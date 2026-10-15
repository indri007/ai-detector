# PRODUCT REQUIREMENTS DOCUMENT (`PRD.md`)
**Project:** Academic Writing Intelligence Platform  
**Version:** 1.0.0-MVP  
**Status:** Approved for Foundation & Design  
**Owner:** Technical Project Director & Senior Architect

---

## 1. Product Vision & Problem Statement

### 1.1 Product Vision
To provide an independent, privacy-first academic writing workstation that equips researchers, university students, and educators with accurate grammar checking, transparent similarity detection against a verified corpus, academic paraphrasing, and explainable writing analytics—without compromising intellectual property or fabricating integrity claims.

### 1.2 Problem Statement
Existing commercial solutions suffer from distinct critical flaws:
1. **Opaque & Punitive Similarity Indexing:** Commercial tools often lock academic papers into proprietary closed databases, generating non-reproducible similarity percentages without actionable open-access source links.
2. **Privacy & Intellectual Property Concerns:** Authors fear submitting unpublished research drafts to third-party services that may harvest data for model training.
3. **Flawed & Over-Confident AI Detectors:** Many current tools produce false accusations of AI authorship, damaging student reputations and academic trust.
4. **Tool Fragmentation:** Authors must juggle separate applications for grammar (e.g. Grammarly), similarity checks (e.g. Turnitin), and paraphrasing (e.g. QuillBot).

---

## 2. Target Users & Personas

### 2.1 Persona 1: Dr. Aris (Senior Academic Researcher & Journal Author)
* **Goal:** Polish English manuscript syntax, ensure proper citation formatting, and check similarity against open scientific literature prior to submitting to an international journal.
* **Pain Points:** Strict confidentiality; manuscript must not leak; needs explainable suggestions, not generic consumer-grade rewrites.

### 2.2 Persona 2: Nabila (Final-Year Undergraduate Student)
* **Goal:** Verify thesis drafts in Indonesian and English, check for accidental unquoted phrasing, and fix repetitive vocabulary.
* **Pain Points:** Budget constraints; fear of false-positive plagiarism or false-positive AI flags.

### 2.3 Persona 3: Prof. Hendra (Journal Editor / Peer Reviewer)
* **Goal:** Quickly inspect submitted manuscripts for baseline linguistic clarity and verify that cited references genuinely align with text similarities.
* **Pain Points:** Needs reproducible, evidence-based reports showing exact matched sentences rather than an arbitrary opaque percentage.

---

## 3. User Journeys

### 3.1 Core MVP Journey (Guest / Stateless Fast Check)
1. User navigates to the web editor.
2. User pastes an abstract or manuscript section (up to 3,000 words).
3. The editor immediately counts characters, words, and estimated reading time.
4. User clicks **"Run Comprehensive Check"** (or toggles individual checks: Grammar, Similarity).
5. The application highlights issues inline using color-coded decorations (Red = Grammar, Amber = Similarity).
6. User clicks a highlighted token to inspect the diagnostic card (rule explanation, suggested replacement, or matched source citation).
7. User accepts or dismisses suggestions with a single click.
8. User exports the polished text or downloads an inspection summary report.

### 3.2 Registered Journey (Document History - P1)
1. User logs in with email/password.
2. User saves documents to their private workspace.
3. User reviews past historical check reports with version comparisons.
4. User deletes documents permanently with a guaranteed soft-to-hard purge cycle.

---

## 4. Functional Requirements

### 4.1 Editor & Workspace (FR-ED)
* `FR-ED-01` [P0]: **Rich-Text Writing Canvas.** Support basic academic text formatting (paragraphs, headings, blockquotes, lists).
* `FR-ED-02` [P0]: **Real-Time Word & Character Statistics.** Display active word count, character count, and estimated reading time with zero perceptible typing lag (< 16ms render loop).
* `FR-ED-03` [P0]: **Character Offset Management.** Maintain an Abstract Syntax Tree (AST) where inline decorations map reliably to character positions `[startOffset, endOffset]`, updating gracefully when text mutations occur.
* `FR-ED-04` [P1]: **Export Functionality.** Export document to Markdown (.md) and Clean Text (.txt) formats. (DOCX export deferred to P1).

