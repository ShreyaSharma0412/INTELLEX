'use client';

import React from 'react';
import { Database, GitCommit, Clock } from 'lucide-react';
import { EvaluationItem } from './EditorialMatrix';

interface MemoryTimelineProps {
  evaluations: EvaluationItem[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ evaluations }) => {
  const rememberedCves = evaluations
    .filter((e) => e.cve_id)
    .map((e) => ({
      cve_id: e.cve_id!,
      title: e.title,
      verdict: e.verdict,
      evaluated_at: e.evaluated_at,
    }));

  const uniqueCves = Array.from(new Set(rememberedCves.map((c) => c.cve_id))).map(
    (cveId) => rememberedCves.find((c) => c.cve_id === cveId)!
  );

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleTimeString();
    } catch {
      return isoStr;
    }
  };

  return (
    <section className="graphite-panel rounded-[26px] p-6 flex flex-col gap-4 border border-white/[0.09] shadow-2xl bg-[#070b14]/85 backdrop-blur-2xl">
      <div className="flex justify-between items-center pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Database className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
            Memory Timeline & Entity Knowledge Base
          </h3>
        </div>
        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] px-3 py-1 rounded-full font-mono font-bold shadow-sm">
          {uniqueCves.length} Tracked Entities
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 font-mono text-xs">
        {uniqueCves.length === 0 ? (
          <div className="text-center p-8 text-gray-400 text-xs font-mono bg-white/[0.02] rounded-2xl border border-white/[0.06]">
            Memory store initializing... Incident fingerprints will populate here chronologically.
          </div>
        ) : (
          uniqueCves.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-purple-500/40 transition duration-200 shadow-sm">
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                <GitCommit className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-300 text-xs">{item.cve_id}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> {formatDate(item.evaluated_at)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-normal truncate">{item.title}</p>
                <span className={`self-start text-[9px] uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                  item.verdict === 'PUBLISHED'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {item.verdict}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
