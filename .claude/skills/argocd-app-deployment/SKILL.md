---
name: argocd-app-deployment
description: Deploy applications via ArgoCD using GitOps
---

# ArgoCD Application Deployment

## When to Use
- User asks to deploy applications using GitOps or ArgoCD
- Setting up continuous deployment pipelines for LearnFlow or arbitrary apps

## Instructions
This skill provides scripts to trigger and verify ArgoCD deployments.
Since ArgoCD watches a Git repository, the standard flow is:
1. Commit changes to your manifests (e.g., Helm charts or K8s YAML) to the target Git repository.
2. Apply the ArgoCD Application manifest if not already applied: `./scripts/deploy.sh`
3. Verify the synchronization status of the application: `python scripts/verify.py learnflow`
4. Confirm application is `Synced` and `Healthy` before proceeding.

## Validation
- [ ] ArgoCD application is created.
- [ ] Application sync status is `Synced`.
- [ ] Application health status is `Healthy`.

See [docs/skill-development-guide.md](../../docs/skill-development-guide.md) for more info on skill creation and conventions.
