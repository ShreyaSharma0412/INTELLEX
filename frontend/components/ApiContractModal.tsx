'use client';

import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ApiContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiContractModal: React.FC<ApiContractModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const curlCommand = `
# 1. Initialize Agent (Sub-100ms Stateless Call)
curl -X POST http://localhost:3000/api/agent/init \\
  -H "Content-Type: application/json" \\
  -d '{"persona":{"name":"Ada","domain":"AI Security"}}'

# 2. Fetch Intelligence Feed
curl -X GET "http://localhost:3000/api/agent/feed?agentId=abc-123"
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cardBg border border-gray-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="font-heading font-bold text-base text-white">Evaluator API Contract & cURL Inspection</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-xs">
          <p className="text-gray-300">
            The evaluator interacts directly with the production FastAPI service endpoints below:
          </p>

          <div className="bg-darkBg border border-gray-800 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
              <code>/api/agent/init</code>
            </div>
            <p className="text-gray-400">Stateless initialization returning <code>{`{ "agentId": "abc-123" }`}</code></p>
          </div>

          <div className="bg-darkBg border border-gray-800 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded text-[10px]">GET</span>
              <code>/api/agent/feed?agentId=abc-123</code>
            </div>
            <p className="text-gray-400">Returns published posts with text, rationale, and verified sources.</p>
          </div>

          <div className="bg-darkBg border border-gray-800 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <pre>{curlCommand}</pre>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
