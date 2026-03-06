# Feature Specification: LearnFlow UI Dashboards

**Feature Branch**: `2-ui-dashboards`
**Created**: 2026-03-02
**Status**: Draft
**Input**: AI-native platform UI with dark theme, student and teacher dashboards

## User Scenarios & Testing

### User Story 1 - Student Dashboard & Learning Workspace (Priority: P1)

Maya logs in and sees her personalized dashboard showing "Module 2: Loops - 60% complete" with a color-coded mastery ring (yellow). She clicks "Continue Learning" and enters the Learning Workspace. On the left, she chats with the AI tutor (green-accented bubbles showing "Handled by Concepts Agent"). On the right, the Monaco editor displays code with syntax highlighting. Below, the console shows output. She runs her code, sees a green success pulse, and her mastery ring updates to 68% (still yellow, closer to green).

**Why this priority**: This is the core user experience - students learning Python with AI assistance in a modern, developer-friendly interface. Without this flow, the platform feels like a generic educational tool.

**Independent Test**: Student can view dashboard, enter learning workspace, chat with AI, write and run code, and see mastery update - all without teacher features.

**Acceptance Scenarios**:

1. **Given** Maya is on the dashboard, **When** she views module progress, **Then** she sees color-coded mastery (Red 0-40%, Orange 41-70%, Green 71-90%, Blue 91-100%)
2. **Given** Maya enters the workspace, **When** she asks a question, **Then** AI response appears in green-accented bubble with agent badge
3. **Given** Maya writes code, **When** she clicks Run, **Then** output appears in console within 5 seconds with execution timer
4. **Given** Maya completes an exercise, **When** mastery updates, **Then** she sees a subtle animation and new percentage

---

### User Story 2 - Teacher Dashboard & Analytics (Priority: P2)

Mr. Rodriguez logs in and sees his class dashboard with a heatmap showing module mastery across 25 students. A red-glowing alert panel shows "James - List Comprehensions - 3 failed attempts". He clicks James's name and sees code attempt history with error frequency chart. He types "Generate easy exercises on list comprehensions" in the AI prompt box, selects "Easy" difficulty, previews 3 exercises, and assigns to James with one click.

**Why this priority**: Teacher features enable human intervention when AI detects struggle. The dashboard must surface insights quickly without overwhelming data.

**Independent Test**: Teacher can view class heatmap, see struggle alerts, view student detail, generate and assign exercises - without requiring student flow.

**Acceptance Scenarios**:

1. **Given** James struggles, **When** Mr. Rodriguez views dashboard, **Then** he sees red-glowing alert within 1 minute
2. **Given** Mr. Rodriguez clicks student name, **When** he views detail page, **Then** he sees code attempts, error chart, and AI insights
3. **Given** Mr. Rodriguez generates exercises, **When** he assigns to student, **Then** student receives notification immediately

---

### User Story 3 - Quiz & Progress Visualization (Priority: P3)

Students take quizzes with a minimal interface - timer in top-right, progress bar at top, MCQ and code questions. After submitting, they see a mastery update animation (ring fills from 65% to 72%, color changes yellow to green). On the progress page, they see topic mastery cards, a trend line graph showing improvement over time, streak tracker, and weak areas highlighted in orange.

**Why this priority**: Progress visualization provides motivation and insight. Quiz interface must be distraction-free for accurate assessment.

**Independent Test**: Quiz interface displays correctly, progress page shows accurate mastery data and trends.

**Acceptance Scenarios**:

1. **Given** student takes quiz, **When** they submit, **Then** they see score and mastery update animation within 2 seconds
2. **Given** student views progress page, **When** they have completed 5+ exercises, **Then** they see trend graph and mastery cards
3. **Given** student crosses mastery threshold, **When** status changes (e.g., 70% → 71%), **Then** ring color changes from Orange to Green

---

### Edge Cases

- What happens when AI response takes >10 seconds? **Show loading indicator with "Thinking..." animation, then deliver response**
- How does UI handle code execution errors? **Red highlight in console, error type badge, suggestion from Debug Agent**
- What if student has no progress data yet? **Show empty state with "Get Started" CTA and module selector**
- How are network interruptions shown? **Toast notification "Reconnecting...", auto-retry, preserve unsaved code**

## Requirements

### Functional Requirements

