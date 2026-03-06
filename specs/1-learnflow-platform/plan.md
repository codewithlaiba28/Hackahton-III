# Implementation Plan: LearnFlow Platform

**Branch**: `1-learnflow-platform` | **Date**: 2026-03-02 | **Spec**: [specs/1-learnflow-platform/spec.md](../spec.md)
**Input**: Feature specification from `/specs/1-learnflow-platform/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Build an AI-powered Python tutoring platform where students learn through conversational AI agents, write and execute code, take quizzes, and track progress. Teachers monitor class performance and generate custom exercises.

**Technical Approach**: 
- Use existing Skills for all infrastructure (kafka-k8s-setup, postgres-k8s-setup, fastapi-dapr-agent, nextjs-k8s-deploy)
- Local-first development with Minikube
- MCP Code Execution pattern for all agent operations
- Event-driven microservices with Kafka and Dapr

## Technical Context

**Language/Version**: Python 3.11, TypeScript 5, Node.js 18
**Primary Dependencies**: FastAPI, Next.js 14, Dapr, Kafka, PostgreSQL
**Storage**: PostgreSQL (Neon DB for production, local for dev)
**Testing**: pytest (backend), Jest (frontend)
**Target Platform**: Web application (Kubernetes cluster)
**Project Type**: Web application (frontend + backend microservices)
**Performance Goals**: 
- AI response time <10 seconds
- Code execution result <5 seconds
- Support 100+ concurrent students
**Constraints**: 
- Local development on Minikube (4 CPU, 8GB RAM)
- Code execution timeout 5 seconds, memory 50MB
- No external cloud for MVP
**Scale/Scope**: 
- 8 Python curriculum modules
- 2 user types (student, teacher)
- 5 AI agents (Triage, Concepts, Debug, Exercise, Progress)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance Status | Notes |
|-----------|------------------|-------|
| I. Skills Are The Product | ✅ PASS | Will use existing skills: kafka-k8s-setup, postgres-k8s-setup, fastapi-dapr-agent, nextjs-k8s-deploy, mcp-code-execution |
| II. Qwen CLI As Primary Agent | ✅ PASS | All prompts will invoke Skills explicitly with Qwen CLI |
| III. MCP Code Execution Pattern | ✅ PASS | All heavy operations via scripts, minimal context usage |
| IV. Local-First Development | ✅ PASS | Minikube only, npm run dev verification before K8s |
| V. AAIF Standards | ✅ PASS | Skills portable across Claude Code, Goose, Codex |
| VI. Script-First Architecture | ✅ PASS | All operations in idempotent scripts with dry-run |
| VII. Verification Gates | ✅ PASS | Verification scripts for deployment and functionality |

**GATE RESULT**: ✅ PASS - All principles satisfied, proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/1-learnflow-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── api.yaml         # OpenAPI spec
│   └── events.yaml      # Kafka event schemas
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── services/
│   ├── triage-agent/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── k8s/
│   ├── concepts-agent/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── k8s/
│   ├── debug-agent/
│   ├── exercise-agent/
│   └── progress-agent/
├── shared/
│   ├── models.py
│   └── dapr_components/
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
├── public/
├── tests/
└── k8s/

infrastructure/
├── kafka/
│   └── topics/
├── postgres/
│   └── migrations/
└── helm/
    └── learnflow/
```

**Structure Decision**: Web application with backend microservices (5 AI agents) + Next.js frontend. Each agent is an independent FastAPI service with Dapr sidecar. Frontend is a single Next.js application with Monaco editor integration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all principles satisfied with standard architecture.

## Phase 0: Research & Technical Decisions

### Research Topics

1. **Dapr Pub/Sub with Kafka Integration**
   - Decision: Use Dapr's Kafka pubsub component
   - Rationale: Abstracts Kafka complexity, provides retry/resilience
   - Alternatives: Direct Kafka SDK (rejected - more complex)

2. **Code Execution Sandbox**
   - Decision: Docker-in-Docker with resource limits
   - Rationale: Isolated, secure, matches constitution constraints
   - Alternatives: Pyodide (rejected - limited library support)

3. **AI Agent Communication Pattern**
   - Decision: Event-driven via Kafka topics
   - Rationale: Loose coupling, async processing, audit trail
   - Alternatives: Direct HTTP (rejected - tight coupling)

4. **Progress Tracking Storage**
   - Decision: PostgreSQL with materialized views
   - Rationale: Real-time dashboards, complex queries
   - Alternatives: Redis (rejected - need persistence)

**Output**: [research.md](./research.md)

