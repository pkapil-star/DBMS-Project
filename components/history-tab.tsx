"use client";

import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Shield,
  History as HistoryIcon,
  Search,
} from "lucide-react";
import type { AnalysisResult } from "../lib/types";

interface Props {
  history: AnalysisResult[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "score-green";
  if (score >= 50) return "score-yellow";
  return "score-red";
}

function getSeverityClass(severity: string) {
  switch (severity) {
    case "LOW":
      return "severity-low";
    case "MEDIUM":
      return "severity-medium";
    case "HIGH":
      return "severity-high";
    default:
      return "severity-low";
  }
}

function formatTime(iso: string | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function truncateQuery(q: string, max = 80) {
  return q.length > max ? q.slice(0, max) + "…" : q;
}

export function HistoryTab({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="glass-card-static empty-state py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-light border border-border flex items-center justify-center mb-4">
          <HistoryIcon size={28} className="text-foreground-dim" />
        </div>
        <p className="text-foreground-dim font-medium">No history yet</p>
        <p className="text-foreground-dim/60 text-sm mt-1">
          Analyzed queries will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Query History
          </h2>
        </div>
        <span className="text-xs text-foreground-dim">
          {history.length} {history.length === 1 ? "query" : "queries"} analyzed
        </span>
      </div>

      {/* Table card */}
      <div className="glass-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 text-xs uppercase tracking-wider text-foreground-dim font-medium border-b border-border bg-[rgba(6,6,14,0.3)]">
          <div className="col-span-5">Query</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Severity</div>
          <div className="col-span-1 text-center">Time</div>
          <div className="col-span-2 text-right">Timestamp</div>
        </div>

        {/* Rows */}
        {history.map((item, index) => (
          <div
            key={index}
            className="history-row grid grid-cols-12 gap-3 px-5 py-4 items-center"
          >
            {/* Query */}
            <div className="col-span-5">
              <code className="text-sm text-primary-light font-mono break-all leading-relaxed">
                {truncateQuery(item.query)}
              </code>
            </div>

            {/* Score */}
            <div className="col-span-2 flex justify-center">
              <span className={`score-badge ${getScoreColor(item.score)}`}>
                {item.score}
              </span>
            </div>

            {/* Severity */}
            <div className="col-span-2 flex justify-center">
              <span
                className={`severity-badge ${getSeverityClass(item.severity)}`}
              >
                {item.severity === "LOW" ? (
                  <CheckCircle size={12} />
                ) : (
                  <AlertTriangle size={12} />
                )}
                {item.severity}
              </span>
            </div>

            {/* Execution time */}
            <div className="col-span-1 text-center text-sm text-foreground-muted tabular-nums">
              {item.executionTime}
              <span className="text-foreground-dim text-xs">ms</span>
            </div>

            {/* Timestamp */}
            <div className="col-span-2 text-right text-xs text-foreground-dim">
              <Clock size={12} className="inline mr-1 opacity-50" />
              {formatTime(item.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}