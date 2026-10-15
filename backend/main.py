from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import re
import urllib.request
import urllib.parse
import json

app = FastAPI(
    title="AcademicWrite AI - Shared Core API",
    version="1.0.0",
    description="Unified API engine serving Microsoft Word Add-in, Streamlit, and Next.js"
)

# CORS enabled for Office Add-in (localhost / Word iframe) and Streamlit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---

class GrammarFinding(BaseModel):
    id: str
    rule_id: str
    category: str
    severity: str
    message: str
    start_offset: int
    end_offset: int
    original_text: str
    replacement_text: Optional[str] = None
    explanation: Optional[str] = None

class AnalysisRequest(BaseModel):
    text: str = Field(..., max_length=20000, description="Naskah akademik (maks. 20.000 karakter)")
    language: str = Field("en-US", description="en-US, en-GB, atau id-ID")

class RewriteRequest(BaseModel):
    text: str = Field(..., max_length=3000)
    mode: str = Field("academic_formal", description="academic_formal, concise, or clarity")
    language: str = Field("en-US")

class RewriteResponse(BaseModel):
    original: str
    mode: str
    suggested_rewrite: str
    rationale: str

from backend.nlp_engine import (
    OPEN_ACCESS_CORPUS,
    analyze_grammar_rules,
    calculate_similarity_shingles
)

# --- API Endpoints ---

@app.get("/health")
def health():
    return {"status": "ok", "service": "AcademicWrite AI Backend"}

@app.post("/api/v1/analyze/comprehensive")
def analyze_comprehensive(req: AnalysisRequest):
    words = re.findall(r"\S+", req.text)
    findings = analyze_grammar_rules(req.text, req.language)
    similarity = calculate_similarity_shingles(req.text)
    
    return {
        "metrics": {
            "word_count": len(words),
            "char_count": len(req.text),
            "reading_time_minutes": max(1, (len(words) + 199) // 200)
        },
        "grammar": {
            "provider": "AcademicWrite Local Rules Engine",
            "findings_count": len(findings),
            "findings": findings
        },
        "similarity": similarity
    }

@app.post("/api/v1/style/rewrite", response_model=RewriteResponse)
def rewrite_style(req: RewriteRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    # Deterministic Academic Rewriter Transformation
    rewritten = text
    rationale = "Kalimat disesuaikan dengan konvensi akademik baku."
    
    if req.language == "id-ID":
        rewritten = re.sub(r"\bpraktek\b", "praktik", rewritten, flags=re.IGNORECASE)
        rewritten = re.sub(r"\bdi\s+mana\b(?!\?)", "yang", rewritten, flags=re.IGNORECASE)
        rewritten = re.sub(r"\btujuan\s+daripada\b", "tujuan", rewritten, flags=re.IGNORECASE)
        rationale = "Ejaan disesuaikan dengan KBBI/PUEBI dan penghilangan kata mubazir."
    else:
        rewritten = re.sub(r"\bdon't\b", "do not", rewritten, flags=re.IGNORECASE)
        rewritten = re.sub(r"\bcan't\b", "cannot", rewritten, flags=re.IGNORECASE)
        rewritten = re.sub(r"\bwon't\b", "will not", rewritten, flags=re.IGNORECASE)
        rewritten = re.sub(r"\bI\s+think\b", "The evidence suggests", rewritten, flags=re.IGNORECASE)
        rationale = "Contractions expanded and subjective first-person statements replaced with objective academic framing."

    return RewriteResponse(
        original=text,
        mode=req.mode,
        suggested_rewrite=rewritten,
        rationale=rationale
    )

@app.get("/api/v1/citations/search")
def search_citations(q: str = Query(..., min_length=1)):
    url = f"https://api.crossref.org/works?query={urllib.parse.quote(q)}&rows=5"
    headers = {"User-Agent": "VeritasAcademic/1.0 (mailto:dev@academicwrite.local)"}
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            items = data.get("message", {}).get("items", [])
            
            results = []
            for item in items:
                authors = [f"{a.get('given','')} {a.get('family','')}".strip() for a in item.get("author", [])]
                results.append({
                    "title": (item.get("title") or ["Judul Tidak Ditemukan"])[0],
                    "doi": item.get("DOI", ""),
                    "authors": authors[:3],
                    "year": item.get("published", {}).get("date-parts", [[None]])[0][0],
                    "url": item.get("URL", f"https://doi.org/{item.get('DOI','')}")
                })
            return {"query": q, "total": len(results), "results": results}
    except Exception as e:
        return {"query": q, "total": 0, "results": [], "error": str(e)}

if __name__ == "__main__":
    import sys
    # Check if executed via Streamlit Cloud (e.g. streamlit run backend/main.py)
    is_streamlit = any("streamlit" in str(arg).lower() for arg in sys.argv)
    if not is_streamlit:
        try:
            from streamlit.runtime.scriptrunner import get_script_run_ctx
            if get_script_run_ctx() is not None:
                is_streamlit = True
        except Exception:
            pass

    if is_streamlit:
        import os
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        app_file = os.path.join(root_dir, "streamlit_app", "app.py")
        if root_dir not in sys.path:
            sys.path.insert(0, root_dir)
        with open(app_file, "r", encoding="utf-8") as f:
            code = compile(f.read(), app_file, 'exec')
            exec(code, globals())
    else:
        import uvicorn
        uvicorn.run(app, host="127.0.0.1", port=8000)
