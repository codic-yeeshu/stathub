#!/bin/bash
set -e  # Exit immediately if a command fails

# Configuration variables
DOCKER_USERNAME=${DOCKER_USERNAME:-""}
DOCKER_PASSWORD=${DOCKER_PASSWORD:-""}
IMAGE_NAME=${IMAGE_NAME:-""}
CONTAINER_NAME=${CONTAINER_NAME:-""}
PORT_OUTSIDE=${PORT_OUTSIDE:-""}
PORT_INSIDE=${PORT_INSIDE:-""}
echo "Starting deployment of $CONTAINER_NAME..."

# Install Docker if not installed
if ! command -v docker >/dev/null 2>&1; then
    echo "Docker not found. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    echo "Docker installed: $(docker --version)"
else
    echo "Docker is already installed: $(docker --version)"
fi

# Login to Docker Hub
echo "Logging into Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

# Pull the latest image
echo "Pulling image $IMAGE_NAME..."
docker pull "$IMAGE_NAME"

# Stop and remove existing container if it exists ---
if docker ps -a --format '{{.Names}}' | grep -Eq "^$CONTAINER_NAME\$"; then
    echo "Stopping existing container $CONTAINER_NAME..."
    docker stop "$CONTAINER_NAME"
    echo "Removing existing container $CONTAINER_NAME..."
    docker rm "$CONTAINER_NAME"
else
    echo "No existing container named $CONTAINER_NAME found. Proceeding to run new container."
fi

# Run the container
echo "Running container $CONTAINER_NAME..."
docker run -d \
  -p "$PORT_OUTSIDE:$PORT_INSIDE" \
  --name "$CONTAINER_NAME" \
  "$IMAGE_NAME"

echo "Deployment completed successfully!"
