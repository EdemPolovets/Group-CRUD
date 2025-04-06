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
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; do\n\
  echo "Waiting for postgres..."\n\
  sleep 1\n\
done\n\
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f src/db/migration/init.sql\n\
node dist/server.js' > /app/start.sh && chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["/app/start.sh"] 