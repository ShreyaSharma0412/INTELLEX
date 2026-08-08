'use client';

import React from 'react';
import { ShieldCheck, Check, Lock, FileText, Globe, Sparkles } from 'lucide-react';

export const VerificationMatrix: React.FC = () => {
  return (
    <section className="graphite-panel rounded-[26px] p-6 flex flex-col gap-4 border border-white/[0.09] shadow-2xl bg-[#070b14]/85 backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
            Anti-Hallucination Verification Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold shadow-sm">
          Strict Evidence Enforcement
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 flex flex-col gap-2 transition duration-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <Check className="w-4.5 h-4.5 text-emerald-400 font-extrabold" />
          </div>
          <span className="font-bold text-gray-100 text-xs">URL Provenance</span>
          <span className="text-[10px] text-gray-400 font-normal leading-relaxed">Valid HTTP canonical link confirmed in primary source</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 flex flex-col gap-2 transition duration-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <Check className="w-4.5 h-4.5 text-emerald-400 font-extrabold" />
          </div>
          <span className="font-bold text-gray-100 text-xs">Advisory ID Match</span>
          <span className="text-[10px] text-gray-400 font-normal leading-relaxed">CVE/GHSA present in raw source evidence text</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 flex flex-col gap-2 transition duration-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <Check className="w-4.5 h-4.5 text-emerald-400 font-extrabold" />
          </div>
          <span className="font-bold text-gray-200 text-xs">Evidence Depth</span>
          <span className="text-[10px] text-gray-400 font-normal leading-relaxed">Snippet &gt; 40 characters verified against evidence</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 flex flex-col gap-2 transition duration-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <Check className="w-4.5 h-4.5 text-emerald-400 font-extrabold" />
          </div>
          <span className="font-bold text-gray-100 text-xs">Zero Inventions</span>
          <span className="text-[10px] text-gray-400 font-normal leading-relaxed">Unverified claims automatically rejected at gate</span>
        </div>
      </div>
    </section>
  );
};
