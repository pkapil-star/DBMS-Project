"use client";

import { useState } from "react";
import {
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Shield,
  Code,
  Loader2,
} from "lucide-react";
import type { AnalysisResult } from "../lib/types";

interface Props {
  onNewResult: (result: AnalysisResult) => void;
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

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "LOW":
      return <CheckCircle size={14} />;
    case "MEDIUM":
      return <AlertTriangle size={14} />;
    case "HIGH":
      return <AlertTriangle size={14} />;
    default:
      return <CheckCircle size={14} />;
  }
}

export function AnalysisTab({ onNewResult }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      data.timestamp = new Date().toISOString();
      setResult(data);
      onNewResult(data);
    } catch (err: any) {
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the API server. Make sure the Flask backend is running on http://127.0.0.1:5000"
          : `Analysis failed: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Input card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            SQL Query Input
          </h2>
        </div>

        <textarea
          id="sql-input"
          className="sql-textarea w-full p-4 min-h-[160px]"
          placeholder="Enter your SQL query here...&#10;&#10;Example: SELECT * FROM users WHERE status = 'active'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-foreground-dim">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-surface-light text-foreground-muted text-[11px] font-mono border border-border">
              Ctrl + Enter
            </kbd>{" "}
            to analyze
          </p>

          <button
            id="analyze-btn"
            className="btn-glow flex items-center gap-2 text-sm"
            onClick={handleAnalyze}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Analyzing…
              </>
            ) : (
              <>
                <Play size={16} />
                Analyze Query
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card-static p-5 border-l-4 border-l-danger animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-danger mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-danger text-sm">
                Connection Error
              </p>
              <p className="text-foreground-dim text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              Analysis Results
            </h2>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Score */}
            <div className="rounded-xl bg-[rgba(6,6,14,0.5)] border border-border p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-foreground-dim font-medium">
                Score
              </span>
              <span
                className={`text-3xl font-bold tabular-nums ${
                  result.score >= 80
                    ? "text-success"
                    : result.score >= 50
                    ? "text-warning"
                    : "text-danger"
                }`}
              >
                {result.score}
              </span>
              <span className={`score-badge ${getScoreColor(result.score)}`}>
                {result.score >= 80
                  ? "Good"
                  : result.score >= 50
                  ? "Needs Work"
                  : "Critical"}
              </span>
            </div>

            {/* Severity */}
            <div className="rounded-xl bg-[rgba(6,6,14,0.5)] border border-border p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-foreground-dim font-medium">
                Severity
              </span>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Shield
                  size={22}
                  className={
                    result.severity === "LOW"
                      ? "text-success"
                      : result.severity === "MEDIUM"
                      ? "text-warning"
                      : "text-danger"
                  }
                />
              </div>
              <span
                className={`severity-badge ${getSeverityClass(
                  result.severity
                )}`}
              >
                {getSeverityIcon(result.severity)}
                {result.severity}
              </span>
            </div>

            {/* Execution Time */}
            <div className="rounded-xl bg-[rgba(6,6,14,0.5)] border border-border p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-foreground-dim font-medium">
                Execution Time
              </span>
              <span className="text-3xl font-bold tabular-nums text-primary-light">
                {result.executionTime}
              </span>
              <span className="text-xs text-foreground-dim font-medium">
                <Clock size={12} className="inline mr-1" />
                milliseconds
              </span>
            </div>
          </div>

          {/* Query display */}
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground-dim font-medium mb-2">
              Analyzed Query
            </p>
            <div className="code-block p-4">
              <code>{result.query}</code>
            </div>
          </div>

          {/* Issues */}
          {result.issues && result.issues.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-foreground-dim font-medium mb-2">
                Issues Found
              </p>
              <ul className="space-y-2">
                {result.issues.map((issue, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-warning"
                  >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!result && !error && !loading && (
        <div className="glass-card-static empty-state py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-light border border-border flex items-center justify-center mb-4">
            <Activity size={28} className="text-foreground-dim" />
          </div>
          <p className="text-foreground-dim font-medium">No results yet</p>
          <p className="text-foreground-dim/60 text-sm mt-1">
            Enter a SQL query above and click Analyze to get started
          </p>
        </div>
      )}
    </div>
  );
}
