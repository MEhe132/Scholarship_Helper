'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    registeredAccounts,
    registerWithGoogle,
    registerWithPassword,
    loginWithGoogle,
    loginWithPassword,
    prefilledIdentifier,
    setPrefilledIdentifier
  } = useApp();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google sign up prompt state
  const [showGoogleRegisterPrompt, setShowGoogleRegisterPrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('mhbhuiyan132@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Mehedi Hasan');

  // Notifications
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync prefilled identifier if set
  useEffect(() => {
    if (prefilledIdentifier) {
      setIdentifier(prefilledIdentifier);
    }
  }, [prefilledIdentifier]);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setErrorMsg(null);
    setSuccessNotice(null);
    setShowGoogleRegisterPrompt(false);
  };

  // 1. Google Registration (Sign Up) -> Redirects to Sign In!
  const handleGoogleRegisterSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await registerWithGoogle(googleEmailInput, googleNameInput);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to register Google account.');
      return;
    }

    // Success! Switch to Sign In tab and do NOT auto-login.
    setShowGoogleRegisterPrompt(false);
    setPrefilledIdentifier(googleEmailInput);
    setIdentifier(googleEmailInput);
    setAuthModalMode('login');
    setSuccessNotice(`🎉 Account for "${googleEmailInput}" created successfully! Now click "Continue with Google" or sign in with your account.`);
  };

  // 2. Normal Registration (Sign Up) -> Redirects to Sign In!
  const handlePasswordRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await registerWithPassword(identifier, email || identifier, password, fullName);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
      return;
    }

    // Success! Switch to Sign In tab and do NOT auto-login.
    const registeredId = identifier;
    setPrefilledIdentifier(registeredId);
    setAuthModalMode('login');
    setPassword(''); // Clear password so they must enter it to authenticate
    setSuccessNotice(`🎉 Account created successfully! Please enter your password to sign in to your new account.`);
  };

  // 3. Google Sign In (Authentication)
  const handleGoogleSignIn = async (chosenEmail?: string) => {
    setLoading(true);
    setErrorMsg(null);

    const targetEmail = chosenEmail || (registeredGoogleAccounts.length > 0 ? registeredGoogleAccounts[0].email : undefined);
    const res = await loginWithGoogle(targetEmail);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Google login failed.');
      return;
    }

    // Successfully Authenticated!
    setSuccessNotice('Signed in successfully! Welcome back.');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessNotice(null);
    }, 600);
  };

  // 4. Normal User ID & Password Sign In (Authentication)
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await loginWithPassword(identifier, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in.');
      return;
    }

    // Successfully Authenticated!
    setSuccessNotice('Signed in successfully! Welcome back.');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessNotice(null);
    }, 600);
  };

  const registeredGoogleAccounts = registeredAccounts.filter(acc => acc.provider === 'google');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              {authModalMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {authModalMode === 'login' ? 'Step 2: Sign In to Account' : 'Step 1: Create Account First'}
              </h3>
              <p className="text-xs text-slate-500">
                {authModalMode === 'login' 
                  ? 'Enter credentials or pick registered Google account' 
                  : 'Register first, then sign in with your ID & password'}
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
            <span>Create Account (Sign Up)</span>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

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
          {/* VIEW A: CREATE ACCOUNT (SIGN UP FIRST)                  */}
          {/* ======================================================== */}
          {authModalMode === 'signup' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Create your student account below. Once registered, you will sign in with your credentials.</span>
              </div>

              {/* 1. Google Sign Up Option */}
              {!showGoogleRegisterPrompt ? (
                <button
                  type="button"
                  onClick={() => setShowGoogleRegisterPrompt(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-3 group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.34 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.66 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z" />
                  </svg>
                  <span className="group-hover:text-slate-900">Register with Google Account</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      Register Google Email
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGoogleRegisterPrompt(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="e.g. Mehedi Hasan"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Google Email (Gmail)</label>
                    <input
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. mhbhuiyan132@gmail.com"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleRegisterSubmit()}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Create Google Account & Go to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  Or Sign Up with User ID & Password
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Password Sign Up Form */}
              <form onSubmit={handlePasswordRegisterSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mehedi Hasan"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desired User ID or Student Username</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. mehedi_cs or student123"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. you@university.edu"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Go to Sign In</span>
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW B: SIGN IN (AUTHENTICATE WITH REGISTERED ACCOUNT)   */}
          {/* ======================================================== */}
          {authModalMode === 'login' && (
            <div className="space-y-4">
              
              {/* 1. Google Sign-in with Registered Accounts */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-3 group disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.34 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.66 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z" />
                  </svg>
                  <span className="group-hover:text-slate-900">Continue with Google</span>
                </button>

                {/* Registered Google Accounts Quick Pick */}
                {registeredGoogleAccounts.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                      Select Your Signed-Up Google Account:
                    </span>
                    <div className="space-y-1">
                      {registeredGoogleAccounts.map((gAcc) => (
                        <button
                          key={gAcc.id}
                          type="button"
                          onClick={() => handleGoogleSignIn(gAcc.email)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between text-xs group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                              {gAcc.fullName.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-800 truncate">{gAcc.email}</span>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600 group-hover:underline">
                            Log in →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  Or Sign In with User ID & Password
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Password Sign In Form */}
              <form onSubmit={handlePasswordSignIn} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">User ID or Email</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. cs_student or your email"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Password</label>
                    <span 
                      onClick={() => alert('For demo accounts: Default password is "password123". For newly created accounts, use the password you created during Sign Up.')}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Need help?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Portal</span>
                </button>
              </form>

              {/* Quick switch to Sign Up */}
              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Create Account First
                </button>
              </div>

            </div>
          )}

          {/* Safe Badge */}
          <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 2-Step Registration & Login System</span>
          </div>

        </div>
      </div>
    </div>
  );
}
