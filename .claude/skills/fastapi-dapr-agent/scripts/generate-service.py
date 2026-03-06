#!/usr/bin/env python3
"""
FastAPI + Dapr Service Generator

Generates a complete FastAPI microservice with Dapr sidecar configuration.
Executes via MCP code execution pattern - minimal tokens in context.
"""

import os
import sys
from pathlib import Path


# Service templates
MAIN_PY_TEMPLATE = '''"""
{service_name} - FastAPI Microservice with Dapr

Auto-generated service for LearnFlow platform.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="{service_title}",
    description="AI Agent service for LearnFlow platform",
    version="1.0.0"
)


# Request/Response Models
class EventMessage(BaseModel):
    topic: str
    data: Dict[str, Any]


class HealthResponse(BaseModel):
    status: str
    service: str


class PublishResponse(BaseModel):
    success: bool
    message: str


@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint for Kubernetes probes."""
    return HealthResponse(
        status="healthy",
        service="{service_name}"
    )


@app.get("/")
def root():
    """Root endpoint with service information."""
    return {{
        "service": "{service_name}",
        "version": "1.0.0",
        "status": "running"
    }}


@app.post("/publish", response_model=PublishResponse)
def publish_event(message: EventMessage):
    """
    Publish an event to Kafka via Dapr pub/sub.
    
    This endpoint demonstrates Dapr pub/sub integration.
    Events are published to the configured Kafka broker.
    """
    try:
        from dapr.clients import DaprClient
        
        with DaprClient() as client:
            client.publish_event(
                pubsub_name='learnflow-pubsub',
                topic_name=message.topic,
                data=message.data.json().encode('utf-8')
            )
        
        logger.info(f"Published event to topic: {{message.topic}}")
        return PublishResponse(
            success=True,
            message=f"Event published to {{message.topic}}"
        )
    except Exception as e:
        logger.error(f"Failed to publish event: {{e}}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/invoke")
def invoke_agent(request: Dict[str, Any]):
    """
    Main agent endpoint for processing requests.
    
    This is where you implement the specific agent logic.
    For example:
    - concepts-agent: Explain Python concepts
    - debug-agent: Help debug code
    - exercise-agent: Generate coding exercises
    """
    # TODO: Implement agent-specific logic here
    return {{
        "service": "{service_name}",
        "response": "Agent processing completed",
        "data": request
    }}


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        log_level="info"
    )
'''

DAPR_PUBSUB_TEMPLATE = '''apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-pubsub
  namespace: learnflow
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka-0.kafka-headless.kafka:9092"
  - name: authType
    value: "none"
  - name: consumerFetchDefault
    value: "1048576"
'''

DAPR_STATESTORE_TEMPLATE = '''apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-statestore
  namespace: learnflow
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: "redis-master:6379"
  - name: redisPassword
    secretKeyRef:
      name: redis-secret
      key: password
auth:
  secretStore: kubernetes-secrets
'''

DEPLOYMENT_TEMPLATE = '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: {service_name}
  namespace: learnflow
  labels:
    app: {service_name}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {service_name}
  template:
    metadata:
      labels:
        app: {service_name}
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "{service_name}"
        dapr.io/app-port: "8080"
        dapr.io/enable-api-logging: "true"
    spec:
      containers:
      - name: {service_name}
        image: {service_name}:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: PYTHONUNBUFFERED
          value: "1"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "256Mi"
'''

SERVICE_TEMPLATE = '''apiVersion: v1
kind: Service
metadata:
  name: {service_name}
  namespace: learnflow
  labels:
    app: {service_name}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: {service_name}
'''

DOCKERFILE_TEMPLATE = '''FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run the application
CMD ["python", "main.py"]
'''

REQUIREMENTS_TEMPLATE = '''fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
dapr==1.12.0
dapr-ext-fastapi==1.12.0
python-json-logger==2.0.7
'''


def create_service(service_name: str, base_path: str) -> bool:
    """Create a complete FastAPI + Dapr service."""
    
    # Convert to valid Kubernetes name (lowercase, hyphens)
    service_name = service_name.lower().replace("_", "-")
    service_title = service_name.replace("-", " ").title()
    
    base_dir = Path(base_path) / "services" / service_name
    
    print(f"📁 Creating service: {service_name}")
    print(f"📂 Location: {base_dir}")
    
    # Create directories
    dirs = [
        base_dir,
        base_dir / "dapr_components",
        base_dir / "k8s"
    ]
    
    for dir_path in dirs:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    # Create files
    files = {
        "main.py": MAIN_PY_TEMPLATE.format(
            service_name=service_name,
            service_title=service_title
        ),
        "requirements.txt": REQUIREMENTS_TEMPLATE,
        "Dockerfile": DOCKERFILE_TEMPLATE,
        "dapr_components/pubsub.yaml": DAPR_PUBSUB_TEMPLATE,
        "dapr_components/statestore.yaml": DAPR_STATESTORE_TEMPLATE,
        "k8s/deployment.yaml": DEPLOYMENT_TEMPLATE.format(service_name=service_name),
        "k8s/service.yaml": SERVICE_TEMPLATE.format(service_name=service_name)
    }
    
    for filename, content in files.items():
        file_path = base_dir / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Created {filename}")
    
    print(f"\n✓ Service '{service_name}' created successfully")
    print(f"\n📝 Next steps:")
    print(f"  1. Review and customize: {base_dir}/main.py")
    print(f"  2. Build image: docker build -t {service_name}:latest {base_dir}")
    print(f"  3. Deploy: kubectl apply -f {base_dir}/k8s/")
    
    return True


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python generate-service.py <service-name> [base-path]")
        print("\nExamples:")
        print("  python generate-service.py concepts-agent")
        print("  python generate-service.py debug-agent ./services")
        sys.exit(1)
    
    service_name = sys.argv[1]
    base_path = sys.argv[2] if len(sys.argv) > 2 else "."
    
    success = create_service(service_name, base_path)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
