# Cleanup and Rebuild Script for UAEPass Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UAE Pass Backend - Cleanup & Rebuild" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all related processes
Write-Host "[1/5] Stopping all UAEPass processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*UAEPass*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  ✓ Processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Navigate to project directory
Write-Host "[2/5] Navigating to project directory..." -ForegroundColor Yellow
Set-Location "D:\Study\POCs\UAEPass-POC\UAEPass-POC\Backend\UAEPassPOC.API"
Write-Host "  ✓ In directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Step 3: Clean bin and obj folders
Write-Host "[3/5] Cleaning bin and obj folders..." -ForegroundColor Yellow
if (Test-Path "bin") {
    Remove-Item -Path "bin" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed bin folder" -ForegroundColor Green
}
if (Test-Path "obj") {
    Remove-Item -Path "obj" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed obj folder" -ForegroundColor Green
}
Start-Sleep -Seconds 2
Write-Host ""

# Step 4: Clear NuGet cache
Write-Host "[4/5] Clearing NuGet cache..." -ForegroundColor Yellow
dotnet nuget locals all --clear | Out-Null
Write-Host "  ✓ NuGet cache cleared" -ForegroundColor Green
Write-Host ""

# Step 5: Restore and Build
Write-Host "[5/5] Restoring and building..." -ForegroundColor Yellow
dotnet restore --force
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Restore successful" -ForegroundColor Green
} else {
    Write-Host "  ✗ Restore failed" -ForegroundColor Red
    exit 1
}

dotnet build --no-restore
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Cleanup and rebuild completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open Visual Studio" -ForegroundColor White
Write-Host "2. Open the solution: Backend\UAEPassPOC.sln" -ForegroundColor White
Write-Host "3. Press F5 to run" -ForegroundColor White
Write-Host ""
