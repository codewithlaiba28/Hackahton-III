# MCP Code Execution Reference

## The Token Problem

### Direct MCP Call (Inefficient)
```
TOOL CALL: gdrive.getDocument(documentId: "abc123")
→ returns full transcript (25,000 tokens into context)

TOOL CALL: salesforce.updateRecord(data: {{ Notes: [full transcript] }})
→ model writes transcript again (25,000 more tokens)

Total: 50,000 tokens for a simple copy operation
```

### Skills + Code Execution (Efficient)
```
SKILL.md tells agent WHAT to do (~100 tokens)
scripts/*.py does the actual work (0 tokens - executed, not loaded)
Only the final result enters context: "✓ Done." (~10 tokens)

Total: ~110 tokens
```

## MCP Client Pattern

### Basic MCP Client Template
```python
#!/usr/bin/env python3
"""
MCP Client Script

Wraps MCP server calls and returns minimal results.
"""

import subprocess
import json
import sys


def call_mcp_tool(tool_name: str, params: dict) -> dict:
    """Call an MCP tool and return the result."""
    # This would use the actual MCP client library
    # For now, we simulate the pattern
    
    cmd = [
        "mcp", "call", tool_name,
        "--params", json.dumps(params)
    ]
    
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        return json.loads(result.stdout)
    else:
        raise Exception(f"MCP call failed: {result.stderr}")


def main():
    """Main entry point."""
    # Example: Get document from Google Drive
    result = call_mcp_tool("gdrive.getDocument", {{
        "documentId": "abc123"
    }})
    
    # Process data locally (not in agent context)
    processed = {{
        "title": result.get("title"),
        "word_count": len(result.get("content", "").split())
    }}
    
    # Return minimal result to agent context
    print(json.dumps({{
        "status": "success",
        "data": processed
    }}))


if __name__ == "__main__":
    main()
```

## Common MCP Patterns

### 1. Data Transfer (Copy between systems)
```python
# Get data from source
source_data = call_mcp_tool("source.get", {{"id": source_id}})

# Process/filter locally
filtered = filter_relevant_data(source_data)

# Write to destination
result = call_mcp_tool("dest.set", {{
    "id": dest_id,
    "data": filtered
}})

# Return minimal confirmation
print(f"✓ Copied {len(filtered)} records")
```

### 2. Data Query with Filtering
```python
# Query large dataset
all_rows = call_mcp_tool("sheet.get", {{"id": sheet_id}})

# Filter to relevant subset
pending = [r for r in all_rows if r["status"] == "pending"][:5]

# Return only what agent needs
print(f"Found {len(pending)} pending items")
for item in pending:
    print(f"  - {{item['name']}}")
```

### 3. Batch Operations
```python
# Process in batches to avoid context bloat
for batch in chunks(items, batch_size=100):
    results = call_mcp_tool("bulk.update", {{"items": batch}})
    processed += len(results)
    print(f"Processed {{processed}}/{{total}}")

print(f"✓ Completed batch operation: {{total}} items")
```

## Token Efficiency Comparison

| Operation | Direct MCP | Skills + Scripts | Savings |
| --------- | ---------- | ---------------- | ------- |
| Copy document | 50,000 tokens | 110 tokens | 99.8% |
| Query + filter | 30,000 tokens | 150 tokens | 99.5% |
| Batch update | 100,000 tokens | 200 tokens | 99.8% |

## Best Practices

1. **Minimal Skill Instructions**: Keep SKILL.md under 200 tokens
2. **External Scripts**: All heavy lifting in scripts (0 tokens in context)
3. **Filter Early**: Process data in scripts, not in agent context
4. **Summarize Results**: Return summaries, not raw data
5. **Use REFERENCE.md**: Store detailed docs for on-demand loading

## Resources

- [MCP Code Execution Pattern (Anthropic)](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
