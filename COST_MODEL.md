# OPERATIONAL COST MODEL (`COST_MODEL.md`)
**Project:** Academic Writing Intelligence Platform  
**Target:** Predictable, Minimized Operational Overhead  
**Status:** Approved Specification  
**Role:** Project Director & DevOps Engineer

---

## 1. Local Development Cost: $0.00 / Month

During local development, all components execute on the developer's workstation:
* **Web & API Framework:** Next.js (Open Source MIT License) — $0.
* **Database:** PostgreSQL (Open Source PostgreSQL License) — $0.
* **Grammar Engine:** LanguageTool Container (LGPL 2.1 License) — $0.
* **Third-Party APIs:** Zero external paid API calls in P0 MVP — $0.

---

## 2. Cloud Hosting & Production Cost Projections

| Infrastructure Tier | Component | Technology / Provider | Free Tier Allowance | Estimated Monthly Cost (Low Usage: < 1k docs/mo) | Estimated Monthly Cost (Normal Usage: 10k docs/mo) | High Scale (> 50k docs/mo) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Compute (Web/API)** | Next.js Container | Google Cloud Run / VPS | 2M requests/mo free | $0.00 (within free tier) | $5.00 - $12.00 | $25.00 - $45.00 |
| **Compute (Grammar)** | LanguageTool | Cloud Run (2 vCPU, 2GB) | 2M requests/mo free | $0.00 - $4.00 (CPU active) | $15.00 - $28.00 | $50.00 - $90.00 |
| **Database** | PostgreSQL 14+ | Managed Cloud SQL / Supabase | 500MB free / Tiny VPS | $0.00 (Free tier / Low VPS) | $10.00 - $25.00 | $50.00 - $100.00 |
| **Egress / Bandwidth** | Text payloads | Cloud Run / CDN | 100 GB/mo free | $0.00 | $1.00 | $5.00 |
| **Domain & SSL** | Custom Domain | Let's Encrypt / Cloudflare | Automated free SSL | $12.00 / year (~$1/mo) | $1.00 / mo | $1.00 / mo |
| **TOTAL ESTIMATE** | | | | **~$1.00 - $5.00 / mo** | **~$32.00 - $67.00 / mo** | **~$131.00 - $241.00 / mo**|

---

## 3. Cost-Per-Analysis Unit Economics

* **Grammar Check (1,000 words):**
  * Local: $0.000.
  * Cloud Run compute execution: ~300ms @ 2 vCPU = **$0.00007 per check**.
* **Similarity Check (1,000 words against 50 corpus papers):**
  * Trigram query + MinHash comparison: ~150ms DB CPU = **$0.00004 per check**.
* **Total Marginal Infrastructure Cost per Analysis:** **< $0.0002 (Less than 1/50th of a cent)**.

---

## 4. Cost Risks & Governance Guardrails

1. **Risk: Unbounded Public Scraping / Bot Abuse:**
   * *Mitigation:* Hard rate limits enforced per IP (10 checks/minute). Maximum payload capped at 20,000 characters.
2. **Risk: Cloud Run Concurrency Memory Bloat:**
   * *Mitigation:* Set maximum instances ceiling (`max-instances: 3`) on Cloud Run to enforce a hard budget cap ($30/month maximum limit).
3. **Risk: Proprietary Commercial API Creep:**
   * *Mitigation:* Under `RULES.md`, no developer or automated agent may bind a paid third-party API (OpenAI, Anthropic, commercial LanguageTool Premium) without explicit owner written approval.
