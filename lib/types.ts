export interface AnalysisResult {
  query: string;
  score: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
  executionTime: number;
  optimizedQuery?: string;
  improvements?: Improvement[];
  issues?: string[];
  suggestions?: string[];
  rowsScanned?: number;
  timestamp?: string;
}

export interface Improvement {
  before: string;
  after: string;
  description: string;
}

export type Tab = "analysis" | "history" | "optimization";
