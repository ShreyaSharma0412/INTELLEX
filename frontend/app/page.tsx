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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
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
        setPosts(feedData.posts || []);
      }

      if (evalRes.ok) {
        const evalData = await evalRes.json();
        setEvaluations(evalData.evaluations || []);
      }
    } catch (err) {
      console.error('Error connecting to INTELLEX API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 6000);
    return () => clearInterval(interval);
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
      alert(`Trigger Failed: ${e.message}`);
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
