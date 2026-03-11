#!/bin/bash

# Configuration
DOCKER_USER="andremugabo"
BACKEND_REPO="kst-backend"
FRONTEND_REPO="kst-frontend"
ADMIN_REPO="kst-admin"
TAG="prod"
API_URL="https://kst-backend.onrender.com/api"
UPLOAD_URL="https://kst-backend.onrender.com"

echo "🚀 Starting build and push process for KST containers..."

# 1. Backend
echo "📦 Building Backend..."
docker build -t $DOCKER_USER/$BACKEND_REPO:$TAG ./kst-backend
echo "📤 Pushing Backend..."
docker push $DOCKER_USER/$BACKEND_REPO:$TAG

# 2. Frontend
echo "📦 Building Frontend..."
docker build \
  --build-arg VITE_API_URL=$API_URL \
  --build-arg VITE_UPLOAD_URL=$UPLOAD_URL \
  -t $DOCKER_USER/$FRONTEND_REPO:$TAG ./kst-frontend
echo "📤 Pushing Frontend..."
docker push $DOCKER_USER/$FRONTEND_REPO:$TAG

# 3. Admin
echo "📦 Building Admin..."
docker build \
  --build-arg VITE_API_URL=$API_URL \
  --build-arg VITE_UPLOAD_URL=$UPLOAD_URL \
  -t $DOCKER_USER/$ADMIN_REPO:$TAG ./admin-kst
echo "📤 Pushing Admin..."
docker push $DOCKER_USER/$ADMIN_REPO:$TAG

echo "✅ All images pushed successfully to Docker Hub!"
