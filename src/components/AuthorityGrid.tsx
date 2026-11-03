'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Star, 
  SlidersHorizontal, 
  Globe, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  Filter
} from 'lucide-react';
import { authoritiesData } from '../data/authoritiesData';
import { Authority } from '../lib/types';
import { useApp } from '../context/AppContext';
import AuthorityCard from './AuthorityCard';
import { calculateAuthorityMatch } from '../lib/matchingEngine';

export default function AuthorityGrid() {
  const { pinnedShortCodes, userProfile, setIsProfileModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'high_match' | 'fully_funded' | 'tuition_free'>('all');

  const countries = [
    { label: 'All Portals', value: 'all', flag: '🌐' },
    { label: 'Germany', value: 'Germany', flag: '🇩🇪' },
    { label: 'European Union', value: 'European Union', flag: '🇪🇺' },
    { label: 'Italy', value: 'Italy', flag: '🇮🇹' },
    { label: 'United States', value: 'United States', flag: '🇺🇸' },
    { label: 'South Korea', value: 'South Korea', flag: '🇰🇷' },
    { label: 'Japan', value: 'Japan', flag: '🇯🇵' },
    { label: 'Taiwan', value: 'Taiwan', flag: '🇹🇼' },
    { label: 'Sweden', value: 'Sweden', flag: '🇸🇪' },
  ];

  // Filter authorities based on search, country, and match criteria
  const filteredAuthorities = useMemo(() => {
    return authoritiesData.filter((auth) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        auth.name.toLowerCase().includes(query) ||
        auth.shortCode.toLowerCase().includes(query) ||
        auth.country.toLowerCase().includes(query) ||
        auth.popularFields.some(f => f.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Country filter
      if (selectedCountry !== 'all' && auth.country !== selectedCountry) {
        return false;
      }

      // 3. Filter Type
      if (filterType === 'high_match') {
        const match = calculateAuthorityMatch(auth, userProfile);
        if (match.score < 80) return false;
      } else if (filterType === 'fully_funded') {
        if (!auth.tuitionType.toLowerCase().includes('100%') && !auth.tuitionType.toLowerCase().includes('funded')) {
          return false;
        }
      } else if (filterType === 'tuition_free') {
        if (!auth.tuitionType.toLowerCase().includes('free') && !auth.tuitionType.toLowerCase().includes('€0')) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCountry, filterType, userProfile]);

  // Separate pinned favorites vs regular listings
  const pinnedList = useMemo(() => {
    return filteredAuthorities.filter(auth => pinnedShortCodes.includes(auth.shortCode));
  }, [filteredAuthorities, pinnedShortCodes]);

  const unpinnedList = useMemo(() => {
    return filteredAuthorities.filter(auth => !pinnedShortCodes.includes(auth.shortCode));
  }, [filteredAuthorities, pinnedShortCodes]);

  return (
    <section>
      
      {/* Search & Filter Toolbar */}
      <div className="mb-6 space-y-3">
        
        {/* Top Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country, university, authority (e.g. DAAD, Erasmus, Italy, TUM)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Match Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterType(filterType === 'high_match' ? 'all' : 'high_match')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
                filterType === 'high_match'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>High Match (&gt;80%)</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'fully_funded' ? 'all' : 'fully_funded')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                filterType === 'fully_funded'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              💰 100% Fully Funded
            </button>

            <button
              onClick={() => setFilterType(filterType === 'tuition_free' ? 'all' : 'tuition_free')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                filterType === 'tuition_free'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              €0 Free Tuition
            </button>
          </div>

        </div>

        {/* Country Quick Select Carousel / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {countries.map((c) => {
            const isSelected = selectedCountry === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCountry(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* SECTION 1: 📌 Pinned Favorites (Shown First) */}
      {pinnedList.length > 0 && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 shadow-2xs">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  📌 Pinned Favorites ({pinnedList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Your prioritized authorities and portals — pinned to appear first.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
              Floats to Top
            </span>
          </div>

          {/* Responsive Card Grid for Pinned Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedList.map((auth) => (
              <AuthorityCard key={`pinned-${auth.id}`} authority={auth} />
            ))}
          </div>

        </div>
      )}

      {/* SECTION 2: 🌐 All Authorities & Portals (Card Grid in Rows and Columns) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Verified Portals & Authorities ({unpinnedList.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Browse by official government agencies and funding bodies worldwide.
            </p>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Adjust CGPA & Scores</span>
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {unpinnedList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-sm font-semibold text-slate-700 mb-1">No matching authorities found</p>
            <p className="text-xs text-slate-500 mb-4">Try clearing your search query or adjusting country filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('all');
                setFilterType('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Card Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 4 on desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {unpinnedList.map((auth) => (
              <AuthorityCard key={auth.id} authority={auth} />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
