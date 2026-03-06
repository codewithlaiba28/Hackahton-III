---
name: mcp-code-execution
description: MCP Code Execution Pattern implementation
---

# MCP Code Execution Pattern

## When to Use
- Implementing token-efficient AI agent workflows
- Wrapping MCP server calls in scripts
- Reducing context window usage by 80-98%

## Instructions
1. Create skill with minimal instructions (~100 tokens)
2. Implement scripts that execute MCP calls
3. Return only minimal results to agent context
4. Use REFERENCE.md for detailed configuration

## Pattern Overview

**Before (Direct MCP):** 50,000+ tokens in context
**After (Skills + Scripts):** ~110 tokens

```
SKILL.md → scripts/*.py → MCP Server → Minimal Result
(~100 tokens)  (0 tokens)   (external)   (~10 tokens)
```

## Examples

```bash
# Example: Google Drive operations via MCP
python ./.claude/skills/mcp-code-execution/scripts/gdrive-copy.py \
  --source-doc "abc123" \
  --target-sheet "xyz789"

# Example: Salesforce update via MCP
python ./.claude/skills/mcp-code-execution/scripts/salesforce-update.py \
  --record-id "001xxx" \
  --field "Notes" \
  --value "Meeting completed"
```

See [REFERENCE.md](./REFERENCE.md) for MCP client implementation and examples.
