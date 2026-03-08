#!/usr/bin/env python3
import time
import requests
import json

AGENTS = {
    "triage": "http://localhost:8001/health",
    "concepts": "http://localhost:8002/health",
    "debug": "http://localhost:8003/health",
    "exercise": "http://localhost:8004/health",
    "progress": "http://localhost:8005/health",
    "code-review": "http://localhost:8006/health"
}

def check_performance():
    print(f"{'Agent':<15} | {'Status':<10} | {'Latency (s)':<12}")
    print("-" * 45)
    
    for name, url in AGENTS.items():
        start_time = time.time()
        try:
            response = requests.get(url, timeout=10)
            latency = time.time() - start_time
            status = "✓ OK" if response.status_code == 200 else f"✗ {response.status_code}"
            print(f"{name:<15} | {status:<10} | {latency:<12.3f}")
        except Exception as e:
            print(f"{name:<15} | ✗ ERROR     | N/A")

if __name__ == "__main__":
    check_performance()
