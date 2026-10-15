import { describe, it, expect } from "vitest";
import { executeSkill } from "@/lib/orchestrator/skillRouter";

describe("Academic Skill Router & Fallback Engine", () => {
  it("executes paraphrase skill on sample academic text", async () => {
    const text = "Dalam praktek penulisan, kami don't setuju dengan metodologi ini.";
    const result = await executeSkill({
      skillId: "paraphrase",
      text,
      targetLanguage: "id-ID",
    });

    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
    expect(result.output.length).toBeGreaterThan(0);
    // Verifies local rule replacement occurred
    expect(result.output).toContain("praktik");
  });

  it("generates a structured summary using the summarize skill", async () => {
    const text = "Penelitian ini mengevaluasi algoritma transformer pada naskah ilmiah. Temuan empiris membuktikan peningkatan akurasi sebesar 18 persen.";
    const result = await executeSkill({
      skillId: "summarize",
      text,
      targetLanguage: "id-ID",
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("Ringkasan");
  });

  it("handles empty or short text safely without runtime exceptions", async () => {
    const result = await executeSkill({
      skillId: "academic_tone",
      text: "Halo",
    });

    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
  });
});
