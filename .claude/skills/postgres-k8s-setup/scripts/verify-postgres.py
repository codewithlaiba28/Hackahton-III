#!/usr/bin/env python3
"""
PostgreSQL Deployment Verification Script

Verifies PostgreSQL deployment on Kubernetes by checking pod status and connectivity.
Returns minimal output to agent context (MCP code execution pattern).
"""

import subprocess
import json
import sys


def run_kubectl(args: list) -> tuple:
    """Run kubectl command and return stdout, stderr, returncode."""
    result = subprocess.run(
        ["kubectl"] + args,
        capture_output=True,
        text=True
    )
    return result.stdout, result.stderr, result.returncode


def verify_postgres_pods(namespace: str = "postgres") -> bool:
    """Verify all PostgreSQL pods are running."""
    print(f"🔍 Checking PostgreSQL pods in namespace '{namespace}'...")
    
    stdout, stderr, code = run_kubectl([
        "get", "pods", "-n", namespace, "-o", "json"
    ])
    
    if code != 0:
        print(f"✗ Failed to get pods: {stderr}")
        return False
    
    try:
        pods_data = json.loads(stdout)
        pods = pods_data.get("items", [])
        
        if not pods:
            print(f"✗ No pods found in namespace '{namespace}'")
            return False
        
        running = 0
        total = len(pods)
        
        for pod in pods:
            phase = pod.get("status", {}).get("phase", "Unknown")
            pod_name = pod.get("metadata", {}).get("name", "unknown")
            
            if phase == "Running":
                running += 1
                print(f"  ✓ {pod_name}: {phase}")
            else:
                print(f"  ⏳ {pod_name}: {phase}")
        
        print(f"\n📊 Status: {running}/{total} pods running")
        
        if running == total:
            print(f"✓ All {total} PostgreSQL pods are running")
            return True
        else:
            print(f"✗ Only {running}/{total} pods running")
            return False
            
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing kubectl output: {e}")
        return False


def verify_postgres_service(namespace: str = "postgres") -> bool:
    """Verify PostgreSQL service exists."""
    print(f"🔍 Checking PostgreSQL service...")
    
    stdout, stderr, code = run_kubectl([
        "get", "svc", "-n", namespace, "-o", "json"
    ])
    
    if code != 0:
        print(f"✗ Failed to get services: {stderr}")
        return False
    
    try:
        services = json.loads(stdout).get("items", [])
        postgres_svc = [s for s in services if "postgresql" in s.get("metadata", {}).get("name", "")]
        
        if postgres_svc:
            print(f"✓ PostgreSQL service found: {postgres_svc[0]['metadata']['name']}")
            return True
        else:
            print(f"✗ PostgreSQL service not found")
            return False
            
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing kubectl output: {e}")
        return False


def verify_database_connection(namespace: str = "postgres") -> bool:
    """Verify database connection by executing a simple query."""
    print(f"🔍 Testing database connection...")
    
    # Get the primary pod name
    stdout, stderr, code = run_kubectl([
        "get", "pods", "-n", namespace,
        "-l", "app.kubernetes.io/name=postgresql",
        "-o", "jsonpath={.items[0].metadata.name}"
    ])
    
    if code != 0 or not stdout:
        print(f"✗ Failed to get PostgreSQL pod name")
        return False
    
    pod_name = stdout.strip()
    
    # Execute a simple query
    stdout, stderr, code = run_kubectl([
        "exec", "-n", namespace, pod_name, "--",
        "psql", "-U", "learnflow_user", "-d", "learnflow",
        "-c", "SELECT 1;"
    ])
    
    if code == 0 and "1" in stdout:
        print(f"✓ Database connection successful")
        return True
    else:
        print(f"✗ Database connection failed: {stderr}")
        return False


def main():
    """Main entry point."""
    namespace = sys.argv[1] if len(sys.argv) > 1 else "postgres"
    
    print("🚀 PostgreSQL Deployment Verification\n")
    
    pods_ok = verify_postgres_pods(namespace)
    svc_ok = verify_postgres_service(namespace)
    conn_ok = verify_database_connection(namespace)
    
    print("\n" + "=" * 50)
    if pods_ok and svc_ok and conn_ok:
        print("✓ PostgreSQL deployment is healthy")
        sys.exit(0)
    else:
        print("✗ PostgreSQL deployment needs attention")
        sys.exit(1)


if __name__ == "__main__":
    main()
