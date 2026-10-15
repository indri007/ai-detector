# ENTITY RELATIONSHIP DIAGRAM & DATA MODEL (`ERD.md`)
**Project:** Academic Writing Intelligence Platform  
**Version:** 0.2.0-beta (Synchronized with Live Deployment & PRD v0.2.0)  
**Architecture:** Tri-Frontend (Next.js Studio, Streamlit Cloud, Word Add-in) + FastAPI Shared Core + PostgreSQL 14+  
**Status:** Implemented & Approved Specification  
**Architect:** Database Architect & Principal Engineer  
**Live URL:** [https://ai-detector-best.streamlit.app/](https://ai-detector-best.streamlit.app/)

---

## 1. System Architecture & Entity Classification

The data architecture is structured across three cohesive operational tiers:
1. **Tier 1 (Core Authoring & Diagnostics — Implemented in v0.2.0):** 
   * Active document editing, real-time metrics, bilingual PUEBI/KBBI and English syntax findings.
   * Deterministic 5-gram Jaccard similarity against verified open-access corpus literature.
   * Academic Paraphrasing variants (Formal & Concise) with scientific rationales and citation retention.
   * Academic AI Copilot execution logs across 12 specialized academic skills.
   * Official Crossref citation lookup with formatted APA 7 and IEEE bibliographies.
   * Multi-client metadata tracking (`streamlit_cloud`, `web_studio`, `word_addin`).
2. **Tier 2 (Academic Management & Classroom — Fast Follow):** 
   * Multi-tenant institutions, classes, enrollments, assignments, immutable turn-in submissions, and reviewer feedback.
3. **Tier 3 (Security, Audit & Governance — Active):** 
   * Non-repudiation audit trail, zero document-leak logging, and ephemeral guest session purge.

---

### Entity Inventory:
* **`User`:** Identity and authentication (Roles: `admin`, `instructor`, `student`). Nullable for guest/stateless sessions.
* **`Institution`:** University, faculty, or research center.
* **`Class`:** Academic course/semester instance owned by an instructor.
* **`Enrollment`:** Association linking users to classes with role permissions (`instructor`, `student`).
* **`Assignment`:** Course assignment with turn-in deadlines and guidelines.
* **`Document`:** User draft workspace (mutable, auto-saved in `localStorage` or PostgreSQL).
* **`Submission`:** Immutable assignment turn-in snapshot referencing a document version.
* **`AnalysisReport`:** Diagnostic run records (Grammar, Style, Similarity, Client Origin).
* **`GrammarFinding`:** Offset-anchored syntax, spelling, and PUEBI/academic style issues with atomic replacement.
* **`SimilarityMatch`:** Granular attribution records against indexed literature.
* **`Source` / `CorpusDocument`:** Verified reference literature with DOI and license provenance.
* **`CopilotExecution`:** Log and state of Academic AI Copilot runs across the 12 specialized skills (Gemini 2.5 Flash / local fallback).
* **`ParaphraseVariant`:** Academic sentence/passage rewrites with mode tags and preserved constraints.
* **`CitationReference`:** Crossref-verified citations with APA 7 and IEEE bibliographic strings.
* **`Feedback`:** Inline academic feedback, annotations, and grades from instructors.
* **`AuditLog`:** Non-repudiation audit trail for security and academic integrity compliance.

---

## 2. Mermaid Entity Relationship Diagram

```mermaid
erDiagram
    Institution ||--o{ Class : "hosts"
    User ||--o{ Class : "owns_as_instructor"
    User ||--o{ Enrollment : "participates_in"
    Class ||--o{ Enrollment : "contains"
    Class ||--o{ Assignment : "assigns"
    User ||--o{ Document : "authors"
    Assignment ||--o{ Submission : "receives"
    Document ||--o{ Submission : "submitted_as"
    User ||--o{ Submission : "submits"
    
    Document ||--o{ AnalysisReport : "undergoes"
    Submission ||--o{ AnalysisReport : "evaluates"
    AnalysisReport ||--o{ GrammarFinding : "generates"
    AnalysisReport ||--o{ SimilarityMatch : "produces"
    Source ||--o{ SimilarityMatch : "matched_against"

    Document ||--o{ CopilotExecution : "interacts_with"
    Document ||--o{ ParaphraseVariant : "revises_into"
    Document ||--o{ CitationReference : "cites"

    Document ||--o{ Feedback : "receives_annotations"
    User ||--o{ Feedback : "authored_by"
    User ||--o{ AuditLog : "triggers"

    User {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar status "active | suspended"
        varchar role "admin | instructor | student"
        timestamptz created_at
    }

    Institution {
        uuid id PK
        varchar name
        varchar institution_type "university | institute | publisher"
        timestamptz created_at
    }

    Class {
        uuid id PK
        uuid institution_id FK
        uuid owner_id FK "instructor user_id"
        varchar name
        varchar semester
        timestamptz created_at
    }

    Enrollment {
        uuid id PK
        uuid class_id FK
        uuid user_id FK
        varchar role "instructor | student"
        timestamptz enrolled_at
    }

    Assignment {
        uuid id PK
        uuid class_id FK
        varchar title
        text instructions
        timestamptz due_at
        timestamptz created_at
    }

    Document {
        uuid id PK
        uuid owner_id FK "nullable for guest sessions"
        varchar title
        text content
        integer word_count
        varchar language "id-ID | en-US | en-GB"
        varchar client_source "streamlit_cloud | web_studio | word_addin"
        varchar content_hash
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    Submission {
        uuid id PK
        uuid assignment_id FK
        uuid document_id FK
        uuid submitted_by FK
        integer version_number
        varchar status "submitted | reviewed | returned"
        timestamptz submitted_at
    }

    AnalysisReport {
        uuid id PK
        uuid document_id FK "nullable if attached to submission"
        uuid submission_id FK "nullable if personal check"
        varchar analysis_type "grammar | similarity | comprehensive"
        varchar client_type "streamlit_cloud | web_studio | word_addin"
        varchar engine_version
        decimal similarity_score
        varchar status "pending | processing | completed | failed"
        timestamptz created_at
    }

    GrammarFinding {
        uuid id PK
        uuid report_id FK
        varchar rule_id "PUEBI_001 | CONTRACTION_001 | etc"
        varchar category "spelling | grammar | style | punctuation"
        text message
        integer start_offset
        integer end_offset
        text original_text
        text replacement_text
    }

    SimilarityMatch {
        uuid id PK
        uuid report_id FK
        uuid source_id FK
        decimal score
        varchar method "5-gram_jaccard"
        text matched_text
    }

    Source {
        uuid id PK
        varchar title
        varchar authors
        integer publication_year
        varchar doi UK
        varchar source_url
        varchar license "CC-BY | Open Access | Public Domain"
        varchar source_type "journal | preprint | book"
        text raw_text
        timestamptz created_at
    }

    CopilotExecution {
        uuid id PK
        uuid document_id FK "nullable in guest mode"
        varchar skill_name "grammar | clarity | rewriter | tone | paraphrase | chat | imrad_summary | translate | doc_qa | citation_verify | research_gap | journal_formatter"
        varchar model_used "gemini-2.5-flash | local_deterministic_fallback"
        text input_context
        text generated_response
        integer prompt_tokens
        integer completion_tokens
        timestamptz executed_at
    }

    ParaphraseVariant {
        uuid id PK
        uuid document_id FK "nullable in guest mode"
        varchar mode "academic_formal | concise"
        text original_text
        text rewritten_text
        text scientific_rationale
        boolean citations_preserved
        timestamptz created_at
    }

    CitationReference {
        uuid id PK
        uuid document_id FK "nullable in guest mode"
        varchar doi UK
        varchar title
        varchar authors
        integer publication_year
        varchar journal_name
        text apa7_citation
        text ieee_citation
        boolean verified_crossref
        timestamptz created_at
    }

    Feedback {
        uuid id PK
        uuid document_id FK
        uuid reviewer_id FK "instructor"
        varchar text_range "[startOffset, endOffset]"
        text comment
        varchar status "open | addressed"
        timestamptz created_at
    }

    AuditLog {
        uuid id PK
        uuid actor_id FK "nullable for guest actions"
        varchar action "login | analysis_run | copilot_skill | crossref_search | submission | delete"
        varchar resource_type "document | submission | report | copilot"
        uuid resource_id
        varchar client_type "streamlit_cloud | web_studio | word_addin"
        varchar ip_hash
        timestamptz created_at
    }
```

---

## 3. Structural Design Decisions & Entities Breakdown

### 3.1 Academic AI Copilot & Paraphrase Decoupling
* **`CopilotExecution`** decouples generative AI skill executions from deterministic grammar findings. It tracks which of the 12 skills was invoked, the active model (`gemini-2.5-flash` vs `local_deterministic_fallback`), and token metrics.
* **`ParaphraseVariant`** records rewritten variations with their scientific rationales and explicit constraint checks (`citations_preserved = true`), ensuring academic citations like `(Vaswani et al., 2017)` remain untouched during sentence restructuring.

### 3.2 Crossref Citation Management
* **`CitationReference`** provides first-class storage for verified academic literature found through the Crossref REST API. It stores both raw metadata (DOI, authors, year) and pre-formatted citation strings (**APA 7th Edition** and **IEEE**), allowing authors to copy-paste formatted references instantly.

### 3.3 Multi-Client Origin Awareness
* Both **`Document`**, **`AnalysisReport`**, and **`AuditLog`** track `client_type` (`streamlit_cloud`, `web_studio`, `word_addin`), allowing diagnostic performance and usage analytics to be grouped across the three frontends without data silos.

### 3.4 Separation of `Document` and `Submission`
* **`Document`** represents the mutable, working workspace where the researcher types, drafts, and applies revisions in real time (stored in memory/localStorage for guests, or PostgreSQL for registered users).
* **`Submission`** represents an immutable snapshot frozen at turn-in time (`submitted_at`). Even if the student subsequently edits their working document, the submitted assignment report and content remain auditable and verifiable by the instructor.

---

## 4. Retention, Privacy & Stateless Operations

1. **Ephemeral Guest Processing (Streamlit Cloud & Web Studio):**
   * For unregistered sessions, entities (`Document`, `AnalysisReport`, `GrammarFinding`, `CopilotExecution`, `ParaphraseVariant`) exist purely in-memory in the client runtime.
   * `owner_id` is nullable across all tables, ensuring no foreign key constraint failures during guest usage.
2. **Zero-Retention Audit Logging:**
   * `AuditLog` captures only metadata (actor ID, action, resource UUID, client type, hashed IP). Manuscript text is **NEVER** stored in audit logs.
3. **Corpus Immutability & Provenance:**
   * `Source` contains only verified open-access literature (e.g. arXiv CC-BY, Mind, Bell Labs, DOAJ). User submissions are strictly partitioned and **NEVER** inserted into the comparison corpus without explicit written institutional licensing.
