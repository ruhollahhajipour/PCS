[CmdletBinding()]
param(
    [switch]$SkipDatabaseMigrationWarning
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$ApiProject = Join-Path $ProjectRoot "backend\src\PCS.API\PCS.API.csproj"
$FrontendDirectory = Join-Path $ProjectRoot "frontend"
$FrontendPackage = Join-Path $FrontendDirectory "package.json"
$ApiUrl = "http://localhost:5201"
$FrontendUrl = "http://localhost:5173"
$ApiPort = 5201
$FrontendPort = 5173

function Write-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Test-TcpPort([int]$Port) {
    $client = $null
    try {
        $client = [System.Net.Sockets.TcpClient]::new()
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        return $task.Wait(700) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        if ($null -ne $client) { $client.Dispose() }
    }
}

function Test-HttpResponding([string]$Url) {
    try {
        $request = [System.Net.HttpWebRequest]::Create($Url)
        $request.Timeout = 1200
        $request.AllowAutoRedirect = $false
        $response = $request.GetResponse()
        $response.Close()
        return $true
    }
    catch [System.Net.WebException] {
        # HTTP 4xx/5xx still proves an HTTP server answered.
        if ($null -ne $_.Exception.Response) {
            $_.Exception.Response.Close()
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

Write-Step "Checking PCS development prerequisites"

if (-not (Test-Path -LiteralPath $ApiProject)) {
    throw "Backend project not found: $ApiProject"
}
if (-not (Test-Path -LiteralPath $FrontendPackage)) {
    throw "Frontend package.json not found: $FrontendPackage"
}
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    throw "The .NET SDK was not found in PATH."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found in PATH. Install/use Node.js before running PCS."
}

Write-Host "Repository: $ProjectRoot"
Write-Host "Backend:    $ApiUrl"
Write-Host "Frontend:   $FrontendUrl"

Write-Host "`nIMPORTANT: PCS API startup runs EF Core database migrations and seeds security data."
Write-Host "This script does not run the API itself until you confirm below."
if (-not $SkipDatabaseMigrationWarning) {
    $answer = Read-Host "Continue and start the development API (which may modify its configured database)? Type YES"
    if ($answer -cne "YES") {
        Write-Host "Cancelled. No PCS processes were started." -ForegroundColor Yellow
        exit 0
    }
}

Write-Step "Checking ports"

if (Test-TcpPort $ApiPort) {
    Write-Host "Port $ApiPort is already in use. Not starting another API process." -ForegroundColor Yellow
    if (-not (Test-HttpResponding $ApiUrl)) {
        Write-Host "An application owns the port, but HTTP did not respond at $ApiUrl." -ForegroundColor Red
        throw "Resolve the existing listener on port $ApiPort before retrying."
    }
    Write-Host "An HTTP server already responds at $ApiUrl; reusing it."
}
else {
    Write-Step "Starting Backend in a separate PowerShell window"
    $backendCommand = "Set-Location -LiteralPath '$ProjectRoot\backend'; dotnet run --project '$ApiProject' --launch-profile http"
    $encodedBackend = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($backendCommand))
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit", "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encodedBackend
    ) | Out-Null

    Write-Host "Waiting up to 60 seconds for an HTTP response from $ApiUrl ..."
    $apiReady = $false
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1
        if (Test-HttpResponding $ApiUrl) {
            $apiReady = $true
            break
        }
    }
    if (-not $apiReady) {
        throw "Backend did not respond within 60 seconds. Check the Backend PowerShell window. No database or process cleanup was attempted."
    }
    Write-Host "Backend is responding over HTTP."
}

Write-Step "Starting Frontend"
if (Test-TcpPort $FrontendPort) {
    Write-Host "Port $FrontendPort is already in use. Reusing the existing listener." -ForegroundColor Yellow
}
else {
    $frontendCommand = "Set-Location -LiteralPath '$FrontendDirectory'; npm run dev -- --host 127.0.0.1"
    $encodedFrontend = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($frontendCommand))
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit", "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encodedFrontend
    ) | Out-Null

    $frontendReady = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        if (Test-HttpResponding $FrontendUrl) {
            $frontendReady = $true
            break
        }
    }
    if (-not $frontendReady) {
        throw "Frontend did not respond within 30 seconds. Check the Frontend PowerShell window."
    }
    Write-Host "Frontend is responding over HTTP."
}

Write-Step "PCS development launch requested"
Write-Host "Open: $FrontendUrl" -ForegroundColor Green
Write-Host "API:  $ApiUrl"
Write-Host "Backend and Frontend remain in their own PowerShell windows."
Write-Host "Close those windows to stop the processes started by this script."
