import { NextRequest, NextResponse } from "next/server";
import { checkGrammar } from "@/lib/engines/grammar/rulesEngine";
import { analyzeSimilarity } from "@/lib/engines/similarity/similarityEngine";
import { calculateTextMetrics } from "@/lib/utils/textStats";
import { LanguageCode } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "en-US" } = body;

    // Validation 1: Text presence and type
    if (typeof text !== "string") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PAYLOAD",
            message: "Parameter 'text' harus berupa string.",
          },
        },
        { status: 400 }
      );
    }

    // Validation 2: Maximum text length (20,000 characters limit)
    if (text.length > 20000) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT_LENGTH",
            message: `Panjang teks melebihi batas 20.000 karakter. Diterima: ${text.length} karakter.`,
          },
        },
        { status: 400 }
      );
    }

    // Validation 3: Language code validation
    const validLanguages: LanguageCode[] = ["en-US", "en-GB", "id-ID"];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        {
          error: {
            code: "UNSUPPORTED_LANGUAGE",
            message: `Bahasa '${language}' tidak didukung. Pilihan: ${validLanguages.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    // 1. Calculate document text metrics
    const metrics = calculateTextMetrics(text);

    // 2. Concurrently execute grammar checking and similarity engine
    const [grammarResult, similarityResult] = await Promise.all([
      checkGrammar(text, language),
      Promise.resolve(analyzeSimilarity(text)),
    ]);

    // Return unified report payload
    return NextResponse.json({
      data: {
        metrics,
        language,
        grammar: grammarResult,
        similarity: similarityResult,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan internal saat memproses dokumen.",
        },
      },
      { status: 500 }
    );
  }
}
