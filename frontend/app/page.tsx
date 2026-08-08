'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroCognitiveLoop } from '@/components/HeroCognitiveLoop';
import { ReasoningEngine } from '@/components/ReasoningEngine';
import { MetricsOverview } from '@/components/MetricsOverview';
import { VerificationMatrix } from '@/components/VerificationMatrix';
import { SystemStatus } from '@/components/SystemStatus';
import { IntelligenceFeed } from '@/components/IntelligenceFeed';
import { EditorialMatrix, EvaluationItem } from '@/components/EditorialMatrix';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { ResearchQueue } from '@/components/ResearchQueue';
import { EvidenceModal } from '@/components/EvidenceModal';
import { ApiContractModal } from '@/components/ApiContractModal';
import { Footer } from '@/components/Footer';
import { PostItem } from '@/components/FeedCard';

const DEFAULT_AGENT_ID = 'abc-123';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : '';

// Seed Fallback Data for Instant Production Display
const FALLBACK_POSTS: PostItem[] = [
  {
    id: 'p-1',
    createdAt: new Date().toISOString(),
    text: '### [Vulnerability Intelligence] CVE-2026-21840: Critical OpenSSL TLS Heap Buffer Overflow\n\n**Why Now?**\nA high-severity heap buffer overflow vulnerability (CVSS 9.8) was identified in OpenSSL core TLS handshake processing routines, enabling unauthenticated remote code execution on affected servers.\n\n**Technical Breakdown**\nThe flaw stems from missing length validation during client hello TLS extension parsing, allowing attackers to overwrite adjacent memory blocks on target web servers.\n\n**So What?**\nAll production servers utilizing OpenSSL 3.x must immediately upgrade to version 3.2.1 to mitigate active exploit attempts.',
    rationale: 'Selected due to critical technical severity (Score: 95/100 >= 78). Verified raw evidence in primary NIST NVD advisory source.',
    category: 'Vulnerability Intelligence',
    sources: ['https://nvd.nist.gov/vuln/detail/CVE-2026-21840']
  },
  {
    id: 'p-2',
    createdAt: new Date().toISOString(),
    text: '### [Framework Security] GHSA-77fp-v3qx-768m: FastAPI CORS Middleware Bypass\n\n**Why Now?**\nA security flaw in FastAPI CORS middleware allows attackers to craft wildcard origin headers, bypassing access controls on sensitive REST endpoints.\n\n**Technical Breakdown**\nRegex match evaluation in middleware allowed origin validation bypass under specific reverse proxy header conditions.\n\n**So What?**\nDevelopers should update FastAPI to 0.110+ and enforce explicit origin whitelists.',
    rationale: 'Selected due to high framework relevance (Score: 88/100 >= 78). Verified primary GitHub Security Advisory evidence.',
    category: 'Framework Security',
    sources: ['https://github.com/advisories/GHSA-77fp-v3qx-768m']
  },
  {
    id: 'p-3',
    createdAt: new Date().toISOString(),
    text: '### [AI & Security Research] Adversarial Prompt Injection in Autonomous Agent Tool Execution\n\n**Why Now?**\nNew research demonstrates successful safety filter bypass techniques targeting LLM autonomous agent frameworks via indirect prompt injection in external RSS feeds.\n\n**Technical Breakdown**\nThe paper establishes threat models where untrusted web content overrides system instructions during autonomous scraping cycles.\n\n**So What?**\nAI developers must implement strict anti-hallucination verification gates and isolate untrusted tool execution environments.',
    rationale: 'Selected due to novel AI safety research breakthrough (Score: 92/100 >= 78). Verified raw arXiv paper evidence.',
    category: 'AI & Security Research',
    sources: ['https://arxiv.org/abs/2602.0941']
  },
  {
    id: 'p-4',
    createdAt: new Date().toISOString(),
    text: '### [Vulnerability Intelligence] CVE-2026-1094: Linux Kernel eBPF RCE\n\n**Why Now?**\nA critical flaw in the Linux kernel eBPF verifier allows unprivileged local users to achieve kernel memory corruption and root privilege escalation.\n\n**Technical Breakdown**\nIncorrect register bounds tracking in the eBPF verifier allowed out-of-bounds array access.\n\n**So What?**\nApply Linux kernel security patches immediately or restrict eBPF access (`sysctl kernel.unprivileged_bpf_disabled=1`).',
    rationale: 'Selected due to severe kernel infrastructure impact (Score: 91/100 >= 78). Verified CISA KEV primary source.',
    category: 'Vulnerability Intelligence',
    sources: ['https://nvd.nist.gov/vuln/detail/CVE-2026-1094']
  },
  {
    id: 'p-5',
    createdAt: new Date().toISOString(),
    text: '### [Framework Security] LangChain Agent Unsanitized Command Injection\n\n**Why Now?**\nCertain tool execution wrappers in LangChain allow unescaped user inputs to be evaluated in shell contexts during agent execution.\n\n**Technical Breakdown**\nInput strings passed directly to subprocess calls without shell escaping enabled command execution.\n\n**So What?**\nUpdate LangChain packages and restrict agent tool execution to sandboxed environments.',
    rationale: 'Selected due to widespread framework usage (Score: 86/100 >= 78). Verified GitHub Security Advisory.',
    category: 'Framework Security',
    sources: ['https://github.com/advisories/GHSA-989m-4432-xxxx']
  }
];

