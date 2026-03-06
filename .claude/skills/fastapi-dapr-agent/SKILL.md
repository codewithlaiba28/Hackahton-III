---
name: fastapi-dapr-agent
description: Create FastAPI microservices with Dapr sidecar
---

# FastAPI + Dapr Agent Service

## When to Use
- Creating microservices for LearnFlow platform
- Need state management and pub/sub with Dapr
- Building AI agent services with event-driven architecture

## Instructions
1. Generate service: `python scripts/generate-service.py <service-name>`
2. Review generated files in `services/<service-name>/`
3. Build Docker image: `./scripts/build-image.sh <service-name>`
4. Deploy to Kubernetes: `./scripts/deploy-service.sh <service-name>`

## Validation
- [ ] Service code generated with FastAPI structure
- [ ] Dapr components configured (pubsub, state)
- [ ] Dockerfile created with Dapr sidecar
- [ ] Kubernetes manifests ready for deployment
- [ ] Health endpoints responding

## Examples

```bash
# Generate a new service
python ./.claude/skills/fastapi-dapr-agent/scripts/generate-service.py concepts-agent

# Build Docker image
./.claude/skills/fastapi-dapr-agent/scripts/build-image.sh concepts-agent

# Deploy to Kubernetes
./.claude/skills/fastapi-dapr-agent/scripts/deploy-service.sh concepts-agent
```

See [REFERENCE.md](./REFERENCE.md) for Dapr component configuration and service templates.
