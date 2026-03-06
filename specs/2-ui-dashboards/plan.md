# Implementation Plan: LearnFlow UI Dashboards

**Branch**: `2-ui-dashboards` | **Date**: 2026-03-02 | **Spec**: [specs/2-ui-dashboards/spec.md](../spec.md)
**Input**: Feature specification from `/specs/2-ui-dashboards/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Build AI-native UI dashboards for students and teachers with dark theme, color-coded mastery visualization, split-view learning workspace, and real-time analytics.

**Technical Approach**: 
- Use existing Next.js 14 frontend from Phase 1
- Implement UI components following constitution design tokens
- Monaco Editor integration for code workspace
- CSS-in-JS with design token system
- Real-time updates via Kafka consumers (future phase)

## Technical Context

**Language/Version**: TypeScript 5, React 18, Next.js 14
**Primary Dependencies**: Monaco Editor, Recharts (for graphs), Tailwind CSS (optional)
**Storage**: Local state (React Context/Zustand), API calls to backend
**Testing**: Jest, React Testing Library
**Target Platform**: Web browsers (Chrome, Firefox, Edge, Safari - last 2 versions)
**Project Type**: Frontend web application
**Performance Goals**:
- Page transitions <200ms
- 60fps animations
- First paint <1 second
- Time to interactive <3 seconds
**Constraints**:
- Dark theme only (no light mode for MVP)
- Responsive from 1366px to 3840px
- Accessibility WCAG 2.1 AA compliant
**Scale/Scope**:
- 8 core components (AIChatBubble, CodeEditorPanel, MasteryCard, etc.)
- 4 main pages (Student Dashboard, Learning Workspace, Teacher Dashboard, Progress)
- 2 user roles (Student, Teacher)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance Status | Notes |
|-----------|------------------|-------|
| I. Skills Are The Product | ✅ PASS | UI components will be reusable skills |
| II. Qwen CLI As Primary Agent | ✅ PASS | All prompts Qwen-compatible |
| III. MCP Code Execution Pattern | ✅ PASS | Component generation via scripts |
| IV. Local-First Development | ✅ PASS | npm run dev verification before K8s |
| V. AAIF Standards | ✅ PASS | Portable component structure |
| VI. Script-First Architecture | ✅ PASS | Component generation scripts |
| VII. Verification Gates | ✅ PASS | Visual regression tests planned |
| UI Design Constitution | ✅ PASS | All 7 principles satisfied |

**UI Design Constitution Compliance**:
- ✅ AI-Native Aesthetic (Linear, Vercel style)
- ✅ Dark Theme Default (#0B1220, #0A0F1C)
- ✅ Color Palette (AI Green #00C896, status colors)
- ✅ Monaco Editor First-Class
- ✅ Role-Specific Flows (Student/Teacher separate)
- ✅ Responsive Dev-Friendly (1366px to 4K)
- ✅ Performance-Safe Animations (150-300ms)

**GATE RESULT**: ✅ PASS - All principles satisfied, proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/2-ui-dashboards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── component-model.md   # Phase 1 output (component hierarchy)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-components.md # Component API contracts
└── tasks.md             # Phase 2 output
```

### Source Code (frontend directory)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── AIChatBubble.tsx
│   │   │   ├── CodeEditorPanel.tsx
│   │   │   ├── MasteryCard.tsx
│   │   │   ├── StruggleAlertCard.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── HeatmapGrid.tsx
│   │   │   ├── ActivityTimeline.tsx
│   │   │   └── AgentBadge.tsx
│   │   ├── dashboard/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── LearningWorkspace.tsx
│   │   │   └── ProgressPage.tsx
│   │   └── quiz/
│   │       ├── QuizInterface.tsx
│   │       └── QuestionCard.tsx
│   ├── pages/
│   │   ├── student/
│   │   │   ├── dashboard.tsx
│   │   │   ├── workspace.tsx
│   │   │   ├── progress.tsx
│   │   │   └── quiz.tsx
│   │   └── teacher/
│   │       ├── dashboard.tsx
│   │       └── student/[id].tsx
│   ├── styles/
│   │   ├── tokens.css       # Design tokens (colors, animations)
│   │   └── globals.css      # Global styles
│   ├── lib/
│   │   ├── theme.ts         # Theme configuration
│   │   ├── animations.ts    # Animation definitions
│   │   └── utils.ts         # Helper functions
│   └── contexts/
│       ├── AuthContext.tsx
│       └── MasteryContext.tsx
├── tests/
│   ├── components/
│   │   ├── AIChatBubble.test.tsx
│   │   ├── CodeEditorPanel.test.tsx
│   │   └── MasteryCard.test.tsx
│   └── pages/
│       ├── StudentDashboard.test.tsx
│       └── TeacherDashboard.test.tsx
└── public/
    └── assets/
