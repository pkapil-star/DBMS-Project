"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Lightbulb,
  Code,
  Wand2,
} from "lucide-react";
import type { AnalysisResult } from "../lib/types";

interface Props {
  result: AnalysisResult | null;
}

export function OptimizationTab({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = result?.optimizedQuery || result?.query || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!result) {
    return (
      <div className="glass-card-static empty-state py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-light border border-border flex items-center justify-center mb-4">
          <Wand2 size={28} className="text-foreground-dim" />
        </div>
        <p className="text-foreground-dim font-medium">No data yet</p>
        <p className="text-foreground-dim/60 text-sm mt-1">
          Analyze a query first to see optimizations
        </p>
      </div>
    );
  }

  const optimizedQuery = result.optimizedQuery || result.query;
  const improvements = result.improvements || [];
  const hasOptimization =
    result.optimizedQuery && result.optimizedQuery !== result.query;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Optimized query card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              {hasOptimization ? "Optimized Query" : "Current Query"}
            </h2>
          </div>

          <button
            id="copy-btn"
            className="btn-copy flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>

        {hasOptimization && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.1)]">
            <Lightbulb size={14} className="text-success shrink-0" />
            <p className="text-xs text-success">
              This query has been optimized for better performance
            </p>
          </div>
        )}

        <div className="code-block p-4">
          <code className="whitespace-pre-wrap">{optimizedQuery}</code>
        </div>
      </div>

      {/* Improvements list */}
      {improvements.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wand2 size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Improvements
            </h2>
            <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-primary-dark/20 text-primary-light border border-primary-dark/20">
              {improvements.length}
            </span>
          </div>

          <div className="space-y-4">
            {improvements.map((imp, i) => (
              <div
                key={i}
                className="rounded-xl bg-[rgba(6,6,14,0.5)] border border-border p-4"
              >
                {/* Description */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary-dark/20 border border-primary-dark/30 flex items-center justify-center text-xs font-bold text-primary-light">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {imp.description}
                  </p>
                </div>

                {/* Before → After */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground-dim font-medium mb-1.5">
                      Before
                    </p>
                    <div className="code-block p-3 border-l-2 border-l-danger/30">
                      <code className="text-danger/80 text-xs break-all">
                        {imp.before}
                      </code>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight size={18} className="text-foreground-dim" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground-dim font-medium mb-1.5">
                      After
                    </p>
                    <div className="code-block p-3 border-l-2 border-l-success/30">
                      <code className="text-success/80 text-xs break-all">
                        {imp.after}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No improvements */}
      {improvements.length === 0 && (
        <div className="glass-card-static p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-foreground-dim">
            <CheckCircleIcon />
            <p className="text-sm">
              No specific improvements available for this query
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}