#!/usr/bin/env python3
"""
MCP Code Execution Example Script

Demonstrates the MCP code execution pattern with a generic MCP client.
This script can be adapted for any MCP server integration.

Executes via MCP code execution pattern - minimal tokens in context.
"""

import subprocess
import json
import sys
import argparse


class MCPClient:
    """Generic MCP client for executing tool calls."""
    
    def __init__(self, server_name: str = None):
        self.server_name = server_name
    
    def call_tool(self, tool_name: str, params: dict) -> dict:
        """
        Call an MCP tool and return the result.
        
        In production, this would use the actual MCP client library.
        For now, we demonstrate the pattern.
        """
        # Simulate MCP call pattern
        # In real implementation:
        # from mcp import Client
        # client = Client()
        # result = await client.call_tool(tool_name, params)
        
        print(f"🔌 Calling MCP tool: {tool_name}")
        print(f"   Server: {self.server_name or 'default'}")
        print(f"   Params: {json.dumps(params, indent=2)}")
        
        # Simulate successful response
        return {
            "status": "success",
            "tool": tool_name,
            "result": {"message": "Operation completed"}
        }
    
    def list_tools(self) -> list:
        """List available tools from the MCP server."""
        print(f"📋 Listing available tools...")
        return [
            {"name": "example.read", "description": "Read data"},
            {"name": "example.write", "description": "Write data"},
            {"name": "example.query", "description": "Query data"}
        ]


def process_data_filter(data: list, filter_fn: str) -> list:
    """
    Process and filter data locally (not in agent context).
    
    This demonstrates the pattern where heavy data processing
    happens in the script, not in the agent's context window.
    """
    print(f"🔄 Processing {len(data)} items...")
    
    # Example filtering logic
    if filter_fn == "pending":
        filtered = [item for item in data if item.get("status") == "pending"]
    elif filter_fn == "recent":
        filtered = data[:10]  # Last 10 items
    else:
        filtered = data
    
    print(f"✓ Filtered to {len(filtered)} items")
    return filtered


def example_usage_read_operation():
    """Example: Read operation with filtering."""
    client = MCPClient(server_name="example-server")
    
    # Simulate reading data from external system
    print("📖 Simulating read operation...")
    sample_data = [
        {"id": 1, "name": "Item 1", "status": "pending"},
        {"id": 2, "name": "Item 2", "status": "completed"},
        {"id": 3, "name": "Item 3", "status": "pending"},
    ]
    
    # Filter data locally (not in agent context)
    filtered = process_data_filter(sample_data, "pending")
    
    # Return minimal result to agent context
    return {
        "status": "success",
        "count": len(filtered),
        "items": [item["name"] for item in filtered]
    }


def example_usage_write_operation():
    """Example: Write operation with confirmation."""
    client = MCPClient(server_name="example-server")
    
    # Simulate writing data to external system
    print("✏️  Simulating write operation...")
    
    result = client.call_tool("example.write", {
        "data": {"key": "value"},
        "destination": "target-system"
    })
    
    # Return minimal confirmation
    return {
        "status": "success",
        "message": "✓ Data written successfully"
    }


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="MCP Code Execution Example"
    )
    parser.add_argument(
        "--operation",
        choices=["read", "write", "list"],
        default="read",
        help="Operation to perform"
    )
    parser.add_argument(
        "--filter",
        choices=["pending", "recent", "all"],
        default="all",
        help="Filter to apply"
    )
    
    args = parser.parse_args()
    
    print("🚀 MCP Code Execution Example\n")
    
    client = MCPClient(server_name="example-server")
    
    if args.operation == "list":
        tools = client.list_tools()
        print(f"\n📊 Available tools: {len(tools)}")
        for tool in tools:
            print(f"  - {tool['name']}: {tool['description']}")
        sys.exit(0)
    
    elif args.operation == "read":
        result = example_usage_read_operation()
        
    elif args.operation == "write":
        result = example_usage_write_operation()
    
    # Print minimal result (this is what enters agent context)
    print(f"\n{'=' * 50}")
    print(f"✓ Operation completed")
    print(f"📝 Result: {json.dumps(result, indent=2)}")
    
    sys.exit(0 if result["status"] == "success" else 1)


if __name__ == "__main__":
    main()
