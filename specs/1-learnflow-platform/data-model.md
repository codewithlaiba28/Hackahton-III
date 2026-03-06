# Data Model: LearnFlow Platform

**Created**: 2026-03-02
**Purpose**: Define data entities, relationships, and validation rules

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ email       │
│ name        │
│ role        │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┬──────────────────┐
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Progress  │   │  Submission │   │  QuizResult │   │StruggleEvent│
├─────────────┤   ├─────────────┤   ├─────────────┤   ├─────────────┤
│ id          │   │ id          │   │ id          │   │ id          │
│ user_id     │   │ user_id     │   │ user_id     │   │ user_id     │
│ module_id   │   │ exercise_id │   │ quiz_id     │   │ event_type  │
│ topic       │   │ code        │   │ score       │   │ context     │
│ mastery_... │   │ output      │   │ total_...   │   │ triggered_..│
│ status      │   │ status      │   │ completed_..│   │ resolved_at │
│ completed_..│   │ executed_.. │   └─────────────┘   └─────────────┘
└─────────────┘   └─────────────┘
                         ▲
                         │
                         │
                  ┌─────────────┐
                  │  Exercise   │
                  ├─────────────┤
                  │ id          │
                  │ title       │
                  │ description │
                  │ module_id   │
                  │ difficulty  │
                  │ starter_... │
                  │ expected_...│
                  └─────────────┘
```

---

## Entity Definitions

### User

**Purpose**: Represents students and teachers in the platform.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email for login |
| name | VARCHAR(255) | NOT NULL | Display name |
| role | ENUM | NOT NULL, CHECK (role IN ('student', 'teacher')) | User type |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last profile update |

**Relationships**:
- One-to-many: Progress (students only)
- One-to-many: Submission (students only)
- One-to-many: QuizResult (students only)
- One-to-many: StruggleEvent (students only)

---

### Progress

**Purpose**: Track student mastery across Python curriculum modules.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → User(id) | Student reference |
| module_id | VARCHAR(50) | NOT NULL | Module identifier (module-1 to module-8) |
| topic | VARCHAR(255) | NOT NULL | Specific topic within module |
| mastery_score | DECIMAL(5,2) | CHECK (0 <= mastery_score <= 100) | Weighted mastery percentage |
| status | ENUM | DEFAULT 'beginner', CHECK (status IN ('beginner', 'learning', 'proficient', 'mastered')) | Mastery level |
| completed_at | TIMESTAMP | NULLABLE | When topic was mastered |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |

**Validation Rules**:
- `mastery_score` calculated as: `(exercises * 0.4) + (quizzes * 0.3) + (code_quality * 0.2) + (consistency * 0.1)`
- `status` derived from `mastery_score`:
  - 0-40% → 'beginner' (Red)
  - 41-70% → 'learning' (Yellow)
  - 71-90% → 'proficient' (Green)
  - 91-100% → 'mastered' (Blue)

**Relationships**:
- Many-to-one: User

---

### Exercise

**Purpose**: Coding challenges for students to practice Python concepts.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Exercise title |
| description | TEXT | NOT NULL | Problem description |
| module_id | VARCHAR(50) | NOT NULL | Associated module |
| difficulty | ENUM | CHECK (difficulty IN ('easy', 'medium', 'hard')) | Difficulty level |
| starter_code | TEXT | NOT NULL | Initial code template |
| expected_output | TEXT | NOT NULL | Expected program output |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Validation Rules**:
- `starter_code` must be valid Python syntax
- `expected_output` used for automated testing

**Relationships**:
- One-to-many: Submission

---

### Submission

**Purpose**: Record student code attempts and execution results.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → User(id) | Student reference |
| exercise_id | INTEGER | FOREIGN KEY → Exercise(id) | Exercise reference |
| code | TEXT | NOT NULL | Student's submitted code |
| output | TEXT | NULLABLE | Program execution output |
| status | ENUM | CHECK (status IN ('pending', 'success', 'error')) | Execution result |
| executed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |

**Validation Rules**:
- Code execution timeout: 5 seconds
- Memory limit: 50MB
- `status` = 'success' if output matches expected_output

**Relationships**:
- Many-to-one: User, Exercise

---

### QuizResult

**Purpose**: Store quiz scores and completion data.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → User(id) | Student reference |
| quiz_id | VARCHAR(100) | NOT NULL | Quiz identifier |
| score | INTEGER | NOT NULL, CHECK (score >= 0) | Correct answers |
| total_questions | INTEGER | NOT NULL, CHECK (total_questions > 0) | Total questions |
| completed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Completion timestamp |

**Validation Rules**:
- `score` cannot exceed `total_questions`
- Quiz contributes 30% to mastery calculation

**Relationships**:
- Many-to-one: User

---

### StruggleEvent

**Purpose**: Track detected struggle instances for teacher intervention.

| Field | Type | Constraints | Description |
| ----- | ---- | ----------- | ----------- |
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → User(id) | Student reference |
| event_type | VARCHAR(100) | NOT NULL | Trigger type |
| context | TEXT | NOT NULL | Additional context (error messages, code attempts) |
| triggered_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When struggle detected |
| resolved_at | TIMESTAMP | NULLABLE | When struggle was resolved |

**Validation Rules**:
- `event_type` values:
  - 'same_error_repeated' (3+ times)
  - 'stuck_timeout' (>10 minutes)
  - 'low_quiz_score' (<50%)
  - 'verbal_struggle' ("I don't understand")
  - 'failed_executions' (5+ in a row)
- Auto-alert teacher if not resolved within 15 minutes

**Relationships**:
- Many-to-one: User

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_module ON progress(module_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_exercise ON submissions(exercise_id);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX idx_struggle_events_user ON struggle_events(user_id);
CREATE INDEX idx_struggle_events_unresolved ON struggle_events(user_id) WHERE resolved_at IS NULL;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## Materialized Views

### Student Dashboard View

```sql
CREATE MATERIALIZED VIEW student_dashboard AS
SELECT 
  u.id AS user_id,
  u.name,
  u.email,
  m.module_id,
  m.module_name,
  AVG(p.mastery_score) AS avg_mastery,
  COUNT(DISTINCT p.topic) AS topics_completed,
  CASE 
    WHEN AVG(p.mastery_score) >= 91 THEN 'Mastered'
    WHEN AVG(p.mastery_score) >= 71 THEN 'Proficient'
    WHEN AVG(p.mastery_score) >= 41 THEN 'Learning'
    ELSE 'Beginner'
  END AS overall_status
