"""
LearnFlow Exercise Agent
Generates custom coding exercises and quizzes for students
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import httpx
import uuid
import json
from collections import OrderedDict
from sqlalchemy.orm import Session
from datetime import datetime

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db, engine, Base
from shared.models import Exercise, QuizResult, User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

# App ID for Dapr
APP_ID = "exercise-agent"

# Initialize FastAPI app
# In-memory quiz answer cache (quiz_id -> list of correct answer indices)
# Uses OrderedDict to limit memory usage (max 500 quizzes)
class QuizCache:
    def __init__(self, max_size=500):
        self._cache: OrderedDict[str, List[int]] = OrderedDict()
        self._max_size = max_size
    
    def store(self, quiz_id: str, answers: List[int]):
        if len(self._cache) >= self._max_size:
            self._cache.popitem(last=False)
        self._cache[quiz_id] = answers
    
    def get(self, quiz_id: str) -> Optional[List[int]]:
        return self._cache.get(quiz_id)

quiz_answer_cache = QuizCache()

app = FastAPI(
    title="LearnFlow Exercise Agent",
    description="AI-powered Python exercise and quiz generator",
    version="1.0.0"
)

# Cerebras Configuration
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "llama3.1-70b")


class ExerciseRequest(BaseModel):
    """Request to generate an exercise"""
    topic: str
    difficulty: str = "easy"
    user_id: str


class QuizRequest(BaseModel):
    """Request to generate a quiz"""
    topic: str
    num_questions: int = 5
    user_id: str


class QuizQuestion(BaseModel):
    """Single quiz question"""
    id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class Quiz(BaseModel):
    """Quiz definition"""
    id: str
    topic: str
    questions: List[QuizQuestion]


class QuizSubmission(BaseModel):
    """Student quiz submission"""
    user_id: str
    quiz_id: str
    answers: List[int]
    topic: str


class QuizResultResponse(BaseModel):
    """Result of a quiz submission"""
    score: float
    total_questions: int
    correct_answers: int
    feedback: str


async def call_llm(prompt: str, system_message: str) -> str:
    """Call Cerebras AI"""
    if not CEREBRAS_API_KEY:
        return "{}"
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.cerebras.ai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {CEREBRAS_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": CEREBRAS_MODEL,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "response_format": { "type": "json_object" }
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Cerebras API error: {response.text}")
                return "{}"
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Error calling Cerebras: {str(e)}")
        return "{}"


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "app_id": APP_ID}


@app.post("/api/exercise/generate")
async def generate_exercise(request: ExerciseRequest, db: Session = Depends(get_db)):
    """
    Generate and persist AI-powered exercise
    """
    try:
        system_message = """You are an expert Python teacher. Generate a JSON coding exercise.
        Required fields: title, description, difficulty, starter_code, expected_output, hints (list)."""
        
        prompt = f"Generate a {request.difficulty} Python exercise about {request.topic}."
        
        response_text = await call_llm(prompt, system_message)
        data = json.loads(response_text)
        
        exercise = Exercise(
            id=str(uuid.uuid4()),
            title=data.get("title", "Exercise"),
            description=data.get("description", ""),
            module_id=request.topic,
            difficulty=request.difficulty,
            starter_code=data.get("starter_code", ""),
            expected_output=data.get("expected_output", ""),
            hints=data.get("hints", []),
            created_at=datetime.utcnow()
        )
        
        db.add(exercise)
        db.commit()
        db.refresh(exercise)
        
        return exercise
        
    except Exception as e:
        logger.error(f"Error generating exercise: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/quiz/generate", response_model=Quiz)
async def generate_quiz(request: QuizRequest):
    """
    Generate AI-powered quiz and cache correct answers for grading
    """
    try:
        system_message = """You are an expert Python examiner. Generate a JSON quiz.
        Structure: { "topic": "", "questions": [ { "question": "", "options": [], "correct_answer": 0, "explanation": "" } ] }"""
        
        prompt = f"Generate {request.num_questions} questions about {request.topic}."
        
        response_text = await call_llm(prompt, system_message)
        data = json.loads(response_text)
        
        questions = []
        correct_answers = []
        for q in data.get("questions", []):
            correct_idx = q.get("correct_answer", 0)
            correct_answers.append(correct_idx)
            questions.append(QuizQuestion(
                id=str(uuid.uuid4()),
                question=q.get("question", ""),
                options=q.get("options", []),
                correct_answer=correct_idx,
                explanation=q.get("explanation", "")
            ))
        
        quiz_id = str(uuid.uuid4())
        # Cache correct answers for grading when student submits
        quiz_answer_cache.store(quiz_id, correct_answers)
            
        return Quiz(
            id=quiz_id,
            topic=data.get("topic", request.topic),
            questions=questions
        )
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/quiz/submit")
async def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    """
    Grade quiz submission by comparing against cached correct answers
    """
    # Look up correct answers from cache
    correct_answers = quiz_answer_cache.get(submission.quiz_id)
    
    if correct_answers:
        # Real grading: compare student answers against correct answers
        total_questions = min(len(submission.answers), len(correct_answers))
        num_correct = sum(
            1 for student_ans, correct_ans in zip(submission.answers, correct_answers)
            if student_ans == correct_ans
        )
        score = (num_correct / total_questions * 100) if total_questions > 0 else 0.0
    else:
        # Fallback: if quiz not in cache (e.g., server restart), use heuristic
        logger.warning(f"Quiz {submission.quiz_id} not found in cache, using submitted answer count")
        total_questions = len(submission.answers)
        num_correct = 0
        score = 0.0
    
    result = QuizResult(
        id=str(uuid.uuid4()),
        user_id=submission.user_id,
        quiz_id=submission.quiz_id,
        score=score,
        total_questions=total_questions,
        correct_answers=num_correct,
        completed_at=datetime.utcnow()
    )
    
    db.add(result)
    db.commit()
    
    # Generate feedback based on actual score
    if score >= 90:
        feedback = "Excellent work! You've mastered this topic."
    elif score >= 70:
        feedback = "Good job! Review the questions you missed to strengthen your understanding."
    elif score >= 50:
        feedback = "Decent effort. Consider revisiting the topic material before trying again."
    else:
        feedback = "This topic needs more practice. Review the explanations and try again."
    
    return {
        "score": round(score, 1),
        "correct_answers": num_correct,
        "total_questions": total_questions,
        "feedback": feedback
    }


class ExerciseAssignment(BaseModel):
    exercise_id: str
    user_id: str
    assignment_type: str = "individual"


@app.post("/api/exercise/assign")
async def assign_exercise(request: ExerciseAssignment, db: Session = Depends(get_db)):
    """
    Assign an exercise to a student - verifies both exercise and user exist
    """
    # Verify exercise exists
    exercise = db.query(Exercise).filter(Exercise.id == request.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Verify user exists
    from shared.models import User
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"Assigning exercise '{exercise.title}' to user {request.user_id}")
    
    return {
        "success": True,
        "exercise_id": request.exercise_id,
        "exercise_title": exercise.title,
        "user_id": request.user_id,
        "assignment_type": request.assignment_type
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
