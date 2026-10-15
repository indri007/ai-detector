import { TextMetrics } from "@/lib/types";

export function calculateTextMetrics(text: string): TextMetrics {
  const normalized = text.trim();

  if (!normalized) {
    return {
      wordCount: 0,
      charCount: text.length,
      charCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      readingTimeMinutes: 0,
    };
  }

  // Word count: split on one or more whitespace characters
  const words = normalized.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  // Sentence count: regex splitting on sentence-ending punctuation (.!?) followed by space or end
  const sentences = normalized
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Paragraph count: split on two or more consecutive newlines
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphCount = paragraphs.length;

  // Reading time: standard academic speed = 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
  };
}
