'use client';

import React from 'react';
import { Activity, ShieldCheck, Lock, Cpu, Server, CheckCircle2 } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  return (
    <section className="graphite-panel rounded-[22px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-300 border border-white/[0.09] bg-[#070b14]/85 backdrop-blur-2xl shadow-xl">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-smooth-pulse" />
        <span className="font-extrabold text-white tracking-wide text-xs flex items-center gap-2">
          INTELLEX SYSTEM KERNEL OPERATIONAL
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
        </span>
      </div>

      <div className="flex items-center gap-4 flex-wrap text-[11px] text-gray-300">
        <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>PostgreSQL Advisory Lock</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>GenAI SDK Dynamic Discovery</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anti-Hallucination Gate</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
          <Server className="w-3.5 h-3.5 text-purple-400" />
          <span>Stateless API Sub-100ms</span>
        </div>
      </div>
    </section>
  );
};
