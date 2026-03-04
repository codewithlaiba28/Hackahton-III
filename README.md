# LearnFlow Platform

**AI-powered Python tutoring platform for students and teachers**

Built as part of Hackathon III - Reusable Intelligence and Cloud-Native Mastery

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.11+** with pip
- **Docker** and **Docker Compose** (for containerized deployment)
- **Minikube** and **Helm** (for Kubernetes deployment)

### Option 1: Local Development (Recommended for Testing)

```bash
# 1. Start infrastructure (Kafka, PostgreSQL, Redis)
docker-compose up -d kafka postgres redis zookeeper

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../backend/services
pip install -r requirements.txt

# 4. Set environment variables
cp backend/services/.env.template backend/services/.env
# Edit .env and add your OPENAI_API_KEY

# 5. Start backend services (in separate terminals)
cd backend/services/triage-agent && uvicorn main:app --reload --port 8001
cd backend/services/concepts-agent && uvicorn main:app --reload --port 8002
cd backend/services/debug-agent && uvicorn main:app --reload --port 8003
cd backend/services/exercise-agent && uvicorn main:app --reload --port 8004
cd backend/services/progress-agent && uvicorn main:app --reload --port 8005

# 6. Start frontend (in another terminal)
cd frontend
npm run dev

# 7. Open browser
# Frontend: http://localhost:3000
# Login: http://localhost:3000/login
```

### Option 2: Docker Compose (All Services)

```bash
# Build and start everything
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Option 3: Kubernetes Deployment

```bash
# Start Minikube
minikube start --cpus=4 --memory=8192

# Install Helm chart
helm install learnflow ./infrastructure/helm/learnflow \
  --namespace learnflow \
  --create-namespace \
  --set secrets.openaiApiKey=your-openai-api-key

# Check deployment
kubectl get pods -n learnflow
kubectl get services -n learnflow

# Port forward for access
kubectl port-forward svc/learnflow-frontend 3000:3000 -n learnflow
kubectl port-forward svc/learnflow-triage-agent 8001:8001 -n learnflow

# Open browser
# http://localhost:3000
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      KUBERNETES CLUSTER                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Next.js    │    │  Triage     │    │  Concepts   │     │
│  │  Frontend   │    │  Agent      │    │  Agent      │     │
│  │  :3000      │    │  :8001      │    │  :8002      │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│         ┌──────────────────┴──────────────────┐             │
│         │              KAFKA                  │             │
│         │  learning.* | code.* | progress.*   │             │
│         └──────────────────┬──────────────────┘             │
│                            │                                │
│         ┌──────────────────┴──────────────┐                 │
│         │        PostgreSQL               │                 │
│         │        (Neon DB)                │                 │
│         └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Backend Services

| Service | Port | Description |
|---------|------|-------------|
| **Triage Agent** | 8001 | Routes student queries to specialized agents |
| **Concepts Agent** | 8002 | Generates Python explanations with AI |
| **Debug Agent** | 8003 | Helps debug code errors |
| **Exercise Agent** | 8004 | Generates custom exercises and quizzes |
| **Progress Agent** | 8005 | Tracks student progress and mastery |

### Infrastructure

| Component | Purpose |
|-----------|---------|
| **Kafka** | Event streaming between services |
| **PostgreSQL** | User data, progress, submissions |
| **Redis** | Dapr statestore (optional) |
| **Dapr** | Service mesh (optional) |

---

## 📁 Project Structure

```
Hackahton-III/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Next.js pages
│   │   ├── services/         # API service layer
│   │   └── styles/           # CSS styles
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── services/             # FastAPI microservices
│   │   ├── triage-agent/
│   │   ├── concepts-agent/
│   │   ├── debug-agent/
│   │   ├── exercise-agent/
│   │   └── progress-agent/
│   └── shared/               # Shared models and utilities
│       ├── models.py
│       ├── auth.py
│       └── dapr_components/
│
├── infrastructure/
│   ├── helm/learnflow/       # Helm chart for K8s
│   ├── kafka/topics/         # Kafka topic definitions
│   └── postgres/migrations/  # Database migrations
│
├── .claude/skills/           # AI agent skills
│   ├── kafka-k8s-setup/
│   ├── postgres-k8s-setup/
│   ├── fastapi-dapr-agent/
│   └── ...
│
├── specs/                    # Specification documents
│   └── 1-learnflow-platform/
│
├── docker-compose.yml        # Local development
└── README.md                 # This file
```

