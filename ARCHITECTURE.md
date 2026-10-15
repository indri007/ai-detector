# SYSTEM ARCHITECTURE SPECIFICATION (`ARCHITECTURE.md`)
**Project:** Academic Writing Intelligence Platform (`academic-writing-platform`)  
**Version:** 1.0.0-MVP  
**Status:** Approved for Implementation  
**Role:** Principal Software Architect

---

## 1. System Context & Component Boundaries

The Academic Writing Intelligence Platform is designed as a modular, privacy-first system. It separates stateless analytical computation from user data persistence, ensuring that user documents can be examined either ephemerally (zero-retention) or stored within a private workspace.

```mermaid
C4Context
    title System Context Diagram - Academic Writing Platform
    
    Person(researcher, "Academic Researcher / Student", "Writes or pastes manuscripts, views syntax & similarity analysis.")
    
    System_Boundary(platform_boundary, "Academic Writing Intelligence Platform") {
        Container(web_app, "Frontend Studio (Next.js / React)", "TypeScript, TipTap/ProseMirror, Tailwind CSS", "Provides rich text editing, inline diagnostic decoration, and report visualization.")
        Container(api_gateway, "Application & API Server (Next.js Route Handlers)", "Node.js, TypeScript", "Validates payloads, tokenizes text, coordinates analysis pipelines, and enforces privacy controls.")
        ContainerDb(database, "Relational Database", "PostgreSQL 14+ with pg_trgm", "Stores user accounts, document metadata, analysis reports, and indexed open-access corpus.")
        Container(sim_engine, "Similarity Engine (Inverted Index / MinHash)", "TypeScript / Node.js Engine", "Calculates Jaccard similarity and N-gram overlap against indexed open-access corpus.")
    }
    
    System_Ext(lt_server, "Grammar Engine (LanguageTool Server)", "Self-hosted Docker Container / Local API", "Analyzes spelling, grammar, punctuation, and academic style via HTTP JSON API.")
    
    Rel(researcher, web_app, "Interacts with editor and reviews suggestions", "HTTPS / Browser")
    Rel(web_app, api_gateway, "Submits text for analysis", "JSON over HTTPS")
    Rel(api_gateway, database, "Reads/writes documents, jobs, and corpus shingles", "SQL / TCP 5432")
    Rel(api_gateway, sim_engine, "Queries shingles & trigrams", "In-Process / Database Index")
    Rel(api_gateway, lt_server, "Dispatches raw text for rule checking", "HTTP / Localhost:8010")
```

---

## 2. Responsibilities by Component

### 2.1 Frontend Studio (`components/` & `app/`)
* **Rich Text Editing:** Powered by TipTap (ProseMirror engine). Provides immutable document AST, atomic replacement transactions, and character-offset mapped decorations.
* **Inline Diagnostic Rendering:** Renders grammar errors as red underlines and similarity matches as amber highlights.
* **Coordinate Anchoring:** Calculates DOM bounding rectangles to anchor suggestion popovers directly beneath the targeted token.
* **State Management:** Reactive client-side document state with optimistic UI updates and real-time word/character count calculations.

### 2.2 Backend & API Gateway (`app/api/v1/`)
* **Request Validation:** Validates character count (max 20,000 characters for MVP), language code (`id-ID`, `en-US`, `en-GB`), and payload schema.
* **Pipeline Orchestrator:** Triggers grammar and similarity engines concurrently via `Promise.allSettled()`, ensuring failure in one engine does not terminate the other.
* **Offset Harmonizer:** Normalizes character offsets across multi-line breaks (`\r\n` vs `\n`) and Unicode multi-byte graphemes.
* **Privacy Guardrail:** Strips raw document text from logs, emitting only execution metadata (word count, duration, error codes).

### 2.3 Grammar Engine Adapter (`lib/engines/grammar/`)
* Dispatches requests to the LanguageTool server.
* Maps LanguageTool rule categories into unified domain categories: `spelling`, `grammar`, `style`, `punctuation`.
* Translates LanguageTool byte/character offsets into absolute UTF-16 code unit offsets matching the browser's ProseMirror model.

### 2.4 Similarity Engine (`lib/engines/similarity/`)
* **Text Normalization:** Lowercasing, whitespace collapsing, punctuation stripping, and tokenization.
* **5-Gram Shingling:** Extracts overlapping 5-token sequences.
* **Corpus Matching:** Uses PostgreSQL `pg_trgm` and hash matching against `corpus_documents` to retrieve candidate matches, then evaluates exact sentence-level overlap.
* **Attribution Formatter:** Generates verifiable source cards containing author, year, title, and DOI URL.

