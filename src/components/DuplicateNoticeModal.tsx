'use client';

import React from 'react';
import { X, ExternalLink, Layers, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DuplicateNoticeModal() {
  const { activeDuplicateModal, setActiveDuplicateModal } = useApp();

  if (!activeDuplicateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alternative Notices & Clustered Sources</h3>
              <p className="text-xs text-slate-500">Grouped automatically by the deduplication engine</p>
            </div>
          </div>
          <button
            onClick={() => setActiveDuplicateModal(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="p-5">
          <div className="mb-4 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              To keep your main feed clean, our system consolidates duplicate postings into a single card.
              Below are the secondary notices, regional partner calls, or department bulletins linked to <strong>{activeDuplicateModal.title}</strong>.
            </p>
          </div>

          {/* List of Duplicates / Alternatives */}
          <div className="space-y-3">
            {activeDuplicateModal.notices.map((notice) => (
              <div 
                key={notice.id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {notice.sourceTitle}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {notice.discoveredAt}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  {notice.note}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Source: {notice.sourceAuthority}
                  </span>

                  <a 
                    href={notice.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <span>View Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => setActiveDuplicateModal(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
