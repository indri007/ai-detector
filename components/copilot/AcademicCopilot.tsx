"use client";

import React, { useState } from "react";
import { AcademicSkillId } from "@/lib/orchestrator/skillRouter";
import { Sparkles, X, ArrowRight, Check, Loader2, Bot, SlidersHorizontal, ShieldCheck } from "lucide-react";

interface AcademicCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onApplyText: (newText: string) => void;
}

export const AcademicCopilot: React.FC<AcademicCopilotProps> = ({
  isOpen,
  onClose,
  selectedText,
  onApplyText,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<AcademicSkillId>("academic_tone");
  const [customInstruction, setCustomInstruction] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultOutput, setResultOutput] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");

  if (!isOpen) return null;

  const handleRunSkill = async () => {
    if (!selectedText.trim()) {
      alert("Ketik atau masukkan teks di editor terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setResultOutput(null);

    try {
      const res = await fetch("/api/v1/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkill,
          text: selectedText,
          context: customInstruction,
          targetLanguage: "id-ID",
        }),
      });

      if (!res.ok) throw new Error("Gagal mengeksekusi skill.");
      const data = await res.json();
      setResultOutput(data.data.output);
      setModelUsed(data.data.modelUsed);
    } catch {
      setResultOutput("Gagal memproses permintaan. Pastikan koneksi atau backend aktif.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-academic-800" />
          <h3 className="font-bold text-slate-900 text-sm">Academic AI Copilot</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Selector Body */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Pilih Skill Akademik:
        </label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value as AcademicSkillId)}
          className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-academic-800"
        >
          <option value="academic_tone">🎓 Academic Tone & Polishing (Gaya Ilmiah)</option>
          <option value="clarity_conciseness">✂️ Clarity & Conciseness (Ringkas & Padat)</option>
          <option value="sentence_rewriter">🔄 Sentence Rewriter (Perbaiki Struktur Kalimat)</option>
          <option value="paraphrase">✨ Paraphrase (Parafrase & Pertahankan Sitasi)</option>
          <option value="summarize">📑 Summarize (Ringkasan Format IMRaD)</option>
          <option value="bilingual_translate">🌐 Terjemahan Ilmiah (ID ⇄ EN)</option>
          <option value="research_gap">🔬 Research Gap Finder (Analisis Celah Riset)</option>
          <option value="journal_formatter">📐 Audit Template Jurnal (IMRaD / APA / IEEE)</option>
        </select>

        <input
          type="text"
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          placeholder="Instruksi tambahan (opsional, misal: 'target jurnal Q1 Elsevier')..."
          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md outline-none"
        />

        <button
          onClick={handleRunSkill}
          disabled={isProcessing}
          className="w-full py-2 bg-academic-900 hover:bg-academic-950 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Skill...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Jalankan Skill Akademik</span>
            </>
          )}
        </button>
      </div>

      {/* Results Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source Text Preview */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Teks Input ({selectedText.length} karakter):
          </span>
          <div className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-600 line-clamp-3 font-serif">
            {selectedText || "Belum ada teks di editor."}
          </div>
        </div>

        {/* Output Area */}
        {resultOutput && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Hasil Analisis & Rekomendasi:
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {modelUsed}
              </span>
            </div>

            <div className="text-xs p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-lg text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
              {resultOutput}
            </div>

            <button
              onClick={() => {
                onApplyText(resultOutput);
                onClose();
              }}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan Hasil ke Dokumen</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Privacy Banner */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Pemrosesan naskah akademik terisolasi & privat.</span>
      </div>
    </div>
  );
};
