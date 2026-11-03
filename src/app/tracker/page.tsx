'use client';

import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, ApplicationCard } from '../../lib/types';
import Link from 'next/link';

const columns: { status: ApplicationStatus; title: string; color: string; badge: string }[] = [
  { status: 'shortlisted', title: 'Shortlisted', color: 'border-slate-300 bg-slate-50', badge: 'bg-slate-200 text-slate-800' },
  { status: 'preparing', title: 'Preparing Documents', color: 'border-blue-300 bg-blue-50/40', badge: 'bg-blue-100 text-blue-800' },
  { status: 'applied', title: 'Submitted / Applied', color: 'border-indigo-300 bg-indigo-50/40', badge: 'bg-indigo-100 text-indigo-800' },
  { status: 'under_review', title: 'Under Review', color: 'border-amber-300 bg-amber-50/40', badge: 'bg-amber-100 text-amber-800' },
  { status: 'accepted', title: 'Accepted / Funded! 🎉', color: 'border-emerald-400 bg-emerald-50/50', badge: 'bg-emerald-200 text-emerald-900 font-bold' },
];

export default function ApplicationTrackerPage() {
  const { applications, updateApplicationStatus, deleteApplication } = useApp();
  const [newUniName, setNewUniName] = useState('');
  const [newProgramName, setNewProgramName] = useState('');
  const [newCountry, setNewCountry] = useState('Germany');
  const [newDeadline, setNewDeadline] = useState('2026-06-30');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniName || !newProgramName) return;

    // Use Context to save
    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      scholarshipTitle: newProgramName,
      universityName: newUniName,
      country: newCountry,
      countryFlag: newCountry === 'Germany' ? '🇩🇪' : newCountry === 'USA' ? '🇺🇸' : newCountry === 'Italy' ? '🇮🇹' : '🌐',
      status: 'shortlisted',
      deadline: newDeadline,
      notes: 'Manually added custom application.',
      updatedAt: 'Just now'
    };

    // Save
    const existing = JSON.parse(localStorage.getItem('gsh_applications') || '[]');
    const next = [newCard, ...existing];
    localStorage.setItem('gsh_applications', JSON.stringify(next));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Application Kanban Pipeline
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Track and move your higher study applications from initial shortlist to acceptance letters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            + Add from Portals
          </Link>
        </div>
      </div>

      {/* Kanban Board Container (Horizontal scroll on mobile, flex on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const cardsInCol = applications.filter((app) => app.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-2xl border p-3 flex flex-col min-h-[500px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                <span className="font-bold text-xs text-slate-800">
                  {col.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {cardsInCol.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {cardsInCol.map((card) => (
                  <div
                    key={card.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2 text-xs"
                  >
                    {/* Country & Title */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <span className="text-base">{card.countryFlag}</span>
                        <span className="line-clamp-1">{card.universityName}</span>
                      </div>
                      
                      <button
                        onClick={() => deleteApplication(card.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-semibold text-blue-700 text-xs line-clamp-2">
                      {card.scholarshipTitle}
                    </p>

                    {card.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {card.notes}
                      </p>
                    )}

                    {card.deadline && (
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Deadline: {card.deadline}</span>
                      </div>
                    )}

                    {/* Move to Next / Prev Stage Dropdown */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Stage:</span>
                      <select
                        value={card.status}
                        onChange={(e) => updateApplicationStatus(card.id, e.target.value as ApplicationStatus)}
                        className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 focus:outline-none"
                      >
                        <option value="shortlisted">Shortlisted</option>
                        <option value="preparing">Preparing</option>
                        <option value="applied">Applied</option>
                        <option value="under_review">Under Review</option>
                        <option value="accepted">Accepted 🎉</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                  </div>
                ))}

                {cardsInCol.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
