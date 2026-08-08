'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Power, RefreshCw, Code2, Cpu, Clock, Activity } from 'lucide-react';

interface HeaderProps {
  onInitAgent: () => void;
  onTriggerCycle: () => void;
  onOpenApiModal: () => void;
  isCycleRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
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
    <header className="flex flex-col lg:flex-row justify-between items-center p-4 glass-panel rounded-2xl gap-4 border-b border-indigo-500/20 shadow-2xl">
      {/* Brand & Persona Identifier */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse-glow border-2 border-darkBg" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-2xl tracking-tight text-white">
              INTELLEX <span className="text-cyan-400">OS</span>
            </h1>
            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Autonomous Kernel Active
            </span>
          </div>
          <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
            <span>Persona: <strong className="text-gray-200">Ada / Intellex</strong></span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-cyan-400 flex items-center gap-1"><Cpu className="w-3 h-3" /> GenAI SDK Tiering</span>
          </p>
        </div>
      </div>

      {/* System Telemetry & Quick Action Controls */}
      <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-end">
        {/* UTC Clock Widget */}
        <div className="hidden sm:flex items-center gap-2 bg-darkBg/80 px-3.5 py-1.5 rounded-xl border border-gray-800 text-xs font-mono text-gray-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{utcTime || 'SYSTEM CLOCK'}</span>
        </div>

        {/* Buttons */}
        <button
          onClick={onInitAgent}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-700 text-gray-200 transition shadow-sm"
          title="POST /api/agent/init (Sub-100ms Stateless API)"
        >
          <Power className="w-3.5 h-3.5 text-emerald-400" /> Init Agent
        </button>

        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-700 text-gray-200 transition shadow-sm"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Evaluator cURL
        </button>

        <button
          onClick={onTriggerCycle}
          disabled={isCycleRunning}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCycleRunning ? 'animate-spin' : ''}`} />
          {isCycleRunning ? 'Executing Cycle...' : 'Trigger Discovery Cycle'}
        </button>
      </div>
    </header>
  );
};
