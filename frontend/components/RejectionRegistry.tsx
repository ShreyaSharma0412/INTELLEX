'use client';

import React from 'react';
import { XCircle, Scale, ShieldAlert } from 'lucide-react';

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
  evaluated_at: string;
}

interface RejectionRegistryProps {
  evaluations: EvaluationItem[];
}

export const RejectionRegistry: React.FC<RejectionRegistryProps> = ({ evaluations }) => {
  const rejected = evaluations.filter((e) => e.verdict === 'REJECTED');

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleTimeString();
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-xs font-mono">
        <span className="text-gray-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Ada Editorial Threshold:
        </span>
        <span className="font-bold text-rose-300">Score &lt; 0.65 ➔ REJECT</span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        {rejected.length === 0 ? (
          <div className="text-center p-8 text-gray-500 text-xs font-mono bg-darkBg/60 border border-gray-800/80 rounded-xl">
            Zero rejected candidate topics in current stream.
          </div>
        ) : (
          rejected.map((item) => (
            <div
              key={item.topic_id}
              className="bg-cardBg/90 border border-rose-500/20 hover:border-rose-500/40 rounded-xl p-3.5 text-xs flex flex-col gap-2 shadow-md transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="font-heading font-bold text-rose-200 flex items-center gap-2 leading-snug">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{item.title}</span>
                </div>
                <span className="bg-rose-950/60 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap">
                  Score: {item.score ? item.score.toFixed(2) : '0.35'}
                </span>
              </div>

              <div className="text-gray-300 font-body leading-relaxed bg-darkBg/60 p-2.5 rounded-lg border border-gray-800/60 text-[11px]">
                <strong className="font-mono text-rose-400">Rejection Rationale:</strong>{' '}
                {item.rejection_reason || 'Score below quality threshold or sparse technical evidence.'}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-800/40">
                <span>Category: {item.category || 'Vulnerability'}</span>
                <span>{formatDate(item.evaluated_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
