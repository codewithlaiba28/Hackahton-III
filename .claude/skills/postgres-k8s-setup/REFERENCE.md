# PostgreSQL Kubernetes Reference

## Configuration Options

### Helm Values

```yaml
# Default configuration for PostgreSQL on Kubernetes
primary:
  persistence:
    size: 5Gi
  resources:
    limits:
      cpu: 500m
      memory: 1Gi
    requests:
      cpu: 100m
      memory: 256Mi
auth:
  database: learnflow
  username: learnflow_user
```

## Connection Strings

### Local Development (via port-forward)
```
postgresql://learnflow_user:password@localhost:5432/learnflow
```

### Within Kubernetes
```
postgresql://learnflow_user:password@postgresql:5432/learnflow
```

## Database Schema for LearnFlow

### Tables
- `users` - Student and teacher accounts
- `progress` - Learning progress tracking
- `exercises` - Coding exercises
- `submissions` - Code submissions
- `quiz_results` - Quiz scores
- `struggle_events` - Struggle detection events

## Troubleshooting

### Pod Stuck in Pending
```bash
kubectl describe pod <pod-name> -n postgres
kubectl get pvc -n postgres
```

### Connection Issues
```bash
kubectl port-forward svc/postgresql -n postgres 5432:5432
```

### View Logs
```bash
kubectl logs -f <postgres-pod-name> -n postgres
```

### Reset Password
```bash
kubectl get secret postgresql -n postgres -o jsonpath="{.data.password}" | base64 -d
```

## Resources

- [Bitnami PostgreSQL Helm Chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
