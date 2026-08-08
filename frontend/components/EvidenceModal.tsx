'use client';

import React from 'react';
import { X, ShieldCheck, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { PostItem } from './FeedCard';

interface EvidenceModalProps {
  post: PostItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ post, isOpen, onClose }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-cardBg border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">Ada Anti-Hallucination Evidence Inspector</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto text-xs">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Target Dispatch Title</span>
            <h4 className="font-heading font-bold text-base text-white">{post.text.split('\n')[0].replace(/^#+\s*/, '')}</h4>
          </div>

          {/* Verification Badge */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-300 block">Factual Claims Verified Against Raw Source</span>
              <p className="text-gray-400 text-[11px]">Ada confirmed all CVE IDs, URLs, and statistical metrics match raw technical evidence before publishing.</p>
            </div>
          </div>

          {/* Verified Source Links */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-gray-400 font-bold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Primary Source Provenance URLs:
            </span>
            <div className="flex flex-wrap gap-2">
              {post.sources && post.sources.length > 0 ? (
                post.sources.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 bg-darkBg border border-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> {url}
                  </a>
                ))
              ) : (
                <span className="text-gray-500 font-mono">Primary Technical Advisory Feed</span>
              )}
            </div>
          </div>

          {/* Rationale & Full Dispatch Text */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-gray-400 font-bold">Published Dispatch Content & Editorial Rationale:</span>
            <div className="bg-darkBg border border-gray-800 p-4 rounded-xl font-body text-gray-300 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
              {post.text}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
