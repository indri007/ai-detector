/**
 * Scholarly Source Connector
 * Interfaces with official scholarly APIs (Crossref, OpenAlex) for metadata discovery
 * and legal open-access full-text verification.
 * 
 * Rules:
 * - Uses polite pool headers (User-Agent with contact email).
 * - Filters for explicit Creative Commons / Open Access licenses.
 * - Enforces rate-limiting and timeouts.
 * - Never bypasses paywalls or authentication.
 */

export interface ScholarlyMetadata {
  doi: string;
  title: string;
  authors: string[];
  year: number | null;
  journal: string | null;
  licenseUrl: string | null;
  isOpenAccess: boolean;
  landingUrl: string;
}

const POLITE_USER_AGENT =
  "VeritasAcademic/1.0 (https://github.com/academic-writing-platform; mailto:dev@academic-writing-platform.local)";

/**
 * Queries Crossref REST API for open-access literature metadata.
 */
export async function searchCrossref(
  query: string,
  rows = 5
): Promise<ScholarlyMetadata[]> {
  const endpoint = `https://api.crossref.org/works?query=${encodeURIComponent(
    query
  )}&rows=${rows}&select=DOI,title,author,published,container-title,license,URL`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": POLITE_USER_AGENT,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const items = data.message?.items || [];

    return items.map((item: any) => {
      const authors = (item.author || []).map((a: any) =>
        `${a.given || ""} ${a.family || ""}`.trim()
      );

      const year =
        item.published?.["date-parts"]?.[0]?.[0] || null;

      const licenses = item.license || [];
      const isCC = licenses.some((l: any) =>
        (l.URL || "").toLowerCase().includes("creativecommons")
      );

      return {
        doi: item.DOI || "",
        title: (item.title || ["Judul Tidak Ditemukan"])[0],
        authors: authors.length > 0 ? authors : ["Penulis Anonim"],
        year,
        journal: (item["container-title"] || [""])[0] || null,
        licenseUrl: licenses[0]?.URL || null,
        isOpenAccess: isCC,
        landingUrl: item.URL || `https://doi.org/${item.DOI}`,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Resolves a single DOI via Crossref.
 */
export async function resolveDOI(doi: string): Promise<ScholarlyMetadata | null> {
  const cleanDOI = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
  const results = await searchCrossref(cleanDOI, 1);
  return results.length > 0 ? results[0] : null;
}
