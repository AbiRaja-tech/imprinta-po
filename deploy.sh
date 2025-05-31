#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_ID="imprintapo"  # Replace with your Google Cloud project ID
SERVICE_NAME="imprinta-po-frontend"
REGION="us-central1"  # Replace with your preferred region

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Build the Docker image with environment variables
echo "Building Docker image..."
docker build \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" \
    --build-arg FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" \
    --build-arg FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL" \
    --build-arg FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY" \
    -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

# Push the image to Google Container Registry
echo "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run with environment variables
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --set-env-vars="NODE_ENV=production" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID" \
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" \
    --set-env-vars="FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" \
    --set-env-vars="FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL" \
    --set-env-vars="FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10

echo "Deployment completed successfully!" 