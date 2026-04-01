# Stage 1: Build Step
FROM node:24.14.0-alpine AS build-step

# Set work directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies efficiently
RUN corepack enable

RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Set environment variables
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Build the application
RUN pnpm run build

# Stage 2: Nginx Server
FROM nginx:1.28.2-alpine

# Copy the Nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build-step
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
