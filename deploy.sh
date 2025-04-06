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
echo "Stopping and forcefully removing existing containers..."
docker stop backend frontend postgres 2>/dev/null || true
docker rm -f backend frontend postgres 2>/dev/null || true

# Pull latest images from Docker Hub
echo "Pulling latest Docker images..."
docker pull $DOCKER_USERNAME/todo-app-frontend:latest
docker pull $DOCKER_USERNAME/todo-app-backend:latest
docker pull postgres:15

# Create a network for the containers if it doesn't exist
echo "Setting up Docker network..."
docker network create app-network 2>/dev/null || true

# More aggressive volume cleanup
echo "Forcefully removing PostgreSQL data volume..."
docker volume rm -f postgres_data
docker volume create postgres_data

# Start PostgreSQL container with volume
docker run -d --name postgres \
  --network app-network \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# Check container logs immediately after starting
echo "PostgreSQL container startup logs:"
sleep 2
docker logs postgres

# Check if container is running and print logs if it fails to stay running
echo "Checking if PostgreSQL container started successfully..."
sleep 3
if ! docker ps | grep -q postgres; then
  echo "ERROR: PostgreSQL container failed to start. Container logs:"
  docker logs postgres
  echo "Trying a different approach with explicit data permissions..."
  
  # Try with explicit data directory permissions
  docker run -d --name postgres \
    --network app-network \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD=$DB_PASSWORD \
    -e POSTGRES_DB=$DB_NAME \
    -v postgres_data:/var/lib/postgresql/data \
    postgres:15
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
MAX_RETRIES=10
RETRY_INTERVAL=2

for i in $(seq 1 $MAX_RETRIES); do
    echo "Attempt $i of $MAX_RETRIES..."
    if docker exec postgres pg_isready -U $DB_USER 2>/dev/null; then
        echo "PostgreSQL is ready!"
        break
    fi

    # Check if container is still running
    if ! docker ps | grep -q postgres; then
        echo "ERROR: PostgreSQL container stopped running. Container logs:"
        docker logs postgres
        echo "Exiting deployment due to database failure."
        exit 1
    fi

    if [ $i -eq $MAX_RETRIES ]; then
        echo "Error: Could not connect to PostgreSQL after $MAX_RETRIES attempts"
        docker logs postgres
        exit 1
    fi

    echo "PostgreSQL is not ready yet. Waiting $RETRY_INTERVAL seconds..."
    sleep $RETRY_INTERVAL
done

# Run the migrations using the init.sql file that was copied by CircleCI
echo "Running database migrations..."
if [ -f "$HOME/init.sql" ]; then
    echo "Using init.sql from home directory..."
    docker cp $HOME/init.sql postgres:/tmp/init.sql
    docker exec postgres psql -U $DB_USER -d $DB_NAME -f /tmp/init.sql
    echo "Migration completed successfully."
else
    echo "WARNING: init.sql not found in home directory."
    echo "Checking if backend container has the migration file..."
    
    # Try to extract it from the backend image as a fallback
    docker create --name temp-backend $DOCKER_USERNAME/todo-app-backend:latest
    if docker cp temp-backend:/app/dist/db/migration/init.sql /tmp/init.sql; then
        echo "Extracted init.sql from backend image."
        docker cp /tmp/init.sql postgres:/tmp/init.sql
        docker exec postgres psql -U $DB_USER -d $DB_NAME -f /tmp/init.sql
        echo "Migration completed successfully."
    else
        echo "WARNING: Could not find migration file. Creating base tables manually."
        # Only create UUID extension as absolute minimal setup
        docker exec postgres psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
        echo "Created UUID extension. Application will need to create tables on first run."
    fi
    docker rm temp-backend
fi

# Start backend container
echo "Starting backend container..."
docker run -d --name backend \
  --network app-network \
  -p 4000:4000 \
  -e JWT_SECRET=$JWT_SECRET \
  -e NODE_ENV=production \
  -e DB_USER=$DB_USER \
  -e DB_PASSWORD=$DB_PASSWORD \
  -e DB_HOST=postgres \
  -e DB_NAME=$DB_NAME \
  -e DB_PORT=5432 \
  -e FRONTEND_URL=http://$EC2_PUBLIC_IP \
  $DOCKER_USERNAME/todo-app-backend:latest

# Start frontend container
echo "Starting frontend container..."
docker run -d --name frontend \
  --network app-network \
  -p 80:80 \
  -e VITE_API_URL=http://$EC2_PUBLIC_IP:4000/api \
  $DOCKER_USERNAME/todo-app-frontend:latest

echo "Deployment completed successfully!"
echo "Frontend is available at: http://$EC2_PUBLIC_IP"
echo "Backend API is available at: http://$EC2_PUBLIC_IP:4000"

# Display container status
docker ps

# Check logs
echo "Backend logs:"
docker logs backend
