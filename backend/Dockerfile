# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies and clean up in the same layer
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

# Install only the necessary runtime dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && npm install bcrypt --build-from-source \
    && apt-get remove -y python3 make g++ \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy only the necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/bcrypt ./node_modules/bcrypt

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/server.js"] 