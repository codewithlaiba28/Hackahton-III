#!/usr/bin/env python3
"""
Next.js Dockerfile Generator

Generates an optimized multi-stage Dockerfile for Next.js applications.
Executes via MCP code execution pattern - minimal tokens in context.
"""

import os
import sys
from pathlib import Path


DOCKERFILE_TEMPLATE = '''# Multi-stage Dockerfile for Next.js Application
# Optimized for production deployment on Kubernetes

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Stage 3: Runner (production image)
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy built application (standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set runtime environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
'''

DOCKERIGNORE_TEMPLATE = '''# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Development files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build output (will be generated)
.next
out

# Testing
coverage
.nyc_output

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
*.md
docs
'''

K8S_DEPLOYMENT_TEMPLATE = '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: {app_name}
  namespace: learnflow
  labels:
    app: {app_name}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: {app_name}
  template:
    metadata:
      labels:
        app: {app_name}
    spec:
      containers:
      - name: frontend
        image: {app_name}:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "256Mi"
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
'''

K8S_SERVICE_TEMPLATE = '''apiVersion: v1
kind: Service
metadata:
  name: {app_name}
  namespace: learnflow
  labels:
    app: {app_name}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: {app_name}
'''

NEXT_CONFIG_PATCH = '''
// Add to next.config.js for Docker deployment
const nextConfig = {{
  output: 'standalone',
  experimental: {{
    serverActions: {{
      bodySizeLimit: '2mb',
    }},
  }},
}}

module.exports = nextConfig
'''


def generate_dockerfile(app_path: str) -> bool:
    """Generate Dockerfile and related files for Next.js app."""
    
    app_dir = Path(app_path)
    
    if not app_dir.exists():
        print(f"✗ App path does not exist: {app_path}")
        return False
    
    print(f"📁 Generating Dockerfile for: {app_path}")
    
    # Create Dockerfile
    dockerfile_path = app_dir / "Dockerfile"
    with open(dockerfile_path, 'w', encoding='utf-8') as f:
        f.write(DOCKERFILE_TEMPLATE)
    print(f"  ✓ Created Dockerfile")
    
    # Create .dockerignore
    dockerignore_path = app_dir / ".dockerignore"
    with open(dockerignore_path, 'w', encoding='utf-8') as f:
        f.write(DOCKERIGNORE_TEMPLATE)
    print(f"  ✓ Created .dockerignore")
    
    # Create k8s directory
    k8s_dir = app_dir / "k8s"
    k8s_dir.mkdir(exist_ok=True)
    
    # Extract app name from path
    app_name = app_dir.name.lower().replace("_", "-")
    
    # Create Kubernetes deployment
    deployment_path = k8s_dir / "deployment.yaml"
    with open(deployment_path, 'w', encoding='utf-8') as f:
        f.write(K8S_DEPLOYMENT_TEMPLATE.format(app_name=app_name))
    print(f"  ✓ Created k8s/deployment.yaml")
    
    # Create Kubernetes service
    service_path = k8s_dir / "service.yaml"
    with open(service_path, 'w', encoding='utf-8') as f:
        f.write(K8S_SERVICE_TEMPLATE.format(app_name=app_name))
    print(f"  ✓ Created k8s/service.yaml")
    
    # Check if next.config.js exists
    next_config_path = app_dir / "next.config.js"
    if next_config_path.exists():
        print(f"\n⚠️  next.config.js already exists")
        print(f"   Please ensure it includes: output: 'standalone'")
    else:
        # Create basic next.config.js
        config_path = app_dir / "next.config.js"
        with open(config_path, 'w', encoding='utf-8') as f:
            f.write(NEXT_CONFIG_PATCH.strip())
        print(f"  ✓ Created next.config.js")
    
    print(f"\n✓ Dockerfile generation complete for '{app_name}'")
    print(f"\n📝 Next steps:")
    print(f"  1. Review Dockerfile: {dockerfile_path}")
    print(f"  2. Build image: docker build -t {app_name}:latest {app_path}")
    print(f"  3. Deploy: kubectl apply -f {k8s_dir}/")
    
    return True


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python generate-dockerfile.py <app-path>")
        print("\nExamples:")
        print("  python generate-dockerfile.py ./frontend")
        print("  python generate-dockerfile.py ./learnflow-ui")
        sys.exit(1)
    
    app_path = sys.argv[1]
    success = generate_dockerfile(app_path)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
