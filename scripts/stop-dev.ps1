$ErrorActionPreference = "Continue"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stateDir = Join-Path $repoRoot ".pcs-dev"
foreach ($name in @("frontend", "api")) {
    $pidFile = Join-Path $stateDir "$name.pid"
    if (-not (Test-Path $pidFile)) { continue }
    $processId = 0
    if ([int]::TryParse((Get-Content $pidFile -Raw).Trim(), [ref]$processId)) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue; Write-Host "Stopped $name process (PID $processId)." }
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
