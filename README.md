# LearnFlow Platform

**AI-powered Python tutoring platform for students and teachers**

Built as part of **Hackathon III - Reusable Intelligence and Cloud-Native Mastery**

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Docker](https://img.shields.io/badge/docker-compose-ready-blue)
![Backend](https://img.shields.io/badge/backend-6%20services-green)
![Frontend](https://img.shields.io/badge/frontend-next.js-blue)

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

Make sure you have installed:
- **Docker** and **Docker Compose** - [Get Docker](https://www.docker.com/get-started)
- **Node.js 18+** (optional, for local frontend dev) - [Download](https://nodejs.org/)
- **Python 3.11+** (optional, for local backend dev) - [Download](https://www.python.org/)

### Option 1: Docker Compose (RECOMMENDED - Easiest)

```bash
# 1. Clone or navigate to project
cd C:\Code-journy\Quator-4\Hackahton-III

# 2. Start all services (frontend, backend, database, kafka)
docker-compose up -d

# 3. Wait 30 seconds for services to initialize
# You can check status with:
docker-compose ps

# 4. Open browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:8001/docs
```

**That's it!** Your entire LearnFlow platform is now running with:
- ✅ Frontend (Next.js)
- ✅ 6 Backend Services (FastAPI microservices)
- ✅ PostgreSQL Database
- ✅ Kafka Message Queue
- ✅ Redis Cache

### Option 2: Local Development (For Developers)

```bash
# 1. Start infrastructure only (Database + Kafka)
docker-compose up -d postgres kafka redis zookeeper

# 2. Install backend dependencies
cd backend/services
pip install -r requirements.txt

# 3. Set environment variables
cp .env.template .env
# Edit .env if needed (default values work for local dev)

# 4. Start backend services (in separate terminals)
cd triage-agent && uvicorn main:app --reload --port 8001
cd ../concepts-agent && uvicorn main:app --reload --port 8002
cd ../debug-agent && uvicorn main:app --reload --port 8003
cd ../exercise-agent && uvicorn main:app --reload --port 8004
cd ../progress-agent && uvicorn main:app --reload --port 8005
cd ../code-review-agent && uvicorn main:app --reload --port 8006

# 5. Install and start frontend (in new terminal)
cd ../../frontend
npm install
npm run dev

# 6. Open browser
# Frontend: http://localhost:3000
```

---

## 📋 User Guide

### For Students

#### 1. Register Account

1. Go to http://localhost:3000
2. Click **Register** or go to http://localhost:3000/register
3. Fill in:
   - **Name**: Your name
   - **Email**: Your email
   - **Password**: Choose a password
   - **Role**: Select **Student**
4. Click **Initialize Uplink** (Register button)
5. You'll be automatically logged in and redirected to your dashboard

#### 2. Use AI Tutor Chat

1. From dashboard, you'll see the **Neural Tutor Interface** chat
2. Type your Python question, e.g.:
   - "How do for loops work in Python?"
   - "Explain list comprehensions"
   - "What is a function?"
3. Press Enter or click Send
4. AI will respond with explanation and code examples

#### 3. Write and Execute Code

1. Click the **Open Sandbox** button (code icon) on dashboard
2. Write Python code in the Monaco editor
3. Click **Run** to execute your code
4. See output and results instantly

#### 4. Track Your Progress

1. Click **Progress** in the sidebar
2. View your mastery scores for each module
3. See completed exercises and quizzes
4. Track your learning journey

### For Teachers

#### 1. Register as Teacher

1. Go to http://localhost:3000/register
2. Fill in your details
3. Select **Instructor** as role
4. Click Register
5. You'll be redirected to teacher dashboard

#### 2. View Class Analytics

1. From teacher dashboard, see:
   - **Active Students** count
   - **Average Mastery** percentage
   - **Struggle Alerts** - students who need help
   - **Module Breakdown** - per-topic performance

#### 3. Monitor Individual Students

1. Click on any student name
2. View their:
   - Progress per module
   - Mastery scores
   - Recent submissions
   - Struggle events

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DOCKER CONTAINERS                      │
│                                                             │
│  ┌─────────────┐    ┌─────────────────────────────────┐    │
│  │  Frontend   │    │      Backend Services           │    │
│  │  Next.js    │───▶│  ┌──────┐ ┌──────┐ ┌──────┐   │    │
│  │  :3000      │    │  │Triage│ │Concepts│ │Debug │   │    │
│  └─────────────┘    │  │:8001 │ │:8002  │ │:8003 │   │    │
│                     │  └──────┘ └──────┘ └──────┘   │    │
│                     │  ┌──────┐ ┌──────┐ ┌──────┐   │    │
│                     │  │Exercise│ │Progress│ │Code │   │    │
│                     │  │:8004  │ │:8005  │ │Review│   │    │
│                     │  └──────┘ └──────┘ └──────┘   │    │
│                     └─────────────────────────────────┘    │
│                              │                              │
│         ┌────────────────────┴────────────────────┐        │
│         │                                         │        │
│  ┌─────────────┐                          ┌─────────────┐  │
│  │  PostgreSQL │                          │    Kafka    │  │
│  │  Database   │                          │  Messaging  │  │
│  │  :5432      │                          │   :9092     │  │
│  └─────────────┘                          └─────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | Next.js web application |
| **Triage Agent** | 8001 | Routes queries to specialists |
| **Concepts Agent** | 8002 | Python explanations with AI |
| **Debug Agent** | 8003 | Error resolution help |
| **Exercise Agent** | 8004 | Custom exercises & quizzes |
| **Progress Agent** | 8005 | Progress tracking & mastery |
| **Code Review Agent** | 8006 | Code quality feedback |
| **PostgreSQL** | 5432 | User data & progress |
| **Kafka** | 9092 | Event streaming |
| **Redis** | 6379 | Caching & state |
| **Zookeeper** | 2181 | Kafka coordination |

---

## 🔧 Management Commands

### Start Services

```bash
# Start everything
docker-compose up -d

# Start specific service
docker-compose up -d frontend
docker-compose up -d triage-agent
docker-compose up -d postgres
```

### View Logs

```bash
# All services logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f frontend
docker-compose logs -f triage-agent
docker-compose logs -f postgres
```

### Stop Services

```bash
# Stop everything
docker-compose down

# Stop specific service
docker-compose stop frontend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart frontend
docker-compose restart triage-agent
```

### Check Status

```bash
# See all running containers
docker-compose ps

# Check service health
docker-compose ps --filter "status=healthy"
```

### Database Management

```bash
# View database logs
docker-compose logs postgres

# Access database CLI
docker exec -it hackahton-iii-postgres-1 psql -U learnflow -d learnflow

# List tables
docker exec -it hackahton-iii-postgres-1 psql -U learnflow -d learnflow -c "\dt"

# View users
docker exec -it hackahton-iii-postgres-1 psql -U learnflow -d learnflow -c "SELECT id, email, name, role FROM users;"
```

### Fresh Start (Reset Everything)

```bash
# Stop and remove everything including database
docker-compose down --volumes

# Start fresh
docker-compose up -d

# Wait 30 seconds for database initialization
# Then register new user at http://localhost:3000/register
```

---

## 🧪 Testing

### Test Registration

```bash
# Test registration API
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User","role":"student"}'
```

### Test Login

```bash
# Test login API
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Chat

```bash
# Get token from login response, then test chat
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"user_id":"user-xxx","message":"Hello"}'
```

### Health Checks

```bash
# Check all services are healthy
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
curl http://localhost:8006/health
```

---

## 📁 Project Structure

```
Hackahton-III/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── CodeEditor.tsx
│   │   │   └── ui/
│   │   ├── pages/            # Pages
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── student/
│   │   │   │   └── dashboard.tsx
│   │   │   └── teacher/
│   │   │       └── dashboard.tsx
│   │   └── services/         # API layer
│   │       └── api.ts
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── services/             # FastAPI microservices
│   │   ├── triage-agent/     # Routes queries
│   │   ├── concepts-agent/   # Explanations
│   │   ├── debug-agent/      # Error help
│   │   ├── exercise-agent/   # Exercises
│   │   ├── progress-agent/   # Progress tracking
│   │   └── code-review-agent/ # Code reviews
│   ├── shared/               # Shared code
│   │   ├── models.py         # Database models
│   │   ├── auth.py           # Authentication
│   │   └── database.py       # DB connection
│   ├── tests/                # Backend tests
│   └── requirements.txt
│
├── infrastructure/
│   ├── postgres/
│   │   └── migrations/       # Database schema
│   │       ├── 001_initial_schema.sql
│   │       ├── 002_better_auth.sql
│   │       └── 003_fix_user_constraints.sql
│   ├── kafka/
│   │   └── topics/           # Kafka topics
│   └── helm/learnflow/       # Kubernetes Helm chart
│
├── .claude/skills/           # AI Skills (MCP Code Execution)
│   ├── agents-md-gen/
│   ├── kafka-k8s-setup/
│   ├── postgres-k8s-setup/
│   ├── fastapi-dapr-agent/
│   ├── mcp-code-execution/
│   ├── nextjs-k8s-deploy/
│   ├── docusaurus-deploy/
│   ├── k8s-foundation/
│   └── argocd-app-deployment/
│
├── history/prompts/          # Conversation History (PHRs)
│   ├── constitution/
│   ├── spec/
│   ├── plan/
│   ├── tasks/
│   ├── red/
│   ├── green/
│   └── general/
│
├── specs/                    # Specifications
│   └── 1-learnflow-platform/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── data-model.md
│
├── docker-compose.yml        # Docker orchestration
├── STATUS_REPORT.md          # Current status
├── VERIFICATION_REPORT.md    # Verification report
└── README.md                 # This file
```

---

## 🎯 Features

### Student Features ✅

- [x] **AI Tutor Chat** - Real-time conversation with AI agents
- [x] **Code Editor** - Monaco editor with Python execution
- [x] **Progress Tracking** - Mastery scores per module
- [x] **Dashboard** - Overview of learning progress
- [x] **Chat History** - Message history with agent info
- [x] **Role-based Redirect** - Auto-redirect after registration

### Teacher Features ✅

- [x] **Class Analytics** - Overall class performance
- [x] **Student List** - Individual student tracking
- [x] **Struggle Alerts** - Notifications for struggling students
- [x] **Module Breakdown** - Per-topic mastery scores
- [x] **Dashboard** - Teacher-specific analytics

### Backend Features ✅

- [x] **JWT Authentication** - Secure token-based auth
- [x] **AI Agent Routing** - Keyword-based intent detection
- [x] **Database Persistence** - PostgreSQL with migrations
- [x] **Event Streaming** - Kafka messaging
- [x] **CORS Support** - Cross-origin requests enabled
- [x] **Health Checks** - All services monitored

---

## 🛠️ Troubleshooting

### Frontend Won't Start

```bash
# Check logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Backend Service Down

```bash
# Check which service is down
docker-compose ps

# View logs for that service
docker-compose logs triage-agent

# Restart the service
docker-compose restart triage-agent
```

### Database Connection Error

```bash
# Check if postgres is running
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# Wait 10 seconds for it to initialize
# Then restart backend services
docker-compose restart triage-agent progress-agent
```

### CORS Errors

```bash
# Make sure all backend services have CORS enabled
# Check triage-agent logs
docker-compose logs triage-agent

# Restart all backend services
docker-compose restart triage-agent concepts-agent debug-agent exercise-agent progress-agent
```

### 500 Internal Server Error

```bash
# Check service logs
docker-compose logs triage-agent
docker-compose logs progress-agent

# Common fix: restart all services
docker-compose restart

# If still failing, check database
docker-compose logs postgres
```

### Can't Register

```bash
# Check if database is initialized
docker-compose logs postgres | grep "database system is ready"

# Check triage-agent logs
docker-compose logs triage-agent

# Try fresh start
docker-compose down --volumes
docker-compose up -d
# Wait 30 seconds
# Try registering again
```

---

## 📊 API Documentation

### Authentication

```bash
# Register
POST http://localhost:8001/api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "Student Name",
  "role": "student"
}

# Login
POST http://localhost:8001/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": {
    "id": "user-xxx",
    "email": "student@example.com",
    "name": "Student Name",
    "role": "student"
  }
}
```

### Chat

```bash
# Send message
POST http://localhost:8001/api/chat
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "user_id": "user-xxx",
  "message": "How do for loops work?"
}
```

### Progress

```bash
# Get user progress
GET http://localhost:8005/api/progress/{user_id}
Authorization: Bearer YOUR_TOKEN
```

### Swagger Documentation

Each service has interactive API docs:
- Triage Agent: http://localhost:8001/docs
- Concepts Agent: http://localhost:8002/docs
- Debug Agent: http://localhost:8003/docs
- Exercise Agent: http://localhost:8004/docs
- Progress Agent: http://localhost:8005/docs
- Code Review Agent: http://localhost:8006/docs

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with Docker
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🎓 Hackathon III

**Project:** LearnFlow Platform  
**Team:** LearnFlow Team  
**Date:** 2026  
**Standards:** Agentic AI Foundation (AAIF)  

**Built with:**
- Next.js 14 (Frontend)
- FastAPI (Backend)
- PostgreSQL (Database)
- Kafka (Messaging)
- Docker (Containerization)
- AI Skills with MCP Code Execution

---

## 🆘 Support

For issues or questions:

1. Check this README
2. View service logs: `docker-compose logs [service-name]`
3. Check [STATUS_REPORT.md](./STATUS_REPORT.md)
4. Check [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)
5. Review [specs](./specs/) directory

---

**Built with ❤️ using Next.js, FastAPI, Kafka, and Docker**

**Status:** ✅ Ready for Testing | ⏸️ Cloud Deployment Pending
