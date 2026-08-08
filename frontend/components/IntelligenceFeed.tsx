'use client';

import React, { useState } from 'react';
import { Newspaper, ExternalLink, ShieldCheck, Search, Tag, RefreshCw, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostItem } from './FeedCard';

interface IntelligenceFeedProps {
  posts: PostItem[];
  loading: boolean;
  onRefresh: () => void;
  onInspectEvidence: (post: PostItem) => void;
}

export const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({
  posts,
  loading,
  onRefresh,
  onInspectEvidence,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Vulnerability Intelligence', 'AI & Security Research', 'Framework Security'];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    if (p.category) {
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    }
    return (
      p.text.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      p.rationale.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Source';
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleString();
    } catch {
      return isoStr;
    }
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 graphite-panel rounded-[20px] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2.5">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <h3 className="font-heading font-extrabold text-lg text-white tracking-tight">
            Verified Intelligence Feed
          </h3>
          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {posts.length} Verified Dispatches
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition border border-white/[0.08]"
            title="Refresh Intelligence Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-mono px-3.5 py-1.5 rounded-xl transition whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-semibold'
                  : 'bg-white/[0.02] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatches Stream */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-16 graphite-panel rounded-[24px] text-gray-400 text-xs font-mono gap-2 border border-white/[0.08]">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> Fetching live verified intelligence dispatches...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center p-16 graphite-panel rounded-[24px] text-gray-400 text-xs font-mono flex flex-col items-center gap-2 border border-white/[0.08]">
            <Sparkles className="w-6 h-6 text-cyan-400/60" />
            <span>No verified dispatches matching current category filter. Continuous worker is scanning live feeds.</span>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post, idx) => {
              const firstLine = post.text.split('\n')[0].replace(/^#+\s*/, '');
              const bodyLines = post.text.split('\n').slice(1).join('\n').trim();

              return (
                <motion.article
                  key={post.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="graphite-panel rounded-[24px] p-6 md:p-8 flex flex-col gap-5 relative group border border-white/[0.08] hover:border-emerald-500/30 transition shadow-2xl bg-[#0b0f17]/90"
                >
                  {/* Header Badges & Timestamp */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ADA VERIFIED DISPATCH
                      </span>
                      {post.category && (
                        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      )}
                      <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
                        CONFIDENCE: 91%
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Intelligence Title */}
                  <h4 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight leading-snug">
                    {firstLine}
                  </h4>

                  {/* Technical Brief Text Body */}
                  <div className="text-sm text-gray-200 leading-relaxed font-body whitespace-pre-line font-light">
                    {bodyLines || post.text}
                  </div>

                  {/* Ada Editorial Rationale */}
                  {post.rationale && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-200 flex flex-col gap-1.5 font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                        <Award className="w-4 h-4 text-emerald-400" /> ADA EDITORIAL DECISION RATIONALE:
                      </div>
                      <span className="font-light text-[11px] leading-relaxed text-emerald-200/90">
                        {post.rationale}
                      </span>
                    </div>
                  )}

                  {/* Citations & Evidence Trace Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/[0.08] text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-gray-400 text-[11px] font-medium flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-cyan-400" /> Verified Sources:
                      </span>
                      {post.sources && post.sources.length > 0 ? (
                        post.sources.map((srcUrl, idx) => (
                          <a
                            key={idx}
                            href={srcUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-1 rounded-full transition font-mono text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" /> [{idx + 1}] {getDomain(srcUrl)}
                          </a>
                        ))
                      ) : (
                        <span className="text-gray-500 font-mono text-[11px]">Primary Technical Advisory Feed</span>
                      )}
                    </div>

                    <button
                      onClick={() => onInspectEvidence(post)}
                      className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" /> Inspect Evidence Trace
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
