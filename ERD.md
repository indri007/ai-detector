# ENTITY RELATIONSHIP DIAGRAM & DATA MODEL (`ERD.md`)
**Project:** Academic Writing Intelligence Platform  
**Architecture:** Tri-Frontend (Next.js, Streamlit, Word Add-in) + FastAPI Shared Core + PostgreSQL 14+  
**Status:** Approved Specification  
**Architect:** Database Architect & Principal Engineer

---

## 1. System Architecture & Entity Classification

The data architecture is structured into two coherent tiers:
1. **Tier 1 (MVP Baseline — Operational):** Document writing, syntax analysis, local drafts, similarity reports, and open-access corpus provenance.
2. **Tier 2 (Academic Management — Extended):** Multi-tenant institutions, classes, enrollments, assignments, immutable submissions, reviewer feedback, and audit logs.

### Entity Inventory:
* **`User`:** Identity and authentication (Roles: `admin`, `instructor`, `student`).
* **`Institution`:** University, faculty, or research center.
* **`Class`:** Academic course/semester instance owned by an instructor.
* **`Enrollment`:** Association linking users to classes with role permissions (`instructor`, `student`).
* **`Assignment`:** Course assignment with turn-in deadlines and guidelines.
* **`Document`:** User draft workspace (mutable, auto-saved).
* **`Submission`:** Immutable assignment turn-in snapshot referencing a document version.
* **`AnalysisReport` / `AnalysisJob`:** Diagnostic run records (Grammar, Style, Similarity).
* **`GrammarFinding`:** Offset-anchored syntax, spelling, and PUEBI/academic style issues.
* **`SimilarityMatch` / `MatchedSource`:** Granular attribution records against indexed literature.
* **`Source` / `CorpusDocument`:** Verified reference literature with DOI and license provenance.
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
        varchar engine_version
        decimal similarity_score
        varchar status "pending | processing | completed | failed"
        timestamptz created_at
    }

    GrammarFinding {
        uuid id PK
        uuid report_id FK
        varchar rule_id
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
        varchar method "5-gram_jaccard | minhash | embedding"
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
        uuid actor_id FK
        varchar action "login | document_create | analysis_run | submission | delete"
        varchar resource_type "document | submission | report"
        uuid resource_id
        varchar ip_hash
        timestamptz created_at
    }
```

---

## 3. Structural Design Decisions

### 3.1 Separation of `Document` and `Submission`
* **`Document`** represents the mutable, working workspace where the researcher types, drafts, and applies revisions in real time.
* **`Submission`** represents an immutable snapshot frozen at turn-in time (`submitted_at`). Even if the student subsequently edits their working document, the submitted assignment report and content remain auditable and verifiable by the instructor.

### 3.2 Tenant Isolation & Authorization Boundary
* **Student:** Can only read/edit their own documents and view submission reports for classes in which they are enrolled.
* **Instructor:** Can create classes, publish assignments, inspect all student submissions within their enrolled classes, and provide inline feedback.
* **Admin:** Manages institutional settings, users, and audit logs. Has zero access to read private draft document text without explicit authorization.

---

## 4. Retention & Privacy Enforcement

1. **Guest / Ephemeral Processing:** Unregistered user sessions remain stateless. No database records are written without user intent.
2. **Audit Logs Without Document Leaks:** `AuditLog` records actor ID, action type, and resource UUID. Full text content is NEVER stored in audit logs.
3. **Corpus Immutability:** User documents are NEVER ingested into the comparison corpus without verified institutional agreement and licensing.
