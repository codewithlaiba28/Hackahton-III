"""
LearnFlow Code Review Agent
Analyzes student code for style, efficiency, and PEP 8 compliance
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import json

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db, engine, Base
from sqlalchemy.orm import Session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App ID for Dapr
APP_ID = "code-review-agent"

# Initialize FastAPI app
app = FastAPI(
    title="LearnFlow Code Review Agent",
    description="AI-powered PEP 8 and code style reviewer",
    version="1.0.0"
)

# Cerebras Configuration
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "llama3.1-70b")

class ReviewRequest(BaseModel):
    """Review request from student"""
    user_id: str
    code: str
    context: Optional[Dict[str, Any]] = None

class ReviewResponse(BaseModel):
    """Review response to student"""
    review: str
    style_score: int  # 0-100
    readability_score: int # 0-100
    pep8_violations: list[str]
    optimization_tips: list[str]

async def call_llm(prompt: str, system_message: str) -> str:
    """Call Cerebras AI for code review"""
    if not CEREBRAS_API_KEY:
        return "{}"
    
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
                    "temperature": 0.3,
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

@app.post("/api/review", response_model=ReviewResponse)
async def review_code(request: ReviewRequest):
    """
    Analyze student code and provide style/efficiency feedback
    """
    try:
        system_message = """You are an expert Python code reviewer. Provide feedback in JSON format.
        Required fields: 
        - review: general summary of the code
        - style_score: integer 0-100
        - readability_score: integer 0-100
        - pep8_violations: list of strings describing PEP 8 issues
        - optimization_tips: list of strings describing potential improvements"""
        
        prompt = f"Review this Python code:\n```python\n{request.code}\n```"
        
        response_text = await call_llm(prompt, system_message)
        data = json.loads(response_text)
        
        return ReviewResponse(
            review=data.get("review", "Code review completed."),
            style_score=data.get("style_score", 80),
            readability_score=data.get("readability_score", 80),
            pep8_violations=data.get("pep8_violations", []),
            optimization_tips=data.get("optimization_tips", [])
        )
    except Exception as e:
        logger.error(f"Error in code review: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
