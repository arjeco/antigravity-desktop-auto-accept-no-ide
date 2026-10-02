# Install script to configure auto-accept to launch silently on Windows startup

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Antigravity Desktop Auto-Accept - Windows Startup Setup" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Ensure npm dependencies are installed
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "[1/3] Checking npm dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "$repoRoot\node_modules")) {
    npm install
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

# 2. Path to start-silent.vbs
$vbsPath = "$repoRoot\scripts\start-silent.vbs"

# 3. Create shortcut in Windows Startup folder
$startupFolder = [System.Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder "AntigravityAutoAccept.lnk"

Write-Host "[2/3] Creating Windows Startup shortcut in ($startupFolder)..." -ForegroundColor Yellow

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$vbsPath`""
$shortcut.WorkingDirectory = $repoRoot
$shortcut.Description = "Antigravity Desktop Auto-Accept Background Service"
$shortcut.Save()

Write-Host "Startup shortcut created successfully." -ForegroundColor Green

# 4. Start service now
Write-Host "[3/3] Starting background service..." -ForegroundColor Yellow
Start-Process "wscript.exe" -ArgumentList "`"$vbsPath`"" -WorkingDirectory $repoRoot

Write-Host ""
Write-Host "DONE! The service is now running in the background and will start automatically when Windows boots." -ForegroundColor Green
Write-Host "To view real-time logs: Get-Content ~/.antigravity/auto_accept.log -Wait" -ForegroundColor Gray
