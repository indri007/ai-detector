# REST API SPECIFICATION (`API_SPEC.md`)
**Project:** Academic Writing Intelligence Platform  
**Base URL:** `/api/v1`  
**Protocol:** HTTPS / JSON (RFC 8259)  
**Status:** Approved for Implementation  
**Role:** Senior Backend Architect

---

## 1. Global API Standards & Conventions

### 1.1 Content Negotiation & Headers
* **Request Header:** `Content-Type: application/json`
* **Response Header:** `Content-Type: application/json; charset=utf-8`

### 1.2 Error Envelope Format (RFC 7807 Inspired)
All 4xx and 5xx responses strictly adhere to this standardized error envelope:
```json
{
  "error": {
    "code": "INVALID_INPUT_LENGTH",
    "message": "Text length exceeds the maximum permitted limit of 20,000 characters.",
    "details": [
      {
        "field": "text",
        "issue": "Received 24,150 characters, limit is 20,000."
      }
    ]
  }
}
```

### 1.3 Standard Error Codes
| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| **400** | `INVALID_INPUT_LENGTH` | Character count exceeds limit or is empty. |
| **400** | `UNSUPPORTED_LANGUAGE` | Language code is not in `['en-US', 'en-GB', 'id-ID']`. |
| **401** | `UNAUTHORIZED` | Missing or invalid authentication token (for protected routes). |
| **403** | `FORBIDDEN` | Attempting to access another user's document. |
| **404** | `DOCUMENT_NOT_FOUND` | Document ID does not exist or has been soft-deleted. |
| **422** | `UNPROCESSABLE_PAYLOAD`| JSON malformed or missing required fields. |
| **429** | `RATE_LIMIT_EXCEEDED` | Request threshold exceeded. |
| **503** | `ENGINE_UNAVAILABLE` | External LanguageTool or database engine unreachable. |

---

## 2. P0 MVP Endpoints (Required for Baseline)

### 2.1 Endpoint: Analyze Text (Comprehensive)
* **Path:** `POST /api/v1/analyze/comprehensive`
* **Requirement ID:** `FR-GR-01`, `FR-SM-01`, `FR-ED-03`
* **Authentication:** Optional (Guest mode permitted).
* **Purpose:** Runs both grammar checking and similarity analysis against local open-access corpus in parallel.
* **Input Validation:**
  * `text`: String, required, min 1 char, max 20,000 characters (~3,000 words).
  * `language`: String, required, enum: `["en-US", "en-GB", "id-ID"]`.
  * `documentId`: UUID, optional. If provided, checks user ownership.
* **Request Schema:**
```json
{
  "text": "The results shows that recurrent neural networks has significant limitations.",
  "language": "en-US",
  "documentId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
}
```
* **Success Response (200 OK):**
```json
{
  "data": {
    "wordCount": 11,
    "charCount": 77,
    "language": "en-US",
    "grammar": {
      "status": "completed",
      "findingsCount": 2,
      "findings": [
        {
          "id": "gf_01",
          "ruleId": "PERS_PRON_AGREEMENT",
          "category": "grammar",
          "severity": "error",
          "message": "Subject 'results' (plural) requires plural verb 'show'.",
          "startOffset": 4,
          "endOffset": 17,
          "originalText": "results shows",
          "replacementText": "results show"
        },
        {
          "id": "gf_02",
          "ruleId": "HAVE_HAS_AGREEMENT",
          "category": "grammar",
          "severity": "error",
          "message": "Plural noun 'networks' takes 'have'.",
          "startOffset": 49,
          "endOffset": 61,
          "originalText": "networks has",
          "replacementText": "networks have"
        }
      ]
    },
    "similarity": {
      "status": "completed",
      "overallPercent": 18.25,
      "corpusVersion": "1.0-open-access",
      "disclaimer": "Similarity indicates shared phrasing against indexed open-access literature, not plagiarism.",
      "matchedSources": [
        {
          "id": "ms_01",
          "matchPercent": 12.50,
          "matchedSentencesCount": 1,
          "matchedPassage": "recurrent neural networks has significant limitations",
          "sourceTitle": "Attention Is All You Need",
          "sourceAuthors": "Vaswani et al.",
          "sourceYear": 2017,
          "sourceUrl": "https://arxiv.org/abs/1706.03762"
        }
      ]
    }
  }
}
```

