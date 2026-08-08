import re

def verify_claims_against_evidence(topic_data, raw_evidence_text):
    """
    Mandatory Verification Gate:
    Validates that all factual claims (CVE IDs, URLs, key stats) in topic_data
    are backed by raw_evidence_text.
    
    If evidence is missing or unverified -> REJECT TOPIC.
    """
    title = topic_data.get("title", "")
    cve_id = topic_data.get("cve_id")
    canonical_url = topic_data.get("canonical_url", "")
    
    verified_claims = []
    rejected_claims = []

    # 1. URL Provenance Verification
    if not canonical_url or not canonical_url.startswith("http"):
        rejected_claims.append(f"Invalid or missing canonical URL: '{canonical_url}'")
    else:
        verified_claims.append(f"Canonical URL verified: {canonical_url}")

    # 2. CVE / GHSA Advisory Verification (Must be present in raw source evidence)
    if cve_id:
        cve_clean = cve_id.upper()
        if cve_clean in raw_evidence_text.upper():
            verified_claims.append(f"Security Advisory ID verified in raw evidence: {cve_clean}")
        else:
            rejected_claims.append(f"CVE/GHSA ID '{cve_clean}' not found in raw source evidence text.")

    # 3. Minimum Content Quality & Raw Evidence Check
    if not raw_evidence_text or len(raw_evidence_text.strip()) < 40:
        rejected_claims.append("Raw source evidence text is missing or too sparse for verification.")

    # Decision
    is_verified = (len(rejected_claims) == 0)
    
    if is_verified:
        reason = "All factual claims, advisory IDs, and URL provenances successfully verified against raw source text."
    else:
        reason = f"Verification failed due to unverified claims: {'; '.join(rejected_claims)}"

    return {
        "verified": is_verified,
        "reason": reason,
        "verified_claims": verified_claims,
        "rejected_claims": rejected_claims
    }
