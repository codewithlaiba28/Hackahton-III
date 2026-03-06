import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
import httpx
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db, engine, Base
from shared.models import Progress, User, QuizResult, Submission, StruggleEvent

# Define status constants
MASTERY_STATUS = ['beginner', 'learning', 'proficient', 'mastered']

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dapr Configuration
DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_PUBSUB_NAME = os.getenv("DAPR_PUBSUB_NAME", "learnflow-pubsub")

# App ID for Dapr
APP_ID = "progress-agent"

# Initialize FastAPI app
app = FastAPI(
    title="LearnFlow Progress Agent",
    description="Student progress tracking and mastery calculation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def publish_struggle_event(event_data: Dict[str, Any]):
    """Publish struggle event to Kafka via Dapr Pub/Sub"""
    dapr_url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/publish/{DAPR_PUBSUB_NAME}/struggle.alerts"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(dapr_url, json=event_data)
            if response.status_code in (200, 204):
                logger.info(f"Published struggle event for user {event_data.get('user_id')}")
            else:
                logger.error(f"Failed to publish struggle event: {response.text}")
    except Exception as e:
        logger.error(f"Error publishing struggle event to Dapr: {str(e)}")

class ProgressUpdate(BaseModel):
    """Progress update event"""
    user_id: str
    module_id: str
    topic: str
    exercise_score: Optional[float] = None
    quiz_score: Optional[float] = None
    quality_score: Optional[float] = None
    streak_bonus: Optional[float] = None

class ProgressResponse(BaseModel):
    """Progress response"""
    user_id: str
    module_id: str
    topic: str
    mastery_score: float
    status: str
    exercises_completed: int
    quizzes_completed: int

class SubmissionEvent(BaseModel):
    """Code submission event"""
    user_id: str
    exercise_id: str
    code: str
    success: bool
    execution_time_ms: Optional[float] = None

class QuizResultEvent(BaseModel):
    """Quiz result event"""
    user_id: str
    quiz_id: str
    topic: str
    score: float
    total_questions: int

def calculate_mastery_score(
    exercise_score: float = 0,
    quiz_score: float = 0,
    code_quality_score: float = 0,
    consistency_score: float = 0
) -> float:
    """
    Calculate overall mastery score with weighted average:
    - Exercises: 40%
    - Quizzes: 30%
    - Code Quality: 20%
    - Consistency: 10%
    """
    weights = {
        "exercises": 0.4,
        "quizzes": 0.3,
        "code_quality": 0.2,
        "consistency": 0.1
    }
    
    mastery = (
        exercise_score * weights["exercises"] +
        quiz_score * weights["quizzes"] +
        code_quality_score * weights["code_quality"] +
        consistency_score * weights["consistency"]
    )
    
    return min(100, max(0, mastery))

def get_mastery_status_label(score: float) -> str:
    """Get mastery status label from score"""
    if score <= 40:
        return 'beginner'
    elif score <= 70:
        return 'learning'
    elif score <= 90:
        return 'proficient'
    else:
        return 'mastered'

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "app_id": APP_ID}

