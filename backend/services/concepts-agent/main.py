import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import httpx
from sqlalchemy.orm import Session

# Import shared components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.database import get_db, engine, Base
from shared.models import Exercise, User  # Import as needed

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App ID for Dapr
APP_ID = "concepts-agent"

# Initialize FastAPI app
app = FastAPI(
    title="LearnFlow Concepts Agent",
    description="AI-powered Python concepts explainer",
    version="1.0.0"
)

# Cerebras Configuration
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "llama3.1-70b")

class ChatRequest(BaseModel):
    """Chat request from student"""
    user_id: str
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    """Chat response to student"""
    response: str
    code_example: Optional[str] = None
    explanation_type: str = "concept"

class CodeExecutionRequest(BaseModel):
    """Request to execute code"""
    code: str
    user_id: str

class CodeExecutionResult(BaseModel):
    """Result from code execution"""
    output: str
    error: Optional[str] = None
    success: bool
async def call_llm(prompt: str, system_message: str = "You are a helpful Python programming tutor.") -> str:
    """Call Cerebras AI for generating explanations"""
    if not CEREBRAS_API_KEY:
        return "Cerebras API key not configured. Please set CEREBRAS_API_KEY environment variable."
    
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
                    "temperature": 0.7,
                    "max_tokens": 1000
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Cerebras API error: {response.text}")
                return "I'm having trouble generating a response right now. Please try again."
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Error calling Cerebras: {str(e)}")
        return "Error generating response. Please try again."

def extract_code_example(response: str) -> Optional[str]:
    """Extract code example from AI response"""
    import re
    code_blocks = re.findall(r'```python\n(.*?)\n```', response, re.DOTALL)
    if code_blocks:
        return code_blocks[0]
    return None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "app_id": APP_ID}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """
    Generate explanation for student's Python question using AI
    """
    try:
        system_message = """You are a friendly Python programming tutor. 
        Explain concepts clearly with practical examples. 
        Always include a code example when relevant.
        Format code examples in markdown code blocks with ```python."""
        
        prompt = f"Student asks: {request.message}"
        if request.context:
            prompt += f"\nContext: {request.context}"
        
        response = await call_llm(prompt, system_message)
        code_example = extract_code_example(response)
        
        return ChatResponse(
            response=response,
            code_example=code_example,
            explanation_type="concept"
        )
    except Exception as e:
        logger.error(f"Error in concepts chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/code/execute", response_model=CodeExecutionResult)
async def execute_code(request: CodeExecutionRequest):
    """
    Execute Python code in a sandboxed environment
    """
    try:
        import subprocess
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(request.code)
            f.flush()
            temp_file = f.name
        
        try:
            # Simple execution for MVP, in production use proper containerized sandbox
            # Using python3 explicitly as it's standard in most linux distros
            result = subprocess.run(
                ['python3', temp_file],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            output = result.stdout
            error = result.stderr if result.returncode != 0 else None
            
            # If both are empty but it finished, return a placeholder
            if not output and not error and result.returncode == 0:
                output = "(Process finished with no output)"

            return CodeExecutionResult(
                output=output,
                error=error,
                success=result.returncode == 0
            )
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)
            
    except subprocess.TimeoutExpired:
        return CodeExecutionResult(output="", error="Code execution timed out (5s)", success=False)
    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        return CodeExecutionResult(output="", error=f"Execution error: {str(e)}", success=False)

@app.get("/api/topics/{topic}")
async def get_topic_explanation(topic: str):
    """
    Get explanation for a specific Python topic using AI (Direct lookup removed)
    """
    system_message = "You are a Python programming expert. Provide a concise 2-3 sentence definition of the topic."
    prompt = f"Explain the Python concept: {topic}"
    
    explanation = await call_llm(prompt, system_message)
    return {"topic": topic, "explanation": explanation}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
