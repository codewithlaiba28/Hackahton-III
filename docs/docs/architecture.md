---
sidebar_position: 2
---

# Architecture Overview

LearnFlow is designed as a cloud-native, event-driven microservices platform. It leverages **Dapr** for service invocation and pub/sub, uses **Kafka** for event streaming, and is orchestrated via **Kubernetes**.

## Central Neural Engine (Triage Agent)
The Triage Agent acts as the intelligent gateway. It uses LLM-based routing to direct student queries to specialized workers:
- **Concepts Agent**: Explains Python theory.
- **Debug Agent**: Analyzes code errors.
- **Exercise Agent**: Generates tailored practice problems.

## Data & Analytics (Progress Agent)
The Progress Agent manages the student's learning journey:
- **Mastery Scoring**: A weighted algorithm (Exercises 40%, Quizzes 30%, Code Quality 20%, Consistency 10%).
- **Struggle Alert System**: Real-time event detection. When a student scores < 50% on a quiz, a `struggle.alerts` event is published to Kafka.

## Technology Stack
- **Frontend**: Next.js 14, Tailwind CSS, Monaco Editor.
- **Backend**: FastAPI (Python 3.12).
- **Messaging**: Kafka (via Dapr Pub/Sub).
- **Identity**: JWT-based Authentication.
- **GitOps**: Argo CD + GitHub Actions.

## High-Level Flow
1. **Student** submits a quiz on the Frontend.
2. **Progress Agent** processes the result and updates the PostgreSQL DB.
3. If the score is low, **Progress Agent** publishes a message to the `struggle.alerts` Kafka topic.
4. **Teacher Dashboard** (via potential future worker or real-time API) surface the alert for proactive tutoring.
