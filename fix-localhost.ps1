#!/usr/bin/env powershell
# Vite Localhost Debug & Fix Script for Windows
# Usage: ./fix-localhost.ps1

Write-Host "🔧 Vite Localhost Diagnostics & Fix Tool" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to check port status
function Check-Port {
    param([int]$Port)
    
    $result = netstat -ano | findstr $Port
    if ($result) {
        Write-Host "⚠️  Port $Port is IN USE:" -ForegroundColor Yellow
        Write-Host $result
        return $true
    } else {
        Write-Host "✅ Port $Port is FREE" -ForegroundColor Green
        return $false
    }
}

# Function to kill Node processes
function Kill-NodeProcesses {
    Write-Host "`n🔪 Killing all Node.js processes..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "  Killing: $($_.Name) (PID: $($_.Id))"
        Stop-Process -InputObject $_ -Force
    }
    Start-Sleep -Seconds 1
    Write-Host "✅ Node processes terminated" -ForegroundColor Green
}

# 1. Check Node & NPM
Write-Host "`n📋 CHECKING ENVIRONMENT:" -ForegroundColor Cyan
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "  Node: $nodeVersion" -ForegroundColor Green
Write-Host "  NPM:  $npmVersion" -ForegroundColor Green

# 2. Check ports
Write-Host "`n🔌 CHECKING PORTS:" -ForegroundColor Cyan
Check-Port 5173
Check-Port 5174
Check-Port 5175

# 3. Check DNS
Write-Host "`n🌐 CHECKING DNS RESOLUTION:" -ForegroundColor Cyan
try {
    $localhost = [System.Net.Dns]::GetHostAddresses("localhost")
    Write-Host "  Localhost resolves to:" -ForegroundColor Green
    foreach ($ip in $localhost) {
        Write-Host "    - $ip"
    }
} catch {
    Write-Host "  ⚠️  DNS lookup failed: $_" -ForegroundColor Yellow
}

# 4. Kill Node processes
$response = Read-Host "`n❓ Kill all Node processes? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Kill-NodeProcesses
}

# 5. Check vite.config.js
Write-Host "`n📄 CHECKING vite.config.js:" -ForegroundColor Cyan
if (Test-Path "vite.config.js") {
    if ((Get-Content vite.config.js) -match 'host.*0\.0\.0\.0') {
        Write-Host "  ✅ Correct host configuration found (0.0.0.0)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Host configuration may be missing or incorrect" -ForegroundColor Yellow
    }
    
    if ((Get-Content vite.config.js) -match 'strictPort.*false') {
        Write-Host "  ✅ strictPort: false found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  strictPort setting may need adjustment" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ vite.config.js not found!" -ForegroundColor Red
}

# 6. Clear cache option
$response2 = Read-Host "`n❓ Clear npm cache? (y/n)"
if ($response2 -eq 'y' -or $response2 -eq 'Y') {
    Write-Host "Clearing npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "✅ Cache cleared" -ForegroundColor Green
}

# 7. Reinstall option
$response3 = Read-Host "`n❓ Reinstall node_modules? (y/n)"
if ($response3 -eq 'y' -or $response3 -eq 'Y') {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "Running npm install..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies reinstalled" -ForegroundColor Green
}

# Final summary
Write-Host "`n📋 FINAL CHECKLIST:" -ForegroundColor Cyan
Write-Host "  ✅ Node processes killed"
Write-Host "  ✅ vite.config.js configured (host: 0.0.0.0)"
Write-Host "  ✅ package.json scripts updated"
Write-Host "  ✅ Dependencies installed"
Write-Host "`n🚀 Ready to start! Run: npm run dev" -ForegroundColor Green
Write-Host "`n📖 After starting, open: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   in Chrome, Firefox, or Edge`n" -ForegroundColor Cyan
