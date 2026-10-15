# DATABASE TECHNICAL SCHEMA SPECIFICATION (`SCHEMA.md`)
**Project:** Academic Writing Intelligence Platform  
**Target RDBMS:** PostgreSQL 14+ (Compatible with local `psql 14.20`)  
**Status:** Approved for Implementation  
**Architect:** Database Architect

---

## 1. Schema Extensions & Migrations
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

Sequential migration files:
* `migrations/0001_initial_core_schema.sql` (Users, Documents, AnalysisReports, Findings, Sources)
* `migrations/0002_academic_management_schema.sql` (Institutions, Classes, Enrollments, Assignments, Submissions, Feedback, AuditLogs)
* `migrations/0003_seed_open_access_corpus.sql` (Seed verified literature)

---

## 2. Table Definitions (PostgreSQL DDL)

### 2.1 Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT,
    role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'instructor', 'student')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);
```

### 2.2 Table: `institutions`
```sql
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    institution_type VARCHAR(50) NOT NULL DEFAULT 'university',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Table: `classes`
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Table: `enrollments`
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('instructor', 'student')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_user UNIQUE (class_id, user_id)
);
```

### 2.5 Table: `assignments`
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    instructions TEXT,
    due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.6 Table: `documents` (Personal Drafts & Workspaces)
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Document',
    content TEXT NOT NULL DEFAULT '',
    word_count INTEGER NOT NULL DEFAULT 0 CHECK (word_count >= 0),
    language VARCHAR(10) NOT NULL DEFAULT 'en-US' CHECK (language IN ('en-US', 'en-GB', 'id-ID')),
    content_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);
```

### 2.7 Table: `submissions` (Frozen Turn-In Snapshots)
```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'returned')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.8 Table: `sources` (Verified Reference Corpus)
```sql
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    authors VARCHAR(500) NOT NULL,
    publication_year INTEGER CHECK (publication_year BETWEEN 1800 AND 2100),
    doi VARCHAR(255) UNIQUE,
    source_url VARCHAR(1000) NOT NULL,
    license VARCHAR(100) NOT NULL DEFAULT 'Open Access / CC-BY',
    source_type VARCHAR(50) NOT NULL DEFAULT 'journal',
    raw_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.9 Table: `analysis_reports`
```sql
CREATE TABLE analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('grammar', 'similarity', 'comprehensive')),
    engine_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    similarity_score NUMERIC(5, 2) CHECK (similarity_score BETWEEN 0.00 AND 100.00),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_report_target CHECK (document_id IS NOT NULL OR submission_id IS NOT NULL)
);
```

### 2.10 Table: `grammar_findings`
```sql
CREATE TABLE grammar_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES analysis_reports(id) ON DELETE CASCADE,
    rule_id VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('spelling', 'grammar', 'style', 'punctuation')),
    message TEXT NOT NULL,
    start_offset INTEGER NOT NULL CHECK (start_offset >= 0),
    end_offset INTEGER NOT NULL CHECK (end_offset > start_offset),
    original_text TEXT NOT NULL,
    replacement_text TEXT
);
```

### 2.11 Table: `similarity_matches`
```sql
CREATE TABLE similarity_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES analysis_reports(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
    score NUMERIC(5, 2) NOT NULL CHECK (score BETWEEN 0.00 AND 100.00),
    method VARCHAR(50) NOT NULL DEFAULT '5-gram_jaccard',
    matched_text TEXT NOT NULL
);
```

### 2.12 Table: `feedback` (Instructor Annotations)
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    text_range VARCHAR(50),
    comment TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'addressed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.13 Table: `audit_logs` (Security & Academic Integrity)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. High-Performance Query Indexes
```sql
-- 1. User document lookups
CREATE INDEX idx_documents_owner ON documents (owner_id) WHERE deleted_at IS NULL;

-- 2. Class submissions lookup for instructors
CREATE INDEX idx_submissions_assignment ON submissions (assignment_id, submitted_at DESC);

-- 3. Inverted Trigram Index for Open-Access Literature Similarity Discovery
CREATE INDEX idx_sources_trgm_text ON sources USING gin (raw_text gin_trgm_ops);

-- 4. Fast lookup for report findings
CREATE INDEX idx_grammar_findings_report ON grammar_findings (report_id);
CREATE INDEX idx_similarity_matches_report ON similarity_matches (report_id);

-- 5. Audit logs by resource
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);
```
