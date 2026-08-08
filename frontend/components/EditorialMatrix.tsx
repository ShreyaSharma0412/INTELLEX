'use client';

import React, { useState } from 'react';
import { Scale, ShieldAlert, CheckCircle2, BarChart3, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EvaluationItem {
  topic_id: string;
  title: string;
  cve_id?: string;
  category: string;
  status: string;
  canonical_url: string;
  score: number;
  verdict: string;
  rejection_reason?: string;
  criteria_scores?: string; // JSON string or object
  evaluated_at: string;
}

interface EditorialMatrixProps {
  evaluations: EvaluationItem[];
}

export const EditorialMatrix: React.FC<EditorialMatrixProps> = ({ evaluations }) => {
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'REJECTED'>('ALL');

  const filtered = evaluations.filter((item) => {
    if (filter === 'PUBLISHED') return item.verdict === 'PUBLISHED';
    if (filter === 'REJECTED') return item.verdict === 'REJECTED';
    return true;
  });

  const publishedCount = evaluations.filter((e) => e.verdict === 'PUBLISHED').length;
  const rejectedCount = evaluations.filter((e) => e.verdict === 'REJECTED').length;
  const totalCount = evaluations.length || 1;
  const acceptRate = Math.round((publishedCount / totalCount) * 100);
  const rejectRate = Math.round((rejectedCount / totalCount) * 100);

  const parseCriteriaScores = (raw?: string) => {
    if (!raw) return null;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return null;
    }
  };

  return (
    <section className="graphite-panel rounded-[26px] p-6 flex flex-col gap-5 border border-white/[0.09] shadow-2xl relative overflow-hidden bg-[#070b14]/85 backdrop-blur-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Scale className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
              Accepted vs Rejected Editorial Matrix
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              Ada&apos;s 4-Pillar LLM Audit &bull; Threshold Score: 0.78 Standard
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition font-semibold ${
              filter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All ({evaluations.length})
          </button>
          <button
            onClick={() => setFilter('PUBLISHED')}
            className={`px-3 py-1 rounded-lg transition font-semibold ${
              filter === 'PUBLISHED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Accepted ({publishedCount})
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1 rounded-lg transition font-semibold ${
              filter === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Visual Distribution Bar */}
      <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl flex flex-col gap-2 font-mono text-xs">
        <div className="flex justify-between items-center text-gray-300 font-medium">
          <span className="flex items-center gap-1.5 text-gray-200 font-bold">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> EDITORIAL RATIO DISTRIBUTION
          </span>
          <span className="text-[11px] text-gray-400">
            Accepted: <strong className="text-emerald-400 font-bold">{acceptRate}%</strong> &bull; Rejected:{' '}
            <strong className="text-rose-400 font-bold">{rejectRate}%</strong>
          </span>
        </div>
        <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500"
            style={{ width: `${acceptRate}%` }}
          />
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-500"
            style={{ width: `${rejectRate}%` }}
          />
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="flex flex-col gap-3.5 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center p-8 text-gray-400 text-xs font-mono bg-white/[0.02] rounded-2xl border border-white/[0.06]">
            No evaluation records match the selected filter.
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const isAccepted = item.verdict === 'PUBLISHED';
              const criteria = parseCriteriaScores(item.criteria_scores);
              const scorePct = Math.round((item.score || 0.5) * 100);

              return (
                <motion.div
                  key={item.topic_id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className={`p-4 rounded-2xl border transition duration-200 flex flex-col gap-3 font-mono text-xs ${
                    isAccepted
                      ? 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40 shadow-sm'
                      : 'bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/40 shadow-sm'
                  }`}
                >
                  {/* Title Bar & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 truncate">
                      {isAccepted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span className="font-bold text-gray-100 truncate text-xs">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-cyan-300 font-extrabold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        SCORE: {scorePct}/100
                      </span>
                      <span
                        className={`text-[9px] uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                          isAccepted
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {isAccepted ? 'ACCEPTED' : 'REJECTED'}
                      </span>
                    </div>
                  </div>

                  {/* 4-Pillar Visual Progress Bars */}
                  {criteria && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[10px]">
                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Significance</span>
                          <span className="text-cyan-300 font-bold">
                            {Math.round((criteria.technical_significance || 0.5) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${(criteria.technical_significance || 0.5) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Relevance</span>
                          <span className="text-indigo-300 font-bold">
                            {Math.round((criteria.security_relevance || 0.5) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-400 h-full rounded-full"
                            style={{ width: `${(criteria.security_relevance || 0.5) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Quality</span>
                          <span className="text-emerald-300 font-bold">
                            {Math.round((criteria.source_quality || 0.5) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${(criteria.source_quality || 0.5) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Novelty</span>
                          <span className="text-purple-300 font-bold">
                            {Math.round((criteria.novelty || 0.5) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-400 h-full rounded-full"
                            style={{ width: `${(criteria.novelty || 0.5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Decision Rationale Box */}
                  <div
                    className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                      isAccepted
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                    }`}
                  >
                    <span className="font-bold uppercase tracking-wider block mb-1 text-[10px] flex items-center gap-1.5">
                      {isAccepted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ✓ WHY ACCEPTED (SCORE: {scorePct}/100):
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> ✕ WHY REJECTED (SCORE: {scorePct}/100):
                        </>
                      )}
                    </span>
                    <p className="text-[11px] font-normal leading-relaxed">
                      {item.rejection_reason ||
                        (isAccepted
                          ? 'Selected due to critical technical severity (Score >= 0.78). Verified raw evidence in primary advisory sources.'
                          : 'Score below 0.78 threshold. Routine advisory or failed anti-hallucination verification.')}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
