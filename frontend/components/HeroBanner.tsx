'use client';

import React from 'react';
import { Terminal, Radar, Search, Scale, ShieldCheck, Send, Cpu, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="glass-panel border border-indigo-500/30 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Problem Statement #3 &bull; Intelligence Without Instruction
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            Zero Human Prompts Required
          </span>
        </div>

        <h2 className="font-heading font-black text-2xl md:text-4xl text-white tracking-tight leading-none mt-1">
          Most AI waits for a prompt. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400">INTELLEX doesn&apos;t.</span>
        </h2>
        <p className="text-sm text-gray-300 max-w-4xl leading-relaxed">
          Ada Operating System is an autonomous security intelligence researcher. Operating continuously over a 48-hour cycle, Ada scans live primary feeds (CISA, NVD, GHSA, arXiv), extracts verifiable claims, applies strict 4-pillar editorial thresholds, rejects unverified or hype-driven topics, and publishes structured research dispatches.
        </p>
      </div>

      {/* Interactive Autonomous Pipeline Loop */}
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-1">
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Autonomous Pipeline Execution Loop</span>
          <span className="text-emerald-400 font-bold">PostgreSQL Advisory Lock Protected</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 bg-darkBg/90 border border-gray-800/80 p-3 rounded-xl shadow-inner">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-indigo-500/30 shadow-md">
            <Radar className="w-4 h-4 text-indigo-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 1</span>
              <span>DISCOVER</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-cyan-500/30 shadow-md">
            <Search className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 2</span>
              <span>INVESTIGATE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-amber-500/30 shadow-md">
            <Scale className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 3</span>
              <span>JUDGE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-emerald-500/30 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 4</span>
              <span>VERIFY</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-blue-500/30 shadow-md">
            <Send className="w-4 h-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 5</span>
              <span>PUBLISH</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-200 p-2.5 rounded-lg bg-cardBg border border-purple-500/30 shadow-md">
            <Cpu className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase">Stage 6</span>
              <span>REMEMBER</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 shadow-md col-span-2 sm:col-span-1">
            <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] text-emerald-500/80 uppercase">Continuous</span>
              <span>REPEAT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