### 4.2 Grammar & Style Engine (FR-GR)
* `FR-GR-01` [P0]: **Multilingual Support.** Support both English (`en-US`, `en-GB`) and Indonesian (`id-ID`).
* `FR-GR-02` [P0]: **Error Categorization.** Classify findings into: Spelling, Grammar, Punctuation, and Academic Style.
* `FR-GR-03` [P0]: **Interactive Replacement.** Clicking a suggestion card must atomically replace the target span in the editor without corrupting surrounding text or adjacent decorations.
* `FR-GR-04` [P0]: **Local/Self-Hosted Engine Integration.** Connect to an isolated LanguageTool instance via REST API, avoiding hard dependency on rate-limited public tiers.

### 4.3 Similarity Analysis Engine (FR-SM)
* `FR-SM-01` [P0]: **Verifiable Corpus Indexing.** Compare submitted text against a clearly identified, legally accessible corpus of open-access academic papers stored in the system.
* `FR-SM-02` [P0]: **N-Gram Shingling & Fingerprinting.** Decompose input text into standardized token shingles (e.g., 5-grams) and compute deterministic Jaccard / MinHash similarity scores.
* `FR-SM-03` [P0]: **Matched Source Attribution.** For every flagged similarity, display:
  * Exact matched snippet.
  * Source title, author(s), publication year, and DOI/URL link where available.
  * Similarity percentage across the document.
* `FR-SM-04` [P0]: **Plagiarism Disclaimer.** Prominently display notice: *"Text similarity indicates shared phrasing and is not synonymous with plagiarism. Always verify proper citation and context."*

### 4.4 AI Writing Probability Analysis (FR-AI)
* `FR-AI-01` [P1]: **Perplexity & Burstiness Metrics.** Calculate statistical distribution of sentence length variation and lexical predictability.
* `FR-AI-02` [P1]: **Probabilistic Reporting & Disclaimer.** Display results as a probabilistic range (e.g., *"Contains statistical patterns common in AI-generated text"*), strictly forbidding accusatory language.
* `FR-AI-03` [P1]: **Opt-in Execution.** AI detection must be an explicit user-toggled option, not forced on all documents.

### 4.5 Academic Paraphrasing Engine (FR-PR)
* `FR-PR-01` [P1]: **Sentence-Level Rewrite.** Offer 3 distinct academic rewrite modes: *Academic Formal*, *Concise*, and *Expanded/Clarity*.
* `FR-PR-02` [P1]: **Preservation Constraints.** Guarantee retention of numeric data, technical terminology, and in-text citations (e.g., "(Smith et al., 2023)").

### 4.6 User Management & Privacy (FR-AU)
* `FR-AU-01` [P0]: **Anonymous / Guest Mode.** Full capability to check texts up to 3,000 words without requiring account creation.
* `FR-AU-02` [P1]: **Local Authentication.** Secure email/password login using Argon2/Bcrypt and HTTP-only session cookies.
* `FR-AU-03` [P0]: **Instant Data Purge.** Provide a "Clear Canvas & Destroy Session Data" button that wipes client memory and any temporary server-side analysis records.

---

## 5. Non-Functional Requirements (NFR)

* `NFR-PERF-01`: **Editor Latency.** Keypress-to-screen render latency must remain under 16ms (60 fps) for documents up to 5,000 words.
* `NFR-PERF-02`: **Analysis Response Time.** Full grammar check for 1,000 words must complete within < 1.5 seconds on local infrastructure. Similarity check against local corpus must return within < 3.0 seconds.
* `NFR-PRIV-01`: **Zero Data Harvesting.** User submissions are never indexed into public search engines or used for model fine-tuning.
* `NFR-A11Y-01`: **Accessibility Standards.** Full compliance with WCAG 2.1 AA: contrast ratios >= 4.5:1, visible focus states, and full keyboard navigability for editor suggestion popups.
* `NFR-SEC-01`: **Content Security.** Strict sanitation of all pasted rich text to prevent Stored or DOM-based XSS attacks.

