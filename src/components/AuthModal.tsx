'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    registeredUsers,
    signUp,
    login,
    prefilledUserId,
    setPrefilledUserId
  } = useApp();

  // Form states
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Status banners
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync prefilled User ID when switching or redirecting
  useEffect(() => {
    if (prefilledUserId) {
      setUserId(prefilledUserId);
    }
  }, [prefilledUserId]);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setErrorMsg(null);
    setSuccessNotice(null);
  };

  // =========================================================================
  // STEP 1: CREATE ACCOUNT (Sign Up) -> Saves to DB & Redirects to Sign In
  // =========================================================================
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const res = signUp(userId, password, fullName);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account.');
      return;
    }

    // SUCCESS: Account is saved in website database!
    // Now redirect to Sign In tab and do NOT auto-login.
    const createdUserId = userId.trim().toLowerCase();
    setPrefilledUserId(createdUserId);
    setUserId(createdUserId);
    setPassword('');
    setConfirmPassword('');
    setAuthModalMode('login');
    setSuccessNotice(`🎉 Account for "${createdUserId}" created successfully! Now enter your password to sign in.`);
  };

  // =========================================================================
  // STEP 2: LOG IN (Checks database for User ID & Password)
  // =========================================================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    setLoading(true);
    const res = login(userId, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Login failed.');
      return;
    }

    // SUCCESS: User verified against database!
    setSuccessNotice('Signed in successfully! Welcome to your dashboard.');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessNotice(null);
      setPassword('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              {authModalMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {authModalMode === 'login' ? 'Sign In' : 'Create Account (Sign Up)'}
              </h3>
              <p className="text-xs text-slate-500">
                {authModalMode === 'login' 
                  ? 'Enter your User ID and password to access your portal' 
                  : 'Register a unique User ID and password first'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="px-6 pt-3 flex border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authModalMode === 'login' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white rounded-t-lg' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authModalMode === 'signup' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white rounded-t-lg' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (Create Account)</span>
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* Success Banner */}
          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: SIGN UP (CREATE ACCOUNT FIRST)                   */}
          {/* ======================================================== */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Choose a Unique User ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. mehedi_cs or 20261234"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900 font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Alphanumeric, at least 3 characters.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name (Display Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mehedi Hasan"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={5}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 5 characters"
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={5}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Go to Sign In</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already created an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign In here
                </button>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: SIGN IN (CHECK DATABASE & LOG IN)                */}
          {/* ======================================================== */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your User ID
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your registered User ID"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 mt-3"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </button>

              {/* Quick switch to Sign Up */}
              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                New user? Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign Up first
                </button>
              </div>

              {/* Demo accounts hint */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Pre-seeded Test Account:</span>
                  <div className="mt-0.5 text-slate-500">
                    User ID: <code className="bg-white px-1 py-0.5 rounded border font-bold text-blue-700">student123</code> • Password: <code className="bg-white px-1 py-0.5 rounded border font-bold text-blue-700">password123</code>
                  </div>
                </div>
              </div>

            </form>
          )}

          {/* Safe Badge */}
          <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Internal Website Database • Direct ID & Password Authentication</span>
          </div>

        </div>
      </div>
    </div>
  );
}
