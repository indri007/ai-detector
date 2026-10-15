# PROJECT RULES & GOVERNANCE (`RULES.md`)
**Project:** Academic Writing Intelligence Platform  
**Status:** Active & Enforced  
**Role:** Technical Constitution & Operational Boundaries

---

## 1. Project Scope & Non-Goals

### 1.1 In-Scope
* Clean-room, original web application providing academic writing assistance:
  1. Grammar and spelling checks with actionable inline suggestions.
  2. Rich-text editor with offset-accurate highlighting.
  3. Similarity analysis against an explicit, legally accessible, and documented local corpus.
  4. Transparent similarity reports showing matched text snippets and public source metadata.
  5. Academic tone and paraphrasing suggestions with strict citation and factual preservation.
  6. Optional, clearly disclaimed AI-writing probability scoring (probabilistic estimation, never an accusation of misconduct).
  7. Secure local authentication and session management for document history (when included in approved MVP scope).

### 1.2 Explicit Non-Goals
* No pixel-for-pixel cloning of commercial competitors (Grammarly, Turnitin, QuillBot, Copyleaks).
* No scraping or unauthorized access to proprietary academic repositories, institutional databases, or gated journal paywalls.
* No claims of equivalence to commercial tools (e.g., Turnitin Similarity Index) without rigorous, peer-reviewed, independent empirical benchmarks.
* No automated disciplinary actions or definitive accusations of academic dishonesty based on AI detection or similarity percentages.
* No unsolicited retention of submitted documents for machine learning training.

---

## 2. Coding Standards & Naming Conventions

### 2.1 Code Quality & Formatting
* **Language & Mode:** TypeScript with `strict: true`, `noImplicitAny: true`, and zero ignored compiler errors.
* **Paradigm:** Modular, functional-first TypeScript. Minimize mutable state outside the rich editor document tree.
* **Component Architecture:** Next.js App Router (React Server Components by default; Client Components explicitly marked with `'use client'` only when state or DOM interaction is required).
* **Styles:** Tailwind CSS with semantic design tokens defined in `tailwind.config.ts`. No ad-hoc inline styles unless dynamically calculated (e.g., coordinate positioning).

### 2.2 Naming Conventions
* **Files & Directories:**
  * Components: PascalCase (e.g., `DocumentEditor.tsx`, `SimilarityReport.tsx`).
  * Utilities & Hooks: camelCase (e.g., `calculateShingles.ts`, `useDocumentSync.ts`).
  * API Routes: kebab-case directory structure with standard `route.ts` (e.g., `app/api/v1/analyze/grammar/route.ts`).
  * Documentation & Contracts: UPPER_SNAKE_CASE (e.g., `PRD.md`, `ARCHITECTURE.md`).
* **Variables & Functions:** camelCase for variables and functions; PascalCase for Types, Interfaces, and Enums; UPPER_SNAKE_CASE for constants.
* **Database Objects:** snake_case for tables and columns (e.g., `check_reports`, `matched_sources`, `created_at`).

### 2.3 Folder Structure Conventions
```text
/
├── app/                  # Next.js App Router (pages and route handlers)
│   ├── (auth)/           # Authentication route group
│   ├── (dashboard)/      # User dashboard & editor routes
│   └── api/v1/           # Versioned REST API endpoints
├── components/           # UI & domain components
│   ├── ui/               # Core atomic design system primitives
│   ├── editor/           # TipTap/ProseMirror editor & highlight plugins
│   └── reports/          # Report viewers & score visualizers
├── lib/                  # Shared domain logic & engine utilities
│   ├── engines/          # Grammar, similarity, paraphraser, AI-detector adapters
│   ├── db/               # PostgreSQL client, migrations, and queries
│   └── utils/            # String, tokenization, and offset calculators
├── corpus/               # Seed data & legal open-access documents for similarity
├── tests/                # Vitest unit/integration & Playwright E2E suites
├── public/               # Static assets
└── [DOCS].md             # Architecture, PRD, and specification contracts
```

---

