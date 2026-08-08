'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Terminal, Sparkles } from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  type: 'SCAN' | 'EVALUATE' | 'CROSS-CHECK' | 'REJECT' | 'PUBLISH' | 'MEMORY';
  message: string;
}

const CYCLE_STEPS: Array<{ type: LogItem['type']; message: string }> = [
  { type: 'SCAN', message: 'Scanning AI & security news feeds (CISA KEV, NIST NVD, arXiv, GHSA)...' },
  { type: 'EVALUATE', message: 'Evaluating relevance & 4-pillar technical significance score...' },
  { type: 'CROSS-CHECK', message: 'Cross-checking sources & anti-hallucination evidence provenance...' },
  { type: 'REJECT', message: 'Rejecting routine topic: "Generic Minor Wrapper Documentation Patch" (Score 0.58 < 0.78)' },
  { type: 'PUBLISH', message: 'Publishing verified report: "[AI & Security Research] Adversarial Prompt Injection Advisory"' },
  { type: 'MEMORY', message: 'Updating agent memory: Persisted incident entity fingerprint in database.' },
];

export const ThoughtStream: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const now = Date.now();
    const initial: LogItem[] = CYCLE_STEPS.map((step, idx) => ({
      id: String(idx + 1),
      time: new Date(now - (CYCLE_STEPS.length - idx) * 3000).toISOString().substring(11, 19) + ' UTC',
      type: step.type,
      message: step.message,
    }));
    setLogs(initial);

    let index = 0;
    const interval = setInterval(() => {
      const step = CYCLE_STEPS[index % CYCLE_STEPS.length];
      const newLog: LogItem = {
        id: String(Date.now()),
        time: new Date().toISOString().substring(11, 19) + ' UTC',
        type: step.type,
        message: step.message,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      index++;
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const getTypeBadge = (type: LogItem['type']) => {
    switch (type) {
      case 'SCAN':
        return <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">SCANNING FEEDS</span>;
      case 'EVALUATE':
        return <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">EVALUATING</span>;
      case 'CROSS-CHECK':
        return <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">CROSS-CHECKING</span>;
      case 'REJECT':
        return <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">REJECTING</span>;
      case 'PUBLISH':
        return <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">PUBLISHING</span>;
      case 'MEMORY':
        return <span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">UPDATING MEMORY</span>;
    }
  };

  return (
    <div className="graphite-panel rounded-[24px] p-5 flex flex-col gap-3.5 border border-white/[0.09] bg-[#070b14]/90">
      <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-cyan-400 animate-smooth-pulse" />
          <h4 className="font-heading font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
            Ada Real-Time Cognitive Cycle Stream
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full font-bold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-smooth-pulse" />
          AUTONOMOUS STREAM ACTIVE
        </span>
      </div>

      <div className="flex flex-col gap-2 font-mono text-xs max-h-52 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] transition duration-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">{log.time}</span>
              {getTypeBadge(log.type)}
              <span className="text-gray-200 truncate font-normal text-[11px]">{log.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
