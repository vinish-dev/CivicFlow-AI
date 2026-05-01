# Use official Node.js image
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install frontend dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY . .

# Build frontend (Vite)
RUN npm run build

# --- Final Image ---
FROM node:20-slim

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production --legacy-peer-deps

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from build stage
COPY --from=build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "backend/server.js"]
