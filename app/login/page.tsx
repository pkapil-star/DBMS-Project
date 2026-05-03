"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    // Client-side validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint =
      mode === "login"
        ? "http://127.0.0.1:5000/login"
        : "http://127.0.0.1:5000/register";

    const body: Record<string, string> = { email, password };
    if (mode === "register" && name.trim()) body.name = name.trim();

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      if (mode === "login") {
        // Store user info
        if (data.user) {
          localStorage.setItem("sql_user", JSON.stringify(data.user));
        }
        // Redirect to analyzer
        router.push("/");
      } else {
        // Registration success → switch to login with success message
        setSuccess("Account created! You can now sign in.");
        setPassword("");
        setName("");
        setMode("login");
      }
    } catch (err: any) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the API server. Make sure the Flask backend is running on http://127.0.0.1:5000"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";
  const canSubmit =
    !loading && email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="login-page min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="login-orb login-orb-1" aria-hidden="true" />
      <div className="login-orb login-orb-2" aria-hidden="true" />
      <div className="login-orb login-orb-3" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="login-grid" aria-hidden="true" />

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8 relative z-10">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-2xl shadow-[#6366f1]/30">
          <Database size={24} className="text-white" />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#34d399] border-2 border-[#06060e] pulse-dot"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#e2e8f0] flex items-center gap-2 justify-center">
            SQL Analyzer
            <Zap size={18} className="text-[#fbbf24]" />
          </h1>
          <p className="text-xs text-[#64748b] font-medium tracking-wider uppercase mt-0.5">
            Query Intelligence Platform
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="login-card w-full max-w-md relative z-10 animate-fade-in">
        {/* Mode toggle tabs */}
        <div className="flex border-b border-[rgba(255,255,255,0.06)]">
          <button
            id="tab-login"
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-4 text-sm font-medium transition-all duration-200 relative ${
              isLogin
                ? "text-[#a5b4fc]"
                : "text-[#475569] hover:text-[#94a3b8]"
            }`}
          >
            Sign In
            {isLogin && <span className="tab-active-line" />}
          </button>
          <button
            id="tab-register"
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 py-4 text-sm font-medium transition-all duration-200 relative ${
              !isLogin
                ? "text-[#a5b4fc]"
                : "text-[#475569] hover:text-[#94a3b8]"
            }`}
          >
            Create Account
            {!isLogin && <span className="tab-active-line" />}
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#e2e8f0]">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              {isLogin
                ? "Sign in to access the SQL Analyzer"
                : "Start analyzing and optimizing your SQL queries"}
            </p>
          </div>

          <form id="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Name (register only) */}
              {!isLogin && (
                <div className="animate-fade-in">
                  <label
                    htmlFor="name-input"
                    className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-2"
                  >
                    Your name <span className="text-[#475569] normal-case font-normal">(optional)</span>
                  </label>
                  <div
                    className={`login-input-wrap ${
                      focusedField === "name" ? "login-input-focused" : ""
                    }`}
                  >
                    <User
                      size={16}
                      className={`login-input-icon ${
                        focusedField === "name" ? "text-[#818cf8]" : "text-[#475569]"
                      }`}
                    />
                    <input
                      id="name-input"
                      type="text"
                      autoComplete="name"
                      className="login-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-2"
                >
                  Email address
                </label>
                <div
                  className={`login-input-wrap ${
                    focusedField === "email" ? "login-input-focused" : ""
                  }`}
                >
                  <Mail
                    size={16}
                    className={`login-input-icon ${
                      focusedField === "email" ? "text-[#818cf8]" : "text-[#475569]"
                    }`}
                  />
                  <input
                    id="email-input"
                    type="email"
                    autoComplete="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
                  >
                    Password
                  </label>
                  {isLogin && (
                    <span className="text-xs text-[#475569]">
                      Min. 6 characters
                    </span>
                  )}
                </div>
                <div
                  className={`login-input-wrap ${
                    focusedField === "password" ? "login-input-focused" : ""
                  }`}
                >
                  <Lock
                    size={16}
                    className={`login-input-icon ${
                      focusedField === "password" ? "text-[#818cf8]" : "text-[#475569]"
                    }`}
                  />
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="login-input pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <button
                    type="button"
                    id="toggle-password-btn"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors p-1"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Success message */}
              {success && (
                <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.07)] animate-fade-in">
                  <CheckCircle size={15} className="text-[#34d399] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#34d399]">{success}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="login-error animate-fade-in">
                  <AlertTriangle size={15} className="text-[#f87171] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#f87171]">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="submit-btn"
                type="submit"
                className="btn-glow w-full flex items-center justify-center gap-2 text-sm mt-2"
                disabled={!canSubmit}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    {isLogin ? "Signing in…" : "Creating account…"}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="login-divider my-7">
            <span>or continue with</span>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="github-btn"
              type="button"
              className="login-oauth-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
            <button
              id="google-btn"
              type="button"
              className="login-oauth-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

          {/* Switch mode link */}
          <p className="text-center text-sm text-[#64748b] mt-7">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="text-[#818cf8] hover:text-[#a5b4fc] font-medium transition-colors"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-[#334155] relative z-10">
        © 2026 SQL Analyzer · Query Intelligence Platform
      </p>
    </div>
  );
}
