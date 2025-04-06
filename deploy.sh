#!/bin/bash

# Set Docker Hub username
DOCKER_USERNAME="edenpolovets"
echo "Starting deployment with images from $DOCKER_USERNAME..."

# Clean up disk space
echo "Cleaning up disk space..."
docker system prune -af --volumes

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker-compose -f docker-compose.prod.yml down

# Pull latest images from Docker Hub
echo "Pulling latest Docker images..."
docker pull $DOCKER_USERNAME/todo-app-frontend:latest
docker pull $DOCKER_USERNAME/todo-app-backend:latest
docker pull postgres:16

# Start the services using docker-compose
echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_INTERVAL=2

for i in $(seq 1 $MAX_RETRIES); do
    echo "Attempt $i of $MAX_RETRIES..."
    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres; then
        echo "PostgreSQL is ready!"
        break
    fi
    
    if [ $i -eq $MAX_RETRIES ]; then
        echo "Error: Could not connect to PostgreSQL after $MAX_RETRIES attempts"
        exit 1
    fi
    
    echo "PostgreSQL is not ready yet. Waiting $RETRY_INTERVAL seconds..."
    sleep $RETRY_INTERVAL
done

# Run database migrations
echo "Running database migrations..."
if ! docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d todo_app -f /docker-entrypoint-initdb.d/init.sql; then
    echo "Error: Failed to run migrations"
    exit 1
fi

echo "Deployment completed successfully!"
echo "Frontend is available at: http://ec2-13-218-172-249.compute-1.amazonaws.com"
echo "Backend API is available at: http://ec2-13-218-172-249.compute-1.amazonaws.com:4000"

# Display container status
docker ps

# Check for errors in the backend logs
echo "Backend logs:"
docker-compose -f docker-compose.prod.yml logs backend
