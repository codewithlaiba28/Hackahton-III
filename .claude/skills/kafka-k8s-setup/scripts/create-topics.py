#!/usr/bin/env python3
"""
Kafka Topic Creation Script

Creates required topics for the LearnFlow platform.
Executes via MCP code execution pattern - minimal tokens in context.
"""

import subprocess
import json
import sys


# Topics for LearnFlow platform
LEARNFLOW_TOPICS = [
    {"name": "learning.events", "partitions": 3, "replication-factor": 1},
    {"name": "code.submissions", "partitions": 3, "replication-factor": 1},
    {"name": "exercise.completions", "partitions": 3, "replication-factor": 1},
    {"name": "student.struggles", "partitions": 3, "replication-factor": 1},
    {"name": "progress.updates", "partitions": 3, "replication-factor": 1},
]


def run_kafka_command(args: list) -> tuple:
    """Run kafka-topics.sh command via kubectl exec."""
    # Get a Kafka broker pod
    result = subprocess.run(
        ["kubectl", "get", "pods", "-n", "kafka", "-l", "app.kubernetes.io/name=kafka", "-o", "jsonpath={.items[0].metadata.name}"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0 or not result.stdout:
        print("✗ Failed to get Kafka broker pod")
        return None, "No Kafka broker pod found", 1
    
    broker_pod = result.stdout.strip()
    
    # Run kafka-topics.sh inside the broker pod
    cmd = [
        "kubectl", "exec", "-n", "kafka", broker_pod, "--",
        "kafka-topics.sh"
    ] + args
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout, result.stderr, result.returncode


def create_topic(topic_config: dict) -> bool:
    """Create a single Kafka topic."""
    name = topic_config["name"]
    partitions = topic_config["partitions"]
    replication_factor = topic_config["replication-factor"]
    
    print(f"  Creating topic: {name}...")
    
    stdout, stderr, code = run_kafka_command([
        "--create",
        "--bootstrap-server", "localhost:9092",
        "--topic", name,
        "--partitions", str(partitions),
        "--replication-factor", str(replication_factor)
    ])
    
    if code == 0 or "already exists" in stderr.lower():
        print(f"    ✓ Topic '{name}' ready")
        return True
    else:
        print(f"    ✗ Failed to create '{name}': {stderr}")
        return False


def list_topics() -> list:
    """List all existing Kafka topics."""
    stdout, stderr, code = run_kafka_command([
        "--list",
        "--bootstrap-server", "localhost:9092"
    ])
    
    if code == 0:
        return [t.strip() for t in stdout.split("\n") if t.strip()]
    return []


def main():
    """Main entry point."""
    print("🚀 Creating LearnFlow Kafka Topics\n")
    
    # Get existing topics
    print("📋 Checking existing topics...")
    existing_topics = list_topics()
    
    if not existing_topics:
        print("✗ Could not list topics. Ensure Kafka is running.")
        sys.exit(1)
    
    print(f"✓ Found {len(existing_topics)} existing topics\n")
    
    # Create required topics
    print("📝 Creating LearnFlow topics...\n")
    created = 0
    skipped = 0
    
    for topic_config in LEARNFLOW_TOPICS:
        name = topic_config["name"]
        if name in existing_topics:
            print(f"  ⏭️  Topic '{name}' already exists")
            skipped += 1
        else:
            if create_topic(topic_config):
                created += 1
    
    print(f"\n{'=' * 50}")
    print(f"✓ Topics created: {created}")
    print(f"⏭️  Topics skipped (already exist): {skipped}")
    print(f"📊 Total required topics: {len(LEARNFLOW_TOPICS)}")
    
    if created + skipped == len(LEARNFLOW_TOPICS):
        print("\n✓ All LearnFlow topics are ready")
        sys.exit(0)
    else:
        print("\n✗ Some topics failed to create")
        sys.exit(1)


if __name__ == "__main__":
    main()
