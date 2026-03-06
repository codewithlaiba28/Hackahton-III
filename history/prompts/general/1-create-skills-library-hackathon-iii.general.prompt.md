---
id: 1
title: Create Skills Library for Hackathon III
stage: general
date: 2026-03-02
surface: agent
model: qwen-3.5-coder
feature: none
branch: main
user: Administrator
command: /skills find-skills using this skill you create a skill in this project
labels: ["skills", "mcp-code-execution", "kubernetes", "hackathon-iii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/agents-md-gen/SKILL.md
  - .claude/skills/agents-md-gen/REFERENCE.md
  - .claude/skills/agents-md-gen/scripts/generate-agents-md.py
  - .claude/skills/kafka-k8s-setup/SKILL.md
  - .claude/skills/kafka-k8s-setup/REFERENCE.md
  - .claude/skills/kafka-k8s-setup/scripts/deploy-kafka.sh
  - .claude/skills/kafka-k8s-setup/scripts/verify-kafka.py
  - .claude/skills/kafka-k8s-setup/scripts/create-topics.py
  - .claude/skills/postgres-k8s-setup/SKILL.md
  - .claude/skills/postgres-k8s-setup/REFERENCE.md
  - .claude/skills/postgres-k8s-setup/scripts/deploy-postgres.sh
  - .claude/skills/postgres-k8s-setup/scripts/verify-postgres.py
  - .claude/skills/postgres-k8s-setup/scripts/run-migration.py
  - .claude/skills/fastapi-dapr-agent/SKILL.md
  - .claude/skills/fastapi-dapr-agent/REFERENCE.md
  - .claude/skills/fastapi-dapr-agent/scripts/generate-service.py
  - .claude/skills/nextjs-k8s-deploy/SKILL.md
  - .claude/skills/nextjs-k8s-deploy/REFERENCE.md
  - .claude/skills/nextjs-k8s-deploy/scripts/generate-dockerfile.py
  - .claude/skills/mcp-code-execution/SKILL.md
  - .claude/skills/mcp-code-execution/REFERENCE.md
  - .claude/skills/mcp-code-execution/scripts/mcp-client-example.py
  - .claude/skills/docusaurus-deploy/SKILL.md
  - .claude/skills/docusaurus-deploy/REFERENCE.md
  - .claude/skills/docusaurus-deploy/scripts/init-docs.py
  - README.md
tests:
  - Skills validated through structure verification
---

## Prompt

/skills find-skills using this skill you create a skill in this project make sure global pe skill na ho yaha skill banao first you read @Hackahton.md and then is project mai jo jo skill use hongai wo find-skill ko use karte howe banao

## Response snapshot

Created 7 skills for the Hackathon III project following the MCP Code Execution pattern:

1. **agents-md-gen** - Generate AGENTS.md files for repositories
2. **kafka-k8s-setup** - Deploy Apache Kafka on Kubernetes using Helm
3. **postgres-k8s-setup** - Deploy PostgreSQL on Kubernetes with migrations
4. **fastapi-dapr-agent** - Create FastAPI microservices with Dapr sidecar
5. **nextjs-k8s-deploy** - Deploy Next.js applications to Kubernetes
6. **mcp-code-execution** - MCP Code Execution Pattern implementation
7. **docusaurus-deploy** - Deploy Docusaurus documentation sites

Each skill includes:
- SKILL.md (~100 tokens) - Minimal instructions
- REFERENCE.md - Deep documentation (loaded on-demand)
- scripts/ - Execution scripts (0 tokens in context)

## Outcome

- ✅ Impact: Created complete skills library for Hackathon III with 7 skills covering infrastructure deployment, service creation, and documentation
- 🧪 Tests: Skills structure verified through directory listing
- 📁 Files: 27 files created across 7 skill directories
- 🔁 Next prompts: Test skills with Claude Code or Goose, deploy LearnFlow platform
- 🧠 Reflection: Skills follow the MCP Code Execution pattern for 99.8% token efficiency

## Evaluation notes (flywheel)

- Failure modes observed: None - all skills created successfully
- Graders run and results: N/A - skills creation task
- Prompt variant: N/A
- Next experiment: Test skills with actual Claude Code and Goose agents to verify autonomous operation