### 2.5 Database (`PostgreSQL 14+`)
* Stores relational entities defined in `SCHEMA.md`.
* Operates trigram indexing (`gin_trgm_ops`) over corpus text for sub-second similarity candidate filtering.
* Enforces data isolation and foreign key cascading.

---

## 3. Data Flow & Request Lifecycles

### 3.1 End-to-End Analysis Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher
    participant Client as Frontend (TipTap Editor)
    participant API as API Handler (/api/v1/analyze)
    participant LT as Grammar Engine (LanguageTool)
    participant DB as PostgreSQL (Corpus & DB)

    User->>Client: Pastes text & clicks "Run Check"
    Client->>API: POST /api/v1/analyze/comprehensive { text, language, mode }
    
    Note over API: Step 1: Input Validation (Length <= 20,000 chars)
    
    par Grammar Analysis
        API->>LT: POST /v2/check { text, language }
        LT-->>API: 200 OK (Rule matches & offsets)
    and Similarity Analysis
        API->>DB: Query trigram match against corpus_documents
        DB-->>API: Return candidate corpus records
        Note over API: Step 2: Compute 5-gram Jaccard overlap
    end

    Note over API: Step 3: Aggregate findings & verify offset integrity
    API-->>Client: 200 OK (Combined findings & similarity report)
    Client->>Client: Apply ProseMirror Decorations to Canvas
    Client-->>User: Display highlighted tokens & update diagnostic rail
```

---

## 4. Failure Modes & Resilience Strategies

| Failure Scenario | Impact | System Resilience Strategy |
| :--- | :--- | :--- |
| **LanguageTool Service Offline** | Grammar checks fail | Returns partial result: Similarity report succeeds; Grammar tab displays `SERVICE_UNAVAILABLE` with clear retry option. App does not crash. |
| **PostgreSQL Unreachable** | Persistence & Similarity blocked | In-memory fallback for guest mode grammar checking. Similarity returns an informative message indicating local corpus database is offline. |
| **Pasted Text Exceeds Limit** | Potential engine memory exhaustion | Fast 400 Bad Request rejection at API gateway before tokenization or external calls occur. |
| **Invalid Unicode / Formatting** | Character offset misalignment | Text is sanitized and normalized at the boundary; UTF-16 code units are consistently enforced across client and server. |

---

## 5. Deployment Topology

### 5.1 Local Development Environment (Active Phase)
* **Web App:** Next.js development server running natively on Node.js 26.5.0 (`http://localhost:3000`).
* **Database:** PostgreSQL running natively (`psql 14.20`) or via Docker container (`port 5432`).
* **LanguageTool:** Docker container (`erikvl87/languagetool`) running locally on port 8010.
* **Network Boundary:** All traffic is confined to `localhost`. Zero external data transmission.

### 5.2 Future Production Topology (Subject to Owner Approval)
```mermaid
graph TD
    ClientBrowser[Client Browser] -->|HTTPS| CloudRunWeb[Google Cloud Run / Container: Next.js Web & API]
    CloudRunWeb -->|Internal VPC| CloudSQL[Google Cloud SQL / Managed PostgreSQL 14+]
    CloudRunWeb -->|Internal VPC| CloudRunLT[Google Cloud Run / Container: LanguageTool]
```

---

## 6. Operational Costs & Privacy Risks

### 6.1 Operational Cost Model Baseline
* **Local Development:** $0.00 / month.
* **Staging / Initial Production:** Low-cost container deployment (estimated < $20/month with scale-to-zero when idle). Zero third-party pay-per-token API consumption in P0 MVP.

### 6.2 Privacy & Intellectual Property Safeguards
1. **Zero Logging of Document Contents:** Console outputs, server access logs, and error aggregators strictly log:
   `[INFO] Job completed: id=3f1b... length=1420 words=210 duration_ms=412`
   Raw text content is NEVER passed to loggers.
2. **Ephemeral Guest Processing:** Unauthenticated sessions are processed in volatile memory and never persisted to disk unless the user explicitly requests saving.
3. **No External LLM Data Transmission in P0:** All P0 processing is executed on self-hosted local services.
