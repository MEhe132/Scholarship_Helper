'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Briefcase, 
  Coins, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Check, 
  ShieldCheck, 
  GraduationCap,
  Layers,
  FileText
} from 'lucide-react';
import { authoritiesData } from '../../../data/authoritiesData';
import { useApp } from '../../../context/AppContext';
import { calculateAuthorityMatch } from '../../../lib/matchingEngine';

export default function AuthorityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shortCodeParam = (params?.shortCode as string)?.toUpperCase();
  const { isPinned, togglePin, userProfile, addToTracker, applications, setActiveDuplicateModal } = useApp();

  const authority = authoritiesData.find(
    (a) => a.shortCode.toUpperCase() === shortCodeParam
  );

  if (!authority) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Authority Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested scholarship authority could not be located.</p>
        <Link href="/" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Return to All Portals
        </Link>
      </div>
    );
  }

  const pinned = isPinned(authority.shortCode);
  const match = calculateAuthorityMatch(authority, userProfile);
  const isAlreadyInTracker = applications.some(app => app.authorityShortCode === authority.shortCode);

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Portals</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <span className="text-4xl sm:text-5xl shrink-0 leading-none">
              {authority.countryFlag}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {authority.shortCode}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {authority.badge}
                </span>
              </div>
              
              <h2 className="text-sm sm:text-base font-semibold text-slate-700 mb-2">
                {authority.name} • {authority.country}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {authority.summary}
              </p>
            </div>
          </div>

          {/* Action cluster: Pin, Add to Tracker, Official Website */}
          <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
            
            <button
              onClick={() => togglePin(authority.shortCode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                pinned
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${pinned ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>{pinned ? 'Pinned on Top' : 'Pin to Top'}</span>
            </button>

            <button
              onClick={() => addToTracker(authority)}
              disabled={isAlreadyInTracker}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                isAlreadyInTracker
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm shadow-blue-500/20'
              }`}
            >
              {isAlreadyInTracker ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Tracker</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add to Tracker</span>
                </>
              )}
            </button>

            <a
              href={authority.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

          </div>

        </div>

        {/* Financial & Work Rights Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              Tuition & Coverage
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {authority.tuitionType}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Work Rights & Hourly Pay
            </span>
            <span className="text-xs font-semibold text-slate-800 block leading-snug">
              {authority.workRightsText}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Sync & Live Calls
            </span>
            <span className="text-xs font-bold text-blue-700 block">
              {authority.availableNewsCount} Active Calls Available
            </span>
            <span className="text-[10px] text-slate-400">Synced: {authority.lastSyncedAt}</span>
          </div>

        </div>

      </div>

      {/* Match Analysis & Profile Fit */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-900">
              🎯 Your Profile Match Score: {match.score}% ({match.tag})
            </span>
          </div>
          <span className="text-xs text-blue-800 font-medium">
            Based on your CGPA: <strong>{userProfile.cgpa.toFixed(2)}</strong> (Recommended: ≥ {authority.minCgpaRecommendation.toFixed(2)})
          </span>
        </div>

        {/* Reasons list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {match.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
          {match.warnings.map((warn, idx) => (
            <div key={idx} className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Duplicates / Alternate Sources Drawer Button if available */}
      {authority.duplicateNotices && authority.duplicateNotices.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Clustered Alternate Sources Available</h4>
              <p className="text-[11px] text-slate-500">The Python deduplication engine grouped {authority.duplicateNotices.length} matching departmental or regional notices.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveDuplicateModal({
              title: authority.name,
              notices: authority.duplicateNotices!
            })}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200"
          >
            View {authority.duplicateNotices.length} Sources
          </button>
        </div>
      )}

      {/* In-Depth Application & Documentation Checklist */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Application Requirements & Document Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Academic & Testing Criteria</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Minimum Recommended CGPA: <strong>{authority.minCgpaRecommendation.toFixed(2)} / 4.00</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                GRE Exam: <strong>{authority.greRequired ? 'Required' : 'Waived / Not Required'}</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                IELTS Target: <strong>{authority.ieltsRecommended.toFixed(1)}+ overall</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Eligible Majors: {authority.popularFields.join(', ')}
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Required Dossier Files</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Official BSc Transcripts & Grading Scale Explanation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Academic CV (1–2 pages, LaTeX format)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Statement of Purpose / Motivation Letter tailored to lab
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                2 Academic Letters of Recommendation (LORs) from professors
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
