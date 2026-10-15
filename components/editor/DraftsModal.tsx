"use client";

import React from "react";
import { DraftMetadata } from "@/lib/types";
import { Plus, Trash2, X, FileText, AlertCircle, Clock } from "lucide-react";

interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftMetadata[];
  activeDraftId: string | null;
  onSelectDraft: (id: string) => void;
  onCreateDraft: () => void;
  onDeleteDraft: (id: string) => void;
}

export const DraftsModal: React.FC<DraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  activeDraftId,
  onSelectDraft,
  onCreateDraft,
  onDeleteDraft,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-academic-800" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Draf Naskah Lokal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex items-start space-x-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            Draf tersimpan secara privat di peramban (browser) Anda. Draf dapat terhapus jika Anda membersihkan cache atau berganti perangkat.
          </span>
        </div>

        {/* Draft List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {drafts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada draf tersimpan.
            </div>
          ) : (
            drafts.map((draft) => {
              const isActive = draft.id === activeDraftId;
              return (
                <div
                  key={draft.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isActive
                      ? "border-academic-800 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectDraft(draft.id);
                      onClose();
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-xs text-slate-900 truncate">
                        {draft.title || "Draf Tanpa Judul"}
                      </span>
                      {isActive && (
                        <span className="text-[10px] bg-academic-800 text-white px-1.5 py-0.5 rounded font-semibold">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                      <span>{draft.wordCount} kata</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(draft.updatedAt).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Hapus draf "${draft.title || "Draf Tanpa Judul"}"?`
                        )
                      ) {
                        onDeleteDraft(draft.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors ml-2"
                    title="Hapus draf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onCreateDraft();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-academic-900 hover:bg-academic-950 text-white rounded-md text-xs font-medium shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Draf Baru</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
