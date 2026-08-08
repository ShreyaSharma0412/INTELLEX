'use client';

import React from 'react';
import { Radar, CheckCircle2, ShieldAlert, Percent, Database, Clock, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface MetricsOverviewProps {
  discoveredCount: number;
  publishedCount: number;
  rejectedCount: number;
  pendingCount: number;
  memoryMatchesCount: number;
  verificationRate: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  discoveredCount,
  publishedCount,
  rejectedCount,
  pendingCount,
  memoryMatchesCount,
  verificationRate,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Metric 1: Total Discovered */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-indigo-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-indigo-400 mb-0.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Radar className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition duration-500" />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">DISCOVERED</span>
        </div>
        <span className="font-heading font-black text-3xl text-white tracking-tight leading-none mt-1">
          <AnimatedCounter value={discoveredCount} />
        </span>
        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-1">
          <span>Total Candidate Topics</span>
        </span>
      </div>

      {/* Metric 2: Published */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-emerald-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-emerald-400 mb-0.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition duration-300" />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">PUBLISHED</span>
        </div>
        <span className="font-heading font-black text-3xl text-emerald-300 tracking-tight leading-none mt-1">
          <AnimatedCounter value={publishedCount} />
        </span>
        <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1 mt-1 font-medium">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>Verified Dispatches</span>
        </span>
      </div>

      {/* Metric 3: Rejected */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-rose-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-rose-400 mb-0.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition duration-300" />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">REJECTED</span>
        </div>
        <span className="font-heading font-black text-3xl text-rose-300 tracking-tight leading-none mt-1">
          <AnimatedCounter value={rejectedCount} />
        </span>
        <span className="text-[10px] text-rose-400/90 font-mono flex items-center gap-1 mt-1 font-medium">
          <span>Editorial Filtered</span>
        </span>
      </div>

      {/* Metric 4: Pending Evaluation */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-amber-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-amber-400 mb-0.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">PENDING</span>
        </div>
        <span className="font-heading font-black text-3xl text-amber-300 tracking-tight leading-none mt-1">
          <AnimatedCounter value={pendingCount} />
        </span>
        <span className="text-[10px] text-amber-400/90 font-mono flex items-center gap-1 mt-1 font-medium">
          <span>Pending Triage Buffer</span>
        </span>
      </div>

      {/* Metric 5: Memory Matches */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-purple-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-purple-400 mb-0.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Database className="w-4 h-4 text-purple-400 group-hover:scale-110 transition duration-300" />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">MEMORY</span>
        </div>
        <span className="font-heading font-black text-3xl text-purple-300 tracking-tight leading-none mt-1">
          <AnimatedCounter value={memoryMatchesCount} />
        </span>
        <span className="text-[10px] text-purple-400/90 font-mono flex items-center gap-1 mt-1 font-medium">
          <span>CVE Memory Entities</span>
        </span>
      </div>

      {/* Metric 6: Verification Rate */}
      <div className="group relative overflow-hidden graphite-panel p-5 rounded-[22px] flex flex-col gap-1.5 shadow-xl border border-white/[0.09] hover:border-cyan-500/40 transition duration-300 bg-[#090d16]/80">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between text-cyan-400 mb-0.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Percent className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition duration-300" />
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black tracking-wider">PASS RATE</span>
        </div>
        <span className="font-heading font-black text-3xl text-cyan-300 tracking-tight leading-none mt-1">
          <AnimatedCounter value={Math.round(verificationRate)} />%
        </span>
        <span className="text-[10px] text-cyan-400/90 font-mono flex items-center gap-1 mt-1 font-medium">
          <span>Verification Rate</span>
        </span>
      </div>
    </section>
  );
};
