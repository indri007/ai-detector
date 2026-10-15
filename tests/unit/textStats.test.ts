import { describe, it, expect } from "vitest";
import { calculateTextMetrics } from "@/lib/utils/textStats";

describe("Text Statistics Calculator", () => {
  it("handles empty or whitespace-only text gracefully", () => {
    const resultEmpty = calculateTextMetrics("");
    expect(resultEmpty.wordCount).toBe(0);
    expect(resultEmpty.charCount).toBe(0);
    expect(resultEmpty.sentenceCount).toBe(0);
    expect(resultEmpty.readingTimeMinutes).toBe(0);

    const resultSpaces = calculateTextMetrics("   \n\t  ");
    expect(resultSpaces.wordCount).toBe(0);
    expect(resultSpaces.charCount).toBe(7);
    expect(resultSpaces.sentenceCount).toBe(0);
  });

  it("accurately counts words across multiple whitespace characters and newlines", () => {
    const sample = "The   quick\nbrown\t\tfox jumps over the lazy dog.";
    const result = calculateTextMetrics(sample);
    expect(result.wordCount).toBe(9);
    expect(result.charCount).toBe(sample.length);
  });

  it("calculates sentence count accurately on standard academic punctuation", () => {
    const sample =
      "This is the first sentence. Here is the second sentence! Could this be the third? Indeed it is.";
    const result = calculateTextMetrics(sample);
    expect(result.sentenceCount).toBe(4);
  });

  it("computes reading time based on 200 words per minute", () => {
    // 400 words should be ~2 minutes
    const fourHundredWords = Array(400).fill("word").join(" ");
    const result = calculateTextMetrics(fourHundredWords);
    expect(result.wordCount).toBe(400);
    expect(result.readingTimeMinutes).toBe(2);
  });
});
