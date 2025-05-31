# Load environment variables
. .\set-env.ps1

# Configuration
$PROJECT_ID = "imprintapo"
$SERVICE_NAME = "imprinta-po-frontend"
$REGION = "us-central1"

Write-Host "Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

Write-Host "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

Write-Host "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME `
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 3000 `
    --set-env-vars="NODE_ENV=production" `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10

Write-Host "Deployment completed successfully!" 