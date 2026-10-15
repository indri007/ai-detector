# SECURITY POLICY & THREAT MODEL (`SECURITY.md`)
**Project:** Academic Writing Intelligence Platform  
**Reference Framework:** OWASP Application Security Verification Standard (ASVS) 4.0 (Level 1 / Level 2 applicable controls)  
**Status:** Approved Specification  
**Role:** Senior Application Security Engineer

---

## 1. Threat Model & Protected Assets

### 1.1 Critical Assets
1. **Unpublished Academic Manuscripts:** Intellectual property submitted by researchers. A data leak constitutes a catastrophic loss of academic priority and breach of trust.
2. **User Authentication Credentials:** Passwords and session cookies for registered accounts.
3. **Corpus Integrity:** The verified reference dataset used for similarity calculations (must prevent unauthorized tampering or poisoned entries).
4. **Platform Availability & Compute:** Protection against denial-of-service via computationally heavy text-shingling or regex payloads.

### 1.2 STRIDE Threat Matrix

| Threat Category | Potential Vector | Impact | Baseline Mitigation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Session token hijacking | Unauthorized document access | Secure, HTTP-only, SameSite=Strict cookies; short-lived tokens | Planned (P1 Auth) |
| **Tampering** | Parameter tampering on document ID | Accessing/modifying another user's draft | Strict tenant isolation via `WHERE user_id = :current_user_id` | Enforced in Schema |
| **Repudiation** | Denying plagiarism/similarity reports | Loss of audit integrity | SHA-256 content hashes recorded with analysis job timestamp | Enforced in Schema |
| **Information Disclosure** | Document content leaking into server logs | Leak of unpublished research | Sanitized logging pipeline: zero text logging in APM/logs | Enforced in Architecture |
| **Denial of Service** | 1,000,000-character payload paste | Node.js event loop freeze | 20,000-character limit; request size limit (100 KB) in reverse proxy | Enforced in API Spec |
| **Elevation of Privilege** | Modifying user role to admin | Unauthorized corpus tampering | Role-based check constraint (`CHECK role IN (...)`), server-side role validation | Enforced in Schema |

---

## 2. Controls Inventory: Implemented vs. Planned

| Domain | Control Description | OWASP ASVS Ref | Implementation Status |
| :--- | :--- | :--- | :--- |
| **Input Validation** | Maximum character length (20,000 chars) enforced at API gateway | V5.1.1 | **Implemented in Specification** |
| **Input Validation** | Strict JSON schema parsing & sanitization | V5.1.4 | **Implemented in Specification** |
| **Injection** | Parameterized queries via ORM / SQL query builder | V5.3.1 | **Enforced in Schema design** |
| **XSS Prevention** | DOMPurify / ProseMirror HTML sanitization | V5.2.2 | **Implemented in Editor Design** |
| **Data Privacy** | Zero document text retention in logs | V8.3.1 | **Enforced in Architecture** |
| **Authentication** | Argon2id password hashing | V2.1.1 | **Specified for P1 Auth** |
| **Session Security** | HTTP-only, Secure, SameSite=Strict cookies | V3.4.1 | **Specified for P1 Auth** |
| **Access Control** | Tenant isolation on document CRUD | V4.1.1 | **Specified in Schema/API** |

---

## 3. Vulnerability Mitigation Details

### 3.1 Cross-Site Scripting (XSS) & DOM Injection
* **Risk:** A user pastes rich text containing malicious `<script>` tags, SVG payloads, or event handlers (`onload`, `onerror`).
* **Control:** The TipTap/ProseMirror schema explicitly whitelists only safe inline nodes (`paragraph`, `heading`, `text`, `bold`, `italic`, `blockquote`). All raw HTML is stripped of arbitrary tags before inserting into the document AST. Output rendered to the DOM is escaped by default by React.

### 3.2 SQL Injection (SQLi)
* **Risk:** Malicious inputs inside search or metadata queries.
* **Control:** Direct raw SQL string concatenation is strictly prohibited. All queries must use parameterized placeholders (`$1, $2`) or a verified type-safe query builder.

### 3.3 Server-Side Request Forgery (SSRF)
* **Risk:** If URL fetching or DOI resolution is introduced to retrieve source papers.
* **Control:** In P0 MVP, **remote URL fetching from arbitrary user-provided links is completely disabled**. All similarity checks are performed strictly against the pre-indexed local corpus. Any future DOI resolution must be restricted to an explicit domain whitelist (e.g., `api.crossref.org`, `export.arxiv.org`).

### 3.4 Secret & Environment Variable Management
* **Zero Secrets in Git:** `.env` and `.env.local` are added to `.gitignore`.
* **Example Template:** Only `.env.example` containing non-secret placeholder keys is committed to the repository.
* **Scanning:** Pre-commit hooks (`git-secrets` / scanning rules) must block commits containing high-entropy strings, AWS/GCP keys, or private database connection URIs.

---

## 4. Privacy-Safe Logging & Audit Requirements

### 4.1 Strict Redaction Standard
The application must never log:
* Raw manuscript text, paragraphs, or sentences.
* Extracted grammar suggestion replacements.
* User passwords or raw session tokens.

### 4.2 Compliant Log Example
```json
{
  "level": "info",
  "time": "2026-10-15T06:15:30.120Z",
  "event": "ANALYSIS_COMPLETED",
  "jobId": "e18e3c12-3f8d-4f81-817c-2b2260655866",
  "engine": "comprehensive",
  "language": "en-US",
  "wordCount": 350,
  "durationMs": 312,
  "httpStatus": 200
}
```

---

## 5. Security Testing & Release-Blocking Criteria

A build or release is **STRICTLY BLOCKED** if any of the following occur:
1. `npm audit` reports high or critical severity vulnerabilities in production dependencies.
2. An automated integration test shows that User A can retrieve User B's document by manipulating the document ID (Broken Object Level Authorization - BOLA).
3. Any test detects that raw document text appears in application stdout/stderr logs.
4. Input validation allows a payload exceeding 20,000 characters to reach internal processing engines.
