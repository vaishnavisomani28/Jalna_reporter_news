# JalnaReporterNews - Quick Setup Script
# PowerShell script to check and setup everything

Write-Host "`nJalnaReporterNews Setup Check`n" -ForegroundColor Cyan

# Check .env.local
Write-Host "Checking .env.local file..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "OK: .env.local file exists" -ForegroundColor Green
    $envContent = Get-Content .env.local
    $hasMongo = $envContent | Select-String -Pattern "MONGODB_URI"
    $hasYoutube = $envContent | Select-String -Pattern "YOUTUBE_API_KEY"
    $hasChannel = $envContent | Select-String -Pattern "YOUTUBE_CHANNEL_ID"
    
    if ($hasMongo) { Write-Host "  OK: MONGODB_URI found" -ForegroundColor Green }
    else { Write-Host "  ERROR: MONGODB_URI missing" -ForegroundColor Red }
    
    if ($hasYoutube) { Write-Host "  OK: YOUTUBE_API_KEY found" -ForegroundColor Green }
    else { Write-Host "  ERROR: YOUTUBE_API_KEY missing" -ForegroundColor Red }
    
    if ($hasChannel) { Write-Host "  OK: YOUTUBE_CHANNEL_ID found" -ForegroundColor Green }
    else { Write-Host "  ERROR: YOUTUBE_CHANNEL_ID missing" -ForegroundColor Red }
} else {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "   Please create .env.local file first" -ForegroundColor Yellow
    exit 1
}

# Check MongoDB Service
Write-Host "`nChecking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq 'Running') {
        Write-Host "OK: MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "WARNING: MongoDB service found but not running" -ForegroundColor Yellow
        Write-Host "   Starting MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB
            Write-Host "OK: MongoDB service started" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: Failed to start MongoDB service" -ForegroundColor Red
            Write-Host "   Run as Administrator or start manually" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "WARNING: MongoDB service not found" -ForegroundColor Yellow
    Write-Host "   Options:" -ForegroundColor Yellow
    Write-Host "   1. Install MongoDB locally" -ForegroundColor Cyan
    Write-Host "   2. Use MongoDB Atlas (cloud)" -ForegroundColor Cyan
    Write-Host "   See MONGODB_SETUP.md for details" -ForegroundColor Cyan
}

# Test MongoDB Connection
Write-Host "`nTesting MongoDB connection..." -ForegroundColor Yellow
try {
    node test-mongodb.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nOK: MongoDB connection successful!" -ForegroundColor Green
    } else {
        Write-Host "`nERROR: MongoDB connection failed" -ForegroundColor Red
        Write-Host "   Check MONGODB_SETUP.md for troubleshooting" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Error testing MongoDB connection" -ForegroundColor Red
}

# Final instructions
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "   1. If MongoDB connected: npm run create-admin" -ForegroundColor White
Write-Host "   2. Start server: npm run dev" -ForegroundColor White
Write-Host "   3. Access: http://localhost:3000" -ForegroundColor White
Write-Host "   4. Admin: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
