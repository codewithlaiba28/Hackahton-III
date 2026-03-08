from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from .database import Base

class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    role = Column(String, default='student')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("role IN ('student', 'teacher', 'admin')", name='check_users_role'),
    )

class Progress(Base):
    __tablename__ = "progress"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    module_id = Column(String, index=True)
    topic = Column(String)
    mastery_score = Column(Float, default=0.0)
    status = Column(String, default='beginner')
    exercises_completed = Column(Integer, default=0)
    exercise_avg = Column(Float, default=0.0)
    quizzes_completed = Column(Integer, default=0)
    quiz_avg = Column(Float, default=0.0)
    quality_avg = Column(Float, default=0.0)
    streak_score = Column(Float, default=0.0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("status IN ('beginner', 'learning', 'proficient', 'mastered')", name='check_progress_status'),
        CheckConstraint("mastery_score >= 0 AND mastery_score <= 100", name='check_progress_mastery'),
    )

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(String, primary_key=True)
    title = Column(String)
    description = Column(Text)
    module_id = Column(String, index=True)
    difficulty = Column(String)
    starter_code = Column(Text)
    expected_output = Column(Text)
    hints = Column(String, default='[]')  # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("difficulty IN ('easy', 'medium', 'hard')", name='check_exercise_difficulty'),
    )

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    exercise_id = Column(String, ForeignKey("exercises.id"))
    code = Column(Text)
    output = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    status = Column(String, default='pending')
    execution_time_ms = Column(Float, nullable=True)
    executed_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'running', 'success', 'error', 'timeout')", name='check_submission_status'),
    )

class StruggleEvent(Base):
    __tablename__ = "struggle_events"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    event_type = Column(String)
    context = Column(String, default='{}')  # Store as JSON string
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    is_resolved = Column(Boolean, default=False)
    
    __table_args__ = (
        CheckConstraint("event_type IN ('repeated_error', 'stuck_timeout', 'low_quiz_score', 'failed_executions')", name='check_struggle_event_type'),
    )

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    quiz_id = Column(String)
    score = Column(Float)
    total_questions = Column(Integer)
    correct_answers = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("score >= 0 AND score <= 100", name='check_quiz_score'),
    )
