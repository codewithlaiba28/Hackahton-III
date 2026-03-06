# LearnFlow Quick Start Guide

**Get up and running in 5 minutes!**

---

## Step 1: Verify Prerequisites

```bash
# Check Node.js
node --version  # Should be 18+
npm --version

# Check Python
python --version  # Should be 3.11+
pip --version

# Check Docker (for containerized deployment)
docker --version
docker-compose --version

# Check Kubernetes (for K8s deployment)
minikube version
helm version
kubectl version
```

---

## Step 2: Choose Your Deployment Method

### Method A: Local Development (Fastest)

Best for: Testing and development

```bash
# 1. Start infrastructure
cd C:\Code-journy\Quator-4\Hackahton-III
docker-compose up -d kafka postgres redis

# 2. Install frontend
cd frontend
npm install

# 3. Install backend
cd ../backend/services
pip install -r requirements.txt

# 4. Set environment
cp .env.template .env
# Edit .env - add OPENAI_API_KEY if you have one

# 5. Start services (each in separate terminal)
# Terminal 1 - Triage Agent
cd triage-agent
uvicorn main:app --reload --port 8001

# Terminal 2 - Concepts Agent
cd ../concepts-agent
uvicorn main:app --reload --port 8002

# Terminal 3 - Debug Agent
cd ../debug-agent
uvicorn main:app --reload --port 8003

# Terminal 4 - Exercise Agent
cd ../exercise-agent
uvicorn main:app --reload --port 8004

# Terminal 5 - Progress Agent
cd ../progress-agent
uvicorn main:app --reload --port 8005

# Terminal 6 - Frontend
cd ../../frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Login: http://localhost:3000/login
- Student Dashboard: http://localhost:3000/student/dashboard

---

### Method B: Docker Compose (All-in-One)

Best for: Testing full stack locally

```bash
# Build and start everything
docker-compose up -d --build

# Wait for services (check logs)
docker-compose logs -f

# When ready, access:
# Frontend: http://localhost:3000
```

**Stop services:**
```bash
docker-compose down
```

---

### Method C: Kubernetes (Production-Ready)

Best for: Full deployment testing

```bash
# 1. Start Minikube
minikube start --cpus=4 --memory=8192

# 2. Verify cluster
kubectl cluster-info

# 3. Install LearnFlow
helm install learnflow ./infrastructure/helm/learnflow \
  --namespace learnflow \
  --create-namespace \
  --set secrets.openaiApiKey=sk-your-key-here

# 4. Check deployment (wait for all pods Running)
kubectl get pods -n learnflow -w

# 5. Port forward services
kubectl port-forward svc/learnflow-frontend 3000:3000 -n learnflow

# 6. Access
# Open: http://localhost:3000
```

**Uninstall:**
```bash
helm uninstall learnflow -n learnflow
minikube stop
```

---

## Step 3: Test the Platform

### 1. Login

- Go to http://localhost:3000/login
- Use any email/password (demo mode)
- You'll be redirected to student dashboard

### 2. Try AI Tutor

- Click "Learn" tab
- Type: "Explain Python functions"
- See AI response with code example

### 3. Run Code

- In the Code Editor, type:
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("LearnFlow"))
```
- Click "Run" button
- See output in the output panel

### 4. Check Progress

- Click "Progress" tab
- See your learning modules
- View mastery scores

### 5. Teacher Dashboard

- Go to http://localhost:3000/teacher/dashboard
- View class analytics
- See struggle alerts

---

## Step 4: Verify All Services

```bash
# Check backend health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health

# Check Kafka
docker-compose exec kafka kafka-topics.sh --list --bootstrap-server localhost:9092

# Check PostgreSQL
docker-compose exec postgres psql -U learnflow -d learnflow -c "\dt"
```

---

## Troubleshooting

### Frontend won't start

```bash
# Clear cache
cd frontend
rm -rf .next
npm run dev
```

### Backend service fails

```bash
# Check Python version
python --version  # Must be 3.11+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Kafka connection error

```bash
# Restart Kafka
docker-compose restart kafka

# Check logs
docker-compose logs kafka
```

### Database connection error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart if needed
docker-compose restart postgres
```

### Kubernetes pods not starting

```bash
# Check pod status
kubectl get pods -n learnflow

# View logs
kubectl logs <pod-name> -n learnflow

# Describe for events
kubectl describe pod <pod-name> -n learnflow
```

---

## Next Steps

1. **Explore the codebase** - Check `specs/` for detailed documentation
2. **Customize** - Modify `.env` for your configuration
3. **Add features** - See `tasks.md` for implementation tasks
4. **Deploy** - Use Helm chart for production deployment

---

## Environment Variables

### Required (`.env`)

```bash
# Application
APP_ENV=development
DEBUG=true

# Authentication
JWT_SECRET_KEY=your-secret-key-here

# OpenAI (optional - features work without it)
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://learnflow:learnflow-password@localhost:5432/learnflow

# Kafka
KAFKA_BROKERS=localhost:9092
```

---

## Useful Commands

```bash
# View all running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart frontend

# Stop everything
docker-compose down

# Clean up volumes
docker-compose down -v

# Kubernetes: view resources
kubectl get all -n learnflow

# Kubernetes: scale service
kubectl scale deployment learnflow-concepts-agent --replicas=3 -n learnflow
```

---

**Need help?** Check the main [README.md](../../README.md) or [specs](../specs/) directory.
