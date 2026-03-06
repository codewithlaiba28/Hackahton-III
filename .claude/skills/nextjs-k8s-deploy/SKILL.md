---
name: nextjs-k8s-deploy
description: Deploy Next.js applications to Kubernetes
---

# Next.js Kubernetes Deployment

## When to Use
- Deploying Next.js frontend to Kubernetes
- Containerizing React/Next.js applications
- Setting up production-ready Next.js deployments

## Instructions
1. Generate Dockerfile: `python scripts/generate-dockerfile.py <app-path>`
2. Build image: `./scripts/build-image.sh <app-name>`
3. Deploy to Kubernetes: `./scripts/deploy-nextjs.sh <app-name>`
4. Verify deployment: `python scripts/verify-deployment.py <app-name>`

## Validation
- [ ] Dockerfile created with multi-stage build
- [ ] Image built successfully
- [ ] Deployment running in Kubernetes
- [ ] Service accessible via port-forward
- [ ] Health checks passing

## Examples

```bash
# Generate optimized Dockerfile
python ./.claude/skills/nextjs-k8s-deploy/scripts/generate-dockerfile.py ./frontend

# Build Docker image
./.claude/skills/nextjs-k8s-deploy/scripts/build-image.sh learnflow-frontend

# Deploy to Kubernetes
./.claude/skills/nextjs-k8s-deploy/scripts/deploy-nextjs.sh learnflow-frontend

# Verify deployment
python ./.claude/skills/nextjs-k8s-deploy/scripts/verify-deployment.py learnflow-frontend
```

See [REFERENCE.md](./REFERENCE.md) for Next.js optimization tips and Kubernetes configurations.
