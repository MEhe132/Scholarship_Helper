'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Kanban, 
  FolderLock, 
  BookOpen, 
  User, 
  SlidersHorizontal,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    logout,
    userProfile, 
    setIsProfileModalOpen, 
    applications, 
    documents, 
    pinnedShortCodes 
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">GlobalScholar</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Hub</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">CS Higher Study & Scholarship Portal</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Portals & Opportunities
            </Link>

            <Link
              href="/tracker"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/tracker' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Applications</span>
              {applications.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs rounded-full bg-blue-600 text-white font-semibold">
                  {applications.length}
                </span>
              )}
            </Link>

            <Link
              href="/documents"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/documents' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>Document Vault</span>
              {documents.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {documents.length}
                </span>
              )}
            </Link>

            <Link
              href="/guides"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/guides' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Work Guides</span>
            </Link>
          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center gap-2.5">
            {pinnedShortCodes.length > 0 && (
              <span className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ {pinnedShortCodes.length} Pinned
              </span>
            )}

            {/* If NOT logged in: Show Log In & Sign Up buttons */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 border border-slate-200/80"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/20 hidden sm:flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              /* If LOGGED IN: Show User Avatar & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.userId.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                      {currentUser.fullName || currentUser.userId}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">
                      @{currentUser.userId} • CGPA: {userProfile.cgpa.toFixed(2)}
                    </p>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-blue-600 font-mono truncate">@{currentUser.userId}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Authenticated Session</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                          <span>Academic Profile & Scores</span>
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {userProfile.cgpa.toFixed(2)}
                        </span>
                      </button>

                      <Link
                        href="/tracker"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Kanban className="w-4 h-4 text-indigo-600" />
                        <span>Application Pipeline ({applications.length})</span>
                      </Link>

                      <Link
                        href="/documents"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FolderLock className="w-4 h-4 text-emerald-600" />
                        <span>Document Vault ({documents.length})</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-200 bg-slate-50/80 px-2 py-2 text-xs">
        <Link 
          href="/" 
          className={`px-3 py-1.5 rounded-md font-medium ${pathname === '/' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Portals
        </Link>
        <Link 
          href="/tracker" 
          className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 ${pathname === '/tracker' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Apps ({applications.length})
        </Link>
        <Link 
          href="/documents" 
          className={`px-3 py-1.5 rounded-md font-medium ${pathname === '/documents' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Vault ({documents.length})
        </Link>
        <Link 
          href="/guides" 
          className={`px-3 py-1.5 rounded-md font-medium ${pathname === '/guides' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Guides
        </Link>
        {!currentUser && (
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-md font-bold text-blue-600 bg-blue-50 border border-blue-200"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
