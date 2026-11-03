'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, SlidersHorizontal, Award, Globe2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileModal() {
  const { userProfile, updateProfile, isProfileModalOpen, setIsProfileModalOpen } = useApp();

  const [fullName, setFullName] = useState(userProfile.fullName);
  const [currentDegree, setCurrentDegree] = useState(userProfile.currentDegree);
  const [cgpa, setCgpa] = useState(userProfile.cgpa.toString());
  const [ieltsScore, setIeltsScore] = useState(userProfile.ieltsScore?.toString() || '7.0');
  const [greQuant, setGreQuant] = useState(userProfile.greQuant?.toString() || '164');
  const [fundingPreference, setFundingPreference] = useState(userProfile.fundingPreference);
  const [targetIntake, setTargetIntake] = useState(userProfile.targetIntake);
  const [preferredCountries, setPreferredCountries] = useState<string[]>(userProfile.preferredCountries);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen) return null;

  const countryOptions = ['Germany', 'European Union', 'United States', 'Italy', 'South Korea', 'Japan', 'Taiwan', 'Sweden'];

  const handleCountryToggle = (country: string) => {
    setPreferredCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCgpa = parseFloat(cgpa) || 3.5;
    const parsedIelts = parseFloat(ieltsScore) || 7.0;
    const parsedGre = parseInt(greQuant) || 160;

    updateProfile({
      fullName,
      currentDegree,
      cgpa: Math.min(Math.max(parsedCgpa, 1.0), 4.0),
      ieltsScore: Math.min(Math.max(parsedIelts, 0), 9.0),
      greQuant: Math.min(Math.max(parsedGre, 130), 170),
      fundingPreference: fundingPreference as any,
      targetIntake,
      preferredCountries
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Academic Profile & Metrics</h3>
              <p className="text-xs text-slate-500">Live matching engine recalculates eligibility and fit scores instantly</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name / Profile Tag</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800"
                placeholder="e.g. CS Undergrad (3rd Year)"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Degree / Standing</label>
              <input 
                type="text"
                value={currentDegree}
                onChange={(e) => setCurrentDegree(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800"
                placeholder="BSc in Computer Science (3rd Year)"
              />
            </div>
          </div>

          {/* Academic Scores Row */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-xs mb-2.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Academic Scores & Eligibility Filters
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current CGPA (out of 4.00)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold text-slate-900 bg-white"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Affects Germany & Erasmus match</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  IELTS / Expected Band
                </label>
                <input 
                  type="number"
                  step="0.5"
                  min="4.0"
                  max="9.0"
                  value={ieltsScore}
                  onChange={(e) => setIeltsScore(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold text-slate-900 bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Target: 6.5 – 7.5+</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GRE Quantitative (Optional)
                </label>
                <input 
                  type="number"
                  min="130"
                  max="170"
                  value={greQuant}
                  onChange={(e) => setGreQuant(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-bold text-slate-900 bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">For top US CS labs (160+)</span>
              </div>
            </div>
          </div>

          {/* Preferences Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Funding Route Strategy</label>
              <select 
                value={fundingPreference}
                onChange={(e) => setFundingPreference(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800 bg-white"
              >
                <option value="both">Both (100% Fully Funded & Tuition-Free + Work)</option>
                <option value="fully_funded">100% Fully Funded Awards Only (Erasmus, US PhD)</option>
                <option value="tuition_free_work">Zero Tuition + High Student Tech Work (Germany, Italy)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Application Intake</label>
              <input 
                type="text"
                value={targetIntake}
                onChange={(e) => setTargetIntake(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800"
                placeholder="e.g. Fall 2026 / Spring 2027"
              />
            </div>
          </div>

          {/* Target Countries Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-blue-600" />
              Target Study Destinations (Toggle to customize matches)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {countryOptions.map(country => {
                const isSelected = preferredCountries.includes(country);
                return (
                  <button
                    type="button"
                    key={country}
                    onClick={() => handleCountryToggle(country)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{country}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Changes reflect immediately on card recommendations.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save & Update Matches</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
