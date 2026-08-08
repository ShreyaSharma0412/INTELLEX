'use client';

import React from 'react';
import { Cpu, ShieldCheck, Database, GitCommit } from 'lucide-react';
import { EvaluationItem } from './RejectionRegistry';

interface MemoryGraphProps {
  evaluations: EvaluationItem[];
}

export const MemoryGraph: React.FC<MemoryGraphProps> = ({ evaluations }) => {
  // Extract verified CVE IDs from evaluations and create memory nodes
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
    <div className="glass-panel border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          <h4 className="font-heading font-bold text-sm text-white">Ada Knowledge & Entity Memory Store</h4>
        </div>
        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          {uniqueCves.length} Tracked Entities
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-body">
        Ada remembers previously evaluated CVE advisories and incident fingerprints across 48-hour continuous cycles to prevent duplicate post dispatches:
      </p>

      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 bg-darkBg/60 border border-gray-800/80 rounded-xl">
        {uniqueCves.length === 0 ? (
          <div className="w-full text-center p-4 text-gray-500 text-xs font-mono">
            Memory store initializing... Discovered security advisories will populate here automatically.
          </div>
        ) : (
          uniqueCves.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono shadow-sm transition ${
                item.verdict === 'PUBLISHED'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
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
    </div>
  );
};
