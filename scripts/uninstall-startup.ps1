# Uninstall script to remove auto-accept from Windows startup

$startupFolder = [System.Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder "AntigravityAutoAccept.lnk"

if (Test-Path $shortcutPath) {
    Remove-Item $shortcutPath -Force
    Write-Host "Startup shortcut removed successfully." -ForegroundColor Green
} else {
    Write-Host "No shortcut found in Windows Startup folder." -ForegroundColor Yellow
}

# Stop running node processes running index.js
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like "*antigravity-desktop-auto-accept-no-ide*" } | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force
    Write-Host "Stopped process: PID $($_.ProcessId)" -ForegroundColor Green
}

Write-Host "Uninstallation complete." -ForegroundColor Cyan
