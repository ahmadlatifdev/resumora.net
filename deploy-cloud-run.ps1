# Deploy resumora-net to Cloud Run (source: this repo / main)
# Prerequisites: gcloud CLI, docker (optional), authenticated: gcloud auth login

$ErrorActionPreference = "Stop"

$Service = "resumora-net"
$Region = "us-central1"
$Bucket = "resumora-data-333"
$MountPath = "/mnt/data"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Resolve-Gcloud {
    $candidates = @(
        "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd",
        "$env:ProgramFiles\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
    )
    foreach ($p in $candidates) {
        if (Test-Path $p) { return $p }
    }
    $cmd = Get-Command gcloud -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    throw "gcloud not found. Install Google Cloud SDK and run: gcloud auth login"
}

$gcloud = Resolve-Gcloud
Write-Host "Using gcloud: $gcloud" -ForegroundColor Cyan

$project = & $gcloud config get-value project 2>$null
if (-not $project) {
    throw "No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
}
Write-Host "Project: $project" -ForegroundColor Cyan

Set-Location $RepoRoot

Write-Host "Deploying $Service from $RepoRoot ..." -ForegroundColor Yellow
& $gcloud run deploy $Service `
    --source . `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --add-volume "name=data,type=cloud-storage,bucket=$Bucket" `
    --add-volume-mount "volume=data,mount-path=$MountPath"

$url = & $gcloud run services describe $Service --region $Region --format "value(status.url)"
Write-Host "`nDeployed: $url" -ForegroundColor Green
