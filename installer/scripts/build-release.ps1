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
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed with exit code $LASTEXITCODE" }

Write-Host "Building Frontend..."
Push-Location $frontend
try {
    # The on-premise API serves the SPA from the same origin, so the
    # frontend must call the relative /api path (not an absolute HTTPS URL).
    $env:VITE_API_URL = "/api"

    # Same install flags as .github/workflows/frontend-validation.yml.
    npm ci --legacy-peer-deps --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed with exit code $LASTEXITCODE" }

    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed with exit code $LASTEXITCODE" }
}
finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
}

Copy-Item `
    "$frontend\dist\*" `
    "$publish\client" `
    -Recurse

Write-Host ""
Write-Host "====================================="
Write-Host " Build Completed Successfully"
Write-Host "====================================="