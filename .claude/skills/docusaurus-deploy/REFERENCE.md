# Docusaurus Deployment Reference

## Site Configuration

### docusaurus.config.js
```javascript
module.exports = {
  title: 'LearnFlow Documentation',
  tagline: 'AI-Powered Python Tutoring Platform',
  url: 'https://your-org.github.io',
  baseUrl: '/learnflow-docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-org/learnflow-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  
  themeConfig: {
    navbar: {
      title: 'LearnFlow',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/your-org/learnflow',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};
```

## Documentation Structure

```
docs/
├── docs/
│   ├── intro.md
│   ├── architecture.md
│   ├── skills/
│   │   ├── overview.md
│   │   └── creating-skills.md
│   └── deployment/
│       ├── kubernetes.md
│       └── local-development.md
├── src/
│   └── css/
│       └── custom.css
├── static/
│   └── img/
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

## Deployment Options

### GitHub Pages
```bash
npm run deploy
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learnflow-docs
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: docusaurus
        image: nginx:alpine
        volumeMounts:
        - name: docs
          mountPath: /usr/share/nginx/html
      volumes:
      - name: docs
        configMap:
          name: learnflow-docs
```

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus API Docs Plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs)
