# Research & Technical Decisions: LearnFlow Platform

**Created**: 2026-03-02
**Purpose**: Document technical decisions and rationale for LearnFlow Platform

---

## Decision 1: Dapr Pub/Sub with Kafka Integration

**Context**: Microservices need to communicate asynchronously for events like code submissions, progress updates, and struggle alerts.

### Decision
Use Dapr's Kafka pubsub component to abstract Kafka complexity.

### Rationale
- **Simplicity**: Dapr provides unified API regardless of underlying message broker
- **Resilience**: Built-in retry policies, dead letter queues
- **Observability**: Automatic tracing and metrics
- **Constitution Alignment**: Script-first architecture with Dapr sidecar pattern

### Configuration
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-pubsub
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
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Direct Kafka SDK | Full control, no sidecar | More complex, tight coupling | Violates loose coupling principle |
| RabbitMQ | Simpler setup | Less scalable, no event streaming | Kafka better for event sourcing |
| AWS SQS | Managed service | Cloud vendor lock-in | Violates local-first principle |

---

## Decision 2: Code Execution Sandbox

**Context**: Students write Python code that must execute safely without accessing host system or consuming excessive resources.

### Decision
Docker-in-Docker with resource limits (5s timeout, 50MB memory).

### Rationale
- **Security**: Complete isolation from host system
- **Resource Control**: CPU, memory limits enforced by Docker
- **Flexibility**: Can install any Python packages
- **Constitution Alignment**: 5s timeout, 50MB limit as specified

### Implementation Pattern
```python
# Script executes via MCP Code Execution
docker run --rm \
  --memory="50m" \
  --cpus="0.5" \
  --network="none" \
  -v /tmp/code:/code:ro \
  python:3.11-slim \
  timeout 5 python /code/solution.py
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Pyodide (WebAssembly) | Browser-based, no server | Limited library support, slow startup | Can't support all Python packages |
| RestrictedPython | Lightweight | Security gaps, complex sandboxing | Docker provides stronger isolation |
| gVisor | Stronger security | More complex, performance overhead | Overkill for educational context |

---

## Decision 3: AI Agent Communication Pattern

**Context**: 5 AI agents (Triage, Concepts, Debug, Exercise, Progress) need to coordinate without tight coupling.

### Decision
Event-driven architecture via Kafka topics with Dapr pub/sub.

### Rationale
- **Loose Coupling**: Agents don't call each other directly
- **Audit Trail**: All events persisted in Kafka
- **Scalability**: Agents can scale independently
- **Constitution Alignment**: Event-driven architecture standard

### Event Flow Example
```
Student submits code
  → code.submissions topic
    → Debug Agent processes
      → progress.updates topic (if correct)
      → student.struggles topic (if stuck)
        → Progress Agent updates dashboard
        → Teacher alerted if struggle detected
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Direct HTTP/RPC | Simpler, synchronous | Tight coupling, cascading failures | Violates microservice principles |
| GraphQL Federation | Unified API schema | Complex setup, synchronous | Not suitable for async events |
| Service Mesh (Istio) | Advanced traffic management | Overkill complexity | Dapr sufficient for our needs |

---

## Decision 4: Progress Tracking Storage

**Context**: Real-time dashboards showing student mastery across 8 modules with color-coded status.

### Decision
PostgreSQL with materialized views for dashboard queries.

### Rationale
- **Persistence**: Data survives restarts (unlike Redis)
- **Complex Queries**: Aggregations, joins for analytics
- **Materialized Views**: Fast dashboard loads
- **Constitution Alignment**: PostgreSQL via postgres-k8s-setup skill

### Schema Pattern
```sql
-- Materialized view for dashboards
CREATE MATERIALIZED VIEW student_dashboard AS
SELECT 
  u.id,
  u.name,
  m.module_id,
  AVG(p.mastery_score) as avg_mastery,
  CASE 
    WHEN AVG(p.mastery_score) >= 91 THEN 'Mastered'
    WHEN AVG(p.mastery_score) >= 71 THEN 'Proficient'
    WHEN AVG(p.mastery_score) >= 41 THEN 'Learning'
    ELSE 'Beginner'
  END as status
FROM users u
JOIN progress p ON u.id = p.user_id
JOIN modules m ON p.module_id = m.id
GROUP BY u.id, u.name, m.module_id;
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Redis | Fast, simple | No persistence (without extra config) | Need durable storage |
| MongoDB | Flexible schema | Complex aggregations | PostgreSQL sufficient |
| Elasticsearch | Great analytics | Overkill, resource-heavy | Simple dashboards don't need ES |

---

## Decision 5: AI Model Integration

**Context**: AI agents need to generate explanations, evaluate code, and provide feedback.

### Decision
Use OpenAI API via OpenAI Agents SDK with fallback to local models.

### Rationale
- **Quality**: Best code generation and reasoning
- **SDK Support**: OpenAI Agents SDK provides structured interactions
- **Fallback**: Can switch to local models for development
- **Constitution Alignment**: MCP Code Execution pattern for API calls

### Integration Pattern
```python
# MCP Code Execution - script handles API calls
from openai import OpenAI

client = OpenAI()

def explain_concept(concept: str, level: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Explain Python concepts to {level} students"},
            {"role": "user", "content": f"Explain: {concept}"}
        ]
    )
    return response.choices[0].message.content
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Local LLM (Llama) | Free, private | Lower quality, resource-heavy | Quality critical for education |
| Anthropic Claude | Good reasoning | API cost similar | OpenAI better for code |
| Fine-tuned Models | Customized | Training complexity | Base models sufficient for MVP |

---

## Decision 6: Frontend Architecture

**Context**: Students need embedded code editor (Monaco), chat interface, and progress dashboard.

### Decision
Next.js 14 with App Router, Monaco Editor, and server-side rendering.

### Rationale
- **Monaco Editor**: Same editor as VS Code, excellent Python support
- **Next.js**: React framework with SSR, API routes
- **Server Components**: Reduce client bundle, faster initial load
- **Constitution Alignment**: nextjs-k8s-deploy skill ready

### Component Structure
```
src/components/
├── CodeEditor.tsx      # Monaco wrapper
├── ChatInterface.tsx   # AI conversation
├── ProgressChart.tsx   # Mastery visualization
├── QuizView.tsx        # Quiz interface
└── Dashboard.tsx       # Main student view
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Create React App | Simpler | No SSR, larger bundle | Next.js better performance |
| Vite + React | Fast dev | No SSR built-in | Need SSR for dashboards |
| Vue/Nuxt | Good DX | Smaller ecosystem | React has more resources |

---

## Summary of Technology Choices

| Layer | Technology | Version | Purpose |
| ----- | ---------- | ------- | ------- |
| Frontend | Next.js | 14 | UI framework |
| Editor | Monaco | 0.44 | Code editor |
| Backend | FastAPI | 0.109 | API framework |
| AI SDK | OpenAI Agents | Latest | AI integration |
| Message Bus | Kafka | 3.x | Event streaming |
| Service Mesh | Dapr | 1.12 | Pub/sub, state |
| Database | PostgreSQL | 15 | Data storage |
| Orchestration | Kubernetes | 1.29 | Container orchestration |
| Package Manager | Helm | 3.x | K8s deployments |
| Local Cluster | Minikube | Latest | Development |

---

## Next Steps

1. ✅ Research complete - all NEEDS CLARIFICATION resolved
2. Proceed to data-model.md with entity definitions
3. Generate API contracts from research decisions
4. Create quickstart.md with development setup
