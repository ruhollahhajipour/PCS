[CmdletBinding()]
param(
    [string]$DatabasePath = (Join-Path $env:LOCALAPPDATA "PCS\Development\PCS-Development.db"),
    [string]$ApiProject = "backend\src\PCS.API\PCS.API.csproj",
    [string]$FrontendDirectory = "frontend"
)
$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$apiProjectPath = Join-Path $repoRoot $ApiProject
$frontendPath = Join-Path $repoRoot $FrontendDirectory
$apiContentRoot = Split-Path $apiProjectPath -Parent
$devConfig = Join-Path $apiContentRoot "Config\pcs.config.json"
$stateDir = Join-Path $repoRoot ".pcs-dev"
function Test-PortInUse([int]$Port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try { $task = $client.ConnectAsync("127.0.0.1", $Port); return $task.Wait(350) -and $client.Connected }
    catch { return $false }
    finally { $client.Dispose() }
}
if (-not (Test-Path $apiProjectPath)) { throw "API project not found: $apiProjectPath" }
if (-not (Test-Path (Join-Path $frontendPath "package.json"))) { throw "Frontend package.json not found." }
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { throw ".NET SDK was not found. Install .NET 10 SDK." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "Node.js/npm was not found." }
if (-not (Test-Path (Join-Path $frontendPath "node_modules\vite"))) { throw "Frontend dependencies are missing. Run npm install in frontend first." }
if (Test-Path $devConfig) { throw "Stopped: $devConfig exists and Program.cs gives this config precedence over environment variables. Isolate/review it manually first; this script will not override it." }
if (Test-PortInUse 5201) { throw "Port 5201 is already in use. Stop the existing API process first." }
if (Test-PortInUse 5173) { throw "Port 5173 is already in use. Stop the existing Vite process first." }
$resolvedDb = [System.IO.Path]::GetFullPath($DatabasePath)
$dbDirectory = Split-Path $resolvedDb -Parent
New-Item -ItemType Directory -Force -Path $dbDirectory | Out-Null
Write-Host ""
Write-Host "PCS Development Startup" -ForegroundColor Cyan
Write-Host "API:      http://localhost:5201"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Database: $resolvedDb"
Write-Host ""
Write-Host "IMPORTANT: API startup runs EF Core migrations and SecuritySeed against this database." -ForegroundColor Yellow
Write-Host "A separate development SQLite file is used. Installer pcs.config.json is not used."
$confirmation = Read-Host "Type START to continue"
if ($confirmation -cne "START") { Write-Host "Cancelled. No service was started."; exit 0 }
$adminUsername = Read-Host "Development initial admin username [admin]"
if ([string]::IsNullOrWhiteSpace($adminUsername)) { $adminUsername = "admin" }
$securePassword = Read-Host "Development initial admin password (minimum 12 characters)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try { $adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr); $securePassword.Dispose() }
if ([string]::IsNullOrWhiteSpace($adminPassword) -or $adminPassword.Length -lt 12) { $adminPassword = $null; throw "Password must contain at least 12 characters. No service was started." }
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$apiOut = Join-Path $stateDir "api.stdout.log"
$apiErr = Join-Path $stateDir "api.stderr.log"
$webOut = Join-Path $stateDir "frontend.stdout.log"
$webErr = Join-Path $stateDir "frontend.stderr.log"
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:ConnectionStrings__DefaultConnection = "Data Source=$resolvedDb"
$env:InitialAdmin__Username = $adminUsername
$env:InitialAdmin__Password = $adminPassword
$api = $null
try {
    $api = Start-Process -FilePath "dotnet" -ArgumentList @("run", "--project", $apiProjectPath, "--launch-profile", "http") -WorkingDirectory $apiContentRoot -PassThru -RedirectStandardOutput $apiOut -RedirectStandardError $apiErr
    $apiReady = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if ($api.HasExited) { throw "API exited during startup. Review $apiErr and $apiOut. Frontend was not started." }
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:5201/health" -TimeoutSec 2
            if ($health.status -eq "ok") { $apiReady = $true; break }
        } catch { }
        Start-Sleep -Seconds 1
    }
    if (-not $apiReady) { throw "API did not become healthy within 30 seconds. Review $apiErr and $apiOut. Frontend was not started." }
    $web = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1") -WorkingDirectory $frontendPath -PassThru -RedirectStandardOutput $webOut -RedirectStandardError $webErr
    Set-Content -Path (Join-Path $stateDir "api.pid") -Value $api.Id
    Set-Content -Path (Join-Path $stateDir "frontend.pid") -Value $web.Id
    Write-Host ""
    Write-Host "Started API PID $($api.Id) and Frontend PID $($web.Id)." -ForegroundColor Green
    Write-Host "Open http://localhost:5173"
    Write-Host "Logs: $stateDir"
    Write-Host "Stop with: .\scripts\stop-dev.ps1"
} catch {
    if ($api -and -not $api.HasExited) { Stop-Process -Id $api.Id -Force -ErrorAction SilentlyContinue }
    throw
} finally {
    $env:ConnectionStrings__DefaultConnection = $null
    $env:InitialAdmin__Username = $null
    $env:InitialAdmin__Password = $null
    $adminPassword = $null
}
