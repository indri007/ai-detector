"use client";

import React, { useState } from "react";
import { GrammarFinding, MatchedSource, SimilarityReport, TextMetrics } from "@/lib/types";
import { GrammarEngineResult } from "@/lib/engines/grammar/rulesEngine";
import { AlertCircle, CheckCircle2, ChevronRight, ExternalLink, Info, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface DiagnosticRailProps {
  grammarResult: GrammarEngineResult | null;
  similarityReport: SimilarityReport | null;
  metrics: TextMetrics;
  isAnalyzing: boolean;
  onApplySuggestion: (finding: GrammarFinding) => void;
  onDismissFinding: (findingId: string) => void;
  onSelectFinding: (finding: GrammarFinding) => void;
  activeFindingId: string | null;
}

export const DiagnosticRail: React.FC<DiagnosticRailProps> = ({
  grammarResult,
  similarityReport,
  metrics,
  isAnalyzing,
  onApplySuggestion,
  onDismissFinding,
  onSelectFinding,
  activeFindingId,
}) => {
  const [activeTab, setActiveTab] = useState<"grammar" | "similarity" | "metrics">("grammar");

  const findings = grammarResult?.findings || [];
  const similarityScore = similarityReport?.overallPercent ?? 0;

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* Tab Switcher Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab("grammar")}
          className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center space-x-1.5 ${
            activeTab === "grammar"
              ? "border-academic-900 text-academic-900 bg-white"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <span>Tata Bahasa</span>
          {findings.length > 0 && (
            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {findings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("similarity")}
          className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center space-x-1.5 ${
            activeTab === "similarity"
              ? "border-academic-900 text-academic-900 bg-white"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <span>Kemiripan</span>
          {similarityReport && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                similarityScore > 20
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {similarityScore}%
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center ${
            activeTab === "metrics"
              ? "border-academic-900 text-academic-900 bg-white"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <span>Statistik</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-3">
            <div className="w-7 h-7 border-2 border-academic-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Menganalisis sintaks dan korpus...</p>
          </div>
        )}

        {/* TAB 1: GRAMMAR & SPELLING FINDINGS */}
        {!isAnalyzing && activeTab === "grammar" && (
          <div className="space-y-3">
            {grammarResult?.status === "partial_local" && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-md text-[11px] text-blue-800 flex items-start space-x-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  <strong>Mode Lokal Aktif:</strong> {grammarResult.message}
                </span>
              </div>
            )}

            {!grammarResult ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Klik &apos;Periksa Teks&apos; untuk memulai analisis bahasa.</p>
              </div>
            ) : findings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs font-medium text-slate-800">
                  Tidak ditemukan kesalahan tata bahasa atau ejaan.
                </p>
                <p className="text-[11px] text-slate-400">
                  Naskah memenuhi kaidah akademik yang diuji.
                </p>
              </div>
            ) : (
              findings.map((f) => {
                const isSelected = f.id === activeFindingId;
                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-academic-800 bg-blue-50/40 shadow-sm ring-1 ring-academic-800"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="uppercase text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        {f.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        offset: {f.startOffset}-{f.endOffset}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium mb-2">{f.message}</p>

                    {f.explanation && (
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                        {f.explanation}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-[11px]">
                        <span className="line-through text-slate-400 mr-1.5">
                          {f.originalText}
                        </span>
                        {f.replacementText && (
                          <span className="font-semibold text-emerald-700">
                            → {f.replacementText}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismissFinding(f.id);
                          }}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
                        >
                          Abaikan
                        </button>
                        {f.replacementText && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApplySuggestion(f);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-academic-900 hover:bg-academic-950 rounded shadow-xs"
                          >
                            Terapkan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SIMILARITY REPORT */}
        {!isAnalyzing && activeTab === "similarity" && (
          <div className="space-y-4">
            {!similarityReport ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">
                  Jalankan pemeriksaan untuk membandingkan teks terhadap korpus terbuka.
                </p>
              </div>
            ) : (
              <>
                {/* Score Summary Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Tingkat Kemiripan Naskah
                  </span>
                  <div
                    className={`text-4xl font-extrabold my-1 ${
                      similarityScore > 20
                        ? "text-amber-600"
                        : "text-academic-900"
                    }`}
                  >
                    {similarityScore}%
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dihitung terhadap {similarityReport.corpusVersion}
                  </p>
                </div>

                {/* Academic Disclaimer */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start space-x-2 text-[11px] text-amber-900 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>{similarityReport.disclaimer}</span>
                </div>

                {/* Matched Sources List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sumber yang Cocok ({similarityReport.matchedSources.length})
                  </h4>

                  {similarityReport.matchedSources.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs border border-dashed rounded-lg">
                      Tidak ada kemiripan signifikan yang ditemukan dalam korpus terbuka ini.
                    </div>
                  ) : (
                    similarityReport.matchedSources.map((source: MatchedSource) => (
                      <div
                        key={source.id}
                        className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2 shadow-xs"
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="font-semibold text-slate-900 text-xs leading-snug">
                            {source.sourceTitle}
                          </h5>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0 ml-2">
                            {source.matchPercent}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          {source.sourceAuthors} ({source.sourceYear})
                        </p>

                        <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-700 font-mono italic border border-slate-100">
                          &ldquo;{source.matchedPassage}&rdquo;
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">
                            {source.license}
                          </span>
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-[11px] text-academic-800 hover:text-academic-950 font-medium"
                          >
                            <span>Buka Sumber</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENT METRICS */}
        {!isAnalyzing && activeTab === "metrics" && (
          <div className="space-y-3">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5 text-xs">
              <h4 className="font-semibold text-slate-900 mb-2">Volume Naskah</h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jumlah Kata:</span>
                <span className="font-bold text-slate-900">{metrics.wordCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Karakter (dengan spasi):</span>
                <span className="font-bold text-slate-900">{metrics.charCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Karakter (tanpa spasi):</span>
                <span className="font-bold text-slate-900">{metrics.charCountNoSpaces}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jumlah Kalimat:</span>
                <span className="font-bold text-slate-900">{metrics.sentenceCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Jumlah Paragraf:</span>
                <span className="font-bold text-slate-900">{metrics.paragraphCount}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <h4 className="font-semibold text-slate-900">Perkiraan Waktu Baca</h4>
              <p className="text-slate-500 text-[11px]">
                Dihitung berdasarkan kecepatan membaca akademik standar (~200 kata/menit).
              </p>
              <div className="text-lg font-bold text-academic-900 pt-1">
                ~{metrics.readingTimeMinutes} Menit
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
