# Tasks: LearnFlow UI Dashboards

**Input**: Design documents from `/specs/2-ui-dashboards/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Tests are OPTIONAL - not included in this task list. Add manually if TDD approach requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:

- **Frontend**: `frontend/src/`
- **Components**: `frontend/src/components/`
- **Pages**: `frontend/src/pages/`
- **Styles**: `frontend/src/styles/`
- **Lib**: `frontend/src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design token setup

- [X] T001 Install UI dependencies: tailwindcss, shadcn/ui primitives, lucide-react
- [X] T002 [P] Create design tokens in frontend/src/styles/globals.css
  - Colors: bg-primary, bg-surface, accent-primary, status colors
  - Animations: fade-in, slide-in, accordion
  - Spacing: via Tailwind
- [X] T003 [P] Create theme configuration in frontend/tailwind.config.js
- [X] T004 [P] Create animation definitions in tailwind.config.js
- [X] T005 Create AppShell layout component in frontend/src/components/layout/AppShell.tsx
  - Sidebar navigation
  - Top bar with user menu
  - Main content area
- [ ] T006 Setup routing structure in frontend/src/pages/
  - /student/dashboard
  - /student/workspace
  - /student/progress
  - /teacher/dashboard
  - /teacher/student/[id]

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create AgentBadge component in frontend/src/components/ui/AgentBadge.tsx
  - Props: agentType (triage, concepts, debug, exercise)
  - Colors: Blue, Green, Red, Purple
- [X] T008 [P] Create ProgressRing component in frontend/src/components/ui/ProgressRing.tsx
  - Props: percentage, size, color, animated
  - SVG ring with percentage display
- [X] T009 [P] Create MasteryCard component in frontend/src/components/ui/MasteryCard.tsx
  - Props: moduleName, masteryScore, status, trend
  - Uses ProgressRing, color status
- [ ] T010 [P] Create AIChatBubble component in frontend/src/components/ui/AIChatBubble.tsx
  - Props: message, agentType, timestamp, isUser
  - Includes AgentBadge, inline code rendering
- [ ] T011 [P] Create CodeEditorPanel component in frontend/src/components/ui/CodeEditorPanel.tsx
  - Props: initialCode, language, onRun, onSave
  - Monaco Editor integration, Run button, execution timer
- [ ] T012 [P] Create console output component in frontend/src/components/ui/ConsoleOutput.tsx
  - Props: output, error, executionTime, status
  - Error highlighting in red, success in green
- [ ] T013 Create AuthContext in frontend/src/contexts/AuthContext.tsx
  - User authentication state
  - Role-based routing (student/teacher)
- [ ] T014 Create MasteryContext in frontend/src/contexts/MasteryContext.tsx
  - Global mastery state with Zustand
  - updateMastery function
  - Module progress tracking

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Dashboard & Learning Workspace (Priority: P1) 🎯 MVP

**Goal**: Students can view dashboard, chat with AI tutor, write and run code, see mastery updates

**Independent Test**: Student can complete full learning loop (dashboard → workspace → chat → code → mastery update) without teacher features

### Implementation for User Story 1

- [X] T015 [P] [US1] Create StudentDashboard page in frontend/src/pages/student/dashboard.tsx
  - Welcome panel
  - Module progress grid with MasteryCards
  - Recent activity timeline
- [ ] T016 [P] [US1] Create ActivityTimeline component in frontend/src/components/ui/ActivityTimeline.tsx
  - Props: activities array
  - Vertical timeline with timestamps
- [ ] T017 [US1] Create LearningWorkspace page in frontend/src/pages/student/workspace.tsx
  - Split layout: AI Chat (left) + Monaco Editor (right)
  - Console output panel at bottom
- [ ] T018 [US1] Implement AI chat interface in frontend/src/components/chat/ChatInterface.tsx
  - Message input with send button
  - Chat history with AIChatBubble components
  - Loading indicator for AI responses
  - Agent badge display on each response
- [ ] T019 [US1] Integrate Monaco Editor in LearningWorkspace
  - Dynamic import with SSR disabled
  - Python language support
  - Dark theme configuration
- [ ] T020 [US1] Implement code execution flow in frontend/src/components/ui/CodeEditorPanel.tsx
  - Run button with green glow
  - API call to backend execute endpoint
  - Display output in ConsoleOutput
  - Execution timer badge
- [ ] T021 [US1] Implement mastery update animation in frontend/src/components/ui/MasteryCard.tsx
  - Framer Motion for ring fill animation
  - Color transition on status change
  - Percentage counter animation
