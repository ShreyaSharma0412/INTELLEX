'use client';

import React from 'react';
import { Radar, Cpu, Clock, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvaluationItem } from './EditorialMatrix';

interface ResearchQueueProps {
  evaluations: EvaluationItem[];
}

export const ResearchQueue: React.FC<ResearchQueueProps> = ({ evaluations }) => {
  // Filter pending topics or fallback to candidate stream
  const pendingItems = evaluations.filter(
    (e) => e.status === 'EVALUATING' || e.status === 'DISCOVERED' || e.verdict === 'EVALUATING' || !e.verdict
  );
  const displayItems = pendingItems.length > 0 ? pendingItems : evaluations.slice(0, 6);

  return (
    <section className="graphite-panel rounded-[26px] p-6 flex flex-col gap-4 border border-white/[0.09] shadow-2xl relative overflow-hidden bg-[#070b14]/85 backdrop-blur-2xl">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Radar className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
              Pending Triage & Ingestion Queue
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              Live Scraped Candidate Stream &bull; Telemetry Buffer
            </p>
          </div>
        </div>

        <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{displayItems.length} IN BUFFER</span>
        </span>
      </div>

      {/* Candidates List Stream */}
      <div className="flex flex-col gap-3 font-mono text-xs">
        {displayItems.length === 0 ? (
          <div className="text-center p-8 text-gray-400 text-xs font-mono bg-white/[0.02] rounded-2xl border border-white/[0.06] flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400/60" />
            <span>Queue empty. Discovered topics stream here during execution cycles.</span>
          </div>
        ) : (
          <AnimatePresence>
            {displayItems.map((item, idx) => {
              const isEvaluating = item.status === 'EVALUATING' || item.verdict === 'EVALUATING' || item.status === 'DISCOVERED' || !item.verdict;
              const isPublished = item.verdict === 'PUBLISHED';

              return (
                <motion.div
                  key={item.topic_id || idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition duration-200 ${
                    isEvaluating
                      ? 'bg-amber-500/[0.04] border-amber-500/25 hover:border-amber-500/40'
                      : isPublished
                      ? 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40'
                      : 'bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`p-1.5 rounded-lg border ${
                      isEvaluating ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}>
                      <Cpu className="w-3.5 h-3.5 flex-shrink-0" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-gray-100 font-bold truncate text-[11px] leading-snug">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3 text-cyan-400/80" />
                        <span>Pillar: <strong className="text-cyan-300 font-semibold">{item.category || 'Vulnerability Intelligence'}</strong></span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] uppercase px-3 py-1 rounded-full font-bold tracking-wider whitespace-nowrap border flex-shrink-0 shadow-sm ${
                      isEvaluating
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                        : isPublished
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isEvaluating ? 'PENDING TRIAGE' : item.verdict}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
