import { NextRequest, NextResponse } from "next/server";
import { searchCrossref } from "@/lib/corpus/scholarlyConnector";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: { code: "MISSING_QUERY", message: "Parameter 'q' wajib diisi." } },
      { status: 400 }
    );
  }

  const results = await searchCrossref(q.trim(), 5);

  return NextResponse.json({
    data: {
      query: q,
      total: results.length,
      results,
    },
  });
}