---

## 🎯 Features

### For Students

- **AI Tutor Chat** - Ask questions and get instant explanations
- **Code Editor** - Write and execute Python code in browser
- **Progress Tracking** - See mastery scores for each module
- **Custom Exercises** - Get personalized practice problems
- **Real-time Feedback** - Debug errors with AI assistance

### For Teachers

- **Class Dashboard** - Monitor overall class progress
- **Struggle Alerts** - Get notified when students need help
- **Module Analytics** - See which topics need more attention
- **Student List** - Track individual student progress
- **Intervention Tools** - Assign custom exercises

---

## 🔐 Authentication

The platform uses JWT-based authentication:

```bash
# Login endpoint
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}

# Response includes JWT token
{
  "access_token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "role": "student"
  }
}
```

---

## 📊 API Endpoints

### Triage Agent (`:8001`)

```
POST /api/chat          - Send message (auto-routes to specialist)
GET  /health            - Health check
GET  /api/route         - Debug: see routing decision
```

### Concepts Agent (`:8002`)

```
POST /api/chat          - Get Python explanations
POST /api/code/execute  - Execute Python code
GET  /api/topics/:topic - Get topic explanation
```

### Debug Agent (`:8003`)

```
POST /api/chat          - Get help with errors
POST /api/struggle/detect - Detect student struggles
```

### Exercise Agent (`:8004`)

```
POST /api/exercise/generate - Generate custom exercise
POST /api/quiz/generate     - Generate quiz
POST /api/quiz/submit       - Submit quiz for grading
POST /api/exercise/assign   - Assign exercise to student
```

### Progress Agent (`:8005`)

```
GET  /api/progress/:user_id    - Get user progress
POST /api/progress/update      - Update progress
POST /api/submissions/track    - Track code submission
POST /api/quiz/results         - Process quiz result
```

---

## 🛠️ Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend/services
pytest
```

### Code Style

```bash
# Frontend linting
cd frontend
npm run lint

# Backend formatting
cd backend/services
black .
flake8
```

### Building Docker Images

```bash
# Frontend
docker build -t learnflow-frontend:latest ./frontend

# Backend (per service)
docker build -t learnflow-triage-agent:latest ./backend/services \
  --build-arg SERVICE_NAME=triage-agent
```

---

## 🚢 Deployment

### Kubernetes (Production)

```bash
# 1. Configure values
vim infrastructure/helm/learnflow/values.yaml

# 2. Install
helm install learnflow ./infrastructure/helm/learnflow \
  --namespace learnflow \
  --create-namespace

# 3. Monitor
kubectl get pods -n learnflow -w

# 4. Upgrade
helm upgrade learnflow ./infrastructure/helm/learnflow \
  --namespace learnflow \
  --set image.tag=v1.0.1

# 5. Uninstall
helm uninstall learnflow -n learnflow
```

---

## 📝 Skills Library

This project uses AI Skills with MCP Code Execution:

| Skill | Purpose |
|-------|---------|
| `kafka-k8s-setup` | Deploy Kafka to Kubernetes |
| `postgres-k8s-setup` | Deploy PostgreSQL |
| `fastapi-dapr-agent` | Generate FastAPI services |
| `nextjs-k8s-deploy` | Deploy Next.js apps |
| `mcp-code-execution` | MCP code execution pattern |
| `agents-md-gen` | Generate AGENTS.md files |
| `docusaurus-deploy` | Deploy documentation |

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🎓 Hackathon III

This project was built for **Hackathon III: Reusable Intelligence and Cloud-Native Mastery**

**Team:** LearnFlow Team  
**Date:** 2026  
**Standards:** Agentic AI Foundation (AAIF)

---

## 🆘 Support

For issues or questions:

1. Check the [specs](./specs/) directory for documentation
2. Review [quickstart.md](./specs/1-learnflow-platform/quickstart.md)
3. Open an issue on GitHub

---

**Built with ❤️ using Next.js, FastAPI, Kafka, and Kubernetes**
