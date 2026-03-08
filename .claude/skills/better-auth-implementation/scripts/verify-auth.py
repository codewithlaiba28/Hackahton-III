#!/usr/bin/env python3
import requests
import sys

def check_health(base_url):
    try:
        response = requests.get(f"{base_url}/api/auth/ok")
        if response.status_code == 200 and response.json().get("ok"):
            print("✓ Better Auth API is healthy")
            return True
        else:
            print(f"✗ Better Auth API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Could not connect to Better Auth API: {e}")
        return False

def check_session(base_url):
    try:
        response = requests.get(f"{base_url}/api/auth/session")
        if response.status_code == 200:
            print("✓ Session endpoint is reachable")
            return True
        else:
            print(f"✗ Session check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Could not connect to Session endpoint: {e}")
        return False

if __name__ == "__main__":
    url = "http://localhost:3000"
    if len(sys.argv) > 1:
        url = sys.argv[1]
    
    health_ok = check_health(url)
    session_ok = check_session(url)
    
    if health_ok and session_ok:
        sys.exit(0)
    else:
        sys.exit(1)
