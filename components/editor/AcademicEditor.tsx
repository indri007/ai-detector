"use client";

import React, { useRef } from "react";
import { GrammarFinding } from "@/lib/types";

interface AcademicEditorProps {
  content: string;
  onChange: (newContent: string) => void;
  findings: GrammarFinding[];
  activeFindingId: string | null;
  onSelectFinding: (finding: GrammarFinding) => void;
}

export const AcademicEditor: React.FC<AcademicEditorProps> = ({
  content,
  onChange,
  findings,
  activeFindingId,
  onSelectFinding,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDFDFE] relative overflow-hidden">
      {/* Editorial Canvas Container */}
      <div className="flex-1 relative flex flex-col p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ketik atau tempel naskah artikel ilmiah, abstrak, atau tesis Anda di sini... (Mendukung bahasa Indonesia dan Inggris)"
            className="w-full flex-1 min-h-[480px] bg-transparent resize-none outline-none font-serif text-lg leading-relaxed text-slate-900 placeholder:text-slate-300 placeholder:font-sans placeholder:text-sm selection:bg-blue-100"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Inline Highlights Drawer for Small Screens */}
      {findings.length > 0 && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-2 flex overflow-x-auto space-x-2">
          {findings.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelectFinding(f)}
              className={`shrink-0 px-2.5 py-1 rounded text-xs border ${
                f.id === activeFindingId
                  ? "bg-blue-50 border-academic-800 text-academic-900 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {f.originalText} → {f.replacementText || "cek"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
