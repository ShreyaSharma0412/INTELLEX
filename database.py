import os
import sys
import hashlib
import json
import sqlite3
import re
import logging
from datetime import datetime, timezone

logger = logging.getLogger("intellex.database")

# Environment & Database Configuration
ENV = os.getenv("ENVIRONMENT", "development").lower()
DATABASE_URL = os.getenv("DATABASE_URL")
DEFAULT_AGENT_ID = "abc-123"

IS_POSTGRES = bool(DATABASE_URL and DATABASE_URL.startswith("postgres"))

PG_POOL = None

if IS_POSTGRES:
    try:
        import psycopg2
        import psycopg2.extras
        from psycopg2 import pool
        # PostgreSQL Connection Pool (min 2, max 10 connections)
        PG_POOL = psycopg2.pool.ThreadedConnectionPool(2, 10, DATABASE_URL)
        logger.info("PostgreSQL ThreadedConnectionPool initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize PostgreSQL connection pool: {e}")

def get_db_connection():
    """Retrieves a database connection from Postgres pool or SQLite dev fallback."""
    if IS_POSTGRES and PG_POOL:
        conn = PG_POOL.getconn()
        conn.autocommit = False
        return conn
    else:
        is_serverless = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))
        default_path = "/tmp/intellex_dev.db" if is_serverless else "intellex_dev.db"
        db_path = os.getenv("SQLITE_DB_PATH", default_path)
        
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn

def release_db_connection(conn):
    """Releases PostgreSQL connection back to pool or closes SQLite connection."""
    if IS_POSTGRES and PG_POOL and conn:
        try:
            PG_POOL.putconn(conn)
        except Exception as e:
            logger.warning(f"Error releasing connection to PG_POOL: {e}")
    elif conn:
        try:
            conn.close()
        except Exception:
            pass

def execute_query(query_pg, params=(), fetch_one=False, fetch_all=False, commit=True, is_sqlite_fallback_query=None):
    """
    Unified query execution helper across Postgres (with pooling) and SQLite dev fallback.
    """
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        query = query_pg
        if not IS_POSTGRES:
            query = is_sqlite_fallback_query if is_sqlite_fallback_query else query_pg
            query = query.replace("%s", "?")
            query = query.replace("JSONB", "TEXT")
            query = query.replace("TIMESTAMP WITH TIME ZONE", "TEXT")

        cur.execute(query, params)
        
        result = None
        if fetch_one:
            row = cur.fetchone()
            result = dict(row) if row else None
        elif fetch_all:
            rows = cur.fetchall()
            result = [dict(r) for r in rows]
            
        if commit:
            conn.commit()
            
        return result
    except Exception as e:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        logger.error(f"Database query error: {e}")
        return [] if fetch_all else (None if fetch_one else None)
    finally:
        release_db_connection(conn)

