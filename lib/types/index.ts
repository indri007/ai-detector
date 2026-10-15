export type LanguageCode = "en-US" | "en-GB" | "id-ID";

export type FindingCategory = "spelling" | "grammar" | "style" | "punctuation";
export type FindingSeverity = "error" | "warning" | "suggestion";

export interface GrammarFinding {
  id: string;
  ruleId: string;
  category: FindingCategory;
  severity: FindingSeverity;
  message: string;
  startOffset: number;
  endOffset: number;
  originalText: string;
  replacementText?: string;
  explanation?: string;
}

export interface MatchedSource {
  id: string;
  matchPercent: number;
  matchedSentencesCount: number;
  matchedPassage: string;
  sourceTitle: string;
  sourceAuthors: string;
  sourceYear: number;
  sourceUrl: string;
  license: string;
}

export interface SimilarityReport {
  status: "completed" | "skipped" | "failed";
  overallPercent: number;
  corpusVersion: string;
  disclaimer: string;
  matchedSources: MatchedSource[];
}

export interface TextMetrics {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
}

export interface DraftMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface DraftDocument extends DraftMetadata {
  content: string;
  language: LanguageCode;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";
