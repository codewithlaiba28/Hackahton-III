---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes using Helm
---

# Kafka Kubernetes Setup

## When to Use
- User asks to deploy Kafka to Kubernetes
- Setting up event-driven microservices architecture
- Creating message broker for LearnFlow platform

## Instructions
1. Ensure Minikube is running: `minikube status`
2. Run deployment: `./scripts/deploy-kafka.sh`
3. Verify status: `python scripts/verify-kafka.py`
4. Create topics: `python scripts/create-topics.py`
5. Confirm all pods Running before proceeding

## Validation
- [ ] All Kafka and Zookeeper pods in Running state
- [ ] Can create test topic successfully
- [ ] Kafka namespace exists
- [ ] Helm release is deployed

## Examples

```bash
# Deploy Kafka
./.claude/skills/kafka-k8s-setup/scripts/deploy-kafka.sh

# Verify deployment
python ./.claude/skills/kafka-k8s-setup/scripts/verify-kafka.py

# Create topics for LearnFlow
python ./.claude/skills/kafka-k8s-setup/scripts/create-topics.py
```

See [REFERENCE.md](./REFERENCE.md) for configuration options and troubleshooting.
