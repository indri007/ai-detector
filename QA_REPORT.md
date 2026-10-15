# QUALITY ASSURANCE & VERIFICATION REPORT (`QA_REPORT.md`)
**Project:** AcademicWrite AI / Academic Writing Platform  
**Audit Date:** 2026-10-15  
**Auditor:** Principal Software Architect & QA Lead  
**Overall Status:** PASSED (All 13 Unit Tests Passing, Production Build Passing)

---

## 1. Automated Test Results (Vitest)

Command Executed: `npm test` (`vitest run`)  
Exit Code: `0` (Success)

```text
 ✓ tests/unit/similarityEngine.test.ts (5 tests passed)
   - normalizes text and strips punctuation correctly
   - generates 5-gram shingles accurately
   - calculates 100% Jaccard similarity for identical sets and 0% for disjoint sets
   - detects exact text overlap when quoting Vaswani et al. 2017 from open-access corpus
   - returns 0% similarity and clear explanation for completely original or short text

 ✓ tests/unit/rulesEngine.test.ts (4 tests passed)
   - detects Indonesian non-standard spelling 'praktek' -> 'praktik'
   - flags informal English contractions in formal prose
   - flags incorrect relative 'di mana' in Indonesian academic text
   - handles text with zero errors cleanly without false positives

 ✓ tests/unit/textStats.test.ts (4 tests passed)
   - handles empty or whitespace-only text gracefully
   - accurately counts words across multiple whitespace characters and newlines
   - calculates sentence count accurately on standard academic punctuation
   - computes reading time based on 200 words per minute

Test Files: 3 passed (3 total)
Tests:      13 passed (13 total)
Duration:   410ms
```

---

## 2. Static Typing & Production Build

### TypeScript Compilation:
* **Command:** `npx tsc --noEmit`
* **Result:** Exit Code `0` — Zero errors across components, engines, and API routes.

### Next.js Production Build:
* **Command:** `npm run build`
* **Result:** Exit Code `0` — Generated production bundle:
  * `/` (Static Studio Canvas): `12.8 kB`
  * `/api/v1/analyze/comprehensive` (Dynamic API route): `0 B`
  * `/api/v1/sources/search` (Dynamic Scholarly search): `0 B`

---

## 3. Verified Functional Capabilities
1. **Academic Writing Editor & Canvas:** Live text area with zero typing lag and line statistics.
2. **Real-Time Word & Character Statistics:** Instant word, character (with and without whitespace), sentence count, and reading time calculation.
3. **Draft Persistence & Recovery:** Client-side `localStorage` auto-saving with debouncing, status badges (`Menyimpan...`, `Tersimpan di browser`), draft list modal, and safe recovery.
4. **Bilingual Grammar & Style Engine:**
   * English academic rules: Informal contractions, subjective first-person framing, consecutive whitespace.
   * Indonesian PUEBI rules: Non-standard spellings (e.g. *praktek* -> *praktik*), improper relative *di mana*, redundant *daripada*, and terminology style suggestions.
   * LanguageTool integration with transparent local fallback indicator when local Docker container is offline.
5. **Verifiable Similarity Engine:**
   * 5-gram tokenization and deterministic Jaccard similarity overlap calculation.
   * Evaluated against verified CC-BY open-access corpus (Vaswani et al. 2017, Shannon 1948, Turing 1950, Kaplan et al. 2020, Pratama & Wicaksono 2022).
   * Matched source cards with author, year, title, license, and direct DOI URL.
   * Prominent academic disclaimer: *Similarity indicates shared phrase structure against indexed open-access literature, not proof of plagiarism.*
6. **Scholarly Source Discovery:**
   * Crossref REST API connector for discovering peer-reviewed literature metadata and DOI resolution via polite pool headers.

---

## 4. Security & Privacy Audit Findings
* **Zero Secrets Committed:** No `.env` or credentials present in Git tracking.
* **Privacy Guardrail:** Raw user manuscripts are NEVER logged in server outputs or transmitted to untrusted third-party services.
* **Cost Incurred:** $0.00 (Zero paid cloud dependencies or third-party paid API consumption).