- **FR-001**: System MUST display student dashboard with module progress, mastery visualization, and recent activity
- **FR-002**: System MUST provide split-view learning workspace with AI chat (left) and Monaco editor (right)
- **FR-003**: AI chat bubbles MUST show agent badge (Triage=Blue, Concepts=Green, Debug=Red, Exercise=Purple)
- **FR-004**: Code editor MUST have syntax highlighting, line numbers, and "Run" button with green glow
- **FR-005**: Console output MUST display execution results, errors in red, with execution time badge
- **FR-006**: Mastery rings MUST use color coding: Red (0-40%), Orange (41-70%), Green (71-90%), Blue (91-100%)
- **FR-007**: Teacher dashboard MUST show class mastery heatmap with color intensity per module
- **FR-008**: Struggle alerts MUST have red glow and display student name, topic, and failure count
- **FR-009**: Student detail page MUST show code attempt history, error frequency chart, and AI insights
- **FR-010**: Exercise builder MUST have AI prompt box, difficulty selector, preview panel
- **FR-011**: Quiz interface MUST have timer, progress bar, MCQ and code question support
- **FR-012**: Progress page MUST display mastery cards, trend graph, streak tracker, weak area highlights
- **FR-013**: All hover states MUST have subtle green glow (#00C896 with 20% opacity)
- **FR-014**: Page transitions MUST use 200ms fade animation
- **FR-015**: UI MUST scale from 1366px laptop to 3840px 4K monitor without layout break

### Key Entities

- **MasteryCard**: Module/topic name, mastery percentage, color status, trend indicator
- **ActivityTimeline**: Timestamp, activity type, description, associated module
- **StruggleAlert**: Student name, topic, trigger type, failure count, timestamp
- **CodeAttempt**: Code snippet, output, error type, execution time, timestamp
- **AgentBadge**: Agent name, color code, role description

## Success Criteria

### Measurable Outcomes

- **SC-001**: Students can navigate from dashboard to learning workspace in under 2 seconds
- **SC-002**: AI chat responses appear with agent badge in under 10 seconds
- **SC-003**: Code execution results display in console within 5 seconds of clicking Run
- **SC-004**: Teachers can identify struggling students from dashboard in under 10 seconds
- **SC-005**: Quiz completion rate improves by 30% compared to text-based interfaces
- **SC-006**: 90% of students can accurately interpret their mastery level from color rings
- **SC-007**: UI maintains 60fps during page transitions on mid-range laptops (2020+)

## Assumptions

- Users have basic web literacy and understand chat interfaces
- Students are familiar with code editors (VS Code, etc.) or will learn quickly
- Teachers have at least basic Python knowledge to interpret AI insights
- All users have modern browsers (Chrome, Firefox, Edge, Safari - last 2 versions)
- Network connection is stable enough for real-time updates (1Mbps+ minimum)
- Monaco Editor loads from CDN with fallback for offline scenarios

## UI Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| bg-primary | #0B1220 | Main background |
| bg-surface | #111827 | Cards, panels |
| bg-card | #0F172A | Elevated cards |
| accent-primary | #00C896 | AI Green, CTAs |
| accent-hover | #00E6A8 | Hover states |
| text-primary | #E5E7EB | Main text |
| text-muted | #94A3B8 | Secondary text |
| border-soft | #1F2937 | Subtle borders |
| status-beginner | #EF4444 | Red (0-40%) |
| status-learning | #F59E0B | Orange (41-70%) |
| status-proficient | #10B981 | Green (71-90%) |
| status-mastered | #3B82F6 | Blue (91-100%) |

### Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| hover-glow | 150ms | ease-out | Button, card hover |
| page-transition | 200ms | ease-in-out | Route changes |
| button-click | 100ms | ease-out | Scale to 0.98 |
| mastery-update | 300ms | ease-out | Ring fill animation |
| error-shake | 200ms | ease-in-out | Invalid input |
| success-pulse | 400ms | ease-out | Success feedback |

### Components

- **AIChatBubble**: Message text, agent badge, timestamp, inline code
- **CodeEditorPanel**: Monaco editor, Run button, execution timer, sandbox indicator
- **MasteryCard**: Module name, radial progress, color status, trend arrow
- **StruggleAlertCard**: Student name, topic, failure count, red glow border
- **ProgressRing**: SVG ring, percentage, color based on status
- **HeatmapGrid**: Module × Students matrix, color intensity
- **ActivityTimeline**: Vertical line, timestamp, activity cards
- **AgentBadge**: Colored pill, agent name, icon