FROM users u
CROSS JOIN modules m
LEFT JOIN progress p ON u.id = p.user_id AND p.module_id = m.module_id
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.email, m.module_id, m.module_name
ORDER BY u.id, m.module_id;
```

### Teacher Analytics View

```sql
CREATE MATERIALIZED VIEW teacher_analytics AS
SELECT 
  m.module_id,
  m.module_name,
  COUNT(DISTINCT s.user_id) AS total_students,
  AVG(s.avg_mastery) AS class_avg_mastery,
  COUNT(DISTINCT CASE WHEN s.overall_status = 'Mastered' THEN s.user_id END) AS mastered_count,
  COUNT(DISTINCT CASE WHEN s.overall_status = 'Beginner' THEN s.user_id END) AS struggling_count,
  COUNT(se.id) AS active_struggles
FROM modules m
CROSS JOIN student_dashboard s
LEFT JOIN struggle_events se ON s.user_id = se.user_id AND se.resolved_at IS NULL
GROUP BY m.module_id, m.module_name
ORDER BY m.module_id;
```

---

## State Transitions

### Progress Status Flow

```
[New Student]
      │
      ▼
  Beginner (0-40%)
      │
      ├── Complete exercises ──► Learning (41-70%)
      │                              │
      │                              ├── Pass quizzes ──► Proficient (71-90%)
      │                              │                       │
      │                              │                       ├── Master exercises ──► Mastered (91-100%)
      │                              │                       │
      │                              │                       ◄─── Struggle detected
      │                              │
      │                              ◄─── Low quiz scores
      │
      ◄─── Failed submissions
```

---

## Migration Strategy

### Phase 1: Core Tables
```sql
-- 1. Create users table
-- 2. Create progress table
-- 3. Create exercises table
```

### Phase 2: Interaction Tables
```sql
-- 1. Create submissions table
-- 2. Create quiz_results table
-- 3. Create struggle_events table
```

### Phase 3: Performance
```sql
-- 1. Create indexes
-- 2. Create materialized views
-- 3. Seed sample data
```

---

## Next Steps

1. ✅ Data model complete
2. Generate API contracts (contracts/api.yaml)
3. Generate event schemas (contracts/events.yaml)
4. Create database migration scripts
