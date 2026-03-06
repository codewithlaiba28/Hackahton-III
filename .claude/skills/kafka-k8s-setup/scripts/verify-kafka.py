#!/usr/bin/env python3
"""
Kafka Deployment Verification Script

Verifies Kafka deployment on Kubernetes by checking pod status.
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


def verify_kafka_pods(namespace: str = "kafka") -> bool:
    """Verify all Kafka pods are running."""
    print(f"🔍 Checking Kafka pods in namespace '{namespace}'...")
    
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
            print(f"✓ All {total} Kafka pods are running")
            return True
        else:
            print(f"✗ Only {running}/{total} pods running")
            return False
            
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing kubectl output: {e}")
        return False


def verify_kafka_service(namespace: str = "kafka") -> bool:
    """Verify Kafka service exists."""
    print(f"🔍 Checking Kafka service...")
    
    stdout, stderr, code = run_kubectl([
        "get", "svc", "-n", namespace, "-o", "json"
    ])
    
    if code != 0:
        print(f"✗ Failed to get services: {stderr}")
        return False
    
    try:
        services = json.loads(stdout).get("items", [])
        kafka_svc = [s for s in services if "kafka" in s.get("metadata", {}).get("name", "")]
        
        if kafka_svc:
            print(f"✓ Kafka service found: {kafka_svc[0]['metadata']['name']}")
            return True
        else:
            print(f"✗ Kafka service not found")
            return False
            
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing kubectl output: {e}")
        return False


def main():
    """Main entry point."""
    namespace = sys.argv[1] if len(sys.argv) > 1 else "kafka"
    
    print("🚀 Kafka Deployment Verification\n")
    
    pods_ok = verify_kafka_pods(namespace)
    svc_ok = verify_kafka_service(namespace)
    
    print("\n" + "=" * 50)
    if pods_ok and svc_ok:
        print("✓ Kafka deployment is healthy")
        sys.exit(0)
    else:
        print("✗ Kafka deployment needs attention")
        sys.exit(1)


if __name__ == "__main__":
    main()