```

**Structure Decision**: Component-based architecture with clear separation between UI components (reusable) and page components (route-specific). Design tokens in CSS for theme consistency.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all principles satisfied with standard React/Next.js patterns.

## Phase 0: Research & Technical Decisions

### Research Topics

1. **Monaco Editor Integration in Next.js 14**
   - Decision: Use @monaco-editor/react package with SSR disabled
   - Rationale: Official Monaco wrapper, easy integration, good performance
   - Alternatives: CodeMirror (rejected - less VS Code-like), custom iframe (rejected - complex)

2. **State Management for UI**
   - Decision: React Context + Zustand for global state
   - Rationale: Simple for MVP, easy to scale, minimal boilerplate
   - Alternatives: Redux (rejected - overkill), Jotai (rejected - less familiar)

3. **Charting Library for Progress Visualization**
   - Decision: Recharts for line charts and radial progress
   - Rationale: React-native, composable, good TypeScript support
   - Alternatives: Chart.js (rejected - less React-friendly), D3 (rejected - overkill)

4. **Animation Strategy**
   - Decision: CSS transitions + Framer Motion for complex animations
   - Rationale: Performance-safe, respects prefers-reduced-motion
   - Alternatives: GSAP (rejected - bundle size), pure CSS (rejected - limited control)

5. **Responsive Design Approach**
   - Decision: CSS Grid + Flexbox with container queries
   - Rationale: Modern approach, better than media queries for components
   - Alternatives: Bootstrap (rejected - too generic), Tailwind (considered - may add later)

**Output**: [research.md](./research.md)

## Phase 1: Design & Contracts

### Component Model

**Core UI Components**:

1. **AIChatBubble**
   - Props: message, agentType, timestamp, isUser
   - Renders: Chat bubble with agent badge, message text, inline code
   - States: loading, error, success

2. **CodeEditorPanel**
   - Props: initialCode, language, onRun, onSave, readOnly
   - Renders: Monaco editor, Run button, execution timer, sandbox indicator
   - States: editing, running, success, error

3. **MasteryCard**
   - Props: moduleName, masteryScore, status, trend
   - Renders: Module name, radial progress ring, color status, trend arrow
   - States: beginner, learning, proficient, mastered

4. **StruggleAlertCard**
   - Props: studentName, topic, failureCount, timestamp
   - Renders: Student name, topic, red glow border, failure count badge
   - States: new, acknowledged, resolved

5. **ProgressRing**
   - Props: percentage, size, color, animated
   - Renders: SVG ring with percentage, color based on status
   - States: static, animating

6. **HeatmapGrid**
   - Props: data (students × modules), colorScale
   - Renders: Grid with color intensity per cell
   - States: loading, empty, populated

7. **ActivityTimeline**
   - Props: activities (array)
   - Renders: Vertical timeline with activity cards
   - States: loading, empty, populated

8. **AgentBadge**
   - Props: agentType (Triage, Concepts, Debug, Exercise)
   - Renders: Colored pill with agent name and icon
   - States: active, inactive

**Output**: [component-model.md](./component-model.md)

### UI Component Contracts

**Component API**:

```typescript
// AIChatBubble.tsx
interface AIChatBubbleProps {
  message: string;
  agentType: 'triage' | 'concepts' | 'debug' | 'exercise';
  timestamp: string;
  isUser?: boolean;
  onRetry?: () => void;
}

// CodeEditorPanel.tsx
interface CodeEditorPanelProps {
  initialCode: string;
  language: 'python';
  onRun: (code: string) => Promise<ExecutionResult>;
  onSave?: (code: string) => void;
  readOnly?: boolean;
}

// MasteryCard.tsx
interface MasteryCardProps {
  moduleName: string;
  masteryScore: number; // 0-100
  status: 'beginner' | 'learning' | 'proficient' | 'mastered';
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}
```

**Output**: [contracts/ui-components.md](./contracts/ui-components.md)

### Quick Start Guide

```bash
# 1. Install dependencies
cd frontend
npm install @monaco-editor/react recharts framer-motion zustand

# 2. Run development server
npm run dev

# 3. Access dashboards
# Student: http://localhost:3000/student/dashboard
# Teacher: http://localhost:3000/teacher/dashboard

# 4. Test components
npm test

# 5. Build for production
npm run build
```

**Output**: [quickstart.md](./quickstart.md)

## Constitution Check (Post-Design)

*Re-evaluate after design complete*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Skills Are The Product | ✅ PASS | Components are reusable skills |
| II. Qwen CLI As Primary Agent | ✅ PASS | All scripts Qwen-compatible |
| III. MCP Code Execution | ✅ PASS | Component generation via scripts |
| IV. Local-First | ✅ PASS | npm run dev in quickstart |
| V. AAIF Standards | ✅ PASS | Portable component structure |
| VI. Script-First | ✅ PASS | Generation scripts included |
| VII. Verification Gates | ✅ PASS | Visual regression tests planned |
| UI Design Constitution | ✅ PASS | All 7 principles implemented |

**GATE RESULT**: ✅ PASS - Design satisfies all constitution principles

## Next Steps

1. Create [research.md](./research.md) - Phase 0 technical decisions
2. Create [component-model.md](./component-model.md) - Component hierarchy
3. Create [contracts/ui-components.md](./contracts/ui-components.md) - Component APIs
4. Create [quickstart.md](./quickstart.md) - Developer guide
5. Run `/sp.tasks` to generate implementation tasks

---

**Plan Status**: Ready for Phase 1 execution
**Artifacts Generated**: research.md, component-model.md, contracts/, quickstart.md
**Next Command**: `/sp.tasks` to break into implementation tasks
