#requires -Version 5.1
<#
.SYNOPSIS
    Builds the Windows on-premise installer (PCSSetup.exe) from a clean checkout.

.DESCRIPTION
    Produces exactly the inputs that backend/src/PCS.Installer/PCS.Installer.csproj
    validates in its PrepareSetupPackage target:

      frontend/dist                                  (VITE_API_URL=/api, same-origin)
      backend/publish/PCS.API/PCS.API.exe            (self-contained win-x64)
      backend/src/PCS.Launcher/bin/Release/net10.0-windows/win-x64/publish

    and then publishes the installer, which bundles them into
    backend/src/PCS.Installer/Setup/PCSSetup.exe.

    Run on Windows with the .NET 10 SDK and Node.js 22.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param(
        [Parameter(Mandatory)] [string] $Name,
        [Parameter(Mandatory)] [scriptblock] $Action
    )

    Write-Host ""
    Write-Host "==> $Name"
    $global:LASTEXITCODE = 0
    & $Action
    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE"
    }
}

Write-Host ""
Write-Host "====================================="
Write-Host " PCS Build & Release"
Write-Host "====================================="

$root     = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backend  = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$apiOut   = Join-Path $backend "publish\PCS.API"
$setupExe = Join-Path $backend "src\PCS.Installer\Setup\PCSSetup.exe"

# ---------------------------------------------------------------
# Frontend (served by PCS.API from the same origin => relative /api)
# ---------------------------------------------------------------
Push-Location $frontend
try {
    $env:VITE_API_URL = "/api"

    # Same install flags as .github/workflows/frontend-validation.yml.
    Invoke-Step "Install frontend dependencies" {
        npm ci --legacy-peer-deps --no-audit --no-fund
    }

    Invoke-Step "Build frontend" { npm run build }
}
finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
}

if (-not (Test-Path (Join-Path $frontend "dist\index.html"))) {
    throw "Frontend build did not produce frontend\dist\index.html"
}

# ---------------------------------------------------------------
# API: self-contained so the target machine needs no .NET runtime
# ---------------------------------------------------------------
if (Test-Path $apiOut) {
    Remove-Item $apiOut -Recurse -Force
}

Invoke-Step "Publish PCS.API (win-x64, self-contained)" {
    dotnet publish (Join-Path $backend "src\PCS.API\PCS.API.csproj") `
        -c Release -r win-x64 --self-contained true -o $apiOut
}

if (-not (Test-Path (Join-Path $apiOut "PCS.API.exe"))) {
    throw "API publish did not produce PCS.API.exe"
}

# ---------------------------------------------------------------
# Launcher (single-file, self-contained; settings are in its csproj)
# ---------------------------------------------------------------
Invoke-Step "Publish PCS.Launcher" {
    dotnet publish (Join-Path $backend "src\PCS.Launcher\PCS.Launcher.csproj") -c Release
}

# ---------------------------------------------------------------
# Installer (bundles API + frontend + launcher into PCSSetup.exe)
# ---------------------------------------------------------------
Invoke-Step "Publish PCS.Installer" {
    dotnet publish (Join-Path $backend "src\PCS.Installer\PCS.Installer.csproj") -c Release
}

if (-not (Test-Path $setupExe)) {
    throw "Installer publish did not produce $setupExe"
}

$hash = (Get-FileHash $setupExe -Algorithm SHA256).Hash
$sizeMb = [math]::Round((Get-Item $setupExe).Length / 1MB, 1)

Write-Host ""
Write-Host "====================================="
Write-Host " Build Completed Successfully"
Write-Host " $setupExe"
Write-Host " $sizeMb MB  SHA256 $hash"
Write-Host "====================================="