- [ ] T022 [US1] Add empty state for new students in frontend/src/components/dashboard/EmptyState.tsx
  - "Get Started" CTA
  - Module selector
  - Encouraging message
- [ ] T023 [US1] Implement responsive layout for LearningWorkspace
  - Desktop: Split view (1fr 1fr)
  - Tablet: Stacked layout
  - Mobile: Single column with tabs
- [ ] T024 [US1] Add hover effects with green glow
  - Buttons: box-shadow with accent-primary
  - Cards: subtle scale and glow
  - All transitions 150ms ease-out
- [ ] T025 [US1] Implement page transitions
  - 200ms fade animation on route change
  - Framer Motion AnimatePresence

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently
- Student dashboard displays module progress
- Learning workspace with AI chat and code editor
- Code execution with console output
- Mastery update animations working

---

## Phase 4: User Story 2 - Teacher Dashboard & Analytics (Priority: P2)

**Goal**: Teachers can view class analytics, see struggle alerts, generate and assign exercises

**Independent Test**: Teacher can view class heatmap, identify struggling students, generate exercises, and assign to student

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create HeatmapGrid component in frontend/src/components/ui/HeatmapGrid.tsx
  - Props: data (students × modules), colorScale
  - Color intensity per cell
  - Hover tooltip with details
- [ ] T027 [P] [US2] Create StruggleAlertCard component in frontend/src/components/ui/StruggleAlertCard.tsx
  - Props: studentName, topic, failureCount, timestamp
  - Red glow border
  - Failure count badge
- [ ] T028 [US2] Create TeacherDashboard page in frontend/src/pages/teacher/dashboard.tsx
  - Class mastery heatmap
  - Struggle alerts panel
  - Recent activity feed
  - Quick "Generate Exercise" button
- [ ] T029 [US2] Implement struggle alerts panel in frontend/src/components/teacher/StruggleAlertsPanel.tsx
  - List of StruggleAlertCard components
  - Red glow animation for new alerts
  - Filter by status (new, acknowledged, resolved)
- [ ] T030 [US2] Create StudentDetail page in frontend/src/pages/teacher/student/[id].tsx
  - Code attempt history
  - Error frequency chart (Recharts)
  - AI-generated insights summary
  - Assign exercise modal
- [ ] T031 [US2] Create ExerciseBuilder component in frontend/src/components/teacher/ExerciseBuilder.tsx
  - AI prompt input box
  - Difficulty selector (Easy, Medium, Hard)
  - Preview panel with generated exercises
  - Assign to class CTA
- [ ] T032 [US2] Implement error frequency chart in frontend/src/components/charts/ErrorFrequencyChart.tsx
  - Bar chart with Recharts
  - Error types on X-axis, count on Y-axis
  - Color-coded by error severity
- [ ] T033 [US2] Create AssignExerciseModal in frontend/src/components/teacher/AssignExerciseModal.tsx
  - Student selector
  - Due date picker
  - Message input
  - Submit button
- [ ] T034 [US2] Implement AI exercise generation flow
  - API call to backend generate endpoint
  - Loading state with skeleton
  - Preview of 3 generated exercises
  - Select and assign workflow
- [ ] T035 [US2] Add notification system for students
  - Toast notifications
  - Badge count in navigation
  - Mark as read functionality

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently
- Student flow complete (US1)
- Teacher dashboard with heatmap and alerts (US2)
- Exercise generation and assignment (US2)

---

## Phase 5: User Story 3 - Quiz & Progress Visualization (Priority: P3)

**Goal**: Quiz interface with timer, progress tracking with trend graphs and mastery cards

**Independent Test**: Quiz displays correctly, progress page shows accurate mastery data and trends

### Implementation for User Story 3

- [ ] T036 [P] [US3] Create QuizInterface component in frontend/src/components/quiz/QuizInterface.tsx
  - Timer in top-right
  - Progress bar at top
  - Question display area
  - Submit button
- [ ] T037 [P] [US3] Create QuestionCard component in frontend/src/components/quiz/QuestionCard.tsx
  - MCQ support with radio buttons
  - Code question mode with Monaco editor
  - Next/Previous navigation
- [ ] T038 [US3] Create QuizPage in frontend/src/pages/student/quiz.tsx
  - Quiz state management
  - Timer countdown
  - Auto-submit on timeout
- [ ] T039 [US3] Implement mastery update animation after quiz submit
  - Modal with score display
  - Mastery ring animation (before → after)
  - Color change on status threshold crossed
- [ ] T040 [US3] Create ProgressPage in frontend/src/pages/student/progress.tsx
  - Topic mastery cards grid
  - Trend line graph (Recharts)
  - Streak tracker
  - Weak area highlights
