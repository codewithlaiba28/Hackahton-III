---
name: agent-performance-monitor
description: Monitor LearnFlow AI agent performance (latency, health, throughput)
---

# Agent Performance Monitor

## When to Use
- Checking if agents are responding within SLA ( < 10s )
- Troubleshooting slow responses in the LearnFlow platform
- Verifying agent health across the Kubernetes cluster

## Instructions
1. Ensure all agent services are running
2. Run performance check: `python scripts/check-latencies.py`
3. View summary report of agent health and response times

## Validation
- [ ] Triage Agent latency < 2s
- [ ] Specialist Agents (Concepts, Debug) latency < 5s
- [ ] No 500 errors in service logs
- [ ] All 6 agents responding to health checks

See [REFERENCE.md](./REFERENCE.md) for threshold configurations and monitoring setup.
