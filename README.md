# LearnFlow Platform

**AI-powered Python tutoring platform for students and teachers**

Built as part of **Hackathon III - Reusable Intelligence and Cloud-Native Mastery**

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Docker](https://img.shields.io/badge/docker-compose-ready-blue)
![Backend](https://img.shields.io/badge/backend-6%20services-green)
![Frontend](https://img.shields.io/badge/frontend-next.js-blue)

---

## 🚀 Hackathon III: Reusable Intelligence

LearnFlow is designed using the **Agentic AI Foundation (AAIF)** standards, focusing on **Skills with MCP Code Execution**. Instead of direct tool calls, AI agents use specialized skills to build, deploy, and manage the platform.

### 🧩 Core Architecture Patterns
- **Skills-First Development**: All infrastructure (Kafka, Postgres, Redis) is managed via agentic skills.
- **MCP Code Execution**: Heavy data operations are offloaded to local scripts, minimizing context bloat.
- **Event-Driven AI**: 6 specialized microservice agents communicate via a unified event bus.

---

## ⚡ Quick Start

### Prerequisites
- **Docker** and **Docker Compose**
- **Node.js 18+** & **Python 3.11+** (for local development)

### One-Command Setup (Recommended)
```bash
# Start all services
docker-compose up -d

# Wait 30s for initialization and check status
docker-compose ps
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API (Triage)**: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 🔐 Authentication (Better Auth)

The platform has been migrated to **Better Auth** for robust session management.

1. **Register**: `http://localhost:3000/register` (Select Student or Instructor).
2. **Login**: `http://localhost:3000/login`.
3. **Session**: Secure, database-backed sessions with HTTP-only cookies.

---

## 🐳 Docker Infrastructure

The entire platform is orchestrated via Docker Compose for consistent local development.

### Running Services
| Container | Role | Port |
|-----------|------|------|
| `frontend` | Next.js UI + Better Auth Server | 3000 |
| `triage-agent` | AI Router & Gateway | 8001 |
| `concepts-agent`| AI Conceptual Tutor | 8002 |
| `debug-agent` | AI Debugging Assistant | 8003 |
| `exercise-agent`| AI Exercise Generator | 8004 |
| `progress-agent`| AI Progress Tracker | 8005 |
| `code-review-agent` | AI Code Quality Reviewer | 8006 |
| `kafka` | Message Broker (Internal) | 9092 |
| `postgres` | Primary Database | 5432 |
| `redis` | Cache & State Store | 6379 |

### Persistent Data
- **Postgres**: User profiles, progress, and auth data.
- **Kafka**: Event streams and message history.
- **Redis**: Temporary state and session cache.

### Networking
Services communicate securely over the internal `learnflow-network`. Container names serve as persistent hostnames.

---

## 📁 Project Structure

- `frontend/`: Next.js frontend & Auth server.
- `backend/services/`: FastAPI-powered AI agents.
- `.claude/skills/`: CORE PRODUCT - Reusable AI agent capabilities.
- `infrastructure/`: K8s manifests, Helm charts, and DB migrations.
- `specs/`: Platform blueprints and data models.

---

## ☁️ Cloud Deployment Note

> [!IMPORTANT]
> **Cloud Deployment Status**: This project has been developed and verified locally using **Minikube** and **Docker Compose**. It has **not** been deployed to a public cloud provider (Azure/GCP/OCI) at this time as those are paid services. The project is fully architected for Kubernetes and ready for cloud deployment.

---

## 📄 License
MIT License - 2026 LearnFlow Team | Built with ❤️ for Hackathon III
