# Use Node.js base image
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Install dependencies (including dev, needed for build + prisma)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build

# -------- Production image --------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./
RUN npm install --production



# Expose port
EXPOSE 3000

# Run migrations and start app
CMD npx prisma migrate deploy && npm run start:prod