- [ ] T041 [US3] Create TrendGraph component in frontend/src/components/charts/TrendGraph.tsx
  - Line chart with Recharts
  - Time on X-axis, mastery on Y-axis
  - Color-coded by module
- [ ] T042 [US3] Create StreakTracker component in frontend/src/components/progress/StreakTracker.tsx
  - Fire icon with count
  - Visual calendar heatmap
  - Current streak vs best streak
- [ ] T043 [US3] Implement weak area highlighting
  - Orange border on low mastery topics
  - "Practice Recommended" badge
  - Link to relevant exercises
- [ ] T044 [US3] Add responsive layout for ProgressPage
  - Grid layout for mastery cards
  - Responsive chart sizing
  - Mobile-friendly streak display

**Checkpoint**: All user stories should now be independently functional
- US1: Student learning experience ✅
- US2: Teacher analytics & intervention ✅
- US3: Quiz & progress visualization ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T045 [P] Refine all animations to match constitution
  - Hover: 150ms ease-out
  - Page transitions: 200ms fade
  - Mastery update: 300ms ease-out
  - Button click: scale 0.98, 100ms
- [ ] T046 [P] Implement responsive design for all pages
  - Test at 1366px, 1920px, 2560px, 3840px
  - Container queries where supported
  - Fallback to media queries
- [ ] T047 [P] Add accessibility features
  - ARIA labels on all interactive elements
  - Keyboard navigation support
  - Focus indicators with accent-primary
  - Screen reader announcements
- [ ] T048 [P] Implement prefers-reduced-motion support
  - CSS media query for reduced motion
  - Disable non-essential animations
  - Maintain functionality
- [ ] T049 Performance optimization
  - Code splitting for routes
  - Lazy load Monaco Editor
  - Memoize expensive components (HeatmapGrid, TrendGraph)
  - Virtual scrolling for long lists
- [ ] T050 [P] Add loading states and skeletons
  - Dashboard loading skeleton
  - Chat message loading indicator
  - Editor loading state
- [ ] T051 [P] Implement error boundaries
  - React ErrorBoundary for each page
  - Graceful error messages
  - Retry functionality
- [ ] T052 [P] Add visual regression tests
  - Playwright screenshots for all pages
  - Compare against baselines
  - CI integration
- [ ] T053 Documentation updates
  - Component Storybook (optional)
  - README with component usage
  - Design token documentation

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

- Models/components before pages
- Core components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T002, T003, T004 can run in parallel
- **Foundational Phase**: T007, T008, T009, T010, T011, T012 can run in parallel (different components)
- **User Story 1**: T015, T016 can run in parallel
- **User Story 2**: T026, T027 can run in parallel
- **User Story 3**: T036, T037 can run in parallel
- **Cross-Story**: Once Foundational complete, US1, US2, US3 can proceed in parallel with different developers
- **Polish Phase**: T045, T046, T047, T048 can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all UI component creation tasks together:
Task: "T007 [P] Create AgentBadge component in frontend/src/components/ui/AgentBadge.tsx"
Task: "T008 [P] Create ProgressRing component in frontend/src/components/ui/ProgressRing.tsx"
Task: "T009 [P] Create MasteryCard component in frontend/src/components/ui/MasteryCard.tsx"
Task: "T010 [P] Create AIChatBubble component in frontend/src/components/ui/AIChatBubble.tsx"
Task: "T011 [P] Create CodeEditorPanel component in frontend/src/components/ui/CodeEditorPanel.tsx"
Task: "T012 [P] Create ConsoleOutput component in frontend/src/components/ui/ConsoleOutput.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T014) - CRITICAL gate
3. Complete Phase 3: User Story 1 (T015-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Student dashboard displays
   - Learning workspace functional
   - AI chat working with agent badges
   - Code editor runs code
   - Mastery updates animate
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
   - Developer A: User Story 1 (T015-T025)
   - Developer B: User Story 2 (T026-T035)
   - Developer C: User Story 3 (T036-T044)
3. Stories complete and integrate independently
4. Team reunites for Polish phase (T045-T053)

---

## Task Summary

| Phase | Tasks | Count |
| ----- | ----- | ----- |
| Phase 1: Setup | T001-T006 | 6 |
| Phase 2: Foundational | T007-T014 | 8 |
| Phase 3: User Story 1 | T015-T025 | 11 |
| Phase 4: User Story 2 | T026-T035 | 10 |
| Phase 5: User Story 3 | T036-T044 | 9 |
| Phase 6: Polish | T045-T053 | 9 |
| **Total** | | **53** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow constitution design tokens strictly
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
