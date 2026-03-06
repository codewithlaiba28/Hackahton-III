"""
LearnFlow Debug Agent
Helps students debug code errors and provides solutions
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import json
import uuid
from datetime import datetime

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db, engine, Base
from shared.models import StruggleEvent, User
from sqlalchemy.orm import Session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App ID for Dapr
APP_ID = "debug-agent"

# Initialize FastAPI app
app = FastAPI(
    title="LearnFlow Debug Agent",
    description="AI-powered code debugging assistant",
    version="1.0.0"
)

# Cerebras Configuration
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "llama3.1-70b")

# Dapr Configuration
DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_PUBSUB_NAME = os.getenv("DAPR_PUBSUB_NAME", "learnflow-pubsub")
DAPR_TOPIC_STRUGGLE = "student.struggles"


class ChatRequest(BaseModel):
    """Chat request with error context"""
    user_id: str
    message: str
    code: Optional[str] = None
    error_message: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Debug response with solution"""
    response: str
    error_type: Optional[str] = None
    solution: Optional[str] = None
    corrected_code: Optional[str] = None


async def call_llm(prompt: str, system_message: str) -> str:
    """Call Cerebras AI for debugging assistance"""
    if not CEREBRAS_API_KEY:
        return "Cerebras API key not configured."
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
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
                    "temperature": 0.5,
                    "max_tokens": 1500
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Cerebras API error: {response.text}")
                return "Error generating debug response."
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Error calling Cerebras: {str(e)}")
        return "Error generating response."


def detect_error_type(error_message: str) -> str:
    """Detect the type of error from error message"""
    error_patterns = {
        "SyntaxError": ["invalid syntax", "SyntaxError"],
        "NameError": ["not defined", "NameError"],
        "TypeError": ["TypeError", "unsupported operand"],
        "IndexError": ["index out of range", "IndexError"],
        "KeyError": ["KeyError"],
        "AttributeError": ["has no attribute", "AttributeError"],
        "ValueError": ["ValueError", "invalid literal"],
        "ImportError": ["ImportError", "ModuleNotFoundError"],
        "IndentationError": ["IndentationError", "expected an indented block"],
        "ZeroDivisionError": ["division by zero", "ZeroDivisionError"],
    }
    
    for error_type, patterns in error_patterns.items():
        if any(pattern.lower() in error_message.lower() for pattern in patterns):
            return error_type
    
    return "UnknownError"


async def publish_struggle_event(event_data: Dict[str, Any]):
    """Publish struggle event to Kafka via Dapr Pub/Sub"""
    dapr_url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/publish/{DAPR_PUBSUB_NAME}/{DAPR_TOPIC_STRUGGLE}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(dapr_url, json=event_data)
            if response.status_code == 204 or response.status_code == 200:
                logger.info(f"Successfully published struggle event for user {event_data.get('user_id')}")
            else:
                logger.error(f"Failed to publish struggle event: {response.text}")
    except Exception as e:
        logger.error(f"Error publishing to Dapr: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "app_id": APP_ID}


@app.post("/api/chat", response_model=ChatResponse)
async def debug_chat(request: ChatRequest, authorization: Optional[str] = Header(None)):
    """
    Analyze and help debug student's code error
    """
    try:
        system_message = """You are an expert Python debugging assistant.
        Analyze the error and code provided. Explain what went wrong in simple terms.
        Provide the corrected code in a markdown block."""
        
        prompt = f"Student reports: {request.message}"
        if request.code:
            prompt += f"\nCode:\n```python\n{request.code}\n```"
        if request.error_message:
            prompt += f"\nError message:\n{request.error_message}"
        
        response = await call_llm(prompt, system_message)
        
        # Simple extraction logic
        import re
        code_blocks = re.findall(r'```python\n(.*?)\n```', response, re.DOTALL)
        corrected_code = code_blocks[0] if code_blocks else None
        
        return ChatResponse(
            response=response,
            corrected_code=corrected_code
        )
    except Exception as e:
        logger.error(f"Error in debug chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/struggle/detect")
async def detect_struggle(request: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Detect if student is struggling and persist to DB/Publish via Dapr
    """
    user_id = request.get("user_id")
    error_count = request.get("error_count", 0)
    
    if error_count >= 3:
        # Create DB record
        struggle = StruggleEvent(
            id=str(uuid.uuid4()),
            user_id=user_id,
            event_type="repeated_error",
            context=request,
            triggered_at=datetime.utcnow(),
            is_resolved=False
        )
        db.add(struggle)
        db.commit()
        
        # Publish to Pub/Sub
        await publish_struggle_event({
            "id": struggle.id,
            "user_id": user_id,
            "event_type": "repeated_error",
            "context": request
        })
        
        return {"struggle_detected": True, "event_id": struggle.id}
    
    return {"struggle_detected": False}


if __name__ == "__main__":
    import uvicorn
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    uvicorn.run(app, host="0.0.0.0", port=8003)
