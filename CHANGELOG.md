# PROJECT CHANGELOG (`CHANGELOG.md`)
All notable changes to the **AcademicWrite AI / Academic Writing Platform** will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0-beta] - 2026-10-15

### Added
- **Academic Writing Studio (Next.js 14 App Router):**
  - Rich academic editor with zero typing lag and live word/character counters.
  - Client-side auto-saving drafts (`localStorage`) with recovery modal, debouncing, and quota error detection.
  - Diagnostic rail with 3 inspection tabs: Tata Bahasa, Kemiripan Teks, and Statistik Naskah.
- **Bilingual Academic Grammar Engine (`lib/engines/grammar/rulesEngine.ts`):**
  - Indonesian PUEBI/KBBI rules (non-standard spellings, relative *di mana*, redundant *daripada*).
  - English formal academic conventions (contraction expansion, objective phrasing).
  - LanguageTool API adapter with transparent status disclosure when local container port 8010 is offline.
- **Verifiable Similarity Engine (`lib/engines/similarity/similarityEngine.ts`):**
  - 5-gram tokenization and deterministic Jaccard similarity index.
  - Verified open-access corpus (Vaswani et al. 2017, Shannon 1948, Turing 1950, Kaplan et al. 2020, Pratama & Wicaksono 2022).
  - Source attribution cards with title, authors, year, license, and direct DOI URL.
  - Prominent academic integrity disclaimer (*Similarity != Plagiarism*).
- **Academic AI Copilot & Skill Router (`lib/orchestrator/skillRouter.ts`):**
  - Multi-model routing supporting Gemini 2.5 Flash and deterministic local fallback.
  - 12 core academic skills: Grammar, Clarity & Conciseness, Sentence Rewriter, Academic Tone, Paraphrase, Academic Chat, Summarize (IMRaD), Bilingual Translation, Document Q&A, Citation Verification, Research Gap Finder, and Journal Formatter.
- **Multi-Client Unified Architecture:**
  - **FastAPI Backend (`backend/main.py`, `backend/nlp_engine.py`):** Shared REST endpoints for Grammar, Style Rewriting, Crossref Citation Search, and Corpus Similarity.
  - **Microsoft Word Add-in (`word-addin/`):** Office.js task pane with `manifest.xml`, explicit user consent gating, selection reading, and replacement via Word JavaScript APIs.
  - **Streamlit Companion Dashboard (`streamlit_app/app.py`):** Interactive Python research dashboard.
- **Automated Verification Suites (`tests/unit/`):**
  - 16 automated Vitest tests passed with 100% pass rate.
  - Python backend unit tests passed.
  - TypeScript strict compilation passed with 0 errors.

---

## [0.1.0-alpha] - 2026-10-15

### Added
- Complete 14-document technical specification suite (`ENVIRONMENT_AUDIT.md`, `RULES.md`, `PRD.md`, `DESIGN.md`, `ERD.md`, `SCHEMA.md`, `ARCHITECTURE.md`, `API_SPEC.md`, `SECURITY.md`, `QA_TEST_PLAN.md`, `COST_MODEL.md`, `PLAN.md`, `DEPLOYMENT.md`, `DOCUMENT_REVIEW.md`).
- Repository initialization with `main` branch and strict `.gitignore` secret protection.
