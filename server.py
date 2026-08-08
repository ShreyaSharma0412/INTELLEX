from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import os
import json
import logging
from datetime import datetime, timezone

from database import execute_query, get_utc_now, DEFAULT_AGENT_ID, ensure_agent_exists

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("intellex.server")

app = FastAPI(
    title="INTELLEX AI - Autonomous Creator Evaluator API",
    description="Stateless Production API for Evaluators & Command Center Dashboard",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas matching exact Evaluator Contract
class PersonaConfig(BaseModel):
    name: Optional[str] = "Ada"
    domain: Optional[str] = "AI Security"

class InitRequest(BaseModel):
    persona: Optional[PersonaConfig] = Field(default_factory=PersonaConfig)

class InitResponse(BaseModel):
    agentId: str

# API Routes

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "INTELLEX - Autonomous AI Creator",
        "persona": "Ada / Intellex",
        "timestamp": get_utc_now()
    }

# 1. Evaluator Init Endpoint: POST /api/agent/init
@app.post("/api/agent/init", response_model=InitResponse)
def init_agent(req: InitRequest = None):
    """
    Evaluator API Endpoint 1: Initializes/finds agent.
    Stateless and sub-100ms. Does NOT execute scraping or worker loops in-process.
    Returns exact evaluator contract: { "agentId": "abc-123" }
    """
    agent_id = DEFAULT_AGENT_ID
    persona_name = req.persona.name if (req and req.persona) else "Ada"
    domain_name = req.persona.domain if (req and req.persona) else "AI Security"

    # Ensure agent record exists in database
    ensure_agent_exists(agent_id, persona_name, domain_name)
    logger.info(f"Agent '{agent_id}' initialized via POST /api/agent/init (Fast & Stateless)")

    return {"agentId": agent_id}

# 2. Evaluator Feed Endpoint: GET /api/agent/feed?agentId=...
@app.get("/api/agent/feed")
def get_agent_feed(agentId: str = Query(..., description="The agent ID")):
    """
    Evaluator API Endpoint 2: Returns published intelligence feed.
    Exact evaluator contract schema with optional category metadata.
    """
    query_postgres = """
        SELECT p.id, p.published_at as createdAt, p.text, p.rationale, t.category,
               ARRAY_AGG(s.url) as sources
        FROM posts p
        LEFT JOIN topics t ON p.topic_id = t.id
        LEFT JOIN post_sources s ON p.id = s.post_id
        WHERE p.agent_id = %s
        GROUP BY p.id, p.published_at, p.text, p.rationale, t.category
        ORDER BY p.published_at DESC
    """

    query_sqlite = """
        SELECT p.id, p.published_at as createdAt, p.text, p.rationale, t.category,
               s.url as source_url
        FROM posts p
        LEFT JOIN topics t ON p.topic_id = t.id
        LEFT JOIN post_sources s ON p.id = s.post_id
        WHERE p.agent_id = ?
        ORDER BY p.published_at DESC
    """

    rows = execute_query(query_postgres, (agentId,), fetch_all=True, is_sqlite_fallback_query=query_sqlite)

    # Process results into flat list with deduplicated sources
    posts_map = {}
    for r in rows:
        pid = r["id"]
        if pid not in posts_map:
            # Format ISO-8601 UTC timestamp
            created_at = r.get("createdat") or r.get("createdAt") or get_utc_now()
            posts_map[pid] = {
                "id": r["id"],
                "createdAt": created_at,
                "text": r["text"],
                "rationale": r["rationale"],
                "category": r.get("category", "Vulnerability Intelligence"),
                "sources": []
            }

        # Handle sources array (Postgres ARRAY_AGG vs SQLite rows)
        if "sources" in r and isinstance(r["sources"], list):
            for src in r["sources"]:
                if src and src not in posts_map[pid]["sources"]:
                    posts_map[pid]["sources"].append(src)
        elif r.get("source_url") and r["source_url"] not in posts_map[pid]["sources"]:
            posts_map[pid]["sources"].append(r["source_url"])

    return {"posts": list(posts_map.values())}

# 3. Editorial Rejection Audit Stream Endpoint: GET /api/agent/evaluations
@app.get("/api/agent/evaluations")
def get_evaluations(agentId: str = Query(DEFAULT_AGENT_ID)):
    """
    Returns full evaluation audit history, showcasing published vs rejected candidate topics.
    """
    query_pg = """
        SELECT t.id as topic_id, t.title, t.cve_id, t.category, t.status, t.canonical_url,
               e.score, e.verdict, e.rejection_reason, e.criteria_scores, e.evaluated_at
        FROM topics t
        LEFT JOIN topic_evaluations e ON t.id = e.topic_id
        ORDER BY e.evaluated_at DESC
    """
    query_sqlite = query_pg.replace("%s", "?")

    evals = execute_query(query_pg, fetch_all=True, is_sqlite_fallback_query=query_sqlite)
    return {
        "agentId": agentId,
        "totalEvaluated": len(evals),
        "evaluations": evals
    }

# 4. Telemetry Metrics Endpoint: GET /api/agent/stats
@app.get("/api/agent/stats")
def get_agent_stats(agentId: str = Query(DEFAULT_AGENT_ID)):
    """
    Returns live editorial telemetry stats for the dashboard metrics cards.
    """
    topics = execute_query(
        "SELECT status FROM topics",
        fetch_all=True,
        is_sqlite_fallback_query="SELECT status FROM topics"
    )
    memory_count_res = execute_query(
        "SELECT COUNT(*) as cnt FROM agent_memory",
        fetch_one=True,
        is_sqlite_fallback_query="SELECT COUNT(*) as cnt FROM agent_memory"
    )
    
    discovered = len(topics)
    published = sum(1 for t in topics if t.get("status") == "PUBLISHED")
    rejected = sum(1 for t in topics if t.get("status") == "REJECTED")
    pending = sum(1 for t in topics if t.get("status") in ["EVALUATING", "DISCOVERED"])
    
    memory_matches = (memory_count_res.get("cnt", 0) if isinstance(memory_count_res, dict) else memory_count_res[0]) if memory_count_res else 0
    verification_rate = round((published / discovered * 100), 1) if discovered > 0 else 0.0

    return {
        "agentId": agentId,
        "discovered": discovered,
        "published": published,
        "rejected": rejected,
        "pending": pending,
        "memory_matches": memory_matches,
        "verification_rate": verification_rate
    }

# 5. Manual Trigger Endpoint (for testing/development): POST /api/agent/trigger
@app.post("/api/agent/trigger")
def trigger_autonomous_cycle(agentId: str = Query(DEFAULT_AGENT_ID)):
    """Development trigger endpoint to explicitly invoke autonomous worker cycle."""
    from worker import run_autonomous_cycle
    stats = run_autonomous_cycle(agentId)
    return {
        "status": "completed",
        "agentId": agentId,
        "stats": stats
    }

# Continuous Background Worker Loop Registration
import threading
import time

def start_continuous_worker():
    def worker_loop():
        from worker import run_autonomous_cycle
        logger.info("Ada Autonomous Continuous Worker Loop Started.")
        while True:
            try:
                run_autonomous_cycle()
            except Exception as e:
                logger.error(f"Autonomous worker cycle error: {e}")
            time.sleep(8)

    t = threading.Thread(target=worker_loop, daemon=True)
    t.start()

@app.on_event("startup")
def on_startup():
    start_continuous_worker()

# Mount static web dashboard UI
public_dir = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(public_dir):
    app.mount("/", StaticFiles(directory=public_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    logger.info(f"INTELLEX Production API Service starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
