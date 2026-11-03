'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Briefcase, 
  Coins, 
  Mail, 
  FileText, 
  Clock, 
  Copy, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { guidesData, StudyGuide } from '../../data/guidesData';

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<StudyGuide>(guidesData[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Work Rights & Higher Study Strategy Guides
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          In-depth guides on student work laws, CS Werkstudent jobs, blocked accounts, and professor cold-email templates.
        </p>
      </div>

      {/* 2-Column Layout: Guide Directory on Left, Active Article on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider px-1">
            Available Guides ({guidesData.length})
          </h3>

          <div className="space-y-2">
            {guidesData.map((guide) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{guide.countryFlag}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {guide.category}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                      {guide.title}
                    </h4>

                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {guide.readTime}
                    </span>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Guide Reader */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          
          {/* Article Header */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <span className="text-xl">{selectedGuide.countryFlag}</span>
              <span>{selectedGuide.country}</span>
              <span>•</span>
              <span className="text-blue-600 font-bold">{selectedGuide.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedGuide.readTime}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-2">
              {selectedGuide.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedGuide.summary}
            </p>
          </div>

          {/* Quick Key Takeaways */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Key Strategic Takeaways
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedGuide.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            <div 
              className="whitespace-pre-line font-sans"
              dangerouslySetInnerHTML={{ 
                __html: selectedGuide.contentMarkdown
                  .replace(/### (.*?)\n/g, '<h3 class="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                  .replace(/> (.*?)\n/g, '<blockquote class="border-l-4 border-blue-500 pl-3 py-1 my-2 bg-blue-50/50 rounded-r text-xs text-slate-800">$1</blockquote>')
              }}
            />
          </div>

          {/* Template Copy Tool (For cold emails & CVs) */}
          {selectedGuide.category === 'Application Strategy' || selectedGuide.category === 'Templates' ? (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                You can copy this template directly into your notes or email client.
              </span>
              <button
                onClick={() => handleCopy(selectedGuide.contentMarkdown)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
              </button>
            </div>
          ) : null}

        </div>

      </div>

    </div>
  );
}
