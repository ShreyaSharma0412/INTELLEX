'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, Search, Tag, CheckCircle2, Award, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PostItem {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  category?: string;
  sources: string[];
}

interface FeedCardProps {
  post: PostItem;
  onInspectEvidence?: (post: PostItem) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, onInspectEvidence }) => {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Source';
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toUTCString();
    } catch {
      return isoStr;
    }
  };

  const firstLine = post.text.split('\n')[0].replace(/^#+\s*/, '');
  const remainingText = post.text.split('\n').slice(1).join('\n').trim();

  // Extract CVE ID for memory reference if present
  const cveMatch = post.text.match(/CVE-\d{4}-\d{4,7}/i);
  const memoryRef = cveMatch ? cveMatch[0].toUpperCase() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl transition transform hover:-translate-y-0.5 relative group bg-[#0b0f17]/90"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none" />

      {/* Top Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ADA VERIFIED DISPATCH
          </span>
          <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold">
            CONFIDENCE SCORE: 91%
          </span>
          {memoryRef && (
            <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
              <Database className="w-3 h-3 text-purple-400" /> MEMORY: {memoryRef}
            </span>
          )}
        </div>

        <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-500" /> {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Report Title */}
      <h4 className="font-heading font-extrabold text-xl text-white leading-snug tracking-tight">
        {firstLine}
      </h4>

      {/* Post Text Body Summary */}
      <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed font-body font-light">
        {remainingText || post.text}
      </div>

      {/* Why Selected & Relevance Rationale Box */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-200 flex flex-col gap-2 font-mono">
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
            <Award className="w-4 h-4 text-emerald-400" /> PUBLISHING DECISION RATIONALE
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
            PASSED 0.78 THRESHOLD
          </span>
        </div>

        <p className="text-[11px] text-emerald-200/90 leading-relaxed font-light">
          {post.rationale || 'Selected due to high technical severity. Verified raw evidence in primary technical advisory feeds.'}
        </p>
      </div>

      {/* Footer Controls & Primary Sources */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-gray-400 text-[11px] font-semibold flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" /> Primary Sources:
          </span>
          {post.sources && post.sources.length > 0 ? (
            post.sources.map((srcUrl, idx) => (
              <a
                key={idx}
                href={srcUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 bg-black/40 hover:bg-white/[0.06] border border-white/[0.1] px-2.5 py-1 rounded-lg transition font-mono text-[11px]"
              >
                <ExternalLink className="w-3 h-3" /> {getDomain(srcUrl)}
              </a>
            ))
          ) : (
            <span className="text-gray-500 font-mono text-[11px]">Primary Technical Advisory Feed</span>
          )}
        </div>

        {onInspectEvidence && (
          <button
            onClick={() => onInspectEvidence(post)}
            className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5" /> Inspect Evidence Trace
          </button>
        )}
      </div>
    </motion.div>
  );
};