@app.post("/api/progress/update")
async def update_progress(request: ProgressUpdate, db: Session = Depends(get_db)):
    """
    Update student progress using database persistence
    """
    try:
        # Check if user exists, if not create a placeholder (in real app, users come from Auth)
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            user = User(
                id=request.user_id,
                email=f"{request.user_id}@example.com",
                name=f"Student {request.user_id}",
                password_hash="dummy-placeholder",
                role='student'
            )
            db.add(user)
            db.commit()

        # Get or create progress record
        progress = db.query(Progress).filter(
            Progress.user_id == request.user_id,
            Progress.module_id == request.module_id
        ).first()
        
        if not progress:
            progress = Progress(
                id=str(uuid.uuid4()),
                user_id=request.user_id,
                module_id=request.module_id,
                topic=request.topic,
                mastery_score=0.0,
                status='beginner',
                exercises_completed=0,
                quizzes_completed=0
            )
            db.add(progress)
        
        # Update granular averages
        if request.exercise_score is not None:
            progress.exercises_completed += 1
            progress.exercise_avg = (progress.exercise_avg * 0.8) + (request.exercise_score * 0.2)
        
        if request.quiz_score is not None:
            progress.quizzes_completed += 1
            progress.quiz_avg = (progress.quiz_avg * 0.7) + (request.quiz_score * 0.3)
            
        if request.quality_score is not None:
            progress.quality_avg = (progress.quality_avg * 0.9) + (request.quality_score * 0.1)
            
        if request.streak_bonus is not None:
            progress.streak_score = min(100.0, progress.streak_score + request.streak_bonus)

        # Final Weighted Mastery Calculation (Hackathon Specification)
        # Exercise: 40%, Quiz: 30%, Quality: 20%, Streak: 10%
        progress.mastery_score = (
            (progress.exercise_avg * 0.4) +
            (progress.quiz_avg * 0.3) +
            (progress.quality_avg * 0.2) +
            (progress.streak_score * 0.1)
        )

        progress.status = get_mastery_status_label(progress.mastery_score)
        progress.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(progress)

        return {
            "success": True,
            "user_id": request.user_id,
            "module_id": request.module_id,
            "mastery_score": progress.mastery_score,
            "status": progress.status,
            "exercises_completed": progress.exercises_completed,
            "quizzes_completed": progress.quizzes_completed
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str, module_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get real student progress from PostgreSQL
    """
    try:
        query = db.query(Progress).filter(Progress.user_id == user_id)
        if module_id:
            query = query.filter(Progress.module_id == module_id)
        
        records = query.all()
        results = [{
            "module_id": r.module_id,
            "topic": r.topic,
            "mastery_score": r.mastery_score,
            "status": r.status,
            "exercises_completed": r.exercises_completed,
            "quizzes_completed": r.quizzes_completed
        } for r in records]
        
        return {
            "user_id": user_id,
            "progress": results,
            "total_modules": len(results)
        }
    except Exception as e:
        logger.error(f"Error getting progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/submissions/track")
async def track_submission(request: SubmissionEvent, db: Session = Depends(get_db)):
    """
    Track code submission in PostgreSQL
    """
    try:
        submission = Submission(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            exercise_id=request.exercise_id,
            code=request.code,
            status="success" if request.success else "error",
            execution_time_ms=request.execution_time_ms,
            executed_at=datetime.utcnow()
        )
        db.add(submission)
        
        # Update progress quality score (mock logic for now but using real DB)
        db.commit()

        # Detect Struggle: 5+ failed code executions
        if not request.success:
            failed_count = db.query(Submission).filter(
                Submission.user_id == request.user_id,
                Submission.exercise_id == request.exercise_id,
                Submission.status == "error"
            ).count()
            
            if failed_count >= 5:
                await publish_struggle_event({
                    "user_id": request.user_id,
                    "event_type": "excessive_failures",
                    "exercise_id": request.exercise_id,
                    "count": failed_count,
                    "message": "Student has 5+ failed executions in a row"
                })

        # Detect Struggle: Stuck on exercise > 10 minutes
        first_attempt = db.query(Submission).filter(
            Submission.user_id == request.user_id,
            Submission.exercise_id == request.exercise_id
        ).order_by(Submission.executed_at.asc()).first()
        
        if first_attempt:
            delta = datetime.utcnow() - first_attempt.executed_at
            if delta.total_seconds() > 600: # 10 minutes
                await publish_struggle_event({
                    "user_id": request.user_id,
                    "event_type": "stuck_on_exercise",
                    "exercise_id": request.exercise_id,
                    "time_spent_seconds": delta.total_seconds(),
                    "message": "Student has been stuck on this exercise for over 10 minutes"
                })
        
        return {"success": True, "submission_id": submission.id}
    except Exception as e:
        db.rollback()
        logger.error(f"Error tracking submission: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/results")
async def process_quiz_result(request: QuizResultEvent, db: Session = Depends(get_db)):
    """
    Process real quiz results and persist to database
    """
    try:
        quiz_result = QuizResult(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            quiz_id=request.quiz_id,
            score=request.score,
            total_questions=request.total_questions,
            correct_answers=int(request.score * request.total_questions / 100),
            completed_at=datetime.utcnow()
        )
        db.add(quiz_result)
        
        await update_progress(ProgressUpdate(
            user_id=request.user_id,
            module_id=request.quiz_id.split(":")[0],
            topic=request.topic,
            quiz_score=request.score
        ), db=db)
        
        # Check for struggle (score < 50)
        if request.score < 50:
            alert = StruggleEvent(
                id=str(uuid.uuid4()),
                user_id=request.user_id,
                event_type="low_quiz_score",
                context={"score": request.score, "quiz_id": request.quiz_id, "topic": request.topic},
                triggered_at=datetime.utcnow()
            )
            db.add(alert)
            
            # Publish struggle event to Kafka via Dapr
            await publish_struggle_event({
                "user_id": request.user_id,
                "event_type": "low_quiz_score",
                "topic": request.topic,
                "score": request.score
            })

        db.commit()
        return {"success": True, "user_id": request.user_id, "score": request.score}
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing quiz result: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teacher/analytics")
async def get_teacher_analytics(db: Session = Depends(get_db)):
    """
    Get aggregated analytics for the teacher dashboard
    """
    try:
        from sqlalchemy import func
        # Agregate progress by module
        stats = db.query(
            Progress.module_id,
            Progress.topic,
            func.count(Progress.user_id).label("student_count"),
            func.avg(Progress.mastery_score).label("avg_mastery")
        ).group_by(Progress.module_id, Progress.topic).all()
        
        # Get count of struggling students (mastery < 50) per module
        struggles = db.query(
            Progress.module_id,
            func.count(Progress.user_id).label("struggle_count")
        ).filter(Progress.mastery_score < 50).group_by(Progress.module_id).all()
        
        struggle_map = {s.module_id: s.struggle_count for s in struggles}
        
        results = []
        for s in stats:
            results.append({
                "module_id": s.module_id,
                "topic": s.topic,
                "student_count": s.student_count,
                "avg_mastery_score": round(float(s.avg_mastery), 1) if s.avg_mastery else 0,
                "struggling_students": struggle_map.get(s.module_id, 0)
            })
            
        return results
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teacher/students")
async def get_teacher_students(db: Session = Depends(get_db)):
    """
    Get all students with their overall mastery scores
    """
    try:
        from sqlalchemy import func
        # Get all students
        students = db.query(User).filter(User.role == 'student').all()
        
        # Get mastery for each student (averaged across modules)
        mastery_stats = db.query(
            Progress.user_id,
            func.avg(Progress.mastery_score).label("avg_mastery")
        ).group_by(Progress.user_id).all()
        
        mastery_map = {m.user_id: float(m.avg_mastery) for m in mastery_stats if m.avg_mastery}
        
        results = []
        for student in students:
            mastery = mastery_map.get(student.id, 0.0)
            results.append({
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "mastery": round(mastery, 1),
                "status": "Prime" if mastery > 70 else "Linked" if mastery > 0 else "Offline",
                "rank": "L15 Specialist" if mastery > 90 else "L12 Architect" if mastery > 70 else "L8 Node" if mastery > 40 else "L2 Neophyte"
            })
            
        return results
    except Exception as e:
        logger.error(f"Error getting students: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teacher/stats")
async def get_teacher_stats(db: Session = Depends(get_db)):
    """
    Get high-level stats for teacher dashboard
    """
    try:
        from sqlalchemy import func
        student_count = db.query(User).filter(User.role == 'student').count()
        avg_mastery = db.query(func.avg(Progress.mastery_score)).scalar() or 0.0
        active_alerts = db.query(StruggleEvent).filter(StruggleEvent.is_resolved == False).count()

        # Logic loops = total progress records (active learning paths)
        logic_loops = db.query(Progress).count()

        return {
            "active_entities": student_count,
            "avg_mastery": f"{round(float(avg_mastery), 1)}%",
            "fault_alerts": active_alerts,
            "logic_loops": f"{logic_loops}"
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teacher/alerts")
async def get_teacher_alerts(db: Session = Depends(get_db)):
    """
    Get all active struggle alerts
    """
    try:
        alerts = db.query(StruggleEvent, User.name).join(User, StruggleEvent.user_id == User.id).all()
        
        results = []
        for alert, user_name in alerts:
            results.append({
                "id": alert.id,
                "user_id": alert.user_id,
                "student_name": user_name,
                "event_type": alert.event_type,
                "topic": alert.context.get("topic", "Coding"),
                "triggered_at": alert.triggered_at.isoformat(),
                "context": alert.context
            })
        return results
    except Exception as e:
        logger.error(f"Error getting alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/submissions/{user_id}")
async def get_submission_history(user_id: str, db: Session = Depends(get_db)):
    """
    Get real submission history for a student
    """
    try:
        submissions = db.query(Submission).filter(Submission.user_id == user_id).order_by(Submission.executed_at.desc()).all()
        
        results = []
        for s in submissions:
            # Try to find exercise title
            exercise = db.query(Exercise).filter(Exercise.id == s.exercise_id).first()
            topic = exercise.title if exercise else "Unknown Node"
            
            results.append({
                "id": f"#SUB-{s.id[:6]}",
                "topic": topic,
                "result": "Success" if s.status == "success" else "Failed",
                "date": s.executed_at.isoformat()
            })
        return results
    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
