#!/usr/bin/env python3
"""
Database Migration Script for LearnFlow

Creates initial database schema for the LearnFlow platform.
Executes via MCP code execution pattern - minimal tokens in context.
"""

import subprocess
import sys


# SQL Migration for LearnFlow
MIGRATION_SQL = """
-- LearnFlow Database Schema

-- Users table (students and teachers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning progress tracking
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    module_id VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    mastery_score DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'beginner',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id, topic)
);

-- Coding exercises
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    starter_code TEXT,
    expected_output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code submissions
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    exercise_id INTEGER REFERENCES exercises(id),
    code TEXT NOT NULL,
    output TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'success', 'error')),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz results
CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    quiz_id VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Struggle detection events
CREATE TABLE IF NOT EXISTS struggle_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    context TEXT,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_struggle_events_user ON struggle_events(user_id);

-- Insert sample data
INSERT INTO users (email, name, role) VALUES 
    ('maya@student.com', 'Maya', 'student'),
    ('james@student.com', 'James', 'student'),
    ('rodriguez@teacher.com', 'Mr. Rodriguez', 'teacher')
ON CONFLICT (email) DO NOTHING;

INSERT INTO exercises (title, description, module_id, difficulty, starter_code) VALUES
    ('For Loop Basics', 'Write a for loop that prints numbers 1 to 10', 'module-2', 'easy', 'for i in range(1, 11):\n    print(i)'),
    ('List Comprehension', 'Create a list of squares using list comprehension', 'module-3', 'medium', 'squares = [x**2 for x in range(1, 6)]')
ON CONFLICT DO NOTHING;
"""


def run_kubectl(args: list) -> tuple:
    """Run kubectl command and return stdout, stderr, returncode."""
    result = subprocess.run(
        ["kubectl"] + args,
        capture_output=True,
        text=True
    )
    return result.stdout, result.stderr, result.returncode


def get_postgres_pod(namespace: str = "postgres") -> str:
    """Get the PostgreSQL pod name."""
    stdout, stderr, code = run_kubectl([
        "get", "pods", "-n", namespace,
        "-l", "app.kubernetes.io/name=postgresql",
        "-o", "jsonpath={.items[0].metadata.name}"
    ])
    
    if code != 0 or not stdout:
        return None
    return stdout.strip()


def run_migration(pod_name: str, namespace: str) -> bool:
    """Run SQL migration inside PostgreSQL pod."""
    print("📝 Running database migration...")
    
    # Escape the SQL for shell execution
    sql_escaped = MIGRATION_SQL.replace("'", "'\"'\"'")
    
    stdout, stderr, code = run_kubectl([
        "exec", "-n", namespace, pod_name, "--",
        "psql", "-U", "learnflow_user", "-d", "learnflow",
        "-c", sql_escaped
    ])
    
    if code == 0 or "already exists" in stderr.lower() or "exists" in stderr.lower():
        print("✓ Database migration completed successfully")
        return True
    else:
        print(f"✗ Migration failed: {stderr}")
        return False


def verify_tables(pod_name: str, namespace: str) -> bool:
    """Verify tables were created."""
    print("🔍 Verifying table creation...")
    
    stdout, stderr, code = run_kubectl([
        "exec", "-n", namespace, pod_name, "--",
        "psql", "-U", "learnflow_user", "-d", "learnflow",
        "-c", "\\dt"
    ])
    
    if code == 0:
        print("✓ Tables created successfully")
        print("\nTables:")
        for line in stdout.split("\n"):
            if line.strip() and "public" in line:
                print(f"  {line.strip()}")
        return True
    else:
        print(f"✗ Failed to verify tables: {stderr}")
        return False


def main():
    """Main entry point."""
    namespace = sys.argv[1] if len(sys.argv) > 1 else "postgres"
    
    print("🚀 LearnFlow Database Migration\n")
    
    # Get PostgreSQL pod
    pod_name = get_postgres_pod(namespace)
    if not pod_name:
        print(f"✗ PostgreSQL pod not found in namespace '{namespace}'")
        sys.exit(1)
    
    print(f"✓ Found PostgreSQL pod: {pod_name}\n")
    
    # Run migration
    migration_ok = run_migration(pod_name, namespace)
    if not migration_ok:
        sys.exit(1)
    
    # Verify tables
    tables_ok = verify_tables(pod_name, namespace)
    
    print("\n" + "=" * 50)
    if tables_ok:
        print("✓ Database is ready for LearnFlow")
        sys.exit(0)
    else:
        print("✗ Database migration needs attention")
        sys.exit(1)


if __name__ == "__main__":
    main()
