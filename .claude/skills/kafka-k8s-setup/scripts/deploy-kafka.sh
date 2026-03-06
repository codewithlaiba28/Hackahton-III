#!/bin/bash
# Kafka Kubernetes Deployment Script
# Deploys Apache Kafka using Helm on Kubernetes

set -e

NAMESPACE="kafka"
RELEASE_NAME="kafka"
CHART_REPO="bitnami"
CHART_NAME="kafka"

echo "🚀 Deploying Kafka to Kubernetes..."

# Add Helm repo
echo "📦 Adding Bitnami Helm repo..."
helm repo add $CHART_REPO https://charts.bitnami.com/bitnami 2>/dev/null || true
helm repo update

# Create namespace (dry-run for idempotency)
echo "🔧 Creating namespace: $NAMESPACE..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy Kafka with minimal resources for development
echo "☸️  Installing Kafka with Helm..."
helm upgrade --install $RELEASE_NAME $CHART_REPO/$CHART_NAME \
  --namespace $NAMESPACE \
  --set replicaCount=1 \
  --set zookeeper.replicaCount=1 \
  --set persistence.size=2Gi \
  --set resources.limits.cpu=500m \
  --set resources.limits.memory=1Gi \
  --set resources.requests.cpu=100m \
  --set resources.requests.memory=512Mi \
  --wait \
  --timeout 5m

echo "✓ Kafka deployed to namespace '$NAMESPACE'"
echo "📝 To verify: python scripts/verify-kafka.py"
