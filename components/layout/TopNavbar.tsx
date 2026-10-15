"use client";

import React from "react";
import { LanguageCode, SaveStatus, TextMetrics } from "@/lib/types";
import { BookOpen, CheckCircle2, Clock, Globe, Loader2, Play, Trash2, FolderOpen } from "lucide-react";

interface TopNavbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  metrics: TextMetrics;
  saveStatus: SaveStatus;
  isAnalyzing: boolean;
  onRunCheck: () => void;
  onOpenDrafts: () => void;
  onOpenCopilot: () => void;
  onClear: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  title,
  onTitleChange,
  language,
  onLanguageChange,
  metrics,
  saveStatus,
  isAnalyzing,
  onRunCheck,
  onOpenDrafts,
  onOpenCopilot,
  onClear,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Brandmark & Document Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-2 text-academic-900 font-semibold tracking-tight shrink-0">
          <BookOpen className="w-5 h-5 text-academic-800" />
          <span className="hidden sm:inline text-sm font-bold uppercase tracking-wider text-slate-900">
            Veritas Academic
          </span>
        </div>

        <span className="text-slate-300">/</span>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul Dokumen..."
          className="text-xs sm:text-sm font-medium text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-academic-800 rounded px-2 py-1 outline-none truncate max-w-[160px] sm:max-w-xs transition-colors"
          title="Klik untuk mengubah judul"
        />

        {/* Save Status Badge */}
        <div className="hidden md:flex items-center space-x-1 text-xs text-slate-500">
          {saveStatus === "saving" && (
            <span className="flex items-center text-amber-600">
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
              Menyimpan...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center text-emerald-600">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Tersimpan di browser
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-rose-600 text-xs">Gagal menyimpan</span>
          )}
        </div>
      </div>

      {/* Right: Actions, Language & Metrics */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Language Selector */}
        <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-slate-700 outline-none cursor-pointer font-medium"
            title="Pilih Bahasa Naskah"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="id-ID">Bahasa Indonesia</option>
          </select>
        </div>

        {/* Live Metrics Pill */}
        <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-1">
          <span>
            <strong className="text-slate-900">{metrics.wordCount}</strong> kata
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <strong className="text-slate-900">{metrics.charCount}</strong> karakter
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center text-slate-500">
            <Clock className="w-3 h-3 mr-1" />
            ~{metrics.readingTimeMinutes} mnt
          </span>
        </div>

        {/* Drafts Modal Trigger */}
        <button
          onClick={onOpenDrafts}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
          title="Buka daftar draf tersimpan"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Draf</span>
        </button>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          title="Bersihkan canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* AI Copilot Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-md text-xs font-semibold shadow-xs transition-all"
          title="Buka Academic AI Copilot Skills"
        >
          <span className="text-[11px]">✨</span>
          <span>Copilot AI</span>
        </button>

        {/* Primary Run Check Action */}
        <button
          onClick={onRunCheck}
          disabled={isAnalyzing || metrics.wordCount === 0}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-academic-900 hover:bg-academic-950 disabled:bg-slate-300 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Memeriksa...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Periksa Teks</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
