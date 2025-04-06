#!/bin/bash
# Use environment variable for Docker Hub username or default to hardcoded value
DOCKER_USERNAME=${DOCKERHUB_USERNAME:-edenpolovets}
echo "Starting deployment with images from $DOCKER_USERNAME..."

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

# Create database tables
echo "Creating database tables..."
docker exec db-container psql -U postgres -d todo_app -c "
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"

# Run backend container
echo "Starting backend container..."
docker run -d --name backend-container \
  --network todo-app-network \
  -p 8443:4000 \
  -e JWT_SECRET=NCI-2025 \
  -e NODE_ENV=production \
  -e FRONTEND_URL=http://ec2-13-218-172-249.compute-1.amazonaws.com:8080 \
  -e DATABASE_URL=postgresql://postgres:postgres@db-container:5432/todo_app \
  -v $(pwd)/privatekey.pem:/app/privatekey.pem \
  -v $(pwd)/server.crt:/app/server.crt \
  $DOCKER_USERNAME/todo-app-backend:latest

# Run frontend container
echo "Starting frontend container..."
docker run -d --name frontend-container \
  --network todo-app-network \
  -p 8080:80 \
  -e VITE_API_URL=http://ec2-13-218-172-249.compute-1.amazonaws.com:8443/api \
  $DOCKER_USERNAME/todo-app-frontend:latest

echo "Deployment completed successfully!"
echo "Frontend available at: http://ec2-13-218-172-249.compute-1.amazonaws.com:8080"
echo "Backend API available at: http://ec2-13-218-172-249.compute-1.amazonaws.com:8443"

# Display container status
docker ps

# Check for errors in the backend logs
echo "Backend logs:"
docker logs backend-container --tail 20