## 3. Dependency Management
* **Package Manager:** `npm` with strict adherence to `package-lock.json`.
* **Zero Bloat Policy:** No adding heavy libraries without documented necessity.
* **Prohibited Early Infrastructure:** Do NOT add Redis, Kafka, RabbitMQ, Elasticsearch, Milvus/Pinecone, or Kubernetes unless requirements explicitly demand distributed scaling beyond single-node capabilities.
* **Vulnerability Audits:** `npm audit` must be run prior to committing any package updates.

---

## 4. Error Handling, Privacy & Logging

### 4.1 Truthful & Actionable Errors
* API responses must return structured RFC 7807 problem details or standard JSON error envelopes:
  `{ "error": { "code": "INVALID_TEXT_LENGTH", "message": "...", "details": [] } }`
* Never swallow errors silently or return blank 200 OK responses on failure.

### 4.2 Absolute Document Privacy (*Zero-Retention Guardrail*)
* **NEVER log user document text, paragraphs, or raw academic submissions in server console logs, external APM, or error aggregators (e.g., Sentry).**
* Log only metadata: `document_id`, `word_count`, `duration_ms`, `engine_status`, `error_code`.
* Anonymous analysis mode: Provide an option for stateless analysis where documents are processed in memory and never persisted to the database.

---

## 5. Database & Migration Rules
* All schema changes must be versioned through linear migration files (`/migrations/001_init.sql`, etc.).
* No destructive manual alterations (`ALTER TABLE DROP COLUMN` or `DROP TABLE`) without an explicit data migration script and owner sign-off.
* Foreign keys, cascading rules, and check constraints must be strictly enforced at the database level.
* Soft-delete patterns (`deleted_at`) must be used for user documents to prevent accidental irrecoverable data loss.

---

## 6. Testing & Quality Assurance
* **Unit Testing:** All text tokenization, shingling, MinHash algorithms, and offset calculation logic must have 100% test coverage via Vitest.
* **Integration Testing:** API route handlers must be tested with simulated valid and invalid payloads.
* **End-to-End Testing:** Core user flow (input text -> check -> view highlights -> apply suggestion) must be verified via Playwright.
* **No False Positives in CI:** A build with failing tests is strictly blocked from release.

---

## 7. Cost-Control & Cloud Governance
* **Default Mode: Zero Cloud Cost Local Development.**
* Never create, provision, or bind paid cloud resources (GCP, AWS, Supabase, Neon, OpenAI, Anthropic) without explicit written authorization from the project owner.
* When evaluating third-party APIs (e.g., LanguageTool Cloud, commercial LLMs), hard rate limits, token quotas, and cost-per-call metrics must be established first in `COST_MODEL.md`.

---

## 8. Prohibited Operations & Approval Gates

### 8.1 Strictly Prohibited Shell Operations
1. No `sudo` execution.
2. No recursive deletion (`rm -rf`) outside of transient build artifacts (`.next`, `dist`, `coverage`).
3. No pushing directly to remote production branches without local test verification.
4. No hardcoding or committing secrets (`.env`, private keys, API tokens).

### 8.2 Mandatory Human Approval Gates
The agent must pause and obtain explicit confirmation before:
1. Adding any paid third-party API or cloud service dependency.
2. Running production deployments.
3. Modifying existing production database records or deleting databases.
4. Making breaking changes to the core API contract (`API_SPEC.md`).

---

## 9. Definition of Done (DoD)
A feature or milestone is defined as **DONE** only when:
1. It is mapped to a verified Requirement ID in `PRD.md`.
2. Code conforms to TypeScript strict mode with zero linter errors.
3. Corresponding unit, integration, or E2E tests are written and passing.
4. User interface adheres to `DESIGN.md` tokens and accessibility standards (WCAG 2.1 AA).
5. Document content is proven never to leak into logs.
6. Documentation and `CHANGELOG.md` are updated.
7. Verification commands and outputs are truthfully documented in `QA_REPORT.md`.

---

## 10. Rules for Truthful Reporting
* **Never fabricate test execution:** If a test has not been run, declare it as *“Not Executed”*.
* **Never fabricate benchmark metrics:** Precision, recall, and processing speeds must reflect actual measured runtime performance.
* **Transparent Limitations:** If the similarity corpus only contains 50 articles, clearly state that the engine only tests against those 50 articles.
