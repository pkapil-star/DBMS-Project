"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  History,
  Sparkles,
  Zap,
  Database,
  LogOut,
} from "lucide-react";
import type { Tab } from "../lib/types";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  historyCount: number;
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "analysis", label: "Analysis", icon: <Search size={16} /> },
  { key: "history", label: "History", icon: <History size={16} /> },
  { key: "optimization", label: "Optimization", icon: <Sparkles size={16} /> },
];

export function Navbar({ activeTab, onTabChange, historyCount }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("sql_user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-[rgba(6,6,14,0.75)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-dark to-accent-dark shadow-lg shadow-primary-dark/20">
              <Database size={18} className="text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background pulse-dot" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
                SQL Analyzer
                <Zap size={14} className="text-warning" />
              </h1>
              <p className="text-[10px] text-foreground-dim font-medium tracking-wider uppercase">
                Query Intelligence
              </p>
            </div>
          </div>

          {/* Right side: status + logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.12)] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
              <span className="text-success font-medium">API Connected</span>
            </span>

            <button
              id="logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                text-foreground-dim hover:text-danger
                bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(248,113,113,0.08)]
                border border-border hover:border-[rgba(248,113,113,0.2)]
                transition-all duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-1 -mb-px">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => onTabChange(key)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium
                transition-all duration-200 rounded-t-lg cursor-pointer
                ${
                  activeTab === key
                    ? "text-primary-light"
                    : "text-foreground-dim hover:text-foreground-muted"
                }
              `}
            >
              {icon}
              {label}
              {key === "history" && historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-dark/30 text-primary-light border border-primary-dark/30">
                  {historyCount}
                </span>
              )}
              {activeTab === key && <span className="tab-active-line" />}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}