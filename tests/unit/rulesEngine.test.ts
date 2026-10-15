import { describe, it, expect } from "vitest";
import { checkGrammar } from "@/lib/engines/grammar/rulesEngine";

describe("Academic Grammar & Rules Engine", () => {
  it("detects Indonesian non-standard spelling 'praktek' -> 'praktik'", async () => {
    const text = "Dalam praktek laboratorium, kami menguji sampel tersebut.";
    const result = await checkGrammar(text, "id-ID");

    expect(result.findings.length).toBeGreaterThan(0);
    const finding = result.findings.find((f) => f.ruleId === "ID_SPELL_PRAKTEK");
    expect(finding).toBeDefined();
    expect(finding?.originalText).toBe("praktek");
    expect(finding?.replacementText).toBe("praktik");
  });

  it("flags informal English contractions in formal prose", async () => {
    const text = "The authors don't support the initial hypothesis.";
    const result = await checkGrammar(text, "en-US");

    expect(result.findings.length).toBeGreaterThan(0);
    const finding = result.findings.find((f) => f.ruleId === "EN_CONTRACTION");
    expect(finding).toBeDefined();
    expect(finding?.originalText.toLowerCase()).toBe("don't");
  });

  it("flags incorrect relative 'di mana' in Indonesian academic text", async () => {
    const text = "Sistem ini adalah tempat di mana data disimpan secara aman.";
    const result = await checkGrammar(text, "id-ID");

    const finding = result.findings.find((f) => f.ruleId === "ID_DI_MANA_RELATIF");
    expect(finding).toBeDefined();
  });

  it("handles text with zero errors cleanly without false positives", async () => {
    const text = "The experiment demonstrates a statistically significant improvement across all benchmarks.";
    const result = await checkGrammar(text, "en-US");
    expect(result.findings.length).toBe(0);
  });
});