### 2.2 Endpoint: Grammar Check Only
* **Path:** `POST /api/v1/analyze/grammar`
* **Requirement ID:** `FR-GR-01`, `FR-GR-04`
* **Authentication:** Optional.
* **Purpose:** Lightweight fast check for grammar/spelling only without running corpus similarity.
* **Input Validation:** Max 20,000 characters.

### 2.3 Endpoint: Similarity Check Only
* **Path:** `POST /api/v1/analyze/similarity`
* **Requirement ID:** `FR-SM-01`, `FR-SM-02`
* **Authentication:** Optional.
* **Purpose:** Evaluates text shingles against indexed open-access corpus.

### 2.4 Endpoint: Session Purge (Zero-Retention)
* **Path:** `POST /api/v1/session/purge`
* **Requirement ID:** `FR-AU-01`, `FR-AU-03`
* **Authentication:** Optional (Session Token or ephemeral client token).
* **Purpose:** Erases any temporary analysis records, session caches, and memory states associated with the client.
* **Success Response (200 OK):**
```json
{
  "data": {
    "purged": true,
    "timestamp": "2026-10-15T06:10:00Z"
  }
}
```

---

## 3. P1 Post-MVP Endpoints (Authenticated Workspace)

| Method | Path | Req ID | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | `FR-AU-02` | Create user account with Argon2 hashed password |
| `POST` | `/api/v1/auth/login` | `FR-AU-02` | Authenticate and issue secure HTTP-only cookie |
| `POST` | `/api/v1/auth/logout` | `FR-AU-02` | Invalidate active session cookie |
| `GET` | `/api/v1/documents` | `FR-ED-01` | List active documents owned by the authenticated user |
| `POST` | `/api/v1/documents` | `FR-ED-01` | Save or update draft document |
| `DELETE`| `/api/v1/documents/:id` | `FR-AU-03` | Soft-delete document (with purge option) |
| `POST` | `/api/v1/analyze/paraphrase` | `FR-PR-01` | Academic tone rewrite preserving citations |

---

## 4. Rate Limiting, Idempotency & Privacy Constraints

### 4.1 Rate Limiting (Local & Edge)
* **Guest Users:** 10 requests per minute per IP.
* **Authenticated Users:** 30 requests per minute per user ID.
* Headers returned:
  * `X-RateLimit-Limit: 10`
  * `X-RateLimit-Remaining: 9`
  * `X-RateLimit-Reset: 1776239400`

### 4.2 Privacy-Safe Logging
* **Prohibited Log Data:** Request bodies, `text` parameters, and raw manuscript content MUST NEVER be passed to `console.log`, `winston`, `pino`, or APM.
* **Permitted Log Data:**
  ```json
  {
    "timestamp": "2026-10-15T06:10:15Z",
    "endpoint": "/api/v1/analyze/comprehensive",
    "status": 200,
    "durationMs": 420,
    "wordCount": 145,
    "clientIpHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```

---

## 5. Testing Requirements for API Handlers
1. **Unit Tests (Vitest):**
   * Payload validator rejects empty string (`text: ""`) with 400.
   * Payload validator rejects string with 20,001 characters with 400.
   * Offset normalizer properly aligns UTF-16 surrogate pairs.
2. **Integration Tests (Vitest / Supertest):**
   * When LanguageTool returns 500, endpoint returns 503 partial recovery without process crash.
   * When valid input is sent, response matches JSON schema strictly.
