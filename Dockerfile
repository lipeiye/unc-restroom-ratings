FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN cd server && npm ci --only=production
RUN cd client && npm ci

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build client
RUN cd client && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy server dependencies and code
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/ ./
COPY --from=builder /app/client/dist ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
