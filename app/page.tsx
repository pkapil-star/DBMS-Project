"use client";

import { useState } from "react";
import { Navbar } from "../components/navbar";
import { AnalysisTab } from "../components/analysis-tab";
import { HistoryTab } from "../components/history-tab";
import { OptimizationTab } from "../components/optimization-tab";
import type { Tab, AnalysisResult } from "../lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleNewResult = (result: AnalysisResult) => {
    setLastResult(result);
    setHistory((prev) => [result, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === "analysis" && (
          <AnalysisTab onNewResult={handleNewResult} />
        )}

        {activeTab === "history" && <HistoryTab history={history} />}

        {activeTab === "optimization" && (
          <OptimizationTab result={lastResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-foreground-dim">
          <span>SQL Query Analyzer</span>
          <span>Powered by Flask API</span>
        </div>
      </footer>
    </div>
  );
}