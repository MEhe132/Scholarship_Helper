'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Star, 
  Clock, 
  Newspaper, 
  ExternalLink, 
  Layers, 
  PlusCircle, 
  Check, 
  Briefcase, 
  Coins, 
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Authority } from '../lib/types';
import { useApp } from '../context/AppContext';
import { calculateAuthorityMatch } from '../lib/matchingEngine';

interface AuthorityCardProps {
  authority: Authority;
}

export default function AuthorityCard({ authority }: AuthorityCardProps) {
  const { 
    isPinned, 
    togglePin, 
    userProfile, 
    addToTracker, 
    applications, 
    setActiveDuplicateModal 
  } = useApp();

  const pinned = isPinned(authority.shortCode);
  const match = calculateAuthorityMatch(authority, userProfile);
  const isAlreadyInTracker = applications.some(app => app.authorityShortCode === authority.shortCode);

  const getMatchBadgeStyle = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (score >= 75) return 'bg-blue-50 text-blue-800 border-blue-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  return (
    <div 
      className={`rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
        pinned 
          ? 'border-amber-300 ring-2 ring-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Card Body */}
      <div className="p-4 sm:p-5">
        
        {/* Header: Flag, Name, Pin Button */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl shrink-0 leading-none">
              {authority.countryFlag}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
                  {authority.shortCode}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {authority.country} • {authority.name}
              </p>
            </div>
          </div>

          {/* ⭐ Favorite / Pin to Top Button */}
          <button
            onClick={() => togglePin(authority.shortCode)}
            title={pinned ? 'Unpin from top' : 'Pin to top of feed'}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${
              pinned 
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
                : 'bg-slate-100/70 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
            }`}
          >
            <Star className={`w-4 h-4 ${pinned ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Live Status Row: Updated Date & Available News Count */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 mb-3 text-xs">
          
          {/* Updated Date */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block leading-tight">Last Updated</span>
              <span className="font-semibold text-slate-800 text-[11px] truncate">
                {authority.lastSyncedAt}
              </span>
            </div>
          </div>

          {/* Available News & Opportunity Count */}
          <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200/60 pl-2.5">
            <Newspaper className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block leading-tight">Active News/Calls</span>
              <span className="font-bold text-blue-700 text-[11px]">
                {authority.availableNewsCount} Available
              </span>
            </div>
          </div>

        </div>

        {/* At-a-Glance Highlights */}
        <div className="space-y-2 mb-3 text-xs">
          
          {/* Tuition & Coverage */}
          <div className="flex items-start gap-2 text-slate-700">
            <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-slate-800 leading-snug">
              {authority.tuitionType}
            </span>
          </div>

          {/* Work Rights */}
          <div className="flex items-start gap-2 text-slate-600">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-tight text-slate-600">
              {authority.workRightsText}
            </span>
          </div>

        </div>

        {/* Match Score Badge Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${getMatchBadgeStyle(match.score)}`}>
            <Sparkles className="w-3 h-3" />
            <span>{match.score}% Match ({match.tag})</span>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            Min CGPA: <strong>{authority.minCgpaRecommendation.toFixed(2)}</strong>
          </span>
        </div>

      </div>

      {/* Card Footer: Duplicates & Actions */}
      <div className="p-4 sm:p-5 pt-0">
        
        {/* Duplicate / Alternative notices button */}
        {authority.duplicateNotices && authority.duplicateNotices.length > 0 && (
          <button
            onClick={() => setActiveDuplicateModal({
              title: `${authority.shortCode} (${authority.name})`,
              notices: authority.duplicateNotices!
            })}
            className="w-full mb-2.5 py-1.5 px-3 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700 border border-indigo-200/60 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Layers className="w-3 h-3 text-indigo-600" />
            <span>📎 {authority.duplicateNotices.length} other sources / duplicate notices</span>
          </button>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          
          <Link
            href={`/authorities/${authority.shortCode.toLowerCase()}`}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors shadow-2xs flex items-center justify-center gap-1"
          >
            <span>Explore Calls</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </Link>

          <button
            onClick={() => addToTracker(authority)}
            disabled={isAlreadyInTracker}
            title={isAlreadyInTracker ? 'Already in your application pipeline' : 'Add to Kanban tracker'}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 border ${
              isAlreadyInTracker
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {isAlreadyInTracker ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Tracked</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Track</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