## Phase 1: Design & Contracts

### Data Model

**Entities**:

1. **User**
   - Fields: id (SERIAL), email (VARCHAR), name (VARCHAR), role (ENUM), created_at, updated_at
   - Relationships: One-to-many Progress, Submissions, QuizResults

2. **Progress**
   - Fields: id, user_id, module_id, topic, mastery_score (DECIMAL), status (ENUM), completed_at
   - Relationships: Many-to-one User

3. **Exercise**
   - Fields: id, title, description, module_id, difficulty (ENUM), starter_code, expected_output
   - Relationships: One-to-many Submissions

4. **Submission**
   - Fields: id, user_id, exercise_id, code, output, status (ENUM), executed_at
   - Relationships: Many-to-one User, Exercise

5. **QuizResult**
   - Fields: id, user_id, quiz_id, score, total_questions, completed_at
   - Relationships: Many-to-one User

6. **StruggleEvent**
   - Fields: id, user_id, event_type, context (TEXT), triggered_at, resolved_at
   - Relationships: Many-to-one User

**Validation Rules**:
- Mastery score: 0-100
- Status transitions: Beginner → Learning → Proficient → Mastered
- Code execution: 5s timeout, 50MB memory limit

**Output**: [data-model.md](./data-model.md)

### API Contracts

**REST Endpoints**:

```yaml
# Student APIs
POST /api/auth/login
GET  /api/dashboard
POST /api/chat              # Send message to AI tutor
POST /api/code/execute      # Run code in sandbox
POST /api/exercise/submit   # Submit exercise solution
GET  /api/progress          # Get mastery data
POST /api/quiz/submit       # Submit quiz answers

# Teacher APIs
GET  /api/teacher/dashboard
GET  /api/teacher/alerts    # Struggle alerts
POST /api/exercise/generate # Generate exercises
POST /api/exercise/assign   # Assign to student
GET  /api/teacher/student/:id # View student progress
```

**Kafka Topics**:

```yaml
learning.events:
  - user_id, event_type, timestamp, metadata

code.submissions:
  - user_id, exercise_id, code, output, status

exercise.completions:
  - user_id, exercise_id, score, time_spent

student.struggles:
  - user_id, trigger_type, context, severity

progress.updates:
  - user_id, module_id, new_mastery, status_change
```

**Output**: [contracts/api.yaml](./contracts/api.yaml), [contracts/events.yaml](./contracts/events.yaml)

### Quick Start Guide

```bash
# 1. Local Development
npm install
npm run dev
# Verify: Frontend loads at localhost:3000, APIs respond

# 2. Deploy Infrastructure (Use Skills)
# Use kafka-k8s-setup skill
./scripts/deploy-kafka.sh

# Use postgres-k8s-setup skill
./scripts/deploy-postgres.sh
./scripts/run-migration.py

# 3. Deploy Services
# Use fastapi-dapr-agent skill for each agent
./scripts/deploy-service.sh triage-agent
./scripts/deploy-service.sh concepts-agent
# ... repeat for all agents

# 4. Deploy Frontend
# Use nextjs-k8s-deploy skill
./scripts/deploy-frontend.sh

# 5. Verify
kubectl get pods -n learnflow
kubectl port-forward svc/frontend 3000:80
```

**Output**: [quickstart.md](./quickstart.md)

## Constitution Check (Post-Design)

*Re-evaluate after design complete*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Skills Are The Product | ✅ PASS | Plan uses 7 existing skills |
| II. Qwen CLI As Primary Agent | ✅ PASS | All scripts Qwen-compatible |
| III. MCP Code Execution | ✅ PASS | Scripts for all operations |
| IV. Local-First | ✅ PASS | Minikube in quickstart |
| V. AAIF Standards | ✅ PASS | Portable skill structure |
| VI. Script-First | ✅ PASS | All ops in scripts |
| VII. Verification Gates | ✅ PASS | Verify scripts included |

**GATE RESULT**: ✅ PASS - Design satisfies all constitution principles

## Next Steps

1. Create [research.md](./research.md) - Phase 0 technical decisions
2. Create [data-model.md](./data-model.md) - Database schema
3. Create [contracts/](./contracts/) - API specifications
4. Create [quickstart.md](./quickstart.md) - Developer guide
5. Run `/sp.tasks` to generate implementation tasks

---

**Plan Status**: Ready for Phase 1 execution
**Artifacts Generated**: research.md, data-model.md, contracts/, quickstart.md
**Next Command**: `/sp.tasks` to break into implementation tasks