---

## 6. MVP Scope vs. Future Releases

| Feature Area | P0 (MVP Baseline) | P1 (Post-MVP Fast Follow) | P2 (Long-Term Enterprise) |
| :--- | :--- | :--- | :--- |
| **Editor** | Web canvas, word counter, AST highlight decorations | Markdown/TXT export, dark mode | DOCX/PDF drag-and-drop import |
| **Grammar** | LanguageTool engine (ID & EN), inline popover replacement | Custom academic dictionary | Style guide rule customizer |
| **Similarity** | Local open-access corpus, 5-gram MinHash, source link card | Corpus expansion via DOAJ/Crossref APIs | Institutional private corpus upload |
| **AI Detector** | *Excluded from MVP (Requires benchmark calibration)* | Perplexity/Burstiness metric card | Multi-model ensemble detector |
| **Paraphraser**| *Excluded from MVP* | Single-sentence academic rewrite | Section-level structural rewrite |
| **Accounts** | Guest / Stateless session | Email/password auth, saved drafts | Team / Institutional multi-tenant |

---

## 7. Acceptance Criteria for P0 Features

### AC-01: Editor & Word Count (`FR-ED-01`, `FR-ED-02`)
* Given a blank editor, when a user types or pastes text, then the word count and character count update within 50ms without skipping characters.
* Given text with multiple paragraphs, line breaks are preserved exactly when transferred to analysis payloads.

### AC-02: Grammar Checking & Suggestion Application (`FR-GR-01`, `FR-GR-03`)
* Given an English sentence with an obvious grammatical flaw (e.g., *"He go to university yesterday"*), when the check runs, the text `"go"` is highlighted with a red underline.
* When the user clicks the highlighted word, a popover appears offering `"went"` with explanation.
* When the user clicks `"went"`, the document is updated to *"He went to university yesterday"*, the highlight is cleared, and character offsets of subsequent paragraphs adjust accurately.

### AC-03: Similarity Detection & Attribution (`FR-SM-01`, `FR-SM-03`)
* Given a passage copied verbatim from an indexed document in the local corpus, the engine flags the exact matching sentence.
* The report displays the source title, author, and an active reference link.
* The calculated similarity percentage is strictly derived from the matched shingle ratio.

### AC-04: Stateless Privacy Guarantee (`FR-AU-01`, `FR-AU-03`)
* Given an anonymous user session, when the user clicks "Clear Canvas", no document content remains in `localStorage`, `sessionStorage`, or server database tables.

---

## 8. Budget Constraints & Cost Model Targets
* **Development Phase:** $0.00 / month (Local Docker, PostgreSQL, LanguageTool, Next.js).
* **Initial Production Deployment Target:** < $20.00 / month (Cloud Run / VPS container with zero idle billing for web, managed or containerized PostgreSQL).
* **API Limits:** Zero paid external API dependencies for P0 MVP.

---

## 9. Product Risks & Mitigation Strategies
1. **Risk:** LanguageTool Java container memory footprint.
   * *Mitigation:* Configure JVM heap options (`-Xmx1024m`) to operate within standard development and lightweight container limits.
2. **Risk:** Corpus similarity scalability.
   * *Mitigation:* Use inverted index / trigram index (`pg_trgm`) in PostgreSQL for fast token retrieval before computing exact MinHash overlap.
3. **Risk:** User distrust regarding plagiarism claims.
   * *Mitigation:* Clear UI disclaimers stating that similarity metrics are technical matches, not legal or academic integrity verdicts.

---

## 10. Open Product Decisions for Owner Review
1. **Editor Engine Choice:** Recommend **TipTap (built on ProseMirror)** for robust decoration and offset tracking over Slate or Quill.
2. **Initial Corpus Size:** Recommend seeding an initial open-access corpus of 25–50 computer science and biomedical open-access abstracts (from arXiv/PubMed Open Access) for verifiable local similarity demonstration.
