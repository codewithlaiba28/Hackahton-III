---
name: agents-md-gen
description: Generate AGENTS.md files for repositories
---

# AGENTS.md Generator

## When to Use
- Creating a new repository that needs AI agent documentation
- Adding agent context to existing projects
- Setting up repositories for Claude Code, Goose, or other AI agents

## Instructions
1. Navigate to the target repository
2. Run generation script: `./scripts/generate-agents-md.sh` or `python scripts/generate-agents-md.py`
3. Review the generated AGENTS.md file
4. Commit the file to the repository root

## Validation
- [ ] AGENTS.md created in repository root
- [ ] Contains project structure overview
- [ ] Documents coding conventions
- [ ] Lists key dependencies and tools
- [ ] Includes agent-specific instructions

## Examples

```bash
# Generate for current directory
python .claude/skills/agents-md-gen/scripts/generate-agents-md.py

# Generate for specific path
python .claude/skills/agents-md-gen/scripts/generate-agents-md.py /path/to/repo
```

See [REFERENCE.md](./REFERENCE.md) for AGENTS.md template options and best practices.
