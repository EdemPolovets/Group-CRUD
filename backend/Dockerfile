# Build stage
FROM node:20-slim as builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install build dependencies needed for bcrypt and psql
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/db/migration ./src/db/migration

# Install only production dependencies
RUN npm install --only=production

# Create a script to run migrations
RUN echo '#!/bin/bash\n\
\n\
# Function to check if environment variable is set\n\
check_env() {\n\
    if [ -z "${!1}" ]; then\n\
        echo "Error: $1 is not set"\n\
        exit 1\n\
    fi\n\
}\n\
\n\
# Log all environment variables (except sensitive ones)\n\
echo "Environment Variables:"\n\
env | grep -v "PASSWORD" | grep -v "SECRET" | sort\n\
\n\
# Check required environment variables\n\
echo "Checking environment variables..."\n\
check_env "DB_USER"\n\
check_env "DB_PASSWORD"\n\
check_env "DB_HOST"\n\
check_env "DB_NAME"\n\
check_env "JWT_SECRET"\n\
\n\
echo "Environment variables check passed"\n\
echo "DB_HOST: $DB_HOST"\n\
echo "DB_USER: $DB_USER"\n\
echo "DB_NAME: $DB_NAME"\n\
\n\
# Wait for PostgreSQL to be ready\n\
echo "Waiting for PostgreSQL to be ready..."\n\
MAX_RETRIES=30\n\
RETRY_INTERVAL=2\n\
\n\
for i in $(seq 1 $MAX_RETRIES); do\n\
    echo "Attempt $i of $MAX_RETRIES..."\n\
    if PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then\n\
        echo "PostgreSQL is ready!"\n\
        break\n\
    fi\n\
    \n\
    if [ $i -eq $MAX_RETRIES ]; then\n\
        echo "Error: Could not connect to PostgreSQL after $MAX_RETRIES attempts"\n\
        exit 1\n\
    fi\n\
    \n\
    echo "PostgreSQL is not ready yet. Waiting $RETRY_INTERVAL seconds..."\n\
    sleep $RETRY_INTERVAL\n\
done\n\
\n\
# Run migrations with detailed error logging\n\
echo "Running database migrations..."\n\
if ! PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f src/db/migration/init.sql; then\n\
    echo "Error: Failed to run migrations. Showing detailed output:"\n\
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f src/db/migration/init.sql\n\
    echo "Migration failed with the above error"\n\
    exit 1\n\
fi\n\
\n\
echo "Migrations completed successfully"\n\
echo "Starting application..."\n\
\n\
# Start the application\n\
exec node dist/server.js' > /app/start.sh && chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["/app/start.sh"] 