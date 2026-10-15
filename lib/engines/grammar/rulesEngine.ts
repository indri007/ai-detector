import { GrammarFinding, LanguageCode } from "@/lib/types";

export interface GrammarEngineResult {
  status: "completed" | "engine_unavailable" | "partial_local";
  provider: string;
  findings: GrammarFinding[];
  message?: string;
}

// Local baseline academic linguistic rules (Indonesian PUEBI & English Academic)
interface LocalRule {
  id: string;
  category: "spelling" | "grammar" | "style" | "punctuation";
  severity: "error" | "warning" | "suggestion";
  pattern: RegExp;
  replacement: string;
  message: string;
  explanation: string;
  languages: LanguageCode[];
}

const LOCAL_ACADEMIC_RULES: LocalRule[] = [
  // Indonesian Rules (PUEBI & Academic Syntax)
  {
    id: "ID_DI_MANA_RELATIF",
    category: "grammar",
    severity: "warning",
    pattern: /\bdi\s+mana\b(?!\?)/gi,
    replacement: "tempat / yang mana",
    message: "Kata 'di mana' sebagai kata penghubung kurang baku dalam penulisan ilmiah.",
    explanation: "Dalam bahasa Indonesia baku, 'di mana' adalah kata tanya tempat, bukan kata penghubung relatif (padanan 'where' bahasa Inggris). Gunakan 'tempat', 'yang', atau 'dalam hal tersebut'.",
    languages: ["id-ID"],
  },
  {
    id: "ID_DARIPADA_PERBANDINGAN",
    category: "grammar",
    severity: "error",
    pattern: /\b(tujuan|fungsi|hasil|dampak)\s+daripada\b/gi,
    replacement: "$1",
    message: "Penggunaan 'daripada' yang tidak menunjukkan perbandingan.",
    explanation: "'Daripada' hanya digunakan untuk menyatakan perbandingan. Untuk menerangkan kepemilikan atau hubungan, cukup gunakan kata benda secara langsung.",
    languages: ["id-ID"],
  },
  {
    id: "ID_SPELL_PRAKTEK",
    category: "spelling",
    severity: "error",
    pattern: /\bpraktek\b/gi,
    replacement: "praktik",
    message: "Kata tidak baku menurut KBBI.",
    explanation: "Bentuk baku menurut Kamus Besar Bahasa Indonesia adalah 'praktik' (menggunakan huruf i).",
    languages: ["id-ID"],
  },
  {
    id: "ID_SPELL_METODOLOGI",
    category: "style",
    severity: "suggestion",
    pattern: /\bmetodologi\s+penelitian\b/gi,
    replacement: "metode penelitian",
    message: "Pertimbangkan penggunaan 'metode penelitian'.",
    explanation: "'Metodologi' adalah ilmu tentang metode. Jika merujuk pada langkah-langkah praktis yang dilakukan peneliti, istilah yang lebih tepat adalah 'metode penelitian'.",
    languages: ["id-ID"],
  },

  // English Academic Rules
  {
    id: "EN_CONTRACTION",
    category: "style",
    severity: "warning",
    pattern: /\b(don't|can't|won't|isn't|aren't|doesn't|haven't|hasn't)\b/gi,
    replacement: "do not / cannot / will not",
    message: "Informal contraction in formal academic prose.",
    explanation: "Contractions should generally be avoided in scholarly publications. Expand to full auxiliary and negative forms.",
    languages: ["en-US", "en-GB"],
  },
  {
    id: "EN_FIRST_PERSON_PRONOUN",
    category: "style",
    severity: "suggestion",
    pattern: /\b(I\s+think|I\s+believe|in\s+my\s+opinion)\b/gi,
    replacement: "The evidence suggests / The data indicates",
    message: "Subjective first-person framing in scholarly text.",
    explanation: "Academic writing favors objective, evidence-anchored phrasing over subjective personal opinion statements.",
    languages: ["en-US", "en-GB"],
  },
  {
    id: "EN_DOUBLE_SPACE",
    category: "punctuation",
    severity: "warning",
    pattern: /[a-zA-Z0-9]\s{2,}[a-zA-Z0-9]/g,
    replacement: " ",
    message: "Consecutive redundant whitespace.",
    explanation: "Modern digital typography and publishing standards require single spacing between words.",
    languages: ["en-US", "en-GB", "id-ID"],
  },
];

export async function checkGrammar(
  text: string,
  language: LanguageCode = "en-US"
): Promise<GrammarEngineResult> {
  const apiUrl =
    process.env.LANGUAGETOOL_API_URL || "http://localhost:8010/v2";

  // 1. Attempt connection to LanguageTool service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const ltLangCode = language === "id-ID" ? "id" : language;
    const bodyParams = new URLSearchParams({
      text,
      language: ltLangCode,
    });

    const response = await fetch(`${apiUrl}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const findings: GrammarFinding[] = (data.matches || []).map(
        (m: {
          rule?: { id?: string; category?: { id?: string } };
          message?: string;
          offset: number;
          length: number;
          replacements?: Array<{ value: string }>;
        }, idx: number) => ({
          id: `lt_${idx}_${m.offset}`,
          ruleId: m.rule?.id || "LT_RULE",
          category: (m.rule?.category?.id?.toLowerCase() as any) || "grammar",
          severity: "error",
          message: m.message || "Potential linguistic issue detected.",
          startOffset: m.offset,
          endOffset: m.offset + m.length,
          originalText: text.substring(m.offset, m.offset + m.length),
          replacementText: m.replacements?.[0]?.value || undefined,
        })
      );

      return {
        status: "completed",
        provider: "LanguageTool (Server port 8010)",
        findings,
      };
    }
  } catch {
    // LanguageTool is not running locally; proceed gracefully to local baseline rules
  }

  // 2. Local Fallback Rule Checking
  const findings: GrammarFinding[] = [];
  const applicableRules = LOCAL_ACADEMIC_RULES.filter((r) =>
    r.languages.includes(language)
  );

  for (const rule of applicableRules) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const originalText = match[0];
      const startOffset = match.index;
      const endOffset = startOffset + originalText.length;

      findings.push({
        id: `local_${rule.id}_${startOffset}`,
        ruleId: rule.id,
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        explanation: rule.explanation,
        startOffset,
        endOffset,
        originalText,
        replacementText: rule.replacement.startsWith("$")
          ? originalText.replace(regex, rule.replacement)
          : rule.replacement,
      });
    }
  }

  // Sort findings by start offset
  findings.sort((a, b) => a.startOffset - b.startOffset);

  return {
    status: "partial_local",
    provider: "Mesin Aturan Akademik Lokal (LanguageTool container port 8010 offline)",
    message:
      "LanguageTool server belum terdeteksi aktif di localhost:8010. Pemeriksaan dijalankan menggunakan aturan akademik lokal.",
    findings,
  };
}
