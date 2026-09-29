import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, KeyRound, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAdmin, adminUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  // If already logged in as admin, navigate directly to admin dashboard
  useEffect(() => {
    if (isAdmin || (adminUser && (adminUser.role === "ADMIN" || adminUser.role === "STAFF"))) {
      navigate(redirect, { replace: true });
    }
  }, [isAdmin, adminUser, navigate, redirect]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please enter both admin username/email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login(identifier.trim(), password);
      if (res.user?.role === "ADMIN" || res.user?.role === "STAFF") {
        navigate(redirect, { replace: true });
      } else {
        setError("This account does not have Admin or Staff permissions.");
      }
    } catch (err) {
      setError(err.message || "Admin authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDefaults = () => {
    setIdentifier("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25 ring-4 ring-brand-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin & Staff Portal</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Vishveshwarya Group of Institutions • Operations Desk
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username / Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin or admin@vgi.ac.in"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Unlock Admin Desk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Autofill Card */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Default Access Credentials</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono">
            Username: <span className="font-bold text-white bg-slate-700/80 px-1.5 py-0.5 rounded">admin</span>
            {"  |  "}
            Password: <span className="font-bold text-white bg-slate-700/80 px-1.5 py-0.5 rounded">admin123</span>
          </div>
          <button
            type="button"
            onClick={fillDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors pt-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Click to autofill credentials</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center pt-1">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Student App</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
