#!/bin/bash

# Production Deployment Script for Eclipse Sales Platform
# This script builds and deploys the application using Docker

set -e  # Exit on any error

echo "🚀 Starting Eclipse Sales Platform deployment..."

# Check if required files exist
if [ ! -f ".env.production.local" ]; then
    echo "❌ Error: .env.production.local file not found!"
    echo "Please copy .env.production to .env.production.local and fill in your values."
    exit 1
fi

# Load environment variables
echo "📋 Loading environment variables..."
source .env.production.local

# Validate required environment variables
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_URL" "SUPABASE_KEY" "OPENAI_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set!"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Performing health checks..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    docker-compose -f docker-compose.prod.yml logs web
    exit 1
fi

if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is healthy"
else
    echo "❌ Backend API health check failed"
    docker-compose -f docker-compose.prod.yml logs api
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:8000"
echo "📊 View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Stop services: docker-compose -f docker-compose.prod.yml down"