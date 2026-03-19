# Stage 1: Build Step
FROM node:22-alpine AS build-step

# Set work directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies efficiently
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Nginx Server
FROM nginx:1.25.0-alpine

# Copy the Nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build-step
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
