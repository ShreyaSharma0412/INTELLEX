'use client';

import React from 'react';
import { Satellite, CheckCircle2, FilterX, Percent, Database, Cpu } from 'lucide-react';

interface TelemetryBarProps {
  discoveredCount: number;
  publishedCount: number;
  rejectedCount: number;
  trackedEntitiesCount: number;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  discoveredCount,
  publishedCount,
  rejectedCount,
  trackedEntitiesCount,
}) => {
  const rejectionRate = discoveredCount > 0 ? Math.round((rejectedCount / discoveredCount) * 100) : 0;
  const verificationSuccess = discoveredCount > 0 ? Math.round((publishedCount / discoveredCount) * 100) : 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <div className="glass-panel border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
          <Satellite className="w-5 h-5" />
        </div>
        <div>
          <span className="font-heading font-black text-xl text-white block leading-none">{discoveredCount}</span>
          <span className="text-[11px] text-gray-400 font-mono">Topics Discovered</span>
        </div>
      </div>

      <div className="glass-panel border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="font-heading font-black text-xl text-white block leading-none">{publishedCount}</span>
          <span className="text-[11px] text-gray-400 font-mono">Verified Posts</span>
        </div>
      </div>

      <div className="glass-panel border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
          <FilterX className="w-5 h-5" />
        </div>
        <div>
          <span className="font-heading font-black text-xl text-white block leading-none">{rejectedCount}</span>
          <span className="text-[11px] text-gray-400 font-mono">Quality Rejections</span>
        </div>
      </div>

      <div className="glass-panel border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <span className="font-heading font-black text-xl text-white block leading-none">{rejectionRate}%</span>
          <span className="text-[11px] text-gray-400 font-mono">Rejection Rate</span>
        </div>
      </div>

      <div className="glass-panel border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg col-span-2 lg:col-span-1">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <span className="font-heading font-black text-xl text-white block leading-none">{trackedEntitiesCount}</span>
          <span className="text-[11px] text-gray-400 font-mono">Remembered CVEs</span>
        </div>
      </div>
    </div>
  );
};
