# IMPLEMENTATION MASTER PLAN (`PLAN.md`)
**Project:** Academic Writing Intelligence Platform  
**Architecture:** Next.js App Router (TypeScript) + Tailwind CSS + TipTap Editor + PostgreSQL + LanguageTool  
**Status:** Approved for Implementation  
**Execution Lead:** Senior Project Manager & Lead Architect

---

## 1. Milestones Overview

```text
[Milestone 1: Spec Approval & Workspace Prep] ➔ [Milestone 2: App Shell & Design System]
                                                                  │
[Milestone 4: Engine Integration & Analysis]   ◄─ [Milestone 3: Editor Canvas & Offset Engine]
         │
         ▼
[Milestone 5: Corpus Similarity Engine] ➔ [Milestone 6: Verification & QA Benchmark]
```

---

## 2. Granular Task Breakdown

### Milestone 1: Specification Approval & Workspace Baseline (COMPLETED)
* `TASK-M1-01`: Environment audit and runtime compatibility verification (`ENVIRONMENT_AUDIT.md`). [DONE]
* `TASK-M1-02`: Technical constitution and non-negotiable rules (`RULES.md`). [DONE]
* `TASK-M1-03`: Product requirements and acceptance criteria (`PRD.md`). [DONE]
* `TASK-M1-04`: Visual design tokens and UI layout specification (`DESIGN.md`). [DONE]
* `TASK-M1-05`: Relational data modeling and DDL (`ERD.md`, `SCHEMA.md`). [DONE]
* `TASK-M1-06`: Technical architecture and API contracts (`ARCHITECTURE.md`, `API_SPEC.md`). [DONE]
* `TASK-M1-07`: Security model, test plan, cost projections (`SECURITY.md`, `QA_TEST_PLAN.md`, `COST_MODEL.md`). [DONE]

### Milestone 2: Application Shell & Design Tokens (Stage 3)
* `TASK-M2-01`: Initialize Next.js App Router project skeleton with TypeScript strict mode.
* `TASK-M2-02`: Configure Tailwind CSS with academic design tokens (`#FDFDFE` background, academic navy accent, semantic diagnostic colors).
* `TASK-M2-03`: Establish Git repository hygiene: `.gitignore`, `.env.example`, pre-commit linting rules.
* `TASK-M2-04`: Implement top navigation bar (`TopNavbar.tsx`) with real-time statistics badges and language selector.

### Milestone 3: Rich Text Editor & Offset Synchronizer (Stage 4)
* `TASK-M3-01`: Integrate TipTap editor core with ProseMirror document model.
* `TASK-M3-02`: Build real-time word, character, and sentence counter utility.
* `TASK-M3-03`: Build ProseMirror custom decoration extension to render inline red squiggles (grammar) and amber highlights (similarity).
* `TASK-M3-04`: Implement floating suggestion popover (`SuggestionPopover.tsx`) with coordinate anchoring.
* `TASK-M3-05`: Implement atomic replacement transaction logic to prevent offset drift.

### Milestone 4: Grammar Engine Integration
* `TASK-M4-01`: Build LanguageTool API client adapter with timeout handling and error recovery.
* `TASK-M4-02`: Implement UTF-16 code unit offset harmonizer to translate external findings to ProseMirror coordinates.
* `TASK-M4-03`: Wire up API route `POST /api/v1/analyze/grammar`.
* `TASK-M4-04`: Add diagnostic rail (`DiagnosticRail.tsx`) rendering categorized suggestion cards.

### Milestone 5: Verifiable Similarity Engine
* `TASK-M5-01`: Implement text normalization and 5-gram shingle generator.
* `TASK-M5-02`: Build Jaccard / MinHash similarity calculator.
* `TASK-M5-03`: Create seed corpus dataset (25 open-access scientific papers from arXiv/DOAJ under CC-BY licenses).
* `TASK-M5-04`: Wire up API route `POST /api/v1/analyze/similarity` and `POST /api/v1/analyze/comprehensive`.
* `TASK-M5-05`: Build matched source cards (`MatchedSourceCard.tsx`) with verifiable source links and jump-to-section navigation.

### Milestone 6: Quality Assurance, Security Verification & Release (Stages 6–8)
* `TASK-M6-01`: Implement unit test suites (tokenization, shingling, minhash, offset adjustment).
* `TASK-M6-02`: Implement integration tests for API routes.
* `TASK-M6-03`: Execute accessibility review (WCAG 2.1 AA keyboard navigation, contrast ratios).
* `TASK-M6-04`: Perform security review: verify zero document text in logs, audit dependencies via `npm audit`.
* `TASK-M6-05`: Generate final verification report (`QA_REPORT.md`).

---

## 3. Rollback & Contingency Procedures
* Every task must be committed as an atomic Git commit.
* In the event of a breaking regression, roll back to the previous stable commit tag:
  `git revert HEAD --no-edit`
