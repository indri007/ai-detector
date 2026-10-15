# PRODUCT REQUIREMENTS DOCUMENT (`PRD.md`)
**Project:** Academic Writing Intelligence Platform  
**Version:** 0.2.0-beta (Synchronized with Live Deployment)  
**Status:** Implemented & Live in Production  
**Owner:** Technical Project Director & Senior Architect  
**Live URL:** [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/)  
**Repository:** [`indri007/ai-detector`](https://github.com/indri007/ai-detector)

---

## 1. Product Vision & Problem Statement

### 1.1 Product Vision
To provide an independent, privacy-first academic writing workstation that equips researchers, university students, and educators with accurate grammar checking, transparent similarity detection against a verified corpus, academic paraphrasing, official literature search with citation generation, and an explainable 12-skill Academic AI Copilot—without compromising intellectual property, harvesting drafts, or fabricating integrity claims.

### 1.2 Problem Statement
Existing commercial solutions suffer from distinct critical flaws:
1. **Opaque & Punitive Similarity Indexing:** Commercial tools often lock academic papers into proprietary closed databases, generating non-reproducible similarity percentages without actionable open-access source links.
2. **Privacy & Intellectual Property Concerns:** Authors fear submitting unpublished research drafts to third-party services that harvest data for model training.
3. **Flawed & Over-Confident AI Detectors:** Many current tools produce false accusations of AI authorship, damaging student reputations and academic trust.
4. **Tool Fragmentation:** Authors must juggle separate applications for grammar (e.g. Grammarly), similarity checks (e.g. Turnitin), paraphrasing (e.g. QuillBot), citation finders (e.g. Google Scholar/Mendeley), and AI writing assistants.

---

## 2. Target Users & Personas

### 2.1 Persona 1: Dr. Aris (Senior Academic Researcher & Journal Author)
* **Goal:** Polish English manuscript syntax, format citations in APA 7 / IEEE, inspect similarity against open scientific literature prior to submitting to an international journal, and identify research gaps in related work.
* **Pain Points:** Strict confidentiality; manuscript must not leak; needs explainable suggestions and verified DOI citations, not generic consumer-grade rewrites.

### 2.2 Persona 2: Nabila (Final-Year Undergraduate Student)
* **Goal:** Verify thesis drafts in Indonesian (PUEBI/KBBI) and English, check for accidental unquoted phrasing, rephrase repetitive arguments, and format citations automatically.
* **Pain Points:** Budget constraints; fear of false-positive plagiarism or false-positive AI flags; needs clear, actionable rules.

### 2.3 Persona 3: Prof. Hendra (Journal Editor / Peer Reviewer)
* **Goal:** Quickly inspect submitted manuscripts for baseline linguistic clarity, IMRaD section balance, and verify that cited references genuinely align with text similarities.
* **Pain Points:** Needs reproducible, evidence-based reports showing exact matched sentences rather than an arbitrary opaque percentage.

---

## 3. User Journeys

### 3.1 Streamlit Cloud Standalone Journey (Zero-Setup Cloud Access - Active)
1. User opens the public web app at `https://ai-detector-best.streamlit.app/`.
2. User pastes or drafts text directly into the primary editing canvas.
3. Live metrics update instantly (word count, character count, sentence count, estimated reading time).
4. User triggers **"Jalankan Analisis Menyeluruh"**:
   - PUEBI/KBBI grammar errors and English academic style findings appear with specific rule codes.
   - User clicks **"Terapkan Semua Koreksi Otomatis"** to apply suggestions with 1 click.
   - 5-gram Jaccard similarity engine calculates shingle overlap against the verified open-access corpus and displays matched source cards with active DOIs.
5. User navigates to the **Parafrase & Gaya Ilmiah** tab to generate Academic Formal or Concise rewrites with scientific rationale.
6. User uses **Academic AI Copilot (12 Skills)** for specialized queries (e.g., IMRaD Summarizer, Research Gap Finder, Journal Formatter).
7. User searches the official **Crossref** database for literature and copies formatted APA 7 or IEEE citations.
8. User downloads the complete manuscript diagnostic summary report in Markdown (`.md`).

### 3.2 Next.js 14 Writing Studio Journey (Local Precision Web Editor - Active)
1. User opens `http://localhost:3000`.
2. User writes in a rich academic canvas with zero typing lag (< 16ms).
3. Drafts auto-save to `localStorage` with quota protection and crash recovery.
4. Diagnostic rail displays 3 dedicated tabs (Tata Bahasa, Kemiripan Teks, Statistik Naskah).
5. User clicks inline decorations to view diagnostic popovers and atomically apply replacements.

### 3.3 Microsoft Word Add-in Journey (In-Situ Office Editing - Active)
1. User opens Microsoft Word with the sideloaded `word-addin/manifest.xml`.
2. The task pane initializes with explicit privacy consent verification.
3. User selects a paragraph in Word and clicks "Periksa Teks Terpilih".
4. The add-in queries the backend and displays suggestions in the side pane.
5. User clicks "Ganti di Dokumen Word" to apply the correction directly into the Word document via Office.js APIs.

### 3.4 Registered Journey (Document History & Account Sync - P1 Roadmap)
1. User logs in with email/password (Argon2/Bcrypt).
2. User saves documents to their private encrypted workspace.
3. User reviews historical reports and version comparisons.
4. User deletes documents with a guaranteed soft-to-hard purge cycle.

---

## 4. Functional Requirements

### 4.1 Editor & Workspace (FR-ED)
* `FR-ED-01` [Implemented]: **Rich-Text Writing Canvas.** Support basic academic text formatting, line break preservation, and zero-lag typing.
* `FR-ED-02` [Implemented]: **Real-Time Word & Character Statistics.** Display active word count, character count, sentence count, and estimated reading time.
* `FR-ED-03` [Implemented]: **Character Offset Management.** Maintain offset mapping `[startOffset, endOffset]` so grammar and similarity decorations align precisely with text spans.
* `FR-ED-04` [Implemented]: **Report Export Functionality.** Export document diagnostic summaries directly to Markdown (`.md`) format.
* `FR-ED-05` [Implemented]: **Auto-Save & Local Draft Recovery.** Client-side debounced storage in `localStorage` with recovery modal on accidental tab closure.

### 4.2 Grammar & Style Engine (FR-GR)
* `FR-GR-01` [Implemented]: **Bilingual Support.** Full rule support for Bahasa Indonesia (PUEBI/KBBI) and English (`en-US`, `en-GB`).
* `FR-GR-02` [Implemented]: **PUEBI & KBBI Rule Coverage.** Flag non-standard Indonesian spellings (*praktek -> praktik*, *analisa -> analisis*, *sistim -> sistem*, *objek*, *risiko*, etc.), relative clause syntax (*di mana -> tempat/yang*), redundant prepositions (*daripada*), and pleonasms.
* `FR-GR-03` [Implemented]: **English Academic Style Conventions.** Flag and expand informal contractions (*don't -> do not*, *can't -> cannot*), desubjectify personal opinion phrases (*I think / In my opinion -> The data indicates*), and recommend objective phrasing.
* `FR-GR-04` [Implemented]: **1-Click Bulk & Interactive Replacement.** Support atomic single-replacement and bulk "Terapkan Semua Koreksi Otomatis" without corrupting text or cursor position.
* `FR-GR-05` [Implemented]: **LanguageTool Fallback Adapter.** Connect to local LanguageTool container (port 8010) when available, gracefully falling back to deterministic internal rules when container is offline.

### 4.3 Similarity Analysis Engine (FR-SM)
* `FR-SM-01` [Implemented]: **Verifiable Corpus Indexing.** Compare submitted text against an indexed corpus of verified, legally accessible open-access academic papers:
  1. Vaswani et al. (2017) — *Attention Is All You Need* (arXiv / CC-BY)
  2. Shannon (1948) — *A Mathematical Theory of Communication* (Bell System)
  3. Turing (1950) — *Computing Machinery and Intelligence* (Mind)
  4. Kaplan et al. (2020) — *Scaling Laws for Neural Language Models* (arXiv)
  5. Pratama & Wicaksono (2022) — *Analisis Pemrosesan Bahasa Alami Bahasa Indonesia* (DOAJ / CC-BY)
* `FR-SM-02` [Implemented]: **Deterministic 5-Gram Shingling & Jaccard Index.** Decompose text into normalized 5-token shingles and compute deterministic Jaccard similarity coefficients.
* `FR-SM-03` [Implemented]: **Matched Source Attribution Cards.** For every detected similarity match, display:
  * Exact matched sentence snippet.
  * Source paper title, authors, publication year, license.
  * Direct active DOI or official repository URL.
* `FR-SM-04` [Implemented]: **Custom Reference Document Comparison.** Allow users to upload or input a custom reference paper to compare against the active draft.
* `FR-SM-05` [Implemented]: **Prominent Integrity Disclaimer.** Clearly display: *"Tingkat kemiripan teks menunjukkan kesamaan frasa teknis dan BUKAN bukti plagiarisme. Periksa konteks sitasi secara manual."*

### 4.4 Academic Paraphrasing & Rewriting (FR-PR)
* `FR-PR-01` [Implemented]: **Dual-Mode Academic Rewriting.**
  * *Academic Formal Mode:* Elevates vocabulary, improves sentence rhythm, and enforces scholarly register.
  * *Concise / Lugas Mode:* Eliminates filler words, clarifies passive constructs, and sharpens thesis statements.
* `FR-PR-02` [Implemented]: **Scientific Rationale & Constraint Preservation.** Explain why modifications were recommended while preserving citations (e.g. `(Smith et al., 2023)`), technical terms, and numeric data.

### 4.5 Academic AI Copilot & 12 Specialized Skills (FR-CP)
* `FR-CP-01` [Implemented]: **Multi-Model Orchestration.** Support Google Gemini 2.5 Flash via API with automatic fallback to high-precision rule-based local engines when offline or API key is absent.
* `FR-CP-02` [Implemented]: **12 Domain-Specific Academic Skills:**
  1. *Grammar & Syntax Fixer:* Resolves mechanical linguistic errors.
  2. *Clarity & Conciseness Optimizer:* Removes wordiness while maintaining academic rigor.
  3. *Sentence Rewriter:* Offers alternative phrasings tailored for scholarly journals.
  4. *Academic Tone Adjustment:* Replaces informal vernacular with objective scholarly tone.
  5. *Contextual Paraphraser:* Restructures complex passages with citation retention.
  6. *Academic Consultation Chat:* Interactive AI dialog for discussing methodology, structure, and peer review advice.
  7. *IMRaD Summarizer:* Synthesizes Introduction, Methods, Results, and Discussion into structured abstracts.
  8. *Bilingual Academic Translation:* Accurately translates academic Indonesian to English and vice versa using discipline-specific terminology.
  9. *Document Q&A & Interrogation:* Explains arguments and evaluates clarity within the submitted text.
  10. *Citation Verification & Formatter:* Audits citation syntax and aligns with APA 7, IEEE, or Harvard styles.
  11. *Research Gap Finder:* Identifies unaddressed questions, weak claims, and potential research contributions.
  12. *Journal Style Formatter:* Verifies compliance with major publisher style guidelines (Elsevier, IEEE, Springer).

### 4.6 Official Crossref Integration & Citation Engine (FR-CR)
* `FR-CR-01` [Implemented]: **Live Crossref Metadata Search.** Query the official Crossref REST API by article title or keywords to retrieve verified publication metadata.
* `FR-CR-02` [Implemented]: **Multi-Format Citation Generator.** Automatically generate copyable bibliographic citations in:
  * **APA 7th Edition**
  * **IEEE Citation Style**
* `FR-CR-03` [Implemented]: **Direct DOI Resolution.** Provide direct, clickable `https://doi.org/...` links for immediate verification.

### 4.7 Multi-Client Architecture Scope (FR-MC)
* `FR-MC-01` [Implemented]: **Streamlit Community Cloud Deployment.** Standalone Python application (`streamlit_app/app.py`) running 100% independently in cloud container with zero localhost dependencies.
* `FR-MC-02` [Implemented]: **Microsoft Word Add-in.** Sideloadable Office.js add-in (`word-addin/`) for in-situ manuscript verification directly inside Word on macOS and Windows.
* `FR-MC-03` [Implemented]: **Unified FastAPI Backend.** High-performance asynchronous backend (`backend/main.py`) exposing REST endpoints for grammar, style rewriter, similarity, and Crossref proxy.
* `FR-MC-04` [Implemented]: **Next.js 14 Web Studio.** Modern React App Router frontend (`app/page.tsx`) with Tailwind CSS and modular TypeScript engines.

### 4.8 User Management & Privacy (FR-AU)
* `FR-AU-01` [Implemented]: **Anonymous / Guest Mode.** Full capability to check texts up to 20,000 characters without requiring account creation.
* `FR-AU-02` [Implemented]: **Zero Data Harvesting Guarantee.** Submitted texts are never saved to public databases, search engines, or used to fine-tune AI models.
* `FR-AU-03` [Implemented]: **Instant Client-Side Purge.** 1-click "Bersihkan Kanvas" that flushes client memory and state.
* `FR-AU-04` [P1]: **Local Authentication.** Secure email/password login using Argon2/Bcrypt and HTTP-only session cookies.

---

## 5. Non-Functional Requirements (NFR)

* `NFR-PERF-01`: **Editor Latency.** Keypress-to-screen render latency remains < 16ms (60 fps) for documents up to 5,000 words.
* `NFR-PERF-02`: **Analysis Response Time.** Full grammar check completes within < 1.0 second on local engine. 5-gram Jaccard similarity across corpus returns in < 1.5 seconds.
* `NFR-PRIV-01`: **Zero Data Harvesting.** User submissions are never indexed into public search engines or harvested for model training.
* `NFR-A11Y-01`: **Accessibility Standards.** Compliance with WCAG 2.1 AA: contrast ratios >= 4.5:1, visible focus states, and keyboard navigability.
* `NFR-SEC-01`: **Content Security.** Strict sanitation of pasted rich text to prevent Stored or DOM-based XSS attacks. Zero leak of secrets in git or logs.

---

## 6. Implementation Scope vs. Future Releases Matrix

| Feature Area | Status in v0.2.0-beta (Live) | v0.3.0 (Fast Follow) | v1.0.0 (Long-Term Enterprise) |
| :--- | :--- | :--- | :--- |
| **Web Editor** | **DELIVERED** (Next.js Studio + Streamlit Cloud Canvas) | Dark mode toggle, PDF/DOCX drag-and-drop | Collaborative multi-author editing |
| **Grammar Engine** | **DELIVERED** (Bilingual PUEBI/KBBI + EN Academic rules + 1-click apply) | Custom user academic dictionary | Custom style guide rule creator |
| **Similarity Engine**| **DELIVERED** (5-gram Jaccard + 5 verified OA papers + custom compare) | Expanded corpus via Semantic Scholar & DOAJ | Institutional private repository indexing |
| **Paraphraser** | **DELIVERED** (Academic Formal & Concise modes with rationale) | Sentence variant slider (1–5 variants) | Section-level structural rewrite |
| **AI Copilot** | **DELIVERED** (12 specialized academic skills + Gemini Flash routing) | Custom prompt templates | Self-hosted fine-tuned academic LLM |
| **Literature Search**| **DELIVERED** (Crossref API + APA 7 & IEEE citation generator) | BibTeX export & Zotero integration | Citation graph visualization |
| **Client Platforms** | **DELIVERED** (Streamlit Cloud + Next.js Web + Word Add-in + FastAPI) | Chrome Extension | Desktop Electron app |
| **User Accounts** | **DELIVERED (Stateless Guest Mode)** | Local email/password auth, saved drafts | Institutional SSO (SAML / OAuth2) |

---

## 7. Acceptance Criteria for Verified Features

### AC-01: Editor & Word Count (`FR-ED-01`, `FR-ED-02`, `FR-ED-05`)
* Given a blank editor, when text is pasted or typed, word count, character count, and reading time update within 50ms without dropping keypresses.
* Given an accidental browser refresh, draft content is recovered from `localStorage` without loss.

### AC-02: Bilingual Grammar Checking & 1-Click Replacement (`FR-GR-01`, `FR-GR-02`, `FR-GR-04`)
* Given Indonesian text with non-standard spelling (e.g., *"Praktek analisa ini belum memiliki sistim yang baku"*), the engine flags `praktek`, `analisa`, and `sistim`.
* Clicking "Terapkan Semua Koreksi Otomatis" updates text atomically to *"Praktik analisis ini belum memiliki sistem yang baku"* with zero cursor offset corruption.
* Given English text with contractions (e.g., *"We don't consider"*), the engine flags and expands to *"We do not consider"*.

### AC-03: Similarity Detection & Attribution (`FR-SM-01`, `FR-SM-03`)
* Given text containing passages from *Attention Is All You Need* (Vaswani et al. 2017), the engine flags the matching shingles.
* The diagnostic card displays the title, author list, publication year, license, and active DOI link (`https://doi.org/10.48550/arXiv.1706.03762`).
* Calculated similarity percentage is strictly derived from verified 5-gram token overlap.

### AC-04: Academic AI Copilot 12 Skills (`FR-CP-01`, `FR-CP-02`)
* Selecting any of the 12 skills returns a structured academic response matching the designated persona.
* If Gemini API is offline or without key, deterministic local fallback answers the query without crashing.

### AC-05: Crossref & Citation Generation (`FR-CR-01`, `FR-CR-02`)
* Querying an article title (e.g., *"Deep Residual Learning"*) returns accurate publication metadata from Crossref.
* The system renders valid APA 7 and IEEE citation strings with a copy-to-clipboard action.

### AC-06: Stateless Privacy Guarantee (`FR-AU-01`, `FR-AU-02`, `FR-AU-03`)
* In guest mode, clicking "Bersihkan Kanvas" immediately purges state, memory, and local draft records.

---

## 8. Budget Realization & Cost Model Targets

* **Development Phase Cost:** **$0.00** (Local Mac development, zero paid software licenses).
* **Live Deployment Cost:** **$0.00 / month** (Streamlit Community Cloud free tier + GitHub open repository).
* **AI Copilot Operational Cost:** **$0.00** on Gemini API Free Tier / Pay-as-you-go (< $1.00/mo for thousands of student checks with Gemini 2.5 Flash).
* **Database & Indexing Cost:** **$0.00** (In-memory Python / client-side execution without dedicated managed database bill).

---

## 9. Product Risks & Mitigation Strategies

1. **Risk:** Over-reliance on external LLM availability.  
   * *Mitigation:* Architecture implements smart deterministic local fallback for all 12 Copilot skills and rules engines.
2. **Risk:** User confusion between text similarity and academic plagiarism.  
   * *Mitigation:* Prominent, non-removable disclaimer cards on every similarity inspection view.
3. **Risk:** Draft leakage and intellectual property breach.  
   * *Mitigation:* Strict zero-retention policy, client-side purge, and no indexing into public training pools.
4. **Risk:** Crossref API rate-limiting or latency.  
   * *Mitigation:* Client-side caching of query results and graceful error handling with direct DOI entry option.

---

## 10. Implementation Status & Deployment Record

1. **Streamlit Standalone Cloud:** Active and verified live at [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/).
2. **Word Add-in:** Ready in `word-addin/` with Office.js manifest for Word on macOS and Windows.
3. **Automated Test Suite:** 16 automated Vitest unit tests (`tests/unit/`) passing with 100% pass rate.
4. **TypeScript & Python Quality:** Strict TypeScript compilation with 0 errors; clean PEP 8 Python backend.
