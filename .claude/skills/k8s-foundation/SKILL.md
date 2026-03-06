---
name: k8s-foundation
description: Check cluster health and apply basic Helm charts
---

# Kubernetes Foundation Operations

## When to Use
- User asks to verify the health of the Kubernetes cluster (Minikube).
- User asks to execute basic Helm operations or view chart status.

## Instructions
This skill provides scripts for basic Kubernetes cluster health checks.
1. Run `./scripts/check_health.sh` to get the status of the cluster and core components.
2. Ensure Minikube is running before executing Helm operations.

## Validation
- [ ] Cluster info returns successfully.
- [ ] Nodes are in 'Ready' state.
