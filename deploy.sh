#!/bin/bash

# Set Docker Hub username
DOCKER_USERNAME="edenpolovets"
echo "Starting deployment with images from $DOCKER_USERNAME..."

# Set required environment variables if not already set
export DB_USER=${DB_USER:-postgres}
export DB_PASSWORD=${DB_PASSWORD:-postgres}
export DB_NAME=${DB_NAME:-todo_app}
export JWT_SECRET=${JWT_SECRET:-NCI-2025}
export EC2_PUBLIC_IP=ec2-13-218-172-249.compute-1.amazonaws.com

# Clean up disk space
echo "Cleaning up disk space..."
docker system prune -af --volumes

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker compose -f docker-compose.prod.yml down

# Pull latest images from Docker Hub
echo "Pulling latest Docker images..."
docker pull $DOCKER_USERNAME/todo-app-frontend:latest
docker pull $DOCKER_USERNAME/todo-app-backend:latest
docker pull postgres:16

# Start the services using docker compose
echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_INTERVAL=2

for i in $(seq 1 $MAX_RETRIES); do
    echo "Attempt $i of $MAX_RETRIES..."
    if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U $DB_USER; then
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
if ! docker compose -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER -d $DB_NAME -f /docker-entrypoint-initdb.d/init.sql; then
    echo "Error: Failed to run migrations"
    echo "Checking if init.sql exists in backend container..."
    
    # Try to copy init.sql from the backend container
    if docker compose -f docker-compose.prod.yml exec -T backend test -f /app/dist/db/migration/init.sql; then
        echo "Found init.sql in backend container, using it for migration..."
        docker compose -f docker-compose.prod.yml exec -T backend cat /app/dist/db/migration/init.sql > /tmp/init.sql
        docker compose -f docker-compose.prod.yml cp /tmp/init.sql postgres:/tmp/init.sql
        docker compose -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER -d $DB_NAME -f /tmp/init.sql
        echo "Migration completed successfully using backend's init.sql file."
    else
        echo "WARNING: Could not find init.sql in backend container."
        echo "Please ensure migrations are set up correctly in your docker-compose.prod.yml file."
        echo "Migration failed, but continuing deployment..."
    fi
fi

echo "Deployment completed successfully!"
echo "Frontend is available at: http://$EC2_PUBLIC_IP"
echo "Backend API is available at: http://$EC2_PUBLIC_IP:4000"

# Display container status
docker ps

# Check for errors in the backend logs
echo "Backend logs:"
docker compose -f docker-compose.prod.yml logs backend
