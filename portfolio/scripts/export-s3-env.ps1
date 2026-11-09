# Appwrite S3 Configuration for PowerShell
param (
    [string]$ApiKey = $env:AWS_SECRET_ACCESS_KEY
)

$env:AWS_ACCESS_KEY_ID = "6ad0f8ab0025a03812f7"
if ($ApiKey) {
    $env:AWS_SECRET_ACCESS_KEY = $ApiKey
}
$env:AWS_DEFAULT_REGION = "sfo"
$env:AWS_ENDPOINT_URL = "https://sfo.cloud.appwrite.io/v1/s3"

Write-Host "✓ Appwrite S3 Environment Variables Loaded:" -ForegroundColor Green
Write-Host "  AWS_ACCESS_KEY_ID     = $env:AWS_ACCESS_KEY_ID"
Write-Host "  AWS_DEFAULT_REGION    = $env:AWS_DEFAULT_REGION"
Write-Host "  AWS_ENDPOINT_URL      = $env:AWS_ENDPOINT_URL"
if ($env:AWS_SECRET_ACCESS_KEY) {
    Write-Host "  AWS_SECRET_ACCESS_KEY = [SET (${#env:AWS_SECRET_ACCESS_KEY} chars)]" -ForegroundColor Cyan
} else {
    Write-Host "  AWS_SECRET_ACCESS_KEY = [NOT SET] (Pass as argument: .\export-s3-env.ps1 '<API_KEY>')" -ForegroundColor Yellow
}