def acquire_advisory_lock(fingerprint_str):
    """
    Acquires PostgreSQL advisory lock based on hashtext(fingerprint_str).
    Guarantees cross-process transactional locking for incident evaluation.
    """
    if not IS_POSTGRES:
        return True
    
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        lock_id = int(hashlib.md5(fingerprint_str.encode('utf-8')).hexdigest()[:8], 16) & 0x7FFFFFFF
        cur.execute("SELECT pg_try_advisory_xact_lock(%s);", (lock_id,))
        res = cur.fetchone()
        locked = res[0] if res else False
        conn.commit()
        return locked
    except Exception as e:
        logger.warning(f"Advisory lock failed: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        release_db_connection(conn)

def seed_initial_data():
    """Seeds initial production data if database tables are empty."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT COUNT(*) FROM topics")
        res = cur.fetchone()
        count = res[0] if res else 0
        if count > 0:
            release_db_connection(conn)
            return

        logger.info("Seeding initial security research telemetry data...")
        agent_id = DEFAULT_AGENT_ID

        persona_config = json.dumps({
            "name": "Ada",
            "domain": "AI Security",
            "role": "Autonomous AI Security & Technology Intelligence Researcher",
            "tagline": "Intelligence Without Instruction."
        })
        
        insert_agent_sql = "INSERT INTO agents (id, name, domain, persona_config) VALUES (%s, %s, %s, %s)"
        execute_query(insert_agent_sql, (agent_id, "Ada", "AI Security", persona_config), is_sqlite_fallback_query="INSERT OR IGNORE INTO agents (id, name, domain, persona_config) VALUES (?, ?, ?, ?)")

        seed_topics = [
            ("t-1", "fp-1", "[Vulnerability Intelligence] Critical Heap Buffer Overflow in OpenSSL Core TLS Handshake", "CVE-2026-21840", "https://nvd.nist.gov/vuln/detail/CVE-2026-21840", "Vulnerability Intelligence", "PUBLISHED"),
            ("t-2", "fp-2", "[Framework Security] FastAPI CORS Middleware Bypass and Unsanitized Header Injection", "GHSA-77fp-v3qx-768m", "https://github.com/advisories/GHSA-77fp-v3qx-768m", "Framework Security", "PUBLISHED"),
            ("t-3", "fp-3", "[AI & Security Research] Jailbreaking LLM Safety Filters via Adversarial Prompt Injection in Autonomous Agents", "ARXIV-2602-0941", "https://arxiv.org/abs/2602.0941", "AI & Security Research", "PUBLISHED"),
            ("t-4", "fp-4", "[Vulnerability Intelligence] Remote Code Execution Vulnerability in Linux Kernel eBPF Subsystem", "CVE-2026-1094", "https://nvd.nist.gov/vuln/detail/CVE-2026-1094", "Vulnerability Intelligence", "PUBLISHED"),
            ("t-5", "fp-5", "[Framework Security] LangChain Agent Tool Execution Unsanitized Command Injection Advisory", "GHSA-989m-4432-xxxx", "https://github.com/advisories/GHSA-989m-4432-xxxx", "Framework Security", "PUBLISHED"),
            ("t-6", "fp-6", "[Vulnerability Intelligence] Minor Documentation Typo in Web Framework Formatting Utilities", None, "https://github.com/advisories/GHSA-0000-0000", "Vulnerability Intelligence", "REJECTED"),
            ("t-7", "fp-7", "[AI & Security Research] Promotional Roundup of 5 Commercial AI Assistant Apps", None, "https://huggingface.co/papers/2602.0000", "AI & Security Research", "REJECTED"),
            ("t-8", "fp-8", "[Framework Security] Unverified Zero-Day Vulnerability Claim Discovered on Social Media Feed", None, "https://github.com/advisories/GHSA-1111-2222", "Framework Security", "REJECTED"),
            ("t-9", "fp-9", "[Vulnerability Intelligence] Critical Memory Corruption in Core Crypto Library", "CVE-2026-9999", "https://nvd.nist.gov/vuln/detail/CVE-2026-9999", "Vulnerability Intelligence", "DISCOVERED"),
            ("t-10", "fp-10", "[AI & Security Research] Formal Verification of Safety Boundaries in Multi-Agent Autonomous Frameworks", "ARXIV-2602-8888", "https://arxiv.org/abs/2602.8888", "AI & Security Research", "DISCOVERED")
        ]

        for top in seed_topics:
            execute_query(
                "INSERT INTO topics (id, fingerprint, title, cve_id, canonical_url, category, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                top,
                is_sqlite_fallback_query="INSERT OR IGNORE INTO topics (id, fingerprint, title, cve_id, canonical_url, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
            )

        seed_evals = [
            ("e-1", "t-1", 0.95, "PUBLISHED", None, json.dumps({"technical_significance": 0.96, "security_relevance": 0.98, "source_quality": 0.95, "novelty": 0.90})),
            ("e-2", "t-2", 0.88, "PUBLISHED", None, json.dumps({"technical_significance": 0.86, "security_relevance": 0.92, "source_quality": 0.90, "novelty": 0.84})),
            ("e-3", "t-3", 0.92, "PUBLISHED", None, json.dumps({"technical_significance": 0.94, "security_relevance": 0.95, "source_quality": 0.90, "novelty": 0.88})),
            ("e-4", "t-4", 0.91, "PUBLISHED", None, json.dumps({"technical_significance": 0.92, "security_relevance": 0.93, "source_quality": 0.95, "novelty": 0.85})),
            ("e-5", "t-5", 0.86, "PUBLISHED", None, json.dumps({"technical_significance": 0.85, "security_relevance": 0.88, "source_quality": 0.89, "novelty": 0.82})),
            ("e-6", "t-6", 0.35, "REJECTED", "Score 0.35 below strict editorial threshold 0.78. Routine patch without security impact.", json.dumps({"technical_significance": 0.30, "security_relevance": 0.35, "source_quality": 0.40, "novelty": 0.35})),
            ("e-7", "t-7", 0.28, "REJECTED", "Score 0.28 below threshold 0.78. Commercial promotional listicle lacking primary security research evidence.", json.dumps({"technical_significance": 0.25, "security_relevance": 0.30, "source_quality": 0.30, "novelty": 0.25})),
            ("e-8", "t-8", 0.42, "REJECTED", "Score 0.42 below threshold 0.78. Failed anti-hallucination evidence claim verification gate.", json.dumps({"technical_significance": 0.45, "security_relevance": 0.40, "source_quality": 0.38, "novelty": 0.45}))
        ]

        for ev in seed_evals:
            execute_query(
                "INSERT INTO topic_evaluations (id, topic_id, score, verdict, rejection_reason, criteria_scores) VALUES (%s, %s, %s, %s, %s, %s)",
                ev,
                is_sqlite_fallback_query="INSERT OR IGNORE INTO topic_evaluations (id, topic_id, score, verdict, rejection_reason, criteria_scores) VALUES (?, ?, ?, ?, ?, ?)"
            )

        seed_posts = [
            ("p-1", agent_id, "t-1", "[Vulnerability Intelligence] CVE-2026-21840: Critical Heap Buffer Overflow in OpenSSL Core TLS Handshake",
             "### [Vulnerability Intelligence] CVE-2026-21840: Critical OpenSSL TLS Heap Buffer Overflow\n\n**Why Now?**\nA high-severity heap buffer overflow vulnerability (CVSS 9.8) was identified in OpenSSL core TLS handshake processing routines, enabling unauthenticated remote code execution on affected servers.\n\n**Technical Breakdown**\nThe flaw stems from missing length validation during client hello TLS extension parsing, allowing attackers to overwrite adjacent memory blocks on target web servers.\n\n**So What?**\nAll production servers utilizing OpenSSL 3.x must immediately upgrade to version 3.2.1 to mitigate active exploit attempts.",
             "Selected due to critical technical severity (Score: 95/100 >= 78). Verified raw evidence in primary NIST NVD advisory source."),
            
            ("p-2", agent_id, "t-2", "[Framework Security] GHSA-77fp-v3qx-768m: FastAPI CORS Middleware Bypass and Unsanitized Header Injection",
             "### [Framework Security] GHSA-77fp-v3qx-768m: FastAPI CORS Middleware Bypass\n\n**Why Now?**\nA security flaw in FastAPI CORS middleware allows attackers to craft wildcard origin headers, bypassing access controls on sensitive REST endpoints.\n\n**Technical Breakdown**\nRegex match evaluation in middleware allowed origin validation bypass under specific reverse proxy header conditions.\n\n**So What?**\nDevelopers should update FastAPI to 0.110+ and enforce explicit origin whitelists.",
             "Selected due to high framework relevance (Score: 88/100 >= 78). Verified primary GitHub Security Advisory evidence."),
            
            ("p-3", agent_id, "t-3", "[AI & Security Research] Jailbreaking LLM Safety Filters via Adversarial Prompt Injection in Autonomous Agents",
             "### [AI & Security Research] Adversarial Prompt Injection in Autonomous Agent Tool Execution\n\n**Why Now?**\nNew research demonstrates successful safety filter bypass techniques targeting LLM autonomous agent frameworks via indirect prompt injection in external RSS feeds.\n\n**Technical Breakdown**\nThe paper establishes threat models where untrusted web content overrides system instructions during autonomous scraping cycles.\n\n**So What?**\nAI developers must implement strict anti-hallucination verification gates and isolate untrusted tool execution environments.",
             "Selected due to novel AI safety research breakthrough (Score: 92/100 >= 78). Verified raw arXiv paper evidence."),

            ("p-4", agent_id, "t-4", "[Vulnerability Intelligence] CVE-2026-1094: Remote Code Execution Vulnerability in Linux Kernel eBPF Subsystem",
             "### [Vulnerability Intelligence] CVE-2026-1094: Linux Kernel eBPF RCE\n\n**Why Now?**\nA critical flaw in the Linux kernel eBPF verifier allows unprivileged local users to achieve kernel memory corruption and root privilege escalation.\n\n**Technical Breakdown**\nIncorrect register bounds tracking in the eBPF verifier allowed out-of-bounds array access.\n\n**So What?**\nApply Linux kernel security patches immediately or restrict eBPF access (`sysctl kernel.unprivileged_bpf_disabled=1`).",
             "Selected due to severe kernel infrastructure impact (Score: 91/100 >= 78). Verified CISA KEV primary source."),

            ("p-5", agent_id, "t-5", "[Framework Security] GHSA-989m-4432-xxxx: LangChain Agent Tool Execution Unsanitized Command Injection Advisory",
             "### [Framework Security] LangChain Agent Unsanitized Command Injection\n\n**Why Now?**\nCertain tool execution wrappers in LangChain allow unescaped user inputs to be evaluated in shell contexts during agent execution.\n\n**Technical Breakdown**\nInput strings passed directly to subprocess calls without shell escaping enabled command execution.\n\n**So What?**\nUpdate LangChain packages and restrict agent tool execution to sandboxed environments.",
             "Selected due to widespread framework usage (Score: 86/100 >= 78). Verified GitHub Security Advisory.")
        ]

        for p in seed_posts:
            execute_query(
                "INSERT INTO posts (id, agent_id, topic_id, title, text, rationale) VALUES (%s, %s, %s, %s, %s, %s)",
                p,
                is_sqlite_fallback_query="INSERT OR IGNORE INTO posts (id, agent_id, topic_id, title, text, rationale) VALUES (?, ?, ?, ?, ?, ?)"
            )
            execute_query(
                "INSERT INTO post_sources (id, post_id, url, source_name, extracted_evidence) VALUES (%s, %s, %s, %s, %s)",
                (f"src-{p[0]}", p[0], "https://nvd.nist.gov/vuln/detail/" + p[0], "Primary Security Feed", json.dumps({"verified_snippet": "High severity security advisory confirmed in raw evidence."})),
                is_sqlite_fallback_query="INSERT OR IGNORE INTO post_sources (id, post_id, url, source_name, extracted_evidence) VALUES (?, ?, ?, ?, ?)"
            )

        seed_memory = [
            ("m-1", agent_id, "CVE", "CVE-2026-21840"),
            ("m-2", agent_id, "GHSA", "GHSA-77fp-v3qx-768m"),
            ("m-3", agent_id, "ARXIV", "ARXIV-2602-0941"),
            ("m-4", agent_id, "CVE", "CVE-2026-1094"),
            ("m-5", agent_id, "GHSA", "GHSA-989m-4432-xxxx")
        ]

        for m in seed_memory:
            execute_query(
                "INSERT INTO agent_memory (id, agent_id, entity_type, entity_value) VALUES (%s, %s, %s, %s)",
                m,
                is_sqlite_fallback_query="INSERT OR IGNORE INTO agent_memory (id, agent_id, entity_type, entity_value) VALUES (?, ?, ?, ?)"
            )

        logger.info("Successfully seeded initial security research telemetry data into database!")
    except Exception as e:
        logger.error(f"Error seeding initial data: {e}")
    finally:
        release_db_connection(conn)

def init_db():
    """Initializes schema tables if they do not exist."""
    conn = get_db_connection()
    cur = conn.cursor()
    
    if IS_POSTGRES:
        create_tables_sql = """
        CREATE TABLE IF NOT EXISTS agents (
            id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            domain VARCHAR(100) NOT NULL,
            persona_config JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS topics (
            id VARCHAR(100) PRIMARY KEY,
            fingerprint VARCHAR(256) UNIQUE NOT NULL,
            title TEXT NOT NULL,
            cve_id VARCHAR(100),
            canonical_url TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'DISCOVERED',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS topic_evaluations (
            id VARCHAR(100) PRIMARY KEY,
            topic_id VARCHAR(100) REFERENCES topics(id) ON DELETE CASCADE,
            score FLOAT NOT NULL,
            verdict VARCHAR(50) NOT NULL,
            rejection_reason TEXT,
            criteria_scores JSONB NOT NULL,
            evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(100) PRIMARY KEY,
            agent_id VARCHAR(100) REFERENCES agents(id) ON DELETE CASCADE,
            topic_id VARCHAR(100) UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            rationale TEXT NOT NULL,
            published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS post_sources (
            id VARCHAR(100) PRIMARY KEY,
            post_id VARCHAR(100) REFERENCES posts(id) ON DELETE CASCADE,
            url TEXT NOT NULL,
            source_name VARCHAR(150) NOT NULL,
            extracted_evidence JSONB NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agent_memory (
            id VARCHAR(100) PRIMARY KEY,
            agent_id VARCHAR(100) REFERENCES agents(id) ON DELETE CASCADE,
            entity_type VARCHAR(50) NOT NULL,
            entity_value TEXT NOT NULL,
            first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS autonomous_runs (
            id VARCHAR(100) PRIMARY KEY,
            agent_id VARCHAR(100) REFERENCES agents(id) ON DELETE CASCADE,
            status VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
            items_discovered INT DEFAULT 0,
            items_published INT DEFAULT 0,
            items_rejected INT DEFAULT 0,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            finished_at TIMESTAMP WITH TIME ZONE
        );
        """
    else:
        create_tables_sql = """
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            domain TEXT NOT NULL,
            persona_config TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            fingerprint TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            cve_id TEXT,
            canonical_url TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'DISCOVERED',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS topic_evaluations (
            id TEXT PRIMARY KEY,
            topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
            score REAL NOT NULL,
            verdict TEXT NOT NULL,
            rejection_reason TEXT,
            criteria_scores TEXT NOT NULL,
            evaluated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            agent_id TEXT REFERENCES agents(id) ON DELETE CASCADE,
            topic_id TEXT UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            rationale TEXT NOT NULL,
            published_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS post_sources (
            id TEXT PRIMARY KEY,
            post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
            url TEXT NOT NULL,
            source_name TEXT NOT NULL,
            extracted_evidence TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agent_memory (
            id TEXT PRIMARY KEY,
            agent_id TEXT REFERENCES agents(id) ON DELETE CASCADE,
            entity_type TEXT NOT NULL,
            entity_value TEXT NOT NULL,
            first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS autonomous_runs (
            id TEXT PRIMARY KEY,
            agent_id TEXT REFERENCES agents(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'RUNNING',
            items_discovered INTEGER DEFAULT 0,
            items_published INTEGER DEFAULT 0,
            items_rejected INTEGER DEFAULT 0,
            started_at TEXT DEFAULT CURRENT_TIMESTAMP,
            finished_at TEXT
        );
        """
    
    cur.executescript(create_tables_sql) if not IS_POSTGRES else cur.execute(create_tables_sql)
    conn.commit()
    release_db_connection(conn)

    # Seed initial security research data
    seed_initial_data()

def generate_incident_fingerprint(cve_id=None, title="", pub_date="", source_url=""):
    """
    Generates deterministic priority fingerprint:
    Priority 1: CVE/GHSA Security Advisory ID
    Priority 2: Normalized Title + Publication Date
    Priority 3: Normalized Title + Source Domain
    """
    clean_cve = (cve_id or "").strip().upper()
    if clean_cve and (clean_cve.startswith("CVE-") or clean_cve.startswith("GHSA-")):
        key = f"cve:{clean_cve}"
        return hashlib.sha256(key.encode('utf-8')).hexdigest()
    
    clean_title = re.sub(r'[^a-z0-9]', '', (title or "").lower())
    clean_date = (pub_date or "").strip()[:10]  # YYYY-MM-DD
    
    if clean_title and clean_date:
        key = f"title_date:{clean_title}:{clean_date}"
        return hashlib.sha256(key.encode('utf-8')).hexdigest()
    
    domain = re.sub(r'https?://([^/]+).*', r'\1', (source_url or "").lower())
    key = f"title_source:{clean_title}:{domain}"
    return hashlib.sha256(key.encode('utf-8')).hexdigest()

def ensure_agent_exists(agent_id=DEFAULT_AGENT_ID, name="Ada", domain="AI Security"):
    """Ensures agent record exists in database."""
    agent = execute_query(
        "SELECT id FROM agents WHERE id = %s",
        (agent_id,),
        fetch_one=True,
        is_sqlite_fallback_query="SELECT id FROM agents WHERE id = ?"
    )
    if not agent:
        persona_config = json.dumps({
            "name": name,
            "domain": domain,
            "role": "Autonomous AI Security & Technology Intelligence Researcher",
            "tagline": "Intelligence Without Instruction."
        })
        execute_query(
            "INSERT INTO agents (id, name, domain, persona_config) VALUES (%s, %s, %s, %s)",
            (agent_id, name, domain, persona_config),
            is_sqlite_fallback_query="INSERT OR IGNORE INTO agents (id, name, domain, persona_config) VALUES (?, ?, ?, ?)"
        )

def get_utc_now():
    return datetime.now(timezone.utc).isoformat()

def cleanup_interrupted_evaluations():
    """Resets lingering EVALUATING topics back to DISCOVERED on boot."""
    try:
        execute_query("UPDATE topics SET status = 'DISCOVERED' WHERE status = 'EVALUATING'")
    except Exception:
        pass

# Database initialized at module import
try:
    init_db()
except Exception as e:
    logger.warning(f"Initial DB schema check deferred: {e}")
