#!/bin/bash
# Use environment variable for Docker Hub username or default to hardcoded value
DOCKER_USERNAME=${DOCKERHUB_USERNAME:-edenpolovets}
echo "Starting deployment with images from $DOCKER_USERNAME..."

# Clean up disk space
echo "Cleaning up disk space..."
docker system prune -af --volumes

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker stop frontend-container backend-container db-container || true
docker rm frontend-container backend-container db-container || true

# Pull latest images
echo "Pulling latest Docker images..."
docker pull $DOCKER_USERNAME/todo-app-frontend:latest
docker pull $DOCKER_USERNAME/todo-app-backend:latest
docker pull postgres:15-alpine

# Create a network for the containers if it doesn't exist
echo "Setting up Docker network..."
docker network create todo-app-network || true

# Setup volume for PostgreSQL data
echo "Creating PostgreSQL volume if it doesn't exist..."
docker volume create postgres_data || true

# Start PostgreSQL container
echo "Starting PostgreSQL database container..."
docker run -d --name db-container \
  --network todo-app-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=todo_app \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Wait for PostgreSQL to start
echo "Waiting for PostgreSQL to start..."
sleep 10

# Start backend container (we need it first to access the migration file)
echo "Starting backend container..."
docker run -d --name backend-container \
  --network todo-app-network \
  -p 4000:4000 \
  -e JWT_SECRET=NCI-2025 \
  -e NODE_ENV=production \
  -e DEBUG=express:* \
  -e FRONTEND_URL=http://ec2-13-218-172-249.compute-1.amazonaws.com:8080 \
  -e DATABASE_URL=postgresql://postgres:postgres@db-container:5432/todo_app \
  $DOCKER_USERNAME/todo-app-backend:latest

# Wait for backend to start and provide migration file
echo "Waiting for backend to start..."
sleep 5

# Copy and execute the init.sql file directly from the backend container
echo "Running migrations from the backend container..."
docker cp backend-container:/app/dist/db/migration/init.sql /tmp/init.sql || echo "Migration file not found in expected location!"
if [ -f "/tmp/init.sql" ]; then
  docker cp /tmp/init.sql db-container:/tmp/init.sql
  docker exec db-container psql -U postgres -d todo_app -f /tmp/init.sql
  echo "Migration completed successfully."
else
  echo "WARNING: Could not find migration file. Using fallback migration."
  # Use the same migration SQL content as in your init.sql
  cat > /tmp/init.sql << 'SQL_EOF'
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Create todos table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'todos') THEN
        CREATE TABLE todos (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- Create index if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_todos_user_id'
    ) THEN
        CREATE INDEX idx_todos_user_id ON todos(user_id);
    END IF;
END $$;
SQL_EOF
  docker cp /tmp/init.sql db-container:/tmp/init.sql
  docker exec db-container psql -U postgres -d todo_app -f /tmp/init.sql
  echo "Fallback migration completed."
fi

# Run frontend container
echo "Starting frontend container..."
docker run -d --name frontend-container \
  --network todo-app-network \
  -p 8080:80 \
  -e VITE_API_URL=http://ec2-13-218-172-249.compute-1.amazonaws.com:4000/api \
  $DOCKER_USERNAME/todo-app-frontend:latest

echo "Deployment completed successfully!"
echo "Frontend available at: http://ec2-13-218-172-249.compute-1.amazonaws.com:8080"
echo "Backend API available at: http://ec2-13-218-172-249.compute-1.amazonaws.com:4000"

# Display container status
docker ps

# Check for errors in the backend logs
echo "Backend logs:"
docker logs backend-container
