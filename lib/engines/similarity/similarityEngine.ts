import { MatchedSource, SimilarityReport } from "@/lib/types";
import { OPEN_ACCESS_CORPUS } from "./corpus";

export function normalizeTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export function generateNGrams(tokens: string[], n = 5): Set<string> {
  const ngrams = new Set<string>();
  if (tokens.length < n) {
    if (tokens.length > 0) {
      ngrams.add(tokens.join(" "));
    }
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(" "));
  }

  return ngrams;
}

export function computeJaccardSimilarity(
  setA: Set<string>,
  setB: Set<string>
): number {
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  setA.forEach((item) => {
    if (setB.has(item)) {
      intersectionCount++;
    }
  });

  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : (intersectionCount / unionCount) * 100;
}

export function analyzeSimilarity(inputText: string): SimilarityReport {
  const inputTokens = normalizeTokens(inputText);

  if (inputTokens.length < 5) {
    return {
      status: "completed",
      overallPercent: 0,
      corpusVersion: "1.0-open-access (5 verified papers)",
      disclaimer:
        "Teks terlalu pendek untuk analisis 5-gram yang representatif. Nilai kemiripan dihitung 0%.",
      matchedSources: [],
    };
  }

  const inputNGrams = generateNGrams(inputTokens, 5);
  const matchedSources: MatchedSource[] = [];
  let totalSharedShingles = 0;

  for (const article of OPEN_ACCESS_CORPUS) {
    const articleTokens = normalizeTokens(article.text);
    const articleNGrams = generateNGrams(articleTokens, 5);

    let sharedInArticle = 0;
    const matchingSnippets: string[] = [];

    inputNGrams.forEach((shingle) => {
      if (articleNGrams.has(shingle)) {
        sharedInArticle++;
        if (matchingSnippets.length < 3) {
          matchingSnippets.push(shingle);
        }
      }
    });

    if (sharedInArticle > 0) {
      totalSharedShingles += sharedInArticle;
      const matchPercent = Number(
        ((sharedInArticle / inputNGrams.size) * 100).toFixed(2)
      );

      matchedSources.push({
        id: `match_${article.id}`,
        matchPercent,
        matchedSentencesCount: sharedInArticle,
        matchedPassage: matchingSnippets.join(" ... "),
        sourceTitle: article.title,
        sourceAuthors: article.authors,
        sourceYear: article.year,
        sourceUrl: article.sourceUrl,
        license: article.license,
      });
    }
  }

  // Sort matched sources by highest percentage first
  matchedSources.sort((a, b) => b.matchPercent - a.matchPercent);

  // Overall similarity: ratio of input shingles found in any indexed corpus document
  const rawOverall = (totalSharedShingles / inputNGrams.size) * 100;
  const overallPercent = Math.min(100, Number(rawOverall.toFixed(2)));

  return {
    status: "completed",
    overallPercent,
    corpusVersion: "1.0-open-access (5 verified papers)",
    disclaimer:
      "Kemiripan teks menunjukkan kesamaan susunan kata terhadap korpus terbuka terverifikasi, bukan bukti plagiarisme. Periksa konteks sitasi.",
    matchedSources,
  };
}
