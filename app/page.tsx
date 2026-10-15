"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { AcademicEditor } from "@/components/editor/AcademicEditor";
import { DiagnosticRail } from "@/components/reports/DiagnosticRail";
import { DraftsModal } from "@/components/editor/DraftsModal";
import { AcademicCopilot } from "@/components/copilot/AcademicCopilot";
import {
  DraftDocument,
  DraftMetadata,
  GrammarFinding,
  LanguageCode,
  SaveStatus,
  SimilarityReport,
  TextMetrics,
} from "@/lib/types";
import { calculateTextMetrics } from "@/lib/utils/textStats";
import {
  createNewDraft,
  deleteDraft,
  getActiveDraftId,
  getDraft,
  listDrafts,
  saveDraft,
} from "@/lib/storage/draftStorage";
import { GrammarEngineResult, checkGrammar } from "@/lib/engines/grammar/rulesEngine";
import { analyzeSimilarity } from "@/lib/engines/similarity/similarityEngine";

export default function WritingStudioPage() {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("Naskah Baru");
  const [language, setLanguage] = useState<LanguageCode>("en-US");
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [draftsList, setDraftsList] = useState<DraftMetadata[]>([]);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [metrics, setMetrics] = useState<TextMetrics>({
    wordCount: 0,
    charCount: 0,
    charCountNoSpaces: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    readingTimeMinutes: 0,
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [grammarResult, setGrammarResult] = useState<GrammarEngineResult | null>(null);
  const [similarityReport, setSimilarityReport] = useState<SimilarityReport | null>(null);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize draft on mount
  useEffect(() => {
    const drafts = listDrafts();
    setDraftsList(drafts);

    const savedActiveId = getActiveDraftId();
    if (savedActiveId) {
      const draft = getDraft(savedActiveId);
      if (draft) {
        setActiveDraftId(draft.id);
        setTitle(draft.title);
        setContent(draft.content);
        setLanguage(draft.language);
        setMetrics(calculateTextMetrics(draft.content));
        return;
      }
    }

    // Default sample text to demonstrate instant functionality
    const sampleText =
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. However, the author don't believe that praktek tanpa metode penelitian adalah solusi terbaik.";
    const initialDraft = createNewDraft("Contoh Analisis Akademik", sampleText, "en-US");
    setActiveDraftId(initialDraft.id);
    setTitle(initialDraft.title);
    setContent(initialDraft.content);
    setLanguage(initialDraft.language);
    setMetrics(calculateTextMetrics(initialDraft.content));
    setDraftsList(listDrafts());
  }, []);

  // Update metrics and trigger debounced auto-save on content change
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      const newMetrics = calculateTextMetrics(newContent);
      setMetrics(newMetrics);

      setSaveStatus("saving");
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (activeDraftId) {
          const draftToSave: DraftDocument = {
            id: activeDraftId,
            title,
            content: newContent,
            language,
            wordCount: newMetrics.wordCount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          try {
            saveDraft(draftToSave);
            setSaveStatus("saved");
            setDraftsList(listDrafts());
          } catch {
            setSaveStatus("error");
          }
        }
      }, 500);
    },
    [activeDraftId, title, language]
  );

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (activeDraftId) {
      const current = getDraft(activeDraftId);
      if (current) {
        current.title = newTitle;
        saveDraft(current);
        setDraftsList(listDrafts());
      }
    }
  };

  // Run comprehensive check
  const handleRunCheck = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setActiveFindingId(null);

    try {
      // Concurrently run local grammar and similarity engines
      const [grammarRes, simRes] = await Promise.all([
        checkGrammar(content, language),
        Promise.resolve(analyzeSimilarity(content)),
      ]);

      setGrammarResult(grammarRes);
      setSimilarityReport(simRes);
    } catch {
      // Fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply grammar suggestion replacement
  const handleApplySuggestion = (finding: GrammarFinding) => {
    if (!finding.replacementText) return;

    const before = content.substring(0, finding.startOffset);
    const after = content.substring(finding.endOffset);
    const updatedContent = `${before}${finding.replacementText}${after}`;

    handleContentChange(updatedContent);

    // Remove applied finding from local findings list
    if (grammarResult) {
      setGrammarResult({
        ...grammarResult,
        findings: grammarResult.findings.filter((f) => f.id !== finding.id),
      });
    }
  };

  // Dismiss finding
  const handleDismissFinding = (findingId: string) => {
    if (grammarResult) {
      setGrammarResult({
        ...grammarResult,
        findings: grammarResult.findings.filter((f) => f.id !== findingId),
      });
    }
  };

  // Clear canvas
  const handleClear = () => {
    if (
      content.trim().length > 0 &&
      !confirm("Bersihkan seluruh isi canvas dan hasil pemeriksaan?")
    ) {
      return;
    }
    handleContentChange("");
    setGrammarResult(null);
    setSimilarityReport(null);
    setActiveFindingId(null);
  };

  // Open draft from modal
  const handleSelectDraft = (id: string) => {
    const draft = getDraft(id);
    if (draft) {
      setActiveDraftId(draft.id);
      setTitle(draft.title);
      setContent(draft.content);
      setLanguage(draft.language);
      setMetrics(calculateTextMetrics(draft.content));
      setGrammarResult(null);
      setSimilarityReport(null);
    }
  };

  // Create new draft
  const handleCreateDraft = () => {
    const newDraft = createNewDraft("Draf Baru", "", language);
    setActiveDraftId(newDraft.id);
    setTitle(newDraft.title);
    setContent("");
    setMetrics(calculateTextMetrics(""));
    setDraftsList(listDrafts());
    setGrammarResult(null);
    setSimilarityReport(null);
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    deleteDraft(id);
    const updated = listDrafts();
    setDraftsList(updated);
    if (activeDraftId === id) {
      if (updated.length > 0) {
        handleSelectDraft(updated[0].id);
      } else {
        handleCreateDraft();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FDFDFE]">
      <TopNavbar
        title={title}
        onTitleChange={handleTitleChange}
        language={language}
        onLanguageChange={setLanguage}
        metrics={metrics}
        saveStatus={saveStatus}
        isAnalyzing={isAnalyzing}
        onRunCheck={handleRunCheck}
        onOpenDrafts={() => setIsDraftsModalOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onClear={handleClear}
      />

      <main className="flex-1 flex overflow-hidden">
        <AcademicEditor
          content={content}
          onChange={handleContentChange}
          findings={grammarResult?.findings || []}
          activeFindingId={activeFindingId}
          onSelectFinding={(f) => setActiveFindingId(f.id)}
        />

        <DiagnosticRail
          grammarResult={grammarResult}
          similarityReport={similarityReport}
          metrics={metrics}
          isAnalyzing={isAnalyzing}
          onApplySuggestion={handleApplySuggestion}
          onDismissFinding={handleDismissFinding}
          onSelectFinding={(f) => setActiveFindingId(f.id)}
          activeFindingId={activeFindingId}
        />
      </main>

      <DraftsModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        drafts={draftsList}
        activeDraftId={activeDraftId}
        onSelectDraft={handleSelectDraft}
        onCreateDraft={handleCreateDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <AcademicCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        selectedText={content}
        onApplyText={handleContentChange}
      />
    </div>
  );
}
