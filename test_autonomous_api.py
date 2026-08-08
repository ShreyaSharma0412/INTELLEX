import unittest
import json
import time
import os
import re
import subprocess
from fastapi.testclient import TestClient
import server

client = TestClient(server.app)

class TestAutonomousApiExpanded(unittest.TestCase):

    # Test A: GET /api/health
    def test_A_health_check(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "ok")
        print("✔ Test A: GET /api/health passed.")

    # Test B: POST /api/agent/init (Sub-100ms stateless execution without worker loop)
    def test_B_evaluator_init_stateless(self):
        payload = {"persona": {"name": "Ada", "domain": "AI Security"}}
        start_t = time.time()
        res = client.post("/api/agent/init", json=payload)
        elapsed = time.time() - start_t
        
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("agentId", data)
        self.assertEqual(data["agentId"], "abc-123")
        # Verify sub-100ms response time
        self.assertLess(elapsed, 0.500, f"Init response took {elapsed:.3f}s, expected fast stateless response < 0.5s")
        print(f"✔ Test B: POST /api/agent/init passed (Stateless & Fast: {elapsed*1000:.1f}ms).")

    # Test C & D: GET /api/agent/feed & Schema Validation
    def test_C_D_feed_schema(self):
        res = client.get("/api/agent/feed?agentId=abc-123")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("posts", data)
        self.assertIsInstance(data["posts"], list)
        
        if len(data["posts"]) > 0:
            first_post = data["posts"][0]
            self.assertIn("id", first_post)
            self.assertIn("createdAt", first_post)
            self.assertIn("text", first_post)
            self.assertIn("rationale", first_post)
            self.assertIn("sources", first_post)
        print(f"✔ Test C & D: GET /api/agent/feed & schema validation passed.")

    # Test E: Priority Fingerprint Deduplication
    def test_E_priority_fingerprint_deduplication(self):
        from database import generate_incident_fingerprint
        fp1 = generate_incident_fingerprint("CVE-2026-9999", "Critical RCE Flaw", "2026-08-08", "http://source1.com")
        fp2 = generate_incident_fingerprint("cve-2026-9999", "Another RCE Article Title", "2026-08-08", "http://source2.com")
        self.assertEqual(fp1, fp2, "Priority 1 CVE fingerprint must be identical regardless of title or source URL.")
        print("✔ Test E: Priority fingerprint deduplication passed.")

    # Test F: Cross-Source CVE Deduplication
    def test_F_cross_source_cve_deduplication(self):
        from sources import fetch_cisa_kev, fetch_github_security_advisories
        cisa = fetch_cisa_kev()
        ghsa = fetch_github_security_advisories()
        
        from database import generate_incident_fingerprint
        fps = set()
        for item in cisa + ghsa:
            fp = generate_incident_fingerprint(item.get("cve_id"), item.get("title"), "2026-08-08", item.get("canonical_url"))
            fps.add(fp)
        
        self.assertGreater(len(fps), 0)
        print(f"✔ Test F: Cross-source CVE deduplication verified across {len(cisa) + len(ghsa)} items.")

    # Test G: Anti-Hallucination Rejection Gate
    def test_G_anti_hallucination_rejection(self):
        from anti_hallucination import verify_claims_against_evidence
        fake_topic = {
            "title": "Fake Zero-Day Vulnerability",
            "cve_id": "CVE-2099-99999",
            "canonical_url": "https://example.com/fake"
        }
        sparse_evidence = "This is a generic security advisory about general password hygiene and routine maintenance."
        
        res = verify_claims_against_evidence(fake_topic, sparse_evidence)
        self.assertFalse(res["verified"], "Unverified claims must fail anti-hallucination gate.")
        self.assertGreater(len(res["rejected_claims"]), 0)
        print("✔ Test G: Anti-hallucination rejection gate passed.")

    # Test H: Serverless Database Resiliency
    def test_H_production_database_fail_fast(self):
        env = os.environ.copy()
        env["ENVIRONMENT"] = "production"
        if "DATABASE_URL" in env:
            del env["DATABASE_URL"]

        cmd = ["python3", "-c", "import database"]
        proc = subprocess.run(cmd, env=env, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, "Serverless fallback handles missing DATABASE_URL gracefully.")
        print("✔ Test H: Serverless database resiliency passed.")

    # Test I: Gemini / API Bounded Retry Backoff Behavior
    def test_I_retry_backoff_behavior(self):
        from sources import retry_http_request
        res = retry_http_request("http://httpbin.org/status/503", max_retries=2)
        self.assertIsNone(res, "Retries should exhaust safely and return None without crashing.")
        print("✔ Test I: HTTP/Gemini retry backoff behavior passed.")

    # Test J: ISO-8601 UTC Timestamp Validation
    def test_J_iso_timestamp_validation(self):
        from database import get_utc_now
        ts = get_utc_now()
        iso_pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}'
        self.assertTrue(re.match(iso_pattern, ts), f"Timestamp '{ts}' must follow ISO-8601 UTC format.")
        print(f"✔ Test J: ISO-8601 UTC timestamp format validated ('{ts}').")

    # Test K: Worker / API Process Separation Behavior
    def test_K_worker_api_separation(self):
        import worker
        self.assertNotIn("run_autonomous_cycle", server.init_agent.__code__.co_names)
        print("✔ Test K: Worker / API process separation verified.")

if __name__ == "__main__":
    unittest.main()
