#!/bin/bash
set -e

echo "=== Kubernetes Cluster Health Check ==="
echo ""
echo "[1/3] Cluster Info:"
kubectl cluster-info
echo ""

echo "[2/3] Nodes Status:"
kubectl get nodes
echo ""

echo "[3/3] System Pods Status:"
kubectl get pods -n kube-system
echo ""

echo "✓ Health check complete."