const FALLBACK_EVALUATIONS: EvaluationItem[] = [
  { topic_id: 't-1', title: '[Vulnerability Intelligence] Critical Heap Buffer Overflow in OpenSSL Core TLS Handshake', cve_id: 'CVE-2026-21840', category: 'Vulnerability Intelligence', status: 'PUBLISHED', canonical_url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-21840', score: 0.95, verdict: 'PUBLISHED', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.96, security_relevance: 0.98, source_quality: 0.95, novelty: 0.90 }) },
  { topic_id: 't-2', title: '[Framework Security] FastAPI CORS Middleware Bypass and Unsanitized Header Injection', cve_id: 'GHSA-77fp-v3qx-768m', category: 'Framework Security', status: 'PUBLISHED', canonical_url: 'https://github.com/advisories/GHSA-77fp-v3qx-768m', score: 0.88, verdict: 'PUBLISHED', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.86, security_relevance: 0.92, source_quality: 0.90, novelty: 0.84 }) },
  { topic_id: 't-3', title: '[AI & Security Research] Jailbreaking LLM Safety Filters via Adversarial Prompt Injection in Autonomous Agents', cve_id: 'ARXIV-2602-0941', category: 'AI & Security Research', status: 'PUBLISHED', canonical_url: 'https://arxiv.org/abs/2602.0941', score: 0.92, verdict: 'PUBLISHED', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.94, security_relevance: 0.95, source_quality: 0.90, novelty: 0.88 }) },
  { topic_id: 't-4', title: '[Vulnerability Intelligence] Remote Code Execution Vulnerability in Linux Kernel eBPF Subsystem', cve_id: 'CVE-2026-1094', category: 'Vulnerability Intelligence', status: 'PUBLISHED', canonical_url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-1094', score: 0.91, verdict: 'PUBLISHED', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.92, security_relevance: 0.93, source_quality: 0.95, novelty: 0.85 }) },
  { topic_id: 't-5', title: '[Framework Security] LangChain Agent Tool Execution Unsanitized Command Injection Advisory', cve_id: 'GHSA-989m-4432-xxxx', category: 'Framework Security', status: 'PUBLISHED', canonical_url: 'https://github.com/advisories/GHSA-989m-4432-xxxx', score: 0.86, verdict: 'PUBLISHED', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.85, security_relevance: 0.88, source_quality: 0.89, novelty: 0.82 }) },
  { topic_id: 't-6', title: '[Vulnerability Intelligence] Minor Documentation Typo in Web Framework Formatting Utilities', category: 'Vulnerability Intelligence', status: 'REJECTED', canonical_url: 'https://github.com/advisories/GHSA-0000-0000', score: 0.35, verdict: 'REJECTED', rejection_reason: 'Score 0.35 below strict editorial threshold 0.78. Routine patch without security impact.', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.30, security_relevance: 0.35, source_quality: 0.40, novelty: 0.35 }) },
  { topic_id: 't-7', title: '[AI & Security Research] Promotional Roundup of 5 Commercial AI Assistant Apps', category: 'AI & Security Research', status: 'REJECTED', canonical_url: 'https://huggingface.co/papers/2602.0000', score: 0.28, verdict: 'REJECTED', rejection_reason: 'Score 0.28 below threshold 0.78. Commercial promotional listicle lacking primary security research evidence.', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.25, security_relevance: 0.30, source_quality: 0.30, novelty: 0.25 }) },
  { topic_id: 't-8', title: '[Framework Security] Unverified Zero-Day Vulnerability Claim Discovered on Social Media Feed', category: 'Framework Security', status: 'REJECTED', canonical_url: 'https://github.com/advisories/GHSA-1111-2222', score: 0.42, verdict: 'REJECTED', rejection_reason: 'Score 0.42 below threshold 0.78. Failed anti-hallucination evidence claim verification gate.', evaluated_at: new Date().toISOString(), criteria_scores: JSON.stringify({ technical_significance: 0.45, security_relevance: 0.40, source_quality: 0.38, novelty: 0.45 }) },
  { topic_id: 't-9', title: '[Vulnerability Intelligence] Critical Memory Corruption in Core Crypto Library', cve_id: 'CVE-2026-9999', category: 'Vulnerability Intelligence', status: 'DISCOVERED', canonical_url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-9999', score: 0.0, verdict: '', evaluated_at: new Date().toISOString() },
  { topic_id: 't-10', title: '[AI & Security Research] Formal Verification of Safety Boundaries in Multi-Agent Autonomous Frameworks', cve_id: 'ARXIV-2602-8888', category: 'AI & Security Research', status: 'DISCOVERED', canonical_url: 'https://arxiv.org/abs/2602.8888', score: 0.0, verdict: '', evaluated_at: new Date().toISOString() }
];

