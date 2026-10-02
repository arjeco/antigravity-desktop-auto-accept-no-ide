# Install script to configure auto-accept to launch silently on Windows startup

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Antigravity Desktop Auto-Accept - Setup Inicio Windows" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Ensure npm dependencies are installed
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "[1/3] Verificando dependencias npm..." -ForegroundColor Yellow
if (-not (Test-Path "$repoRoot\node_modules")) {
    npm install
} else {
    Write-Host "Dependencias ya instaladas." -ForegroundColor Green
}

# 2. Path to start-silent.vbs
$vbsPath = "$repoRoot\scripts\start-silent.vbs"

# 3. Create shortcut in Windows Startup folder
$startupFolder = [System.Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder "AntigravityAutoAccept.lnk"

Write-Host "[2/3] Creando acceso directo en Inicio de Windows ($startupFolder)..." -ForegroundColor Yellow

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$vbsPath`""
$shortcut.WorkingDirectory = $repoRoot
$shortcut.Description = "Antigravity Desktop Auto-Accept Background Service"
$shortcut.Save()

Write-Host "Acceso directo creado exitosamente." -ForegroundColor Green

# 4. Start service now
Write-Host "[3/3] Iniciando el servicio en segundo plano..." -ForegroundColor Yellow
Start-Process "wscript.exe" -ArgumentList "`"$vbsPath`"" -WorkingDirectory $repoRoot

Write-Host ""
Write-Host "LISTO! El servicio ya esta corriendo en segundo plano y se iniciara automaticamente cada vez que enciendas tu PC." -ForegroundColor Green
Write-Host "Para verificar logs: Get-Content ~/.antigravity/auto_accept.log -Wait" -ForegroundColor Gray
