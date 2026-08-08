'use client';

import React from 'react';
import { Database, GitCommit } from 'lucide-react';
import { EvaluationItem } from './RejectionRegistry';

interface MemoryInspectorProps {
  evaluations: EvaluationItem[];
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ evaluations }) => {
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

  return (
    <section className="linear-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          <h4 className="font-heading font-bold text-sm text-white tracking-tight">
            Ada Memory & Entity Knowledge Base
          </h4>
        </div>
        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold">
          {uniqueCves.length} Tracked Entities
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-body font-light">
        Ada remembers previously evaluated security advisories across 48-hour continuous loops, guaranteeing cross-process deduplication and incident evolution tracking.
      </p>

      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        {uniqueCves.length === 0 ? (
          <div className="w-full text-center p-4 text-gray-500 text-xs font-mono">
            Memory store initializing... Discovered security advisories will populate here automatically.
          </div>
        ) : (
          uniqueCves.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition ${
                item.verdict === 'PUBLISHED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <GitCommit className="w-3 h-3 text-cyan-400" />
              <span className="font-bold">{item.cve_id}</span>
              <span className="text-[9px] uppercase px-1 rounded bg-black/40 text-gray-400">
                {item.verdict}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
