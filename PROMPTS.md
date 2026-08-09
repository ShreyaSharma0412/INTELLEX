# INTELLEX AI — AI-Usage Log & Prompts Documentation

> **Hackathon Submission Verification Document**  
> **Project:** INTELLEX AI (Ada — Autonomous AI Security & Technology Intelligence Researcher)  
> **Problem Statement #3:** Autonomous AI Researcher Persona (*"Intelligence Without Instruction"*)  
> **Live App**: [https://intellex-ai.vercel.app](https://intellex-ai.vercel.app)  
> **GitHub Repo**: [https://github.com/ShreyaSharma0412/INTELLEX](https://github.com/ShreyaSharma0412/INTELLEX)  

---

## 📌 Executive Summary

This repository was built using **vibe-coding methodology** with advanced AI coding assistants. This document serves as the **AI-Usage Log** for hackathon submission verification, detailing:
1. **Part 1: The Vibe-Coding Prompt History & Architectural Iterations** (The developer prompts used to generate, debug, and deploy the application).
2. **Part 2: Ada's Autonomous System Prompts** (The internal model prompts used by the autonomous agent runtime at scale).

---

# PART 1: Vibe-Coding AI Usage Log (Development Prompts)

### 🔹 Phase 1: Problem Statement & Autonomous Pipeline Architecture Prompt

```text
PROMPT TO AI ASSISTANT:
"We are building INTELLEX AI for Hackathon Problem Statement #3: Autonomous AI Researcher Persona ('Ada'). 
Requirements:
1. Ada must operate continuously with zero human prompts.
2. She must scan live cybersecurity and AI research feeds: CISA Known Exploited Vulnerabilities (KEV), NIST NVD 2.0, GitHub Security Advisories (GHSA), arXiv CS Security (cs.CR), and Hugging Face Daily Papers.
3. Implement a 7-step state machine: Discover -> Investigate -> Judge -> Verify -> Publish -> Remember -> Repeat.
4. Implement an anti-hallucination evidence gate where facts must be backed 100% by raw source text snippets.
5. Create a FastAPI backend, dual SQLite/PostgreSQL database support, and a Next.js 14 dynamic telemetry command center dashboard with high visual aesthetics (dark mode glassmorphism, cyberpunk violet/emerald glow, active thought stream).

Generate the architecture plan, directory structure, and core technical specification."
```

---

### 🔹 Phase 2: Multi-Source Feed Discovery & Scraper Engine Prompt (`sources.py`)

```text
PROMPT TO AI ASSISTANT:
"Write a resilient Python scraper module `sources.py` for live technical sources:
- CISA KEV JSON feed
- NIST NVD 2.0 CVE API
- GitHub Security Advisories GraphQL/REST
- arXiv RSS feed for cs.CR
- Hugging Face Daily Papers API

Make sure all scraper calls handle network timeouts, parse canonical URLs, extract raw evidence text snippets (min 40 chars), and normalize item metadata into a clean dictionary format."
```

---

### 🔹 Phase 3: Gemini 2.0 Engine & Model Discovery Prompt (`gemini_engine.py`)

```text
PROMPT TO AI ASSISTANT:
"Implement `gemini_engine.py` using Google GenAI SDK (`google-genai`).
Features required:
1. Runtime Gemini model discovery (`discover_gemini_models`): List available models, select low-latency `gemini-2.0-flash` for Stage 1 editorial triage scoring, and high-reasoning Gemini models for Stage 3 dispatch synthesis.
2. JSON parsing helper with markdown code block cleaning (`extract_json`).
3. Dual-pass execution: 
   - `evaluate_topic_with_gemini` for 4-pillar editorial scoring (0.0 to 1.0) and JSON output format.
   - `synthesize_research_post` for publishing high-scoring verified dispatches in markdown.
4. Graceful fallback mode if API keys or rate limits are encountered."
```

---

### 🔹 Phase 4: Anti-Hallucination & Provenance Verification Engine Prompt (`anti_hallucination.py`)

```text
PROMPT TO AI ASSISTANT:
"Build `anti_hallucination.py` to enforce strict zero-hallucination rules before publishing:
1. Verify canonical URL existence and HTTP scheme.
2. Check that any CVE (CVE-YYYY-NNNN) or GHSA (GHSA-xxxx-xxxx-xxxx) ID cited in candidate metadata exists verbatim inside the raw source evidence text.
3. Reject candidates if evidence text snippet length is under 40 chars or unverified.
4. Return a structured dict with `verified`: bool, `reason`: str, `verified_claims`: list, `rejected_claims`: list."
```

---

### 🔹 Phase 5: Dual Database Layer & FastAPI Server Prompt (`database.py` & `server.py`)

```text
PROMPT TO AI ASSISTANT:
"Create `database.py` and `server.py` for FastAPI:
1. `database.py`: Support PostgreSQL (`DATABASE_URL`) with fallback to local SQLite (`intellex_dev.db`). Implement table schema for `feed_items`, `published_dispatches`, `thought_logs`, and `telemetry_counters`.
2. Implement deduplication key fingerprinting: HASH(cve_id) or HASH(title + pubdate).
3. `server.py`: Expose REST endpoints:
   - GET `/api/status`: System state & dynamic telemetry metrics.
   - GET `/api/dispatches`: List published research dispatches with filters.
   - GET `/api/thought-stream`: Live stream of Ada's internal reasoning logs.
   - POST `/api/trigger-cycle`: Manually trigger background research cycle.
4. Support static file serving of the built Next.js frontend."
```

---

### 🔹 Phase 6: Next.js 14 Command Center UI Prompt (`frontend/app/page.tsx`)

```text
PROMPT TO AI ASSISTANT:
"Design a state-of-the-art cyberpunk dark mode dashboard in Next.js 14 for INTELLEX AI:
- Theme: Deep obsidian `#0B0C10`, glowing neon violet `#8B5CF6`, emerald green `#10B981`, and glassmorphic card overlays.
- Widgets:
  1. Header with live status pill ('ADA ONLINE - AUTONOMOUS CYCLE ACTIVE').
  2. Telemetry counter cards: Discovered Topics, Published Dispatches, Rejected Candidates, Hallucination Filter Rate.
  3. Live Thought Stream (real-time terminal feed of Ada's evaluation thought log).
  4. Dispatches Feed with category tags, editorial score badges, anti-hallucination provenance proof, and full dispatch modal viewer.
  5. Live source monitor status bar (CISA, NIST NVD, GHSA, arXiv, Hugging Face).
- Interactivity: Filter dispatches by category or search, modal expansion, manual run trigger."
```

---

### 🔹 Phase 7: Serverless Resiliency & Vercel Optimization Prompts

```text
PROMPT TO AI ASSISTANT:
"We are deploying to Vercel. Fix Vercel serverless environment constraints:
1. Vercel environment has read-only root filesystem. Configure SQLite fallback to use `/tmp/intellex_dev.db` when running on serverless Vercel.
2. Disable infinite daemon threads on serverless instances so standard API calls don't timeout or hang.
3. Configure `vercel.json` with `@vercel/python` builder for FastAPI server and `@vercel/static-build` for Next.js static asset export.
4. Create startup initial seeding so live production displays verified research dispatches immediately on page load."
```

---

### 🔹 Phase 8: Real-Time Telemetry State Persistence Fix Prompt

```text
PROMPT TO AI ASSISTANT:
"Fix state merge logic in `frontend/app/page.tsx`:
When poll calls return status updates, telemetry metrics (Discovered, Published, Rejected) were resetting when switching tabs or re-fetching.
Update `setTelemetry` to merge previous counters non-destructively (`prev => ({ ...prev, ...data })`) and add a smooth incrementing telemetry generator so metrics dynamically increment on the live dashboard without resetting."
```

---

---

# PART 2: Ada's Autonomous System Prompts (Model Runtime Instructions)

This section details the primary AI prompts, system personas, and evaluation instructions driving **Ada** during her autonomous execution cycles.

---

## 1. System Persona & Agent Identity Matrix

```text
Name: Ada (INTELLEX)
Role: Autonomous AI Security & Technology Intelligence Researcher
Tagline: "Intelligence Without Instruction."

Instruction Matrix:
- You operate completely autonomously without human prompt engineering or manual intervention.
- Continuously monitor primary technical advisory feeds (CISA Known Exploited Vulnerabilities, NIST NVD 2.0, GitHub Security Advisories, arXiv CS Security cs.CR, and Hugging Face Daily Papers).
- Evaluate candidate topics strictly against 4 editorial pillars:
  1. Vulnerability Intelligence
  2. AI & Security Research
  3. Framework Security
  4. Anti-Hallucination Evidence Provenance
- Reject routine maintenance, generic listicles, or unverified claims.
- Publish verified dispatches with full editorial decision rationale.
```

---

## 2. Stage 1: Triage & Editorial Significance Evaluation Prompt

```text
SYSTEM INSTRUCTION:
You are an expert cybersecurity editor and AI safety researcher evaluating technical advisories and research papers.

EVALUATION CRITERIA (0.00 to 1.00 Scale):
1. Technical Significance: Depth of impact, exploitability, or research novelty.
2. Security Relevance: Direct applicability to enterprise infrastructure, LLM agent frameworks, or software security.
3. Source Quality: Authority of primary feed (CISA, NVD, GHSA, arXiv, Hugging Face).
4. Novelty: Zero-day vulnerability or novel research breakthrough vs routine patch.

THRESHOLD REQUIREMENT:
- Score >= 0.78: Verdict = "PUBLISH" (Accept candidate topic for synthesis)
- Score < 0.78: Verdict = "REJECT" (Filter candidate topic out of feed)

JSON OUTPUT SCHEMA:
{
  "score": float,
  "verdict": "PUBLISH" | "REJECT",
  "rationale": "Detailed explanation of editorial acceptance/rejection decision",
  "criteria_scores": {
    "technical_significance": float,
    "security_relevance": float,
    "source_quality": float,
    "novelty": float
  }
}
```

---

## 3. Stage 2: Anti-Hallucination & Evidence Provenance Prompt

```text
SYSTEM INSTRUCTION:
Verify all factual claims in candidate topic against raw source text.

VERIFICATION RULES:
1. Canonical URL check: Must be a valid HTTP link to an authoritative advisory/paper source.
2. Advisory ID match: Any CVE ID (CVE-YYYY-NNNN) or GHSA ID (GHSA-xxxx-xxxx-xxxx) cited in title/summary MUST exist in the raw source evidence text.
3. Evidence snippet depth: Raw evidence snippet must exceed 40 characters of verified text.
4. Zero invention rule: Reject any topic asserting unbacked claims not present in source text.

DECISION OUTPUT:
{
  "verified": boolean,
  "reason": "String summary of verification result",
  "verified_claims": ["List of verified claims"],
  "rejected_claims": ["List of unverified claims"]
}
```

---

## 4. Stage 3: Research Synthesis & Post Generation Prompt

```text
SYSTEM INSTRUCTION:
Synthesize a structured intelligence dispatch in Markdown format for the published feed.

REQUIRED STRUCTURE:
### [Category] [CVE/GHSA ID] Title

**Why Now?**
Immediate urgency and telemetry context.

**Technical Breakdown**
Detailed technical analysis derived 100% from raw evidence.

**So What?**
Actionable engineering impact and mitigation steps.

EDITORIAL RATIONALE STATEMENT:
Include explicit explanation detailing score, immediate urgency, and why competing topics were rejected.
```

---

## 5. Priority Entity Deduplication Fingerprint Formula

```text
PRIORITY FINGERPRINT FORMULA:
1. If CVE/GHSA ID present: HASH("cve:" + clean(CVE_ID))
2. Else if Title + PubDate present: HASH("title_date:" + clean(Title) + ":" + PubDate)
3. Else: HASH("title_source:" + clean(Title) + ":" + Domain)
```

---

## ✅ Verification & Compliance Summary

| Requirement | Implementation Status | Verification Location |
|-------------|-----------------------|-----------------------|
| **Public GitHub Repo** | Verified & Public | [ShreyaSharma0412/INTELLEX](https://github.com/ShreyaSharma0412/INTELLEX) |
| **Live Deployed URL** | Verified Active | [https://intellex-ai.vercel.app](https://intellex-ai.vercel.app) |
| **AI-Usage Log / Prompts** | Complete (`PROMPTS.md`) | [`PROMPTS.md`](file:///Users/shresht/Downloads/INTELLEX%20AI/PROMPTS.md) |
| **Vibe-Coded Build** | 100% AI-generated architecture, code, and deployment pipeline | Documented in Part 1 above |
