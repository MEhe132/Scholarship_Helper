'use client';

import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  Plus, 
  Check, 
  ShieldCheck, 
  FileCheck2,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentItem } from '../../lib/types';

export default function DocumentVaultPage() {
  const { documents, addDocument, deleteDocument } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<DocumentCategory>('cv');
  const [fileNotes, setFileNotes] = useState('');

  const categories = [
    { label: 'All Files', value: 'all' },
    { label: 'CV / Resumes', value: 'cv' },
    { label: 'SOP & Motivation', value: 'sop' },
    { label: 'Academic Transcripts', value: 'transcript' },
    { label: 'Letters of Rec (LOR)', value: 'lor' },
    { label: 'Certificates & Awards', value: 'certificate' },
  ];

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(d => d.fileCategory === selectedCategory);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    addDocument({
      fileName,
      fileCategory,
      fileSizeKb: Math.floor(Math.random() * 400) + 80,
      fileUrl: '#',
      notes: fileNotes || 'Uploaded application document'
    });

    setFileName('');
    setFileNotes('');
    setIsUploadOpen(false);
  };

  const getCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'cv': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'sop': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'transcript': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'lor': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FolderLock className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Application Document Vault
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Securely store your CV versions, Statement of Purpose drafts, and transcripts ready for university submissions.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Upload Application Document</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. CV_Academic_CS_Munich_2026.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="cv">CV / Resume</option>
                  <option value="sop">Statement of Purpose (SOP)</option>
                  <option value="transcript">Academic Transcript</option>
                  <option value="lor">Letter of Recommendation (LOR)</option>
                  <option value="certificate">Certificate / Award</option>
                  <option value="other">Other Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Target University</label>
                <textarea
                  value={fileNotes}
                  onChange={(e) => setFileNotes(e.target.value)}
                  placeholder="e.g. Tailored for TUM Informatics & RWTH Data Science."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between text-xs space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(doc.fileCategory)}`}>
                  {doc.fileCategory.toUpperCase()}
                </span>
                
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-slate-300 hover:text-red-500 p-0.5 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-slate-900 truncate leading-snug">
                    {doc.fileName}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {doc.fileSizeKb} KB • {doc.uploadedAt}
                  </span>
                </div>
              </div>

              {doc.notes && (
                <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {doc.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Encrypted Vault
              </span>

              <button
                onClick={() => alert(`Simulated download for: ${doc.fileName}`)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No documents found in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
}
