# FastAPI + Dapr Reference

## Service Templates

### Basic Service Structure
```
services/<service-name>/
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── routes.py            # API routes
├── dapr_components/     # Dapr configuration
│   ├── pubsub.yaml      # Pub/sub component
│   └── statestore.yaml  # State store component
├── Dockerfile           # Container image
└── k8s/
    ├── deployment.yaml  # Kubernetes deployment
    └── service.yaml     # Kubernetes service
```

### Dapr Components

#### Pub/Sub Component (Kafka)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka-0.kafka-headless.kafka:9092"
  - name: authType
    value: "none"
```

#### State Store Component (Redis)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: "redis-master:6379"
  - name: redisPassword
    value: ""
```

## FastAPI Service Template

```python
from fastapi import FastAPI
from dapr.clients import DaprClient
import uvicorn

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/publish/{topic}")
def publish_event(topic: str, data: dict):
    with DaprClient() as client:
        client.publish_event(
            pubsub_name='learnflow-pubsub',
            topic_name=topic,
            data=str(data)
        )
    return {"status": "published"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

## Dapr Annotations for Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: concepts-agent
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "concepts-agent"
        dapr.io/app-port: "8080"
```

## Resources

- [Dapr Documentation](https://docs.dapr.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Dapr Python SDK](https://docs.dapr.io/developing-applications/sdks/python/)
