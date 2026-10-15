import { describe, it, expect } from "vitest";
import {
  normalizeTokens,
  generateNGrams,
  computeJaccardSimilarity,
  analyzeSimilarity,
} from "@/lib/engines/similarity/similarityEngine";
import { OPEN_ACCESS_CORPUS } from "@/lib/engines/similarity/corpus";

describe("Similarity Engine & 5-Gram Tokenizer", () => {
  it("normalizes text and strips punctuation correctly", () => {
    const raw = "Attention, is ALL you Need! (2017).";
    const tokens = normalizeTokens(raw);
    expect(tokens).toEqual(["attention", "is", "all", "you", "need", "2017"]);
  });

  it("generates 5-gram shingles accurately", () => {
    const tokens = ["the", "quick", "brown", "fox", "jumps", "over"];
    const shingles = generateNGrams(tokens, 5);
    expect(shingles.size).toBe(2);
    expect(shingles.has("the quick brown fox jumps")).toBe(true);
    expect(shingles.has("quick brown fox jumps over")).toBe(true);
  });

  it("calculates 100% Jaccard similarity for identical sets and 0% for disjoint sets", () => {
    const setA = new Set(["a b c d e", "f g h i j"]);
    const setB = new Set(["a b c d e", "f g h i j"]);
    const setC = new Set(["x y z 1 2"]);

    expect(computeJaccardSimilarity(setA, setB)).toBe(100);
    expect(computeJaccardSimilarity(setA, setC)).toBe(0);
  });

  it("detects exact text overlap when quoting Vaswani et al. 2017 from open-access corpus", () => {
    const vaswaniQuote =
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.";

    const report = analyzeSimilarity(vaswaniQuote);
    expect(report.status).toBe("completed");
    expect(report.overallPercent).toBeGreaterThan(0);
    expect(report.matchedSources.length).toBeGreaterThan(0);

    const firstMatch = report.matchedSources[0];
    expect(firstMatch.sourceTitle).toBe("Attention Is All You Need");
    expect(firstMatch.sourceAuthors).toContain("Vaswani");
    expect(firstMatch.sourceUrl).toBe("https://arxiv.org/abs/1706.03762");
  });

  it("returns 0% similarity and clear explanation for completely original or short text", () => {
    const shortText = "Halo dunia.";
    const report = analyzeSimilarity(shortText);
    expect(report.overallPercent).toBe(0);
    expect(report.matchedSources.length).toBe(0);
  });
});
