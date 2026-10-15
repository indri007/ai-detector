import re
from typing import List, Dict, Any, Optional

OPEN_ACCESS_CORPUS = [
    {
        "id": "oa_vaswani_2017",
        "title": "Attention Is All You Need",
        "authors": "Vaswani et al. (2017)",
        "url": "https://arxiv.org/abs/1706.03762",
        "text": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely."
    },
    {
        "id": "oa_shannon_1948",
        "title": "A Mathematical Theory of Communication",
        "authors": "Shannon, C. E. (1948)",
        "url": "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
        "text": "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. Frequently the messages have meaning; that is they refer to or are correlated according to some system with certain physical or conceptual entities."
    },
    {
        "id": "oa_id_puebi_2022",
        "title": "Analisis Sintaksis Bahasa Indonesia Akademik",
        "authors": "Pratama & Wicaksono (2022)",
        "url": "https://doi.org/10.22146/jnteti.v11i2.3456",
        "text": "Pemrosesan bahasa alami telah berkembang pesat dalam dekade terakhir. Dalam penulisan naskah ilmiah berbahasa Indonesia, tantangan utama meliputi ejaan baku berdasarkan PUEBI, penghindaran kata penghubung di mana yang tidak tepat, dan struktur kalimat pasif berterima."
    }
]

def analyze_grammar_rules(text: str, language: str) -> List[Dict[str, Any]]:
    findings = []
    
    # 1. Indonesian PUEBI Rules
    if language == "id-ID":
        for match in re.finditer(r"\bpraktek\b", text, re.IGNORECASE):
            findings.append({
                "id": f"id_spell_{match.start()}",
                "rule_id": "ID_SPELL_PRAKTEK",
                "category": "spelling",
                "severity": "error",
                "message": "Kata tidak baku menurut KBBI.",
                "start_offset": match.start(),
                "end_offset": match.end(),
                "original_text": match.group(0),
                "replacement_text": "praktik",
                "explanation": "Bentuk baku menurut Kamus Besar Bahasa Indonesia adalah 'praktik' (dengan vokal i)."
            })
        
        for match in re.finditer(r"\bdi\s+mana\b(?!\?)", text, re.IGNORECASE):
            findings.append({
                "id": f"id_gram_{match.start()}",
                "rule_id": "ID_DI_MANA_RELATIF",
                "category": "grammar",
                "severity": "warning",
                "message": "Penggunaan 'di mana' kurang tepat sebagai penghubung klausa relatif.",
                "start_offset": match.start(),
                "end_offset": match.end(),
                "original_text": match.group(0),
                "replacement_text": "tempat / yang",
                "explanation": "'Di mana' adalah kata tanya tempat. Gunakan 'tempat' atau 'yang' untuk klausa penerang."
            })

    # 2. English Academic Rules
    if language in ["en-US", "en-GB"]:
        for match in re.finditer(r"\b(don't|can't|won't|isn't|aren't|doesn't)\b", text, re.IGNORECASE):
            replacements = {
                "don't": "do not", "can't": "cannot", "won't": "will not",
                "isn't": "is not", "aren't": "are not", "doesn't": "does not"
            }
            rep = replacements.get(match.group(0).lower(), "do not")
            findings.append({
                "id": f"en_contract_{match.start()}",
                "rule_id": "EN_ACADEMIC_CONTRACTION",
                "category": "style",
                "severity": "warning",
                "message": "Informal contraction in academic writing.",
                "start_offset": match.start(),
                "end_offset": match.end(),
                "original_text": match.group(0),
                "replacement_text": rep,
                "explanation": "Academic writing requires full auxiliary verb expansion rather than conversational contractions."
            })

    return findings

def calculate_similarity_shingles(text: str) -> Dict[str, Any]:
    tokens = re.findall(r"\b[a-zA-Z0-9\u00C0-\u024F]+\b", text.lower())
    if len(tokens) < 5:
        return {
            "overall_percent": 0.0,
            "matched_sources": [],
            "disclaimer": "Teks terlalu pendek untuk perbandingan 5-gram yang valid."
        }
    
    input_shingles = set(" ".join(tokens[i:i+5]) for i in range(len(tokens) - 4))
    matched_sources = []
    total_matches = 0

    for article in OPEN_ACCESS_CORPUS:
        art_tokens = re.findall(r"\b[a-zA-Z0-9\u00C0-\u024F]+\b", article["text"].lower())
        art_shingles = set(" ".join(art_tokens[i:i+5]) for i in range(len(art_tokens) - 4))
        
        overlap = input_shingles.intersection(art_shingles)
        if overlap:
            match_pct = round((len(overlap) / len(input_shingles)) * 100, 2)
            total_matches += len(overlap)
            matched_sources.append({
                "title": article["title"],
                "authors": article["authors"],
                "url": article["url"],
                "match_percent": match_pct,
                "matched_passages": list(overlap)[:3]
            })

    overall_pct = min(100.0, round((total_matches / len(input_shingles)) * 100, 2))
    return {
        "overall_percent": overall_pct,
        "matched_sources": sorted(matched_sources, key=lambda x: x["match_percent"], reverse=True),
        "disclaimer": "Kemiripan dihitung terhadap korpus terbuka terverifikasi, bukan bukti plagiarisme."
    }
