# Use Node.js base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app (for NestJS/Next.js/React)
RUN npm run build

# Expose port (change if needed)
EXPOSE 3000

# Run migrations and start app
CMD npx prisma migrate deploy && npm run start:prod
