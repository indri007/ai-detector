# SPECIFICATION CONSISTENCY REVIEW (`DOCUMENT_REVIEW.md`)
**Project:** Academic Writing Intelligence Platform (`academic-writing-platform`)  
**Review Date:** 2026-10-15  
**Lead Reviewer:** Principal Software Architect & QA Lead  
**Documents Audited:** `ENVIRONMENT_AUDIT.md`, `RULES.md`, `PRD.md`, `DESIGN.md`, `ERD.md`, `SCHEMA.md`, `ARCHITECTURE.md`, `API_SPEC.md`, `SECURITY.md`

---

## 1. Cross-Document Consistency Matrix

| Dimension | Reference in PRD | Reference in ERD / SCHEMA | Reference in ARCHITECTURE | Reference in API SPEC | Reference in SECURITY | Consistency Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Max Text Length** | 20,000 chars (~3k words) | Enforced via API/Client | Validated at API gateway | Enforced in `POST /analyze/*` | Prevents DoS (ASVS V5.1.1) | **ALIGNED (100%)** |
| **Guest / Stateless Mode** | `FR-AU-01` (No login needed) | `documents.user_id` is nullable | Memory-first processing | Auth header optional in P0 | Zero-retention guaranteed | **ALIGNED (100%)** |
| **Supported Languages** | English & Indonesian (`id-ID`, `en-US`) | `CHECK (language IN (...))` | Handled via LanguageTool | Validated in request schema | Validated at boundary | **ALIGNED (100%)** |
| **Similarity Engine** | Local open-access corpus only | `corpus_documents` table | Trigram + 5-gram MinHash | Matched source attribution card | No SSRF / No web scraping | **ALIGNED (100%)** |
| **Character Offsets** | UTF-16 code units in AST | `start_offset`, `end_offset` | TipTap/ProseMirror sync | Returned in findings JSON | Sanitized in DOM | **ALIGNED (100%)** |
| **Logging Privacy** | Zero text logging in logs | Audit timestamps only | Metadata only in stdout | Redaction specification | Verified in test plan | **ALIGNED (100%)** |

---

## 2. Identified Assumptions & Non-Material Decisions

1. **Editor Engine Choice:** `TipTap` (built on `ProseMirror`) was selected across `PRD.md`, `DESIGN.md`, and `ARCHITECTURE.md`. Rationale: ProseMirror provides immutable transactions and decorations, which are essential for preventing cursor desynchronization when applying grammar replacements.
2. **Initial Similarity Corpus Baseline:** A curated set of 25 open-access scientific papers (CC-BY licensed from arXiv / DOAJ in computer science and linguistics) will serve as the initial verifiable corpus in `migrations/0002_seed_open_access_corpus.sql`.
3. **LanguageTool Local Setup:** The architecture assumes LanguageTool will be run locally via Docker on port 8010 (`erikvl87/languagetool`) to avoid third-party API costs or rate-limiting.

---

## 3. Decisions Requiring Project Owner Confirmation

Before commencing application implementation (Phase 4), the following items are submitted for formal review:

1. **Corpus Subject Focus:** Is the initial seed of 25 Computer Science / Linguistics open-access papers acceptable for baseline testing, or is there a preferred academic domain (e.g., medicine, social sciences)?
2. **Database Execution Route:** Would you prefer the local PostgreSQL 14 instance be started via native macOS service (`brew services start postgresql@14`), or managed entirely through a project-local `docker-compose.yml` file alongside LanguageTool?

---

## 4. Auditor Sign-Off & Verdict
* **Contradictions Found:** **0** (Zero contradictions between requirements, UI design, database schema, architecture, and security policies).
* **Unapproved Features:** **0** (No AI detector, paraphraser, or paid external APIs included in P0 MVP).
* **Code State:** No business-feature code or unapproved packages installed.
* **Ready for Owner Gate Review:** **YES**.
