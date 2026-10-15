# QUALITY ASSURANCE & TEST PLAN (`QA_TEST_PLAN.md`)
**Project:** Academic Writing Intelligence Platform  
**Target Coverage:** Core Engines (100% unit), API Contracts (100% integration), Critical User Flows (E2E)  
**Status:** Approved Specification  
**Lead:** QA Lead & Test Architect

---

## 1. Test Strategy & Testing Pyramid

```text
         ▲
        / \     [E2E Tests: Playwright]
       /   \    - Critical User Journey (Typing -> Analysis -> Highlights -> Suggestion Applied)
      /-----\   
     /       \  [Integration Tests: Vitest + Supertest]
    /         \ - API Endpoint Validation, Offset Harmonization, Error Fallbacks
   /-----------\
  /             \ [Unit Tests: Vitest]
 /               \- Text Tokenization, N-Gram Shingling, MinHash Calculation, Jaccard Similarity
-------------------
```

---

## 2. Test Suites & Verification Matrix

### 2.1 Unit Tests (`tests/unit/`)
* **`tokenizer.test.ts`:**
  * Validates punctuation stripping, lowercase conversion, and stopword handling.
  * Validates boundary edge cases: empty strings, pure whitespace, strings with only emojis.
  * Validates multilingual text (Indonesian diacritics and accented loanwords).
* **`shingler.test.ts`:**
  * Validates 5-gram token extraction.
  * Ensures texts with `< 5` tokens produce graceful fallback without index out of bounds.
* **`minhash.test.ts`:**
  * Verifies deterministic Jaccard similarity estimation against identical texts (must be 100%).
  * Verifies disjoint texts produce 0% overlap.
* **`offsetTracker.test.ts`:**
  * Tests that character replacement at `[start, end]` correctly offsets subsequent findings.
  * Tests multi-byte UTF-16 characters (e.g., mathematical symbols, emojis) to ensure offsets do not shift off by one.

### 2.2 Integration Tests (`tests/integration/`)
* **`apiAnalyze.test.ts`:**
  * Tests `POST /api/v1/analyze/comprehensive`:
    * Valid payload (1,000 words) returns 200 with both grammar and similarity blocks.
    * Empty text payload returns 400 `INVALID_INPUT_LENGTH`.
    * 20,001 character payload returns 400 with descriptive error detail.
    * Unsupported language code (`"fr-FR"`) returns 400 `UNSUPPORTED_LANGUAGE`.
* **`resilience.test.ts`:**
  * Simulates LanguageTool container being down (`ECONNREFUSED` on port 8010).
  * Asserts endpoint returns HTTP 200 with `grammar.status: "engine_unavailable"`, while similarity results remain intact.

### 2.3 End-to-End Browser Tests (`tests/e2e/`)
* **`editorFlow.spec.ts` (Playwright):**
  * Launches application at `http://localhost:3000`.
  * Pastes text with deliberate grammar mistakes: *"The students is writing their thesis yesterday."*
  * Verifies word counter increments accurately.
  * Clicks "Run Check" button.
  * Waits for red decoration highlight to appear on canvas.
  * Clicks red decoration; verifies suggestion popover appears.
  * Clicks replacement pill; verifies canvas text updates to *"The students were writing their thesis yesterday."*
  * Verifies highlight decoration clears.

---

## 3. Similarity Evaluation Methodology

### 3.1 Benchmark Dataset Provenance
* An evaluation benchmark consisting of 10 synthesized test manuscripts with known percentage overlaps (0%, 25%, 50%, 75%, 100%) against the 25 indexed open-access papers.
* Ground Truth:
  * Exact precision and recall are computed against character-level shingle boundaries.
  * Expected tolerance: Calculated similarity must be within `± 2.0%` of ground truth shingle overlap.

---

## 4. Release-Blocking Defect Criteria
The release is **BLOCKED** if any of the following occur:
1. Any Vitest unit or integration test fails.
2. Character offset drift: Applying a suggestion corrupts text or replaces the wrong word span.
3. Memory leak: Successive checks on 3,000-word texts cause Node.js heap to exceed 512MB.
4. Security flaw: Raw document text detected in application logs.
5. Critical accessibility failure: Suggestion popovers cannot be closed via `Escape` key.