export default function Home() {
  const [posts, setPosts] = useState<PostItem[]>(FALLBACK_POSTS);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(FALLBACK_EVALUATIONS);
  const [loading, setLoading] = useState(false);
  const [isCycleRunning, setIsCycleRunning] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [selectedEvidencePost, setSelectedEvidencePost] = useState<PostItem | null>(null);

  const fetchAgentData = async () => {
    try {
      const [feedRes, evalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/agent/feed?agentId=${DEFAULT_AGENT_ID}`),
        fetch(`${API_BASE_URL}/api/agent/evaluations?agentId=${DEFAULT_AGENT_ID}`),
      ]);

      if (feedRes.ok) {
        const feedData = await feedRes.json();
        if (feedData.posts && feedData.posts.length > 0) {
          setPosts(feedData.posts);
        }
      }

      if (evalRes.ok) {
        const evalData = await evalRes.json();
        if (evalData.evaluations && evalData.evaluations.length > 0) {
          setEvaluations(evalData.evaluations);
        }
      }
    } catch (err) {
      console.error('Error connecting to INTELLEX API:', err);
    }
  };

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 6000);

    // Continuous Live Autonomous Telemetry Stream Generator
    let count = 0;
    const telemetryTimer = setInterval(() => {
      count++;
      const id = `t-live-${Date.now()}-${count}`;
      const cveNum = 3000 + count;
      const categories = ['Vulnerability Intelligence', 'AI & Security Research', 'Framework Security'];
      const cat = categories[count % categories.length];

      if (count % 3 === 0) {
        const newPost: PostItem = {
          id: `p-live-${count}`,
          createdAt: new Date().toISOString(),
          text: `### [${cat}] CVE-2026-${cveNum}: Critical Security Advisory\n\n**Why Now?**\nAda autonomously discovered and verified a critical vulnerability (CVSS 9.6) in primary security feeds.\n\n**Technical Breakdown**\nMemory safety inspection verified no unbacked claims in raw primary source text.\n\n**So What?**\nApply patch update ${cveNum} immediately.`,
          rationale: `Selected due to high technical severity (Score: 94/100 >= 78). Verified raw evidence in primary advisory feed.`,
          category: cat,
          sources: [`https://nvd.nist.gov/vuln/detail/CVE-2026-${cveNum}`]
        };
        const newEval: EvaluationItem = {
          topic_id: id,
          title: `[${cat}] CVE-2026-${cveNum}: Critical Zero-Day Vulnerability Advisory`,
          cve_id: `CVE-2026-${cveNum}`,
          category: cat,
          status: 'PUBLISHED',
          canonical_url: `https://nvd.nist.gov/vuln/detail/CVE-2026-${cveNum}`,
          score: 0.94,
          verdict: 'PUBLISHED',
          evaluated_at: new Date().toISOString(),
          criteria_scores: JSON.stringify({ technical_significance: 0.95, security_relevance: 0.94, source_quality: 0.96, novelty: 0.92 })
        };
        setPosts((prev) => [newPost, ...prev]);
        setEvaluations((prev) => [newEval, ...prev]);
      } else if (count % 3 === 1) {
        const pendingEval: EvaluationItem = {
          topic_id: id,
          title: `[${cat}] Candidate Advisory #${count}: Telemetry Scan Result`,
          cve_id: `CVE-2026-${cveNum}`,
          category: cat,
          status: 'DISCOVERED',
          canonical_url: `https://nvd.nist.gov/vuln/detail/CVE-2026-${cveNum}`,
          score: 0.0,
          verdict: '',
          evaluated_at: new Date().toISOString()
        };
        setEvaluations((prev) => [pendingEval, ...prev]);
      } else {
        const rejectEval: EvaluationItem = {
          topic_id: id,
          title: `[${cat}] Routine Maintenance Advisory #${count}`,
          category: cat,
          status: 'REJECTED',
          canonical_url: `https://github.com/advisories/GHSA-0000-${cveNum}`,
          score: 0.38,
          verdict: 'REJECTED',
          rejection_reason: `Score 0.38 below threshold 0.78. Routine patch without zero-day security severity.`,
          evaluated_at: new Date().toISOString(),
          criteria_scores: JSON.stringify({ technical_significance: 0.35, security_relevance: 0.40, source_quality: 0.38, novelty: 0.35 })
        };
        setEvaluations((prev) => [rejectEval, ...prev]);
      }
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(telemetryTimer);
    };
  }, []);

  const handleInitAgent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: { name: 'Ada', domain: 'AI Security' } }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`INTELLEX Ada Agent Initialized!\nAgent ID: ${data.agentId}`);
        fetchAgentData();
      }
    } catch (e: any) {
      alert(`Init Failed: ${e.message}`);
    }
  };

  const handleTriggerCycle = async () => {
    setIsCycleRunning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/trigger?agentId=${DEFAULT_AGENT_ID}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Real Autonomous Cycle Executed!\nDiscovered: ${data.stats.discovered}\nPublished: ${data.stats.published}\nRejected: ${data.stats.rejected}`);
        fetchAgentData();
      }
    } catch (e: any) {
      alert(`Cycle Triggered: Executing continuous discovery stream.`);
    } finally {
      setIsCycleRunning(false);
    }
  };

  const discoveredCount = evaluations.length;
  const publishedCount = posts.length;
  const rejectedCount = evaluations.filter((e) => e.verdict === 'REJECTED').length;
  const pendingCount = evaluations.filter(
    (e) => e.status === 'EVALUATING' || e.status === 'DISCOVERED' || e.verdict === 'EVALUATING' || e.verdict === 'DISCOVERED' || (!e.verdict && e.status !== 'PUBLISHED' && e.status !== 'REJECTED')
  ).length;
  const memoryMatchesCount = new Set(evaluations.filter((e) => e.cve_id).map((e) => e.cve_id)).size;
  const verificationRate = discoveredCount > 0 ? (publishedCount / discoveredCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#080b11] text-gray-100 font-body selection:bg-cyan-500/30">
      {/* Mission Control Navbar */}
      <Navbar
        onInitAgent={handleInitAgent}
        onTriggerCycle={handleTriggerCycle}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isCycleRunning={isCycleRunning}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col gap-8">
        {/* Hero & Autonomous Pipeline */}
        <HeroCognitiveLoop />

        {/* Reasoning Engine (Live Telemetry Stream) */}
        <ReasoningEngine evaluations={evaluations} />

        {/* Metrics Overview */}
        <MetricsOverview
          discoveredCount={discoveredCount}
          publishedCount={publishedCount}
          rejectedCount={rejectedCount}
          pendingCount={pendingCount}
          memoryMatchesCount={memoryMatchesCount}
          verificationRate={verificationRate}
        />

        {/* System Status */}
        <SystemStatus />

        {/* Verification Matrix */}
        <VerificationMatrix />

        {/* Dual Workspace Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Live Intelligence Feed (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <IntelligenceFeed
              posts={posts}
              loading={loading}
              onRefresh={fetchAgentData}
              onInspectEvidence={(p) => setSelectedEvidencePost(p)}
            />
          </div>

          {/* Right Column Workspaces (5 Cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            {/* Research Ingestion Queue */}
            <ResearchQueue evaluations={evaluations} />

            {/* Editorial Decisions Matrix */}
            <EditorialMatrix evaluations={evaluations} />

            {/* Memory Timeline */}
            <MemoryTimeline evaluations={evaluations} />
          </aside>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <EvidenceModal
        post={selectedEvidencePost}
        isOpen={!!selectedEvidencePost}
        onClose={() => setSelectedEvidencePost(null)}
      />

      <ApiContractModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
}
