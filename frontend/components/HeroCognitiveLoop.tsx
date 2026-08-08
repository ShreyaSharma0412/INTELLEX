'use client';

import React from 'react';
import { Radar, Search, Scale, ShieldCheck, Send, Database, ArrowRight, Activity, Terminal, Sparkles, Cpu } from 'lucide-react';
import { ThoughtStream } from './ThoughtStream';

export const HeroCognitiveLoop: React.FC = () => {
  return (
    <section className="relative overflow-hidden graphite-panel rounded-[28px] p-6 md:p-9 flex flex-col gap-8 border border-white/[0.1] shadow-[0_24px_60px_rgba(0,0,0,0.7)] bg-[#070b14]/85 backdrop-blur-2xl">
      {/* Dynamic Luxury Ambient Glow Nodes */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-cyan-500/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Hero Narrative Header */}
      <div className="flex flex-col gap-5 relative z-10 max-w-4xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> PROBLEM STATEMENT #3 &bull; INTELLEX
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Activity className="w-3.5 h-3.5 animate-smooth-pulse" /> Zero Human Prompts Required
          </span>
          <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Autonomous Agent Persona: Ada
          </span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.06]">
          Most AI waits for a prompt. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            INTELLEX doesn&apos;t.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-body font-normal max-w-3xl">
          Ada is an autonomous security intelligence researcher that continuously scans live CISA KEV, NIST NVD, GitHub Security Advisories, and arXiv research feeds, evaluates impact against 4 editorial pillars, verifies evidence against raw source text, and dispatches intelligence without human prompts.
        </p>
      </div>

      {/* Real-time Cognitive Activity Stream */}
      <ThoughtStream />

      {/* Autonomous Cognitive Pipeline Visualizer */}
      <div className="relative z-10 flex flex-col gap-3.5 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
          <span className="flex items-center gap-2 text-gray-200 font-bold tracking-wider uppercase text-[11px]">
            <Cpu className="w-4 h-4 text-cyan-400" /> COGNITIVE PIPELINE STATE MACHINE
          </span>
          <span className="text-[11px] text-emerald-400 font-bold hidden sm:inline flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PostgreSQL Advisory Lock Protected &bull; Fail-Fast Production Schema
          </span>
        </div>

        {/* 7-Step Visual Pipeline Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Step 01 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/[0.06] border border-white/[0.08] hover:border-cyan-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <Radar className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-cyan-300 transition">01</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">DISCOVER</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">Live Scrapers</span>
          </div>

          {/* Step 02 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/[0.06] border border-white/[0.08] hover:border-cyan-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <Search className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-cyan-300 transition">02</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">INVESTIGATE</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">Evidence Extract</span>
          </div>

          {/* Step 03 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-amber-500/[0.06] border border-white/[0.08] hover:border-amber-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <Scale className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-amber-300 transition">03</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">JUDGE</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">4-Pillar Score</span>
          </div>

          {/* Step 04 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-emerald-500/[0.06] border border-white/[0.08] hover:border-emerald-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-emerald-300 transition">04</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">VERIFY</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">Claim Check</span>
          </div>

          {/* Step 05 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/[0.06] border border-white/[0.08] hover:border-cyan-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <Send className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-cyan-300 transition">05</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">PUBLISH</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">Ada Dispatch</span>
          </div>

          {/* Step 06 */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.02] hover:bg-purple-500/[0.06] border border-white/[0.08] hover:border-purple-500/40 transition duration-300 shadow-md">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <Database className="w-4 h-4 group-hover:scale-110 transition" />
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase group-hover:text-purple-300 transition">06</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-white tracking-wide">REMEMBER</span>
            <span className="text-[10px] text-gray-400 font-mono mt-1 group-hover:text-gray-300 transition">CVE Memory</span>
          </div>

          {/* Step 07 Loop */}
          <div className="group relative flex flex-col p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400 transition">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase">LOOP</span>
            </div>
            <span className="font-mono text-xs font-extrabold text-emerald-300 tracking-wide">REPEAT</span>
            <span className="text-[10px] text-emerald-400/90 font-mono mt-1">Continuous 48h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
