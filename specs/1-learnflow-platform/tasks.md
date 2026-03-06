# Tasks: LearnFlow Platform

**Input**: Design documents from `/specs/1-learnflow-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not included in this task list. Add manually if TDD approach requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:

- **Backend**: `backend/services/<agent-name>/`, `backend/shared/`
- **Frontend**: `frontend/src/`, `frontend/public/`
- **Infrastructure**: `infrastructure/kafka/`, `infrastructure/postgres/`, `infrastructure/helm/`
- **Scripts**: `.claude/skills/*/scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create repository structure: backend/, frontend/, infrastructure/, .claude/skills/
- [X] T002 Initialize Node.js project in frontend/ with Next.js 14 dependencies
- [X] T003 Initialize Python projects for each agent service in backend/services/
- [X] T004 [P] Configure ESLint and Prettier in frontend/.eslintrc.json
- [X] T005 [P] Configure Black formatter and Flake8 in backend/services/*/requirements.txt
- [X] T006 Create .gitignore for Node.js and Python projects
- [X] T007 Create root README.md with project overview

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Use kafka-k8s-setup skill: Deploy Kafka to Minikube
  - Run: `.claude/skills/kafka-k8s-setup/scripts/deploy-kafka.sh`
  - Verify: `.claude/skills/kafka-k8s-setup/scripts/verify-kafka.py`
- [ ] T009 Use kafka-k8s-setup skill: Create Kafka topics
  - Run: `.claude/skills/kafka-k8s-setup/scripts/create-topics.py`
- [ ] T010 Use postgres-k8s-setup skill: Deploy PostgreSQL to Minikube
  - Run: `.claude/skills/postgres-k8s-setup/scripts/deploy-postgres.sh`
  - Verify: `.claude/skills/postgres-k8s-setup/scripts/verify-postgres.py`
- [ ] T011 Use postgres-k8s-setup skill: Run database migrations
  - Run: `.claude/skills/postgres-k8s-setup/scripts/run-migration.py`
- [ ] T012 [P] Create shared Python models in backend/shared/models.py
  - User, Progress, Exercise, Submission, QuizResult, StruggleEvent classes
- [ ] T013 [P] Create Dapr pubsub component configuration in backend/shared/dapr_components/pubsub.yaml
- [ ] T014 [P] Create Dapr statestore component in backend/shared/dapr_components/statestore.yaml
- [ ] T015 Create authentication middleware in backend/shared/auth.py
  - JWT token generation and validation
  - User role extraction (student/teacher)
- [ ] T016 Create environment configuration in backend/services/.env.template
  - Database connection strings
  - Kafka broker addresses
  - OpenAI API key placeholder
- [ ] T017 Create Dockerfile template for FastAPI services in backend/services/Dockerfile.template
- [ ] T018 Create Dockerfile for Next.js frontend using nextjs-k8s-deploy skill
  - Run: `.claude/skills/nextjs-k8s-deploy/scripts/generate-dockerfile.py ../../frontend`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Learning Experience (Priority: P1) 🎯 MVP

**Goal**: Students can log in, ask AI tutor questions, write and execute code, and see progress updates

**Independent Test**: Student can complete full learning loop (login → ask → code → execute → see progress) without teacher features

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create User model in backend/shared/models.py
  - Fields: id, email, name, role, created_at, updated_at
- [ ] T020 [P] [US1] Create Progress model in backend/shared/models.py
  - Fields: id, user_id, module_id, topic, mastery_score, status, completed_at
- [ ] T021 [P] [US1] Create Exercise model in backend/shared/models.py
  - Fields: id, title, description, module_id, difficulty, starter_code, expected_output
- [ ] T022 [P] [US1] Create Submission model in backend/shared/models.py
  - Fields: id, user_id, exercise_id, code, output, status, executed_at
- [ ] T023 [P] [US1] Create QuizResult model in backend/shared/models.py
  - Fields: id, user_id, quiz_id, score, total_questions, completed_at
- [ ] T024 Use fastapi-dapr-agent skill: Generate triage-agent service structure
  - Run: `.claude/skills/fastapi-dapr-agent/scripts/generate-service.py triage-agent`
- [ ] T025 Use fastapi-dapr-agent skill: Generate concepts-agent service structure
  - Run: `.claude/skills/fastapi-dapr-agent/scripts/generate-service.py concepts-agent`
- [ ] T026 [US1] Implement Triage Agent in backend/services/triage-agent/main.py
  - Route queries: "explain" → Concepts, "error" → Debug, "exercise" → Exercise
  - POST /api/chat endpoint
- [ ] T027 [US1] Implement Concepts Agent in backend/services/concepts-agent/main.py
  - Generate Python explanations with code examples
  - Integrate OpenAI API for natural language responses
  - POST /api/chat endpoint
- [ ] T028 [US1] Create code execution sandbox script in backend/services/concepts-agent/scripts/execute_code.py
  - Docker-based execution with 5s timeout, 50MB memory limit
  - Returns: output, error, execution_time, status
- [ ] T029 [US1] Implement code execution endpoint in backend/services/concepts-agent/main.py
  - POST /api/code/execute
  - Calls execute_code.py script via MCP pattern
- [ ] T030 Use nextjs-k8s-deploy skill: Create frontend structure
  - Run: `.claude/skills/nextjs-k8s-deploy/scripts/generate-dockerfile.py ../../frontend`
- [ ] T031 [P] [US1] Create ChatInterface component in frontend/src/components/ChatInterface.tsx
  - Message input, AI response display, code example rendering
- [ ] T032 [P] [US1] Create CodeEditor component in frontend/src/components/CodeEditor.tsx
  - Monaco Editor integration for Python code
  - Run button, output display panel
- [ ] T033 [P] [US1] Create Dashboard page in frontend/src/pages/dashboard.tsx
  - Module progress overview, recent activity
- [ ] T034 [US1] Create login page in frontend/src/pages/login.tsx
  - Email/password form, JWT token storage
- [ ] T035 [US1] Implement API service layer in frontend/src/services/api.ts
  - login(), sendChatMessage(), executeCode(), submitExercise()
- [ ] T036 [US1] Create student dashboard page in frontend/src/pages/student/dashboard.tsx
  - Module cards with mastery scores and status colors
- [ ] T037 [US1] Implement progress tracking in backend/services/progress-agent/main.py
  - Calculate mastery scores (exercises 40%, quizzes 30%, code quality 20%, consistency 10%)
  - GET /api/progress endpoint
- [ ] T038 [US1] Create Kafka producer for code.submissions topic in backend/services/concepts-agent/scripts/publish_submission.py
- [ ] T039 [US1] Create Kafka producer for progress.updates topic in backend/services/progress-agent/scripts/publish_update.py
- [ ] T040 [US1] Implement local development verification
  - Run: `npm run dev` in frontend/
  - Start all backend services
  - Verify: Frontend loads, APIs respond, no console errors

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently
- Student can log in
- Ask AI tutor questions
- Write and execute code
- See progress updates

---

## Phase 4: User Story 2 - Teacher Analytics & Intervention (Priority: P2)

**Goal**: Teachers can view class analytics, receive struggle alerts, and generate custom exercises

**Independent Test**: Teacher can view dashboard, see alerts, generate and assign exercises without student flow

### Implementation for User Story 2

- [ ] T041 [P] [US2] Create StruggleEvent model in backend/shared/models.py
  - Fields: id, user_id, event_type, context, triggered_at, resolved_at
- [ ] T042 Use fastapi-dapr-agent skill: Generate exercise-agent service structure
  - Run: `.claude/skills/fastapi-dapr-agent/scripts/generate-service.py exercise-agent`
- [ ] T043 Use fastapi-dapr-agent skill: Generate debug-agent service structure
  - Run: `.claude/skills/fastapi-dapr-agent/scripts/generate-service.py debug-agent`
- [ ] T044 [US2] Implement struggle detection in backend/services/debug-agent/main.py
  - Detect: same error 3+ times, stuck >10 min, quiz <50%, 5+ failed executions
  - Publish to student.struggles Kafka topic
- [ ] T045 [US2] Create struggle alert consumer in backend/services/debug-agent/scripts/consume_struggles.py
  - Listen to code.submissions topic
  - Trigger struggle events based on patterns
- [ ] T046 [US2] Implement Exercise Agent in backend/services/exercise-agent/main.py
  - Generate custom exercises via OpenAI API
  - POST /api/exercise/generate endpoint
- [ ] T047 [US2] Create teacher dashboard page in frontend/src/pages/teacher/dashboard.tsx
  - Class analytics, module breakdown, struggling students list
- [ ] T048 [US2] Create struggle alerts page in frontend/src/pages/teacher/alerts.tsx
  - Real-time alert list with student name, topic, issue
- [ ] T049 [US2] Implement exercise generation UI in frontend/src/components/ExerciseGenerator.tsx
  - Topic input, difficulty selector, generate button
- [ ] T050 [US2] Implement exercise assignment in backend/services/exercise-agent/main.py
  - POST /api/exercise/assign endpoint
  - Send notification to student
- [ ] T051 [US2] Create notification system in backend/services/shared/notification.py
  - In-app notifications for students
  - Email notification placeholder
- [ ] T052 [US2] Create teacher API routes in frontend/src/services/teacherApi.ts
  - getDashboard(), getAlerts(), generateExercises(), assignExercise()
- [ ] T053 [US2] Implement Kafka consumer for progress.updates in backend/services/progress-agent/scripts/consume_progress.py
  - Update materialized views for teacher dashboard

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently
- Student flow complete (US1)
- Teacher flow complete (US2)

---

## Phase 5: User Story 3 - Progress Tracking & Mastery Visualization (Priority: P3)

**Goal**: Comprehensive progress dashboards with color-coded mastery levels for students and class analytics for teachers

**Independent Test**: Dashboards display accurate mastery data when students have completed exercises and quizzes

### Implementation for User Story 3

- [ ] T054 [P] [US3] Create database materialized view in backend/shared/migrations/002_student_dashboard.sql
  - Student dashboard view with avg mastery per module
- [ ] T055 [P] [US3] Create database materialized view in backend/shared/migrations/003_teacher_analytics.sql
  - Class analytics view with aggregate performance
- [ ] T056 [US3] Implement mastery calculation service in backend/services/progress-agent/services/mastery_calculator.py
  - Weighted average: exercises 40%, quizzes 30%, code quality 20%, consistency 10%
  - Status thresholds: Beginner 0-40%, Learning 41-70%, Proficient 71-90%, Mastered 91-100%
- [ ] T057 [US3] Create ProgressChart component in frontend/src/components/ProgressChart.tsx
  - Color-coded module mastery visualization
  - Radar chart or bar chart per module
- [ ] T058 [US3] Update student dashboard in frontend/src/pages/student/dashboard.tsx
  - Add mastery chart component
  - Color-coded status badges
- [ ] T059 [US3] Create class analytics component in frontend/src/pages/teacher/dashboard.tsx
  - Module-by-module breakdown
  - Struggling student count per module
- [ ] T060 [US3] Implement quiz system in backend/services/exercise-agent/main.py
  - POST /api/quiz/submit endpoint
  - Auto-grade multiple choice questions
- [ ] T061 [US3] Create quiz submission consumer in backend/services/progress-agent/scripts/consume_quiz_results.py
  - Update mastery scores based on quiz performance
- [ ] T062 [US3] Implement status change notifications in backend/services/shared/notification.py
  - Notify when student crosses mastery threshold (e.g., Learning → Proficient)
- [ ] T063 [US3] Add refresh mechanism for materialized views in backend/services/progress-agent/scripts/refresh_views.py
  - Run on schedule or after progress updates

**Checkpoint**: All user stories should now be independently functional
- US1: Student learning experience ✅
- US2: Teacher analytics & intervention ✅
- US3: Progress tracking & visualization ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T064 [P] Create comprehensive documentation in docs/
  - Architecture overview
  - API documentation from contracts/api.yaml
  - Event schemas from contracts/events.yaml
- [ ] T065 [P] Create quickstart guide using specs/1-learnflow-platform/quickstart.md
- [ ] T066 Code cleanup and refactoring across all services
- [ ] T067 Performance optimization:
  - Database query optimization
  - Frontend bundle size reduction
  - Monaco Editor lazy loading
- [ ] T068 Security hardening:
  - Input validation on all endpoints
  - Rate limiting for API calls
  - CORS configuration
- [ ] T069 Create integration test suite in backend/tests/integration/
  - Test user journey: login → chat → code → progress
  - Test teacher journey: dashboard → alerts → generate → assign
- [ ] T070 Create frontend test suite in frontend/tests/
  - Component tests for ChatInterface, CodeEditor, Dashboard
  - E2E tests with Playwright or Cypress
- [ ] T071 Set up CI/CD pipeline in .github/workflows/ci.yml
  - Run tests on PR
  - Build Docker images
  - Deploy to Minikube
- [ ] T072 Run quickstart.md validation
  - Follow Phase 1: Local Development
  - Follow Phase 2: Kubernetes Deployment
  - Verify all checkmarks complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP ready after completion
- **User Story 2 (Phase 4)**: Depends on Foundational - can run parallel with US3
- **User Story 3 (Phase 5)**: Depends on Foundational - can run parallel with US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T004, T005 can run in parallel
- **Foundational Phase**: T012, T013, T014 can run in parallel
- **User Story 1**: T019, T020, T021, T022, T023 (models) can run in parallel
- **User Story 1**: T031, T032, T033 (frontend components) can run in parallel
- **User Story 2**: T041 (model) can run in parallel with service generation
- **User Story 3**: T054, T055 (database views) can run in parallel
- **Cross-Story**: Once Foundational complete, US1, US2, US3 can proceed in parallel with different developers

---

## Parallel Example: User Story 1

```bash
# Launch all model creation tasks together:
Task: "T019 [P] [US1] Create User model in backend/shared/models.py"
Task: "T020 [P] [US1] Create Progress model in backend/shared/models.py"
Task: "T021 [P] [US1] Create Exercise model in backend/shared/models.py"
Task: "T022 [P] [US1] Create Submission model in backend/shared/models.py"
Task: "T023 [P] [US1] Create QuizResult model in backend/shared/models.py"

# Launch all frontend components together:
Task: "T031 [P] [US1] Create ChatInterface component in frontend/src/components/ChatInterface.tsx"
Task: "T032 [P] [US1] Create CodeEditor component in frontend/src/components/CodeEditor.tsx"
Task: "T033 [P] [US1] Create Dashboard page in frontend/src/pages/dashboard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T018) - CRITICAL gate
3. Complete Phase 3: User Story 1 (T019-T040)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Student can log in
   - Ask AI tutor questions
   - Write and execute code
   - See progress updates
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T019-T040)
   - Developer B: User Story 2 (T041-T053)
   - Developer C: User Story 3 (T054-T063)
3. Stories complete and integrate independently
4. Team reunites for Polish phase (T064-T072)

---

## Task Summary

| Phase | Tasks | Count |
| ----- | ----- | ----- |
| Phase 1: Setup | T001-T007 | 7 |
| Phase 2: Foundational | T008-T018 | 11 |
| Phase 3: User Story 1 | T019-T040 | 22 |
| Phase 4: User Story 2 | T041-T053 | 13 |
| Phase 5: User Story 3 | T054-T063 | 10 |
| Phase 6: Polish | T064-T072 | 9 |
| **Total** | | **72** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use existing Skills for all infrastructure operations
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
