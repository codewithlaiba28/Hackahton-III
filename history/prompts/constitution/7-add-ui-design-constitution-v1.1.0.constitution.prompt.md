---
id: 7
title: Add UI Design Constitution v1.1.0
stage: constitution
date: 2026-03-02
surface: agent
model: qwen-3.5-coder
feature: none
branch: 1-learnflow-platform
user: Administrator
command: /sp.constitution LearnFlow UI Design Constitution - AI-native platform design principles
labels: ["constitution", "ui-design", "design-system", "hackathon-iii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - Constitution version bumped 1.0.0 → 1.1.0
  - UI Design Constitution section added with 7 principles
  - All placeholders replaced
---

## Prompt

/sp.constitution LearnFlow UI Design Constitution

UI must feel like an AI-native platform (not a school website).

Dark theme default (no light mode for MVP).

Color palette:

Primary: Deep Blue (#0B1220)
Surface: Near Black (#0A0F1C)
Accent: AI Green (#00C896)
Warning: Soft Amber

UI must reflect distributed cloud-native architecture visually.

Monaco Editor is a core experience — not secondary.

Students and Teachers have separate UX flows.

UI must scale from laptop to 4K monitor (dev-friendly).

UI must feel closer to:
Linear
Vercel
GitHub
Notion

No childish gradients.

Animations must be subtle, performance-safe.

phele speckit complete hoga jab implementation don tab implement kar na jab implemetn don tab hi implement karna abhi is ka specify plan task baki hai

## Response snapshot

Updated constitution to v1.1.0 with new UI Design Constitution section:

**7 UI Design Principles Added**:
1. AI-Native Aesthetic - Linear, Vercel, GitHub, Notion style (not school website)
2. Dark Theme Default - Deep blue (#0B1220), near black surfaces, no light mode
3. Color Palette - AI Green accent, Soft Amber warning, status colors
4. Monaco Editor First-Class - Core experience, prominent placement
5. Role-Specific Flows - Separate student/teacher UX
6. Responsive Dev-Friendly - 1366px to 4K, proper contrast
7. Performance-Safe Animations - 150-300ms, respects reduced-motion

**Version Bump**: 1.0.0 → 1.1.0 (MINOR - new section added)

**Sync Impact**:
- Templates compatible - no changes needed
- Follow-up: Update frontend components to match UI constitution

## Outcome

- ✅ Impact: Constitution updated with UI design principles
- 🧪 Tests: Version bumped, all principles declarative and testable
- 📁 Files: 1 file updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Create UI spec → plan → tasks → then implement
- 🧠 Reflection: Following spec-driven approach - constitution → spec → plan → tasks → implementation

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution updated successfully
- Graders run and results: Constitution validation passed
- Prompt variant: N/A
- Next experiment: Create UI specification document following SpecKit flow
