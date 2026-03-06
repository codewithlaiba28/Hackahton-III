#!/usr/bin/env python3
import subprocess
import json
import sys

def verify_app(app_name):
    print(f"Verifying ArgoCD application '{app_name}'...")
    try:
        # Get the Application resource state
        result = subprocess.run(
            ["kubectl", "get", "application", app_name, "-n", "argocd", "-o", "json"],
            capture_output=True, text=True, check=True
        )
        app_data = json.loads(result.stdout)
        
        sync_status = app_data.get("status", {}).get("sync", {}).get("status", "Unknown")
        health_status = app_data.get("status", {}).get("health", {}).get("status", "Unknown")
        
        if sync_status == "Synced" and health_status == "Healthy":
            print(f"✓ Application '{app_name}' is Synced and Healthy.")
            sys.exit(0)
        else:
            print(f"✗ Application '{app_name}' status: Sync={sync_status}, Health={health_status}")
            sys.exit(1)
            
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to get application '{app_name}': {e.stderr}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error parsing application state: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify.py <app_name>")
        sys.exit(1)
    
    verify_app(sys.argv[1])
