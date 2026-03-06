---
name: docusaurus-deploy
description: Deploy Docusaurus documentation sites
---

# Docusaurus Documentation Deployment

## When to Use
- Creating documentation for LearnFlow platform
- Deploying auto-generated API docs
- Setting up project documentation site

## Instructions
1. Initialize site: `python scripts/init-docs.py <site-name>`
2. Generate docs: `python scripts/generate-docs.py <source-path>`
3. Build site: `./scripts/build-site.sh <site-path>`
4. Deploy: `./scripts/deploy-site.sh <site-path>`

## Validation
- [ ] Docusaurus site initialized
- [ ] Documentation generated from source
- [ ] Site builds without errors
- [ ] Documentation accessible via browser

## Examples

```bash
# Initialize documentation site
python ./.claude/skills/docusaurus-deploy/scripts/init-docs.py ./docs

# Generate API documentation
python ./.claude/skills/docusaurus-deploy/scripts/generate-docs.py ./services

# Build the site
./.claude/skills/docusaurus-deploy/scripts/build-site.sh ./docs

# Deploy to GitHub Pages or Kubernetes
./.claude/skills/docusaurus-deploy/scripts/deploy-site.sh ./docs
```

See [REFERENCE.md](./REFERENCE.md) for Docusaurus configuration and deployment options.
