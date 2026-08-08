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
        # On Vercel / serverless platforms, write SQLite DB to /tmp
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
        # Compute integer hash for advisory lock
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
            is_sqlite_fallback_query="INSERT INTO agents (id, name, domain, persona_config) VALUES (?, ?, ?, ?)"
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
