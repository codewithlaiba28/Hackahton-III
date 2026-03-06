"""
LearnFlow Triage Agent
Routes student queries to appropriate specialized agents:
- "explain" → Concepts Agent
- "error" → Debug Agent
- "exercise" → Exercise Agent
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import uuid

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db
from shared.models import User, UserRole
from shared.auth import verify_password, get_password_hash, create_token_for_user
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App ID for Dapr
APP_ID = "triage-agent"

# Initialize FastAPI app
app = FastAPI(
    title="LearnFlow Triage Agent",
    description="Routes student queries to specialized AI agents",
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

# Use the get_password_hash from shared.auth directly

# Agent service URLs (configured via environment or Dapr service discovery)
# Default to Docker service names for container-to-container communication
CONCEPTS_AGENT_URL = os.getenv("CONCEPTS_AGENT_URL", "http://concepts-agent:8000")
DEBUG_AGENT_URL = os.getenv("DEBUG_AGENT_URL", "http://debug-agent:8000")
EXERCISE_AGENT_URL = os.getenv("EXERCISE_AGENT_URL", "http://exercise-agent:8000")
CODE_REVIEW_AGENT_URL = os.getenv("CODE_REVIEW_AGENT_URL", "http://code-review-agent:8000")
PROGRESS_AGENT_URL = os.getenv("PROGRESS_AGENT_URL", "http://progress-agent:8000")

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: Optional[str] = "student"

# ... (Previous ChatRequest and models remain the same)

# ... (Previous ChatRequest and models remain the same)

@app.post("/api/auth/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Real registration endpoint"""
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    new_user = User(
        id=f"user-{uuid.uuid4().hex[:8]}",
        email=request.email,
        name=request.name,
        password_hash=get_password_hash(request.password),
        role=request.role.lower() if request.role else 'student'
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token_for_user(new_user.id, new_user.email, new_user.name, new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        }
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Real authentication endpoint"""
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token_for_user(user.id, user.email, user.name, user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

@app.get("/api/teacher/analytics")
async def get_teacher_analytics(authorization: Optional[str] = Header(None)):
    """Proxy analytics to Progress Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{PROGRESS_AGENT_URL}/api/teacher/analytics", headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.get("/api/teacher/alerts")
async def get_teacher_alerts(authorization: Optional[str] = Header(None)):
    """Proxy alerts to Progress Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{PROGRESS_AGENT_URL}/api/teacher/alerts", headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.get("/api/teacher/students")
async def get_teacher_students(authorization: Optional[str] = Header(None)):
    """Proxy students to Progress Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{PROGRESS_AGENT_URL}/api/teacher/students", headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.get("/api/teacher/stats")
async def get_teacher_stats(authorization: Optional[str] = Header(None)):
    """Proxy stats to Progress Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{PROGRESS_AGENT_URL}/api/teacher/stats", headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.post("/api/code/execute")
async def execute_code(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy code execution to Concepts Agent"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(f"{CONCEPTS_AGENT_URL}/api/code/execute", json=request, headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str, module_id: Optional[str] = None, authorization: Optional[str] = Header(None)):
    """Proxy progress lookup to Progress Agent"""
    url = f"{PROGRESS_AGENT_URL}/api/progress/{user_id}"
    if module_id: url += f"?module_id={module_id}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers={"Authorization": authorization} if authorization else {})
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"Progress Agent error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail="Progress Agent error")
    except Exception as e:
        logger.error(f"Failed to connect to Progress Agent: {str(e)}")
        raise HTTPException(status_code=503, detail="Progress service temporarily unavailable")

@app.post("/api/progress/update")
async def update_progress(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy progress update to Progress Agent"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{PROGRESS_AGENT_URL}/api/progress/update", json=request, headers={"Authorization": authorization} if authorization else {})
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Failed to update progress: {str(e)}")
        raise HTTPException(status_code=503, detail="Progress service temporarily unavailable")

@app.get("/api/submissions/{user_id}")
async def get_submission_history(user_id: str, authorization: Optional[str] = Header(None)):
    """Proxy history to Progress Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{PROGRESS_AGENT_URL}/api/submissions/{user_id}", headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.post("/api/exercise/generate")
async def generate_exercise(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy exercise generation to Exercise Agent"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(f"{EXERCISE_AGENT_URL}/api/exercise/generate", json=request, headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.post("/api/quiz/generate")
async def generate_quiz(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy quiz generation to Exercise Agent"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(f"{EXERCISE_AGENT_URL}/api/quiz/generate", json=request, headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.post("/api/quiz/submit")
async def submit_quiz(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy quiz submission to Exercise Agent"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(f"{EXERCISE_AGENT_URL}/api/quiz/submit", json=request, headers={"Authorization": authorization} if authorization else {})
        return response.json()

@app.post("/api/code/review")
async def review_code(request: Dict[str, Any], authorization: Optional[str] = Header(None)):
    """Proxy code review to Code Review Agent"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(f"{CODE_REVIEW_AGENT_URL}/api/review", json=request)
        return response.json()


class ChatRequest(BaseModel):
    """Chat request from student"""
    user_id: str
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Chat response to student"""
    response: str
    routed_to: str  # Which agent handled this
    confidence: float


class RouteDecision(BaseModel):
    """Internal route decision"""
    agent: str
    reason: str
    confidence: float


def determine_route(message: str) -> RouteDecision:
    """
    Determine which agent should handle this message.
    Simple keyword-based routing (can be enhanced with ML later)
    """
    message_lower = message.lower()

    # Debug-related keywords
    debug_keywords = [
        "error", "exception", "bug", "crash", "fail", "wrong",
        "not working", "traceback", "syntax error", "type error"
    ]

    # Exercise-related keywords
    exercise_keywords = [
        "exercise", "practice", "challenge", "task", "assignment",
        "give me", "create", "generate", "quiz", "test"
    ]

    # Code review-related keywords
    review_keywords = [
        "review", "style", "pep8", "how is my code", "quality", "clean", "format"
    ]

    # Explanation-related keywords
    explanation_keywords_list = [
        "explain", "what is", "how does", "concept", "understand",
        "tutorial", "meaning", "definition", "why"
    ]

    # Score each category
    debug_score = sum(1 for kw in debug_keywords if kw in message_lower)
    exercise_score = sum(1 for kw in exercise_keywords if kw in message_lower)
    explanation_score = sum(1 for kw in explanation_keywords_list if kw in message_lower)
    review_score = sum(1 for kw in review_keywords if kw in message_lower)

    # Determine winner
    scores = {
        "debug-agent": debug_score,
        "exercise-agent": exercise_score,
        "concepts-agent": explanation_score,
        "code-review-agent": review_score
    }

    best_agent = max(scores, key=scores.get)
    best_score = scores[best_agent]

    # Default to concepts if no clear winner
    if best_score == 0:
        return RouteDecision(
            agent="concepts-agent",
            reason="No specific intent detected, defaulting to concepts",
            confidence=0.5
        )

    return RouteDecision(
        agent=best_agent,
        reason=f"Detected intent: {best_agent.replace('-agent', '')} (score: {best_score})",
        confidence=min(1.0, best_score / 3.0)  # Normalize confidence
    )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "app_id": APP_ID}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, authorization: Optional[str] = Header(None)):
    """
    Main chat endpoint - receives student queries and routes to appropriate agent
    """
    try:
        # Determine route
        route = determine_route(request.message)
        
        logger.info(f"Routing message from user {request.user_id} to {route.agent}")
        
        # Route to appropriate agent
        target_url = {
            "concepts-agent": CONCEPTS_AGENT_URL,
            "debug-agent": DEBUG_AGENT_URL,
            "exercise-agent": EXERCISE_AGENT_URL
        }.get(route.agent)
        
        if not target_url:
            raise HTTPException(status_code=500, detail=f"Unknown agent: {route.agent}")
        
        # Forward request to target agent
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{target_url}/api/chat",
                json={
                    "user_id": request.user_id,
                    "message": request.message,
                    "context": request.context
                },
                headers={"Authorization": authorization} if authorization else {}
            )
            
            if response.status_code != 200:
                logger.error(f"Agent {route.agent} returned error: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Agent {route.agent} failed to respond"
                )
            
            agent_response = response.json()
        
        return ChatResponse(
            response=agent_response.get("response", ""),
            routed_to=route.agent,
            confidence=route.confidence
        )
        
    except httpx.RequestError as e:
        logger.error(f"Request to agent failed: {str(e)}")
        # Fallback: return a helpful message
        return ChatResponse(
            response="I'm having trouble connecting to the specialized agent right now. Please try again in a moment.",
            routed_to="triage-agent",
            confidence=0.0
        )
    except Exception as e:
        logger.error(f"Unexpected error in triage: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/route")
async def get_route(message: str):
    """
    Debug endpoint to see how a message would be routed
    """
    route = determine_route(message)
    return {
        "message": message,
        "route": route.agent,
        "reason": route.reason,
        "confidence": route.confidence
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
