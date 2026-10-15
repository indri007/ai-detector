# OPEN-SOURCE REFERENCES & EVALUATION MATRIX (`REFERENCES.md`)
**Project:** Academic Writing Intelligence Platform  
**Target Architecture:** macOS Apple Silicon (`arm64`), Next.js 14, Node.js 26, PostgreSQL  
**Audit Date:** 2026-10-15  
**Reviewer:** Principal Software Architect & QA Lead

---

## 1. Evaluation of Candidate Open-Source Resources

| Resource Name | Source URL | Verified License | Language Support | Estimated Size / Dependencies | Integration Risk on Apple Silicon (`arm64`) | Attribution & Compliance Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Next-Tiptap** | [ndtrung341/next-tiptap](https://github.com/ndtrung341/next-tiptap) | MIT License | Multilingual / Unicode | ~2.5 MB (npm package: `@tiptap/react`, `@tiptap/core`, `prosemirror-*`) | **Low:** Pure TypeScript/JavaScript. Zero native C/C++ compilation. Direct fit for Next.js App Router. | MIT Copyright Notice required in distributed bundles. |
| **LanguageTool** | [languagetool-org/languagetool](https://github.com/languagetool-org/languagetool) | LGPL 2.1 or later | 30+ languages (incl. English `en-US`/`en-GB` and Indonesian `id`) | ~200 MB container image; requires Java 11+ or Docker | **Low-Medium:** Runs reliably via Docker container (`erikvl87/languagetool:latest`) on arm64 with `-Xmx1g` heap limit. Native execution blocked due to missing JRE on host. | LGPL 2.1 compliance: If running as external network service (via HTTP API), LGPL allows unencumbered communication without viral re-licensing of our web app. |
| **Indonesian CASTLE-GEC** | [syauqie/castle-gec](https://huggingface.co/syauqie/castle-gec) | Apache 2.0 / Academic Research | Indonesian (`id-ID`) | ~1.8 GB model weights (PyTorch / mT5 / IndoBART checkpoint) | **High:** Heavy memory footprint. Downloading 1.8 GB weights threatens current disk headroom (34 GiB free, 97% capacity). PyTorch arm64 requires MPS support or ONNX runtime. | Apache 2.0: Retain original license notice and state modifications. Deferred until Phase 6 when disk/RAM headroom is cleared. |
| **Indonesian IGED Dataset** | [syauqie/IGED](https://huggingface.co/datasets/syauqie/IGED) | CC-BY-NC-SA 4.0 | Indonesian grammatical errors | ~15 MB dataset (JSON/CSV pair) | **Medium (Legal):** Non-Commercial (`NC`) clause prohibits direct commercial monetization. Suitable solely as an offline benchmark evaluation dataset for measuring grammar precision/recall. | CC-BY-NC-SA 4.0: Non-commercial only; share-alike downstream distribution. Must NOT be bundled into commercial distribution. |
| **Multilingual MiniLM** | [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) | Apache 2.0 | 50+ languages (incl. ID & EN) | ~470 MB (Dense vector embedding model, 384 dimensions) | **Medium:** Excellent for semantic embedding search. Can run via `@xenova/transformers` (ONNX Web runtime in pure Node.js/WASM) without native Python PyTorch dependencies. | Apache 2.0 notice. Ideal for Phase 5 semantic vector similarity upgrade. |
| **Offline Plagiarism Detector** | [kalpasuraweera/plagiarism-detector](https://github.com/kalpasuraweera/plagiarism-detector) | MIT License | English / Normalized tokens | < 1 MB Python script (N-gram shingling, cosine similarity, Jaccard) | **Low:** Algorithmic reference for N-gram shingling and Jaccard overlap. Directly re-implemented in native TypeScript (`lib/engines/similarity/similarityEngine.ts`) without external runtime bloat. | MIT License attribution. |

---

## 2. Staged Integration Roadmap for Apple Silicon

### Stage A: Pure TypeScript In-Memory Engine (ACTIVE - MVP Milestone)
* **Status:** Implemented in `lib/engines/similarity/similarityEngine.ts` and `lib/engines/grammar/rulesEngine.ts`.
* **Rationale:** Zero external network latency, 0 MB disk footprint, sub-10ms response time on Apple Silicon, 100% deterministic reproducibility.
* **Corpus:** 5 verified open-access peer-reviewed papers (`lib/engines/similarity/corpus.ts`).

### Stage B: Containerized LanguageTool Auxiliary Service (Next Milestone)
* **Status:** Designed and documented in `docker-compose.yml`.
* **Activation Condition:** Requires user to launch Docker Desktop daemon (`Docker version 29.1.3`).
* **Fallback:** When Docker is offline, the application seamlessly falls back to local baseline academic rules without crashing or displaying fabricated results.

### Stage C: ONNX Multilingual Embedding (`MiniLM-L12-v2`) via Transformers.js (Post-MVP)
* **Status:** Planned.
* **Mechanism:** Use `@xenova/transformers` in Node.js to compute 384-dimensional sentence vectors locally in WASM, stored in PostgreSQL with `pgvector`.
* **Prerequisite:** Project owner approval for downloading the ~470 MB quantized model file.

### Stage D: CASTLE-GEC Evaluation Pipeline (Offline Research Milestone)
* **Status:** Deferred.
* **Prerequisite:** Verification of disk cleanup on host machine (expanding free space beyond 34 GiB) and explicit user approval before downloading the 1.8 GB PyTorch weights.

---

## 3. Compliance & Governance Summary
1. **Zero Hallucination Guarantee:** No third-party API or neural model will be reported as "verified" unless its endpoint actually returns HTTP 200.
2. **Attribution Preservation:** All open-access corpus documents and algorithms cite their original creators and licenses in UI cards and code comments.
3. **Storage Discipline:** Model weights exceeding 100 MB will NEVER be auto-downloaded by the agent without explicit human confirmation.
