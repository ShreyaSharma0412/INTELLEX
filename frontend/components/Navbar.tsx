'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Power, RefreshCw, Code2, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface NavbarProps {
  onInitAgent: () => void;
  onTriggerCycle: () => void;
  onOpenApiModal: () => void;
  isCycleRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onInitAgent,
  onTriggerCycle,
  onOpenApiModal,
  isCycleRunning,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="graphite-panel rounded-[22px] px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_16px_36px_rgba(0,0,0,0.6)] border border-white/[0.1] bg-[#070b14]/80 backdrop-blur-2xl">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 transition duration-300">
              <Cpu className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-30 blur transition duration-300 pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-black text-lg text-white tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                INTELLEX
              </span>
              <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-smooth-pulse" />
                AUTONOMOUS AI RESEARCHER
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono hidden sm:flex items-center gap-1.5 mt-0.5">
              <span>Persona:</span>
              <strong className="text-cyan-200 font-semibold">Ada</strong>
              <span className="text-gray-600">&bull;</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-medium">
                Intelligence Without Instruction
              </span>
            </p>
          </div>
        </div>

        {/* System Controls */}
        <div className="flex items-center gap-2.5">
          {/* Live UTC Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-gray-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{utcTime || 'SYSTEM TIME'}</span>
          </div>

          {/* Init Agent Button */}
          <button
            onClick={onInitAgent}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-gray-200 hover:text-white transition shadow-sm group"
            title="POST /api/agent/init (Stateless Evaluator API)"
          >
            <Power className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Init Agent</span>
          </button>

          {/* Evaluator API Button */}
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-gray-200 hover:text-white transition shadow-sm group"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Evaluator API</span>
          </button>

          {/* Execute Cycle Button */}
          <button
            onClick={onTriggerCycle}
            disabled={isCycleRunning}
            className="relative group overflow-hidden flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.35)] transition duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCycleRunning ? 'animate-spin' : 'group-hover:rotate-180 transition duration-500'}`} />
            <span>{isCycleRunning ? 'Executing Cycle...' : 'Execute Cycle'}</span>
            <Sparkles className="w-3 h-3 text-cyan-200 opacity-70 group-hover:opacity-100 transition" />
          </button>
        </div>
      </div>
    </header>
  );
};
