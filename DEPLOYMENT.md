# DEPLOYMENT & OPERATIONS RUNBOOK (`DEPLOYMENT.md`)
**Project:** Academic Writing Intelligence Platform  
**Target Environments:** Local Development (Active) | Staging / Cloud Run (Future)  
**Status:** Approved Specification  
**Lead:** DevOps & Infrastructure Engineer

---

## 1. Local Development Setup (Current Active Target)

### 1.1 Prerequisites Verification
Before running locally, verify:
* Node.js `>= 20.9.0` (`node -v`)
* npm `>= 10.0.0` (`npm -v`)
* Docker Desktop installed and running (for LanguageTool & PostgreSQL containers)

### 1.2 Local Services Configuration (`docker-compose.yml`)
To run PostgreSQL and LanguageTool locally without installing Java on macOS:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: awp_postgres
    environment:
      POSTGRES_USER: awp_user
      POSTGRES_PASSWORD: awp_local_password
      POSTGRES_DB: academic_writing_db
    ports:
      - "5432:5432"
    volumes:
      - awp_pgdata:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d

  languagetool:
    image: erikvl87/languagetool:latest
    container_name: awp_languagetool
    environment:
      - Java_Xms=512m
      - Java_Xmx=1g
    ports:
      - "8010:8010"

volumes:
  awp_pgdata:
```

### 1.3 Local Startup Commands
```bash
# 1. Start auxiliary containers (when Docker Desktop is running)
docker compose up -d

# 2. Install dependencies
npm install

# 3. Start Next.js development server
npm run dev

# 4. Access application at http://localhost:3000
```

---

## 2. Environment Variables & Secret Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Required Variables:
| Variable Name | Purpose | Local Default Value | Production Source |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `development` | Container environment |
| `PORT` | Web server port | `3000` | Cloud Run `$PORT` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://awp_user:awp_local_password@localhost:5432/academic_writing_db` | Secret Manager |
| `LANGUAGETOOL_API_URL`| LanguageTool endpoint | `http://localhost:8010/v2` | Internal Service VPC URL |
| `NEXT_PUBLIC_APP_URL` | Public origin | `http://localhost:3000` | Custom Domain |

> [!CAUTION]
> Never commit `.env` or `.env.local` to Git. Ensure they are listed in `.gitignore`.

---

## 3. Production Deployment Plan (Future — Subject to Approval)

### 3.1 Containerization (`Dockerfile`)
Multi-stage build for minimal production image footprint:
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### 3.2 Pre-Deployment Checklist (Human Approval Gate)
- [ ] All Vitest unit and integration tests passing (`npm test`).
- [ ] Production build succeeds without error (`npm run build`).
- [ ] No uncommitted files or dirty working tree (`git status`).
- [ ] Database migrations tested on staging instance.
- [ ] Zero secrets in committed codebase verified via pre-push audit.
- [ ] Written approval granted by project owner for deployment target and billing.

### 3.3 Rollback Procedures
* **Web App Rollback (Cloud Run):**
  `gcloud run services update-traffic academic-writing-platform --to-revisions=PREVIOUS_REVISION_TAG=100`
* **Database Rollback:**
  Run the corresponding down migration script in `migrations/rollback/`.
