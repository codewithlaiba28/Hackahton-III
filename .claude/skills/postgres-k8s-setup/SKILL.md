---
name: postgres-k8s-setup
description: Deploy PostgreSQL on Kubernetes using Helm
---

# PostgreSQL Kubernetes Setup

## When to Use
- User asks to deploy PostgreSQL to Kubernetes
- Setting up database for LearnFlow platform
- Need persistent storage for application data

## Instructions
1. Ensure Minikube is running: `minikube status`
2. Run deployment: `./scripts/deploy-postgres.sh`
3. Verify status: `python scripts/verify-postgres.py`
4. Run migrations: `python scripts/run-migration.py`
5. Confirm database is accessible before proceeding

## Validation
- [ ] All PostgreSQL pods in Running state
- [ ] Database is accessible via port-forward
- [ ] Required schemas created
- [ ] Connection test successful

## Examples

```bash
# Deploy PostgreSQL
./.claude/skills/postgres-k8s-setup/scripts/deploy-postgres.sh

# Verify deployment
python ./.claude/skills/postgres-k8s-setup/scripts/verify-postgres.py

# Run database migration
python ./.claude/skills/postgres-k8s-setup/scripts/run-migration.py
```

See [REFERENCE.md](./REFERENCE.md) for configuration options and connection strings.
