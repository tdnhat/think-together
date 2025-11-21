# Test script to verify EF Core model warnings are resolved
Write-Host "Testing EF Core model validation..." -ForegroundColor Cyan

Set-Location "D:\Projects\graduation-thesis\project\think-together\backend\src\ThinkTogether.Api"

$output = dotnet run --no-build 2>&1 | Select-String -Pattern "warn.*shadow" -Context 0,1

if ($output) {
    Write-Host "`nWARNINGS FOUND:" -ForegroundColor Red
    $output | ForEach-Object { Write-Host $_.Line -ForegroundColor Yellow }
    exit 1
} else {
    Write-Host "`nNo EF Core shadow property warnings found! ✓" -ForegroundColor Green
    exit 0
}

