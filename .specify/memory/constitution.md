<!--
## Sync Impact Report

**Version Change**: 1.0.0 → 1.1.0 (Minor - UI Design Constitution added)

**Modified Principles**: 
- Added: UI Design Constitution section (7 principles)

**Added Sections**:
- UI Design Constitution with 7 design principles

**Removed Sections**: N/A

**Templates Requiring Updates**:
- ✅ .specify/templates/plan-template.md - No changes needed
- ✅ .specify/templates/spec-template.md - No changes needed  
- ✅ .specify/templates/tasks-template.md - No changes needed

**Follow-up TODOs**:
- TODO: Update frontend components to match UI constitution
- TODO: Create UI component library with design tokens
- TODO: Add accessibility checklist for color contrast
-->

# Hackathon III Constitution
## Reusable Intelligence and Cloud-Native Mastery

## Core Principles

### I. Skills Are The Product
Every capability must be encapsulated as a reusable Skill. Skills are the primary deliverable, not application code. All infrastructure must be created using existing Skills before creating new ones. Skills must follow the MCP Code Execution pattern for token efficiency.

**Rationale**: Skills enable AI agents to build complex applications autonomously. This paradigm shift from coder to teacher maximizes reusability and reduces token consumption by 99.8%.

### II. Qwen CLI As Primary Agent
Qwen CLI acts as the primary coding agent for all development work. Skills must be structured for compatibility with Qwen CLI while maintaining Claude-compatible format. All prompts must explicitly invoke Skills by name.

**Rationale**: Qwen CLI provides the agentic capabilities needed for spec-driven development while maintaining portability across AI agents.

### III. MCP Code Execution Pattern (NON-NEGOTIABLE)
All heavy operations MUST execute via scripts, not direct MCP tool calls. Skills must load minimal instructions (~100 tokens) and delegate execution to external scripts (0 tokens in context). Only minimal results return to agent context.

**Rationale**: Direct MCP calls consume 50,000+ tokens before conversation starts. Scripts reduce this to ~110 tokens, enabling 80-98% token reduction while maintaining full capability.

### IV. Local-First Development
All development MUST target local Kubernetes via Minikube. No Azure, GCP, or Oracle Cloud deployments for MVP. Local verification via `npm run dev` or equivalent MUST pass before Kubernetes deployment.

**Rationale**: Local-first enables rapid iteration, reduces deployment complexity, and ensures skills work in resource-constrained environments before scaling to cloud.

### V. Agentic AI Foundation Standards
All skills and applications MUST comply with Agentic AI Foundation (AAIF) Standards. Skills must be portable across Claude Code, Goose, and Codex without transpilation.

**Rationale**: AAIF standards ensure interoperability and future-proof skills against vendor lock-in. Portability maximizes skill reuse across different AI agents.

### VI. Script-First Architecture
All infrastructure operations MUST be encapsulated in executable scripts. Scripts must be idempotent, support dry-run mode, and return minimal status output. Bash for orchestration, Python for complex logic.

**Rationale**: Scripts enable MCP Code Execution pattern, provide audit trails, support testing, and allow humans to verify agent actions before execution.

### VII. Verification Gates
Every Skill MUST include verification scripts that validate:
- Deployment success (pods running, services accessible)
- Functional correctness (health checks, integration tests)
- Performance budgets (response times, resource usage)

**Rationale**: Automated verification ensures skills work autonomously without manual intervention, enabling single-prompt-to-deployment workflow.

## Agentic Development Standards

**Spec-Driven Development**: All features start with specification in `specs/` directory. AI agents generate implementation from specs, not manual coding.

**Skill Discovery**: Before implementing any capability, search existing Skills library. Create new Skills only when no existing Skill covers the requirement.

**Token Efficiency**: All agent interactions optimized for minimal context usage. Prefer scripts over direct tool calls, summaries over raw data.

**Autonomous Operation**: Skills must work with single prompt → deployment workflow. Zero manual intervention required for standard operations.

## Cloud-Native Deployment Standards

**Kubernetes-Native**: All applications deploy to Kubernetes using Helm charts. Minikube for development, production-ready configs for cloud deployment.

**Event-Driven Architecture**: Microservices communicate via Kafka pub/sub. Dapr sidecars handle state management and service invocation.

**Container Security**: All containers run as non-root users. Multi-stage builds minimize image size. No hardcoded secrets—use environment variables and Kubernetes secrets.

**Observability**: Health endpoints mandatory for all services. Structured logging required. Resource limits defined for all containers.

## UI Design Constitution

**AI-Native Aesthetic**: UI must feel like an AI-native platform (Linear, Vercel, GitHub, Notion) — not a school website. No childish gradients or playful illustrations.

**Dark Theme Default**: Deep blue (#0B1220) primary background, near black (#0A0F1C) surfaces. No light mode for MVP.

**Color Palette**:
- Primary: Deep Blue (#0B1220)
- Surface: Near Black (#0A0F1C)
- Accent: AI Green (#00C896)
- Warning: Soft Amber (#FFB020)
- Status: Red (Beginner), Orange (Learning), Green (Proficient), Blue (Mastered)

**Monaco Editor First-Class**: Code editor is core experience, not secondary. Must have prominent placement, proper syntax highlighting, and distraction-free mode.

**Role-Specific Flows**: Students and teachers have separate, optimized UX flows. No mixing of concerns in primary navigation.

**Responsive Dev-Friendly**: UI must scale from laptop (1366px) to 4K monitor (3840px). Developer-friendly spacing, readable fonts, proper contrast ratios.

**Performance-Safe Animations**: Subtle transitions only (150-300ms). No animations that block interaction or cause layout shift. Respect `prefers-reduced-motion`.

**Visual Architecture**: UI should reflect distributed cloud-native architecture — clean lines, clear hierarchy, visible system status.

## Governance

**Compliance Verification**: All PRs must verify constitution compliance. Complexity violations must be justified with simpler alternatives rejected.

**Amendment Process**: Constitution amendments require:
1. Proposed change with rationale
2. Impact analysis on existing skills
3. Migration plan for affected components
4. Version bump according to semantic versioning

**Versioning Policy**:
- MAJOR: Backward-incompatible principle changes or removals
- MINOR: New principles or material expansions
- PATCH: Clarifications, wording improvements, typo fixes

**Review Cadence**: Constitution reviewed monthly or after major hackathon milestones.

**Version**: 1.1.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02
