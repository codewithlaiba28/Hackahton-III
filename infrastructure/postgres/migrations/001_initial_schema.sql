-- LearnFlow Database Schema
-- Migration 001: Initial Schema (Better Auth Compatible - TEXT IDs)

-- ==================== Users ====================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==================== Progress ====================
CREATE TABLE progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    mastery_score DECIMAL(5,2) DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
    status VARCHAR(50) NOT NULL DEFAULT 'beginner' CHECK (status IN ('beginner', 'learning', 'proficient', 'mastered')),
    exercises_completed INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_module_id ON progress(module_id);
CREATE INDEX idx_progress_status ON progress(status);

-- ==================== Exercises ====================
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    starter_code TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    hints TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_module_id ON exercises(module_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- ==================== Submissions ====================
CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    output TEXT,
    error TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error', 'timeout')),
    execution_time_ms DECIMAL(10,2),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_exercise_id ON submissions(exercise_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_executed_at ON submissions(executed_at);

-- ==================== Quizzes ====================
CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    total_questions INTEGER NOT NULL,
    passing_score DECIMAL(5,2) DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_module_id ON quizzes(module_id);

CREATE TABLE quiz_questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    order_index INTEGER NOT NULL
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

CREATE TABLE quiz_results (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);

-- ==================== Struggle Events ====================
CREATE TABLE struggle_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('repeated_error', 'stuck_timeout', 'low_quiz_score', 'failed_executions')),
    context JSONB NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_struggle_events_user_id ON struggle_events(user_id);
CREATE INDEX idx_struggle_events_event_type ON struggle_events(event_type);
CREATE INDEX idx_struggle_events_is_resolved ON struggle_events(is_resolved);

-- ==================== Chat Messages ====================
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);

-- ==================== Update Trigger Function ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== Materialized Views for Analytics ====================
CREATE MATERIALIZED VIEW student_dashboard AS
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(DISTINCT p.module_id) AS total_modules,
    AVG(p.mastery_score) AS avg_mastery_score,
    SUM(p.exercises_completed) AS total_exercises,
    SUM(p.quizzes_completed) AS total_quizzes,
    COUNT(DISTINCT CASE WHEN NOT se.is_resolved THEN se.id END) AS active_struggles
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
LEFT JOIN struggle_events se ON u.id = se.user_id
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.email;

CREATE INDEX idx_student_dashboard_user_id ON student_dashboard(user_id);

CREATE MATERIALIZED VIEW teacher_analytics AS
SELECT
    p.module_id,
    p.topic,
    COUNT(DISTINCT p.user_id) AS student_count,
    AVG(p.mastery_score) AS avg_mastery_score,
    MIN(p.mastery_score) AS min_mastery_score,
    MAX(p.mastery_score) AS max_mastery_score,
    COUNT(DISTINCT CASE WHEN p.status = 'beginner' THEN p.user_id END) AS beginners_count,
    COUNT(DISTINCT CASE WHEN p.status = 'learning' THEN p.user_id END) AS learning_count,
    COUNT(DISTINCT CASE WHEN p.status = 'proficient' THEN p.user_id END) AS proficient_count,
    COUNT(DISTINCT CASE WHEN p.status = 'mastered' THEN p.user_id END) AS mastered_count,
    COUNT(DISTINCT CASE WHEN NOT se.is_resolved THEN se.user_id END) AS struggling_students
FROM progress p
LEFT JOIN struggle_events se ON p.user_id = se.user_id AND NOT se.is_resolved
GROUP BY p.module_id, p.topic;

CREATE INDEX idx_teacher_analytics_module_id ON teacher_analytics(module_id);

-- ==================== Initial Data (Optional) ====================
-- Uncomment to insert sample data for testing
/*
INSERT INTO users (email, password_hash, name, role) VALUES
('student@example.com', '$2b$12$example_hash', 'Student User', 'student'),
('teacher@example.com', '$2b$12$example_hash', 'Teacher User', 'teacher');
*/
