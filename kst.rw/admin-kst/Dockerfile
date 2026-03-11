# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Delete any local .env files to ensure build-args are used
RUN rm -f .env*

# Set environment variable for build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_UPLOAD_URL
ENV VITE_UPLOAD_URL=$VITE_UPLOAD_URL

# Build the application
RUN npm run build

# Production Stage
FROM nginx:stable-alpine

# Copy build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed (optional)
# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
