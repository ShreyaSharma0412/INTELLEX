'use client';

import React from 'react';
import { Cpu, Terminal, Radio, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvaluationItem } from './EditorialMatrix';

interface ReasoningEngineProps {
  evaluations: EvaluationItem[];
}

export const ReasoningEngine: React.FC<ReasoningEngineProps> = ({ evaluations }) => {
  const latestEvaluations = evaluations.slice(0, 6);

  return (
    <section className="graphite-panel rounded-[26px] p-6 flex flex-col gap-4 border border-white/[0.09] shadow-2xl relative overflow-hidden bg-[#070b14]/85 backdrop-blur-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
            Reasoning Engine &bull; Live Telemetry Stream
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-sm">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          REAL BACKEND COGNITIVE STREAM
        </span>
      </div>

      {/* Live Cognitive Log */}
      <div className="bg-[#050810]/95 border border-white/[0.08] rounded-2xl p-4 flex flex-col gap-3 font-mono text-xs relative z-10 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-white/[0.06] pb-2.5 font-semibold">
          <span className="flex items-center gap-2 text-cyan-300 font-bold">
            <Terminal className="w-4 h-4 text-cyan-400" /> REAL-TIME EVALUATION EVENT AUDIT LOG
          </span>
          <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            {evaluations.length} Backend Evaluations Recorded
          </span>
        </div>

        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
          {latestEvaluations.length === 0 ? (
            <div className="text-center p-8 text-gray-400 text-xs font-mono">
              Waiting for backend evaluation stream... Execute an autonomous cycle to populate live reasoning events.
            </div>
          ) : (
            <AnimatePresence>
              {latestEvaluations.map((item, idx) => {
                const isAccepted = item.verdict === 'PUBLISHED';
                const score = item.score ? Math.round(item.score * 100) : 0;

                return (
                  <motion.div
                    key={item.topic_id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 transition duration-200 ${
                      isAccepted
                        ? 'bg-emerald-500/[0.04] border-emerald-500/25'
                        : 'bg-rose-500/[0.04] border-rose-500/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2.5 truncate">
                        {isAccepted ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="font-bold text-gray-100 truncate text-xs">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          SCORE: {score}/100
                        </span>
                        <span
                          className={`text-[9px] uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                            isAccepted
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isAccepted ? 'PUBLISHED' : 'REJECTED'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-300 font-normal leading-relaxed pl-6">
                      {isAccepted
                        ? `✓ JUDGMENT PASSED (Score: ${score}/100 >= 78): High technical impact. Verified raw telemetry in primary advisory feed.`
                        : `✕ REJECTED (Score: ${score}/100 < 78): ${item.rejection_reason || 'Topic failed strict editorial threshold or single-source credibility standards.'}`}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};
