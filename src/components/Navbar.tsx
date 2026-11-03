'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Sparkles, 
  Kanban, 
  FolderLock, 
  BookOpen, 
  User, 
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { userProfile, setIsProfileModalOpen, applications, documents, pinnedShortCodes } = useApp();

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

          {/* Right Action: User Profile Chip (Click to edit profile & CGPA) */}
          <div className="flex items-center gap-3">
            {pinnedShortCodes.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ {pinnedShortCodes.length} Pinned
              </span>
            )}

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left shadow-2xs group"
              title="Click to edit your CGPA and profile"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {userProfile.fullName ? userProfile.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  CGPA: {userProfile.cgpa.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none">
                  Year 3 • CS
                </p>
              </div>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-1" />
            </button>
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
      </div>
    </header>
  );
}
