# AGENTS.md Reference

## Template Structure

A comprehensive AGENTS.md file should include:

### 1. Project Overview
```markdown
# Project Name

Brief description of what the project does and its purpose.
```

### 2. Tech Stack
```markdown
## Tech Stack
- **Language**: Python 3.11+, TypeScript 5+
- **Framework**: FastAPI, Next.js 14
- **Database**: PostgreSQL (Neon)
- **Message Queue**: Kafka
- **Orchestration**: Kubernetes, Helm
- **AI Agents**: Claude Code, Goose
```

### 3. Directory Structure
```markdown
## Directory Structure
```
project/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── scripts/          # Build and deployment scripts
├── .claude/          # Claude Code skills
└── config/           # Configuration files
```
```

### 4. Development Conventions
```markdown
## Development Conventions
- **Code Style**: PEP 8, ESLint recommended
- **Testing**: pytest, Jest
- **Commit Messages**: Conventional Commits
- **Branch Naming**: feature/, bugfix/, hotfix/
```

### 5. Agent-Specific Instructions
```markdown
## AI Agent Guidelines
- Read existing code before making changes
- Run tests after modifications
- Use type hints in Python, TypeScript in JS
- Follow DRY and SOLID principles
```

## Best Practices

1. **Be Specific**: Include exact commands and file paths
2. **Keep Updated**: Update AGENTS.md when project structure changes
3. **Include Examples**: Show common patterns used in the codebase
4. **Document Decisions**: Link to ADRs for architectural choices

## Resources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Goose Skills Guide](https://block.github.io/goose/docs/guides/context-engineering/using-skills)
