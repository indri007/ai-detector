# PROJECT RULES & GOVERNANCE (`RULES.md`)
**Project:** Academic Writing Intelligence Platform  
**Version:** 0.2.0-beta (Tri-Frontend & Material 3 Governance Update)  
**Status:** Active & Strictly Enforced  
**Role:** Technical Constitution & Operational Boundaries  
**Live URL:** [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/)  
**Repository:** [`indri007/ai-detector`](https://github.com/indri007/ai-detector)

---

## 1. Project Scope & Non-Goals

### 1.1 In-Scope (Implemented & Governed in v0.2.0-beta)
* Clean-room, original academic writing workstation operating across three unified clients:
  1. **Bilingual Grammar & Style Engine:** PUEBI/KBBI Indonesian spellings & syntax (*praktik*, *analisis*, *sistem*, *objek*, *di mana*, *daripada*) + English formal academic conventions (contraction expansion, objective non-first-person voice).
  2. **Verifiable Similarity Engine:** Deterministic 5-gram token shingling and Jaccard similarity index against a legally verified open-access literature corpus (Vaswani 2017, Shannon 1948, Turing 1950, Kaplan 2020, Pratama 2022).
  3. **Official Crossref Integration & Citation Generator:** Real-time metadata discovery via Crossref REST API with copy-ready **APA 7th Edition** and **IEEE** citations.
  4. **Dual-Mode Academic Paraphraser:** Formal Academic and Concise modes with scientific rationale and strict preservation of in-text citations and numerical data.
  5. **Academic AI Copilot (12 Skills):** Multi-model routing supporting Google Gemini 2.5 Flash with intelligent local deterministic fallback when offline.
  6. **Multi-Client Delivery:** Standalone Streamlit Cloud deployment (`https://ai-detector-best.streamlit.app/`), local Next.js 14 Writing Studio, and Microsoft Word Add-in (`word-addin/` via Office.js).
  7. **Material Design 3 & 3D Spatial UI:** Expressive M3 tonal palettes, elevations (0–5), and 3D micro-animations with `prefers-reduced-motion` compliance.

### 1.2 Explicit Non-Goals & Absolute Boundaries
* **No Pixel-for-Pixel Cloning:** Never duplicate trademarked UI elements of proprietary commercial products (Turnitin, Grammarly, QuillBot, Copyleaks).
* **No Unauthorized Scraping:** No automated scraping of paywalled journals, closed student repositories, or unauthorized academic databases.
* **No Fake or Hallucinated Similarity:** Similarity scores must be derived strictly from deterministic mathematical token overlap against verified sources, NEVER fabricated or hallucinated by LLM prompts.
* **No Defamatory or Punitive AI Detection Claims:** The platform forbids accusing authors of misconduct or plagiarism. AI analysis and similarity findings are probabilistic and structural, not legal verdicts.
* **No Unsolicited Data Harvesting:** User manuscripts must NEVER be stored, indexed into public search engines, or harvested for machine learning model training without explicit written consent.

---

## 2. Multi-Stack Coding Standards & Naming Conventions

### 2.1 TypeScript & Next.js Standards
* **Compiler Mode:** TypeScript with `strict: true`, `noImplicitAny: true`, and zero ignored compiler errors (`@ts-ignore` is forbidden).
* **Component Architecture:** Next.js 14 App Router. React Server Components by default; Client Components explicitly designated with `'use client'` only when state or DOM events are required.
* **Styling & Design System:** Tailwind CSS integrating Google Material Design 3 (M3) design tokens defined in `DESIGN.md`. No ad-hoc inline styles unless dynamically calculated for coordinates.

### 2.2 Python & Streamlit / FastAPI Standards
* **Python Compliance:** PEP 8 compliance with comprehensive type annotations (`typing.Dict`, `typing.List`, `typing.Optional`).
* **Standalone Cloud Portability:** Code within `streamlit_app/app.py` must remain completely self-contained and free from hardcoded `localhost:8000` dependencies, allowing instant zero-configuration deployment to Streamlit Community Cloud.
* **FastAPI Asynchronous Pipelines:** Endpoints in `backend/main.py` must use asynchronous handlers (`async def`) and Pydantic v2 schemas for all request/response models.

### 2.3 Microsoft Word Add-in (Office.js) Standards
* **Manifest Integrity:** `word-addin/manifest.xml` must strictly validate against the Microsoft Office App manifest schema.
* **Explicit User Gating:** The add-in must verify user privacy consent prior to reading document selection via `context.document.getSelection()`.
* **Atomic Word Operations:** Text replacements must be wrapped in `context.sync()` within safe transaction blocks.

### 2.4 Project Directory Structure
```text
/
├── app/                  # Next.js 14 App Router frontend
├── components/           # React UI primitives & academic editor components
├── lib/                  # Shared TypeScript domain engines & orchestrators
│   ├── engines/          # Bilingual grammar rules & 5-gram similarity engines
│   ├── orchestrator/     # Academic AI Copilot & 12-skill router
│   ├── types/            # TypeScript interfaces & domain contracts
│   └── utils/            # Text statistics & AST offset utilities
├── backend/              # FastAPI shared core & Python NLP engines
├── streamlit_app/        # Standalone Streamlit Cloud application
├── word-addin/           # Microsoft Word Add-in (manifest & taskpane)
├── public/brand/         # Brand assets & 3D Material 3 logo
├── tests/unit/           # Automated Vitest & Pytest verification suites
├── migrations/           # Linear PostgreSQL DDL migration scripts
└── [DOCS].md             # Technical specification suite (PRD, ERD, SCHEMA, etc.)
```

---

## 3. Dependency & Model Management

### 3.1 Zero-Bloat Policy
* No heavy dependencies (e.g. Redis, Kafka, Elasticsearch, Vector DBs) without written justification and owner sign-off.
* Python dependencies in `requirements.txt` must remain lightweight to ensure sub-60-second cold starts on Streamlit Cloud.

### 3.2 AI Model Routing & Fallback Protocol
* **Primary Copilot Engine:** Google Gemini 2.5 Flash via official SDK/REST API.
* **Mandatory Deterministic Fallback:** Every Copilot skill and NLP rewriter must implement a smart deterministic local rule fallback. The platform must function with 100% stability even if the external API key is absent, exhausted, or offline.

---

## 4. Error Handling, Privacy & Zero-Retention Guardrails

### 4.1 Truthful & Structured Errors
* All API endpoints must return structured JSON envelopes conforming to RFC 7807:
  `{ "error": { "code": "STRING_CODE", "message": "Human readable message", "details": [] } }`
* Never swallow errors silently or return blank 200 OK responses on failure.

### 4.2 Absolute Document Privacy (*Zero-Retention Principle*)
* **NEVER log user document text, paragraphs, or raw academic submissions in server console logs, external APM, or error tracking services.**
* Logs are restricted strictly to audit metadata: `timestamp`, `client_type`, `word_count`, `duration_ms`, `engine_status`, `error_code`.
* Guest Mode must execute purely in-memory with a functional 1-click client-side canvas purge.

---

## 5. Database & Migration Governance
* All PostgreSQL changes must be recorded sequentially in `migrations/` (`0001_initial_core_schema.sql`, `0002_academic_management_schema.sql`, `0003_seed_open_access_corpus.sql`, `0004_copilot_paraphrase_citations.sql`).
* Destructive table drops (`DROP TABLE` / `TRUNCATE`) on non-test databases are strictly prohibited without written consent.
* Soft-delete patterns (`deleted_at`) must be enforced for user workspaces.

---

## 6. Testing, Quality Assurance & Verification
* **Automated Unit Testing:** Tokenization, 5-gram shingling, Jaccard calculation, PUEBI rule evaluation, and AST offsets must maintain >= 90% test coverage via Vitest.
* **Multi-Client Verification:** Every PR or release must verify that both the Next.js Studio and Streamlit Cloud app execute without syntax or import errors.
* **Strict Release Gate:** No code may be deployed or merged into `main` with failing test suites.

---

## 7. Cost Control & Cloud Governance
* **Default Mode: $0.00 / Month Operational Target.**
* The platform must leverage free-tier infrastructure (Streamlit Community Cloud, local Docker, Gemini API Free Tier / low-cost pay-as-you-go).
* Never provision paid cloud resources, VMs, or enterprise managed databases without explicit written authorization from the project owner.

---

## 8. Strictly Prohibited Operations & Approval Gates

### 8.1 Strictly Prohibited Actions
1. Executing `sudo` or modifying system-level OS configurations outside the project root.
2. Recursive deletion (`rm -rf`) outside of transient build caches (`.next`, `__pycache__`, `node_modules/.cache`).
3. Hardcoding or committing secrets (`.env.local`, API keys, private credentials) to git.
4. Fabricating test outcomes, similarity percentages, or citation DOIs.

### 8.2 Mandatory Human Approval Gates
The agent must pause and obtain explicit approval before:
1. Adding paid third-party API keys or provisioning billable cloud infrastructure.
2. Triggering production deployments to new domains or environments.
3. Making breaking schema migrations that alter existing table structures.

---

## 9. Definition of Done (DoD)
A feature or milestone is defined as **DONE** only when:
1. It is mapped to a verified Requirement ID in `PRD.md`.
2. Code conforms to TypeScript strict mode and Python PEP 8 with 0 compilation errors.
3. Automated test suites pass with 100% pass rate.
4. User interface adheres to `DESIGN.md` Material 3 tokens and accessibility standards (WCAG 2.1 AA).
5. Document content is proven never to leak into console or audit logs.
6. Documentation (`PRD.md`, `ERD.md`, `SCHEMA.md`, `DESIGN.md`, `RULES.md`, and `CHANGELOG.md`) is synchronized.

---

## 10. Rules for Truthful Reporting
* **Never fabricate test execution:** If an automated test has not been executed, state *"Not Executed"*.
* **Never fabricate benchmark metrics:** Processing latencies and accuracy scores must reflect actual measured execution data.
* **Transparent Corpus Provenance:** Clearly state the exact composition of the reference corpus (e.g. 5 verified open-access papers) without exaggerated claims.
