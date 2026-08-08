'use client';

import React from 'react';
import { Cpu, Terminal, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 mt-12 border-t border-white/[0.08]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-gray-300">INTELLEX OS v1.0.0</span> &bull; <span className="text-cyan-400">Intelligence Without Instruction</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400 text-[11px]">
          <span>Persona: <strong className="text-gray-200">Ada</strong></span>
          <span>&bull;</span>
          <span>Problem Statement #3</span>
          <span>&bull;</span>
          <span>PostgreSQL + FastAPI + Next.js 14</span>
        </div>
      </div>
    </footer>
  );
};
