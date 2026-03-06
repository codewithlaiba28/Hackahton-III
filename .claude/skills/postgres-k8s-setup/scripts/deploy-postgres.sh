#!/bin/bash
# PostgreSQL Kubernetes Deployment Script
# Deploys PostgreSQL using Helm on Kubernetes

set -e

NAMESPACE="postgres"
RELEASE_NAME="postgresql"
CHART_REPO="bitnami"
CHART_NAME="postgresql"
DB_NAME="learnflow"
DB_USER="learnflow_user"

echo "🚀 Deploying PostgreSQL to Kubernetes..."

# Add Helm repo
echo "📦 Adding Bitnami Helm repo..."
helm repo add $CHART_REPO https://charts.bitnami.com/bitnami 2>/dev/null || true
helm repo update

# Create namespace (dry-run for idempotency)
echo "🔧 Creating namespace: $NAMESPACE..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy PostgreSQL with minimal resources for development
echo "☸️  Installing PostgreSQL with Helm..."
helm upgrade --install $RELEASE_NAME $CHART_REPO/$CHART_NAME \
  --namespace $NAMESPACE \
  --set auth.database=$DB_NAME \
  --set auth.username=$DB_USER \
  --set auth.password=learnflow123 \
  --set primary.persistence.size=2Gi \
  --set primary.resources.limits.cpu=500m \
  --set primary.resources.limits.memory=1Gi \
  --set primary.resources.requests.cpu=100m \
  --set primary.resources.requests.memory=256Mi \
  --wait \
  --timeout 5m

echo "✓ PostgreSQL deployed to namespace '$NAMESPACE'"
echo "📝 Database: $DB_NAME"
echo "📝 Username: $DB_USER"
echo "📝 To verify: python scripts/verify-postgres.py"
