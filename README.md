# INTELLEX AI — Autonomous Security & Tech Intelligence Command Center

> **Problem Statement #3:** Autonomous AI Researcher Persona (**Ada / INTELLEX**) — *Intelligence Without Instruction.*

![INTELLEX AI Command Center Dashboard](./docs/dashboard_screenshot.png)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://intellex-ai.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-blue?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Production-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google_GenAI-SDK-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🌟 Overview

Most AI waits for a prompt. **INTELLEX doesn't.**

Ada is an autonomous security intelligence researcher persona that continuously scans live CISA Known Exploited Vulnerabilities (KEV), NIST NVD 2.0, GitHub Security Advisories (GHSA), arXiv Computer Science Security research, and Hugging Face Daily Papers. She evaluates candidate topics against 4 strict editorial pillars, enforces an anti-hallucination evidence gate, updates PostgreSQL memory entity stores, and dispatches verified technical reports **with zero human prompts**.

---

## 🚀 Live Demo & Repository Links

- **Live Production App (Vercel)**: [https://intellex-ai.vercel.app](https://intellex-ai.vercel.app)
- **Public GitHub Repository**: [https://github.com/ShreyaSharma0412/INTELLEX](https://github.com/ShreyaSharma0412/INTELLEX)
- **Hackathon Prompts Documentation**: [`PROMPTS.md`](./PROMPTS.md)

---

## 🏛 Architecture & 7-Step Autonomous State Machine

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  01 DISCOVER │ ──> │02 INVESTIGATE│ ──> │   03 JUDGE   │ ──> │  04 VERIFY   │
│ Live Feeds   │     │Evidence Ext. │     │4-Pillar Score│     │Anti-Halluc.  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
┌──────────────┐     ┌──────────────┐                                 │
│  07 REPEAT   │ <── │ 06 REMEMBER  │ <── ┌──────────────┐            │
│Continuous 48h│     │ PostgreSQL   │     │  05 PUBLISH  │ <──────────┘
└──────────────┘     └──────────────┘     │ Ada Dispatch │
                                          └──────────────┘
```

1. **DISCOVER**: Scrapes live primary technical sources (CISA KEV, NIST NVD, GitHub Security Advisories, arXiv cs.CR, Hugging Face Papers).
2. **INVESTIGATE**: Extracts raw evidence snippets, advisory IDs, and canonical URLs.
3. **JUDGE**: Multi-factor editorial score against 4 pillars (Significance, Relevance, Quality, Novelty). Threshold: `score >= 0.78`.
4. **VERIFY**: Anti-hallucination claim check ensuring 100% of facts exist in raw evidence text.
5. **PUBLISH**: Synthesizes structured dispatches with complete publishing decision rationale.
6. **REMEMBER**: Persists incident fingerprints into PostgreSQL / SQLite memory store.
7. **REPEAT**: Continuous autonomous loop running without human prompts.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (or set variables in Vercel project settings):

| Variable | Description | Default / Example | Required |
|----------|-------------|-------------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for model discovery & research generation | `AIzaSy...` | Yes |
| `NEXT_PUBLIC_API_URL` | Public API Base URL for frontend requests | `https://intellex-ai.vercel.app` (or `""`) | Optional |
| `ENVIRONMENT` | Application environment mode | `development` or `production` | Optional |
| `DATABASE_URL` | PostgreSQL connection string with connection pooling | `postgresql://user:pass@host:5432/intellex` | Optional (SQLite fallback) |
| `AUTONOMOUS_CYCLE_INTERVAL_SEC` | Background worker cycle interval in seconds | `900` | Optional |

---

## 🛠 Local Setup & Running Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Clone Repository
```bash
git clone https://github.com/ShreyaSharma0412/INTELLEX.git
cd INTELLEX
```

### 2. Install Python & Frontend Dependencies
```bash
pip install -r requirements.txt
cd frontend && npm install && cd ..
```

### 3. Configure Environment Variables
```bash
cp .env.save .env
# Add your GEMINI_API_KEY in .env
```

### 4. Build Frontend & Run Server
```bash
# Build Next.js static production bundle
cd frontend && npm run build && cd ..

# Start FastAPI production server
python3 server.py
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Vercel Deployment Instructions

1. Push latest code to connected GitHub repository `ShreyaSharma0412/INTELLEX`.
2. Connect repository to [Vercel](https://vercel.com).
3. Set environment variable `GEMINI_API_KEY` in Vercel Project Settings $\rightarrow$ Environment Variables.
4. Deploy using automatic Vercel Git integration or Vercel CLI:
   ```bash
   npx vercel --prod
   ```

---

## 📄 License & Attribution

Built for Problem Statement #3 — Autonomous AI Researcher Persona (**Ada / INTELLEX**).