# LearnFlow Docker Restart Script with Database Migration
# This script will restart all containers and apply the new database migration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LearnFlow Docker Restart & Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all containers
Write-Host "[1/5] Stopping all containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "Containers stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Remove the old postgres volume to apply new migration
Write-Host "[2/5] Removing old database volume..." -ForegroundColor Yellow
docker volume rm hackahton-iii-postgres-data 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Old database volume removed" -ForegroundColor Green
} else {
    Write-Host "Database volume not found (this is okay)" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Start all containers with fresh database
Write-Host "[3/5] Starting all containers with fresh database..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "Containers started" -ForegroundColor Green
Write-Host ""

# Step 4: Wait for database initialization
Write-Host "[4/5] Waiting for database initialization (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
Write-Host "Database should be initialized" -ForegroundColor Green
Write-Host ""

# Step 5: Check container health
Write-Host "[5/5] Checking container status..." -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# Show logs from postgres to confirm migration
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Migration Logs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose logs postgres --tail=50
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Triage API: http://localhost:8001" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs:" -ForegroundColor White
Write-Host "  docker-compose logs -f [service-name]" -ForegroundColor Gray
Write-Host ""
