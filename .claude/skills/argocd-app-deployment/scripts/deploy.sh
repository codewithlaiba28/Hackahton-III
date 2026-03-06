#!/bin/bash
set -e

# Default values
APP_SET_FILE="../../gitops/app-set.yaml"

echo "Applying ArgoCD application manifest..."
kubectl apply -f $APP_SET_FILE

echo "✓ ArgoCD deployment manifest applied successfully."
