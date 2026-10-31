$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================="
Write-Host " PCS Build & Release"
Write-Host "====================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\..\.."

$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$publish = Join-Path $root "installer\publish"

if (Test-Path $publish) {
    Remove-Item $publish -Recurse -Force
}

New-Item -ItemType Directory -Path $publish | Out-Null
New-Item -ItemType Directory -Path "$publish\server" | Out-Null
New-Item -ItemType Directory -Path "$publish\client" | Out-Null

Write-Host "Publishing Backend..."
dotnet publish "$backend\src\PCS.API" `
    -c Release `
    -o "$publish\server"

Write-Host "Building Frontend..."
Push-Location $frontend
npm install
npm run build
Pop-Location

Copy-Item `
    "$frontend\dist\*" `
    "$publish\client" `
    -Recurse

Write-Host ""
Write-Host "====================================="
Write-Host " Build Completed Successfully"
Write-Host "====================================="