'use client';

import React from 'react';
import LatestNewsSlider from '../components/LatestNewsSlider';
import AuthorityGrid from '../components/AuthorityGrid';
import { useApp } from '../context/AppContext';
import { Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { userProfile, setIsProfileModalOpen, pinnedShortCodes, applications } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Personalized Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                🎓 3rd-Year CS Higher Study Portal
              </span>
              <span className="text-xs text-slate-300">
                Target: {userProfile.targetIntake}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
              Find Your Funded Master&apos;s or Tuition-Free Tech Route Abroad
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore official opportunities in <strong>Germany (tuition-free + €16–€25/hr Werkstudent jobs)</strong>, 
              <strong> Erasmus Mundus (100% funded)</strong>, <strong>USA (GRA/GTA Assistantships)</strong>, and 
              <strong> Italy (DSU need-based grants)</strong>.
            </p>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block">Your Profile CGPA</span>
              <span className="text-lg font-bold text-emerald-400">
                {userProfile.cgpa.toFixed(2)} / {userProfile.cgpaScale.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Adjust Scores</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. TOP SECTION: Sliding Window / Carousel (Latest News across all websites, Newest First) */}
      <LatestNewsSlider />

      {/* 2. MAIN SECTION: Authority & Opportunity Card Grid (Rows & Columns for PC and Mobile) */}
      <AuthorityGrid />

    </div>
  );
}
