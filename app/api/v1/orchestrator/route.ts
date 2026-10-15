import { NextRequest, NextResponse } from "next/server";
import { executeSkill, AcademicSkillId } from "@/lib/orchestrator/skillRouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, text, context, targetLanguage, journalFormat } = body;

    if (!skillId || typeof skillId !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_SKILL_ID", message: "Parameter 'skillId' wajib diisi." } },
        { status: 400 }
      );
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: { code: "INVALID_TEXT", message: "Parameter 'text' wajib berupa string tidak kosong." } },
        { status: 400 }
      );
    }

    if (text.length > 25000) {
      return NextResponse.json(
        { error: { code: "TEXT_TOO_LONG", message: "Teks melebihi batas 25.000 karakter." } },
        { status: 400 }
      );
    }

    const result = await executeSkill({
      skillId: skillId as AcademicSkillId,
      text,
      context,
      targetLanguage,
      journalFormat,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "ORCHESTRATION_ERROR", message: err.message || "Gagal memproses skill." } },
      { status: 500 }
    );
  }
}
