# ENVIRONMENT AUDIT REPORT (`ENVIRONMENT_AUDIT.md`)
**Project:** Academic Writing Intelligence Platform (`academic-writing-platform`)  
**Workspace Path:** `/Users/jevin/AI CHECKER`  
**Audit Timestamp:** 2026-10-15 13:08 WIB  
**Auditor:** Principal Software Architect & QA Lead  
**Audit Phase:** Phase 1 — Environment (Steps 1 & 2)

---

## 1. System & Hardware Specifications

| Component | Detected Specification | Required Baseline | Evaluation |
| :--- | :--- | :--- | :--- |
| **Operating System** | macOS Sequoia 15.3.1 (`Darwin 24.3.0`) | macOS 12+ / Linux | **PASSED** |
| **Architecture / Chip** | Apple Silicon (`arm64`, T6041 / M-Series) | 64-bit x86 or ARM64 | **PASSED** |
| **Storage Availability** | 926 GiB total, 847 GiB used, **34 GiB available (97% used)** | >= 15 GiB | **WARNING** (Low headroom, cache discipline required) |
| **Memory / Architecture** | Unified Memory Architecture (Apple Silicon) | >= 8 GB RAM | **PASSED** |

---

## 2. Tooling, Runtimes & Dependency Audit

| Tool / Runtime | Installed Version | Binary Path | Daemon / Service Status | Evaluation |
| :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `v26.5.0` | `/opt/homebrew/bin/node` | Active | **PASSED** (Exceeds Next.js >= 20.9 requirement) |
| **npm** | `11.17.0` | `/opt/homebrew/bin/npm` | Active | **PASSED** |
| **Git** | `2.55.0` | `/opt/homebrew/bin/git` | Initialized (`main` branch) | **PASSED** |
| **Docker CLI** | `29.1.3 (build f52814d)` | `/usr/local/bin/docker` | **Daemon Stopped** | **DEPENDENCY INACTIVE** (Docker Desktop not running) |
| **PostgreSQL CLI** | `psql 14.20 (Homebrew)` | `/opt/homebrew/bin/psql` | **Daemon Stopped** (Port 5432 no response) | **SERVICE STOPPED** (Binary present, service inactive) |
| **Python** | `3.9.6` | `/usr/bin/python3` | Active | **PASSED** |
| **Java Runtime** | Not located | N/A | Missing | **NOT INSTALLED** (Relevant if running LanguageTool natively) |

---

## 3. Analysis of Missing Dependencies & Service States (Step 2)

Before installing or running any software, here is the factual status of prerequisites:

### 3.1 Docker Daemon
* **Status:** Docker CLI is installed (`29.1.3`), but the Docker daemon socket (`/Users/jevin/.docker/run/docker.sock`) is not running.
* **Impact:** Any Docker container commands (e.g., containerized PostgreSQL or containerized LanguageTool) will fail until the user launches Docker Desktop or starts the daemon.
* **Resolution Path:** Start Docker Desktop application on macOS when containerized services are required.

### 3.2 PostgreSQL Service
* **Status:** `psql` 14.20 binary is installed via Homebrew, but `pg_isready` reports no response on port 5432.
* **Impact:** Relational database storage cannot connect locally until either:
  1. Local brew service is started (`brew services start postgresql@14`), OR
  2. A PostgreSQL Docker container is launched once Docker Desktop is running, OR
  3. The Phase 4 local MVP runs initial tests statelessly in memory before database integration.
* **Recommendation:** Keep MVP Phase 4 decoupled so the text editor, word counter, and analysis algorithms can be developed and unit-tested in-memory first without blocking on database daemons.

### 3.3 Java Runtime (JRE)
* **Status:** No local Java runtime found (`Unable to locate a Java Runtime`).
* **Impact:** LanguageTool cannot be run as a standalone local `.jar` file directly on macOS without installing OpenJDK.
* **Resolution Path:** Run LanguageTool inside a Docker container (standard `erikvl87/languagetool` image) to eliminate the need for polluting the host machine with a native Java installation.

### 3.4 Storage Headroom Warning
* **Status:** 34 GiB free out of 926 GiB (97% utilized).
* **Mitigation:** We must avoid downloading massive AI model weights (e.g., multi-gigabyte HuggingFace models) or heavy Docker images locally. All dependencies must be lean and auditable.

---

## 4. Phase 1 Verification Verdict
* **Environment Audit:** Complete.
* **Zero Unapproved Installations:** No automatic software, packages, or background daemons have been installed or modified.
* **Current Status:** Phase 1 (Steps 1 & 2) successfully verified. Awaiting owner review to proceed to Phase 2 (Creation of governance & requirements documents).
