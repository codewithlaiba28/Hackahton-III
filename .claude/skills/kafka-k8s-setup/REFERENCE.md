# Kafka Kubernetes Reference

## Configuration Options

### Helm Values

```yaml
# Default configuration for Kafka on Kubernetes
replicaCount: 1
zookeeper:
  replicaCount: 1
persistence:
  size: 8Gi
resources:
  limits:
    cpu: 1000m
    memory: 2Gi
  requests:
    cpu: 250m
    memory: 1Gi
```

### Topics for LearnFlow

```yaml
topics:
  - name: learning.events
    partitions: 3
    replicationFactor: 1
  - name: code.submissions
    partitions: 3
    replicationFactor: 1
  - name: exercise.completions
    partitions: 3
    replicationFactor: 1
  - name: student.struggles
    partitions: 3
    replicationFactor: 1
  - name: progress.updates
    partitions: 3
    replicationFactor: 1
```

## Troubleshooting

### Pod Stuck in Pending
```bash
kubectl describe pod <pod-name> -n kafka
kubectl get pvc -n kafka
```

### Connection Issues
```bash
kubectl get svc -n kafka
kubectl port-forward svc/kafka -n kafka 9092:9092
```

### View Logs
```bash
kubectl logs -f <kafka-pod-name> -n kafka
```

## Resources

- [Bitnami Kafka Helm Chart](https://github.com/bitnami/charts/tree/main/bitnami/kafka)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
