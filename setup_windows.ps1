# WAVE•PM Optimizer - Windows PowerShell Setup & Run Script
# Clonează repo și rulează optimizatorul automat

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 WAVE•PM Crypto.com MCP Optimizer - Windows PowerShell Setup" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Setează directorul
$docsPath = [System.IO.Path]::Combine($env:USERPROFILE, "Documents")
Set-Location $docsPath

# Verifică dacă repository e deja clonat
if (Test-Path "credit-republic") {
    Write-Host "✓ Repository deja clonat" -ForegroundColor Green
    Set-Location credit-republic
} else {
    Write-Host "📥 Clonează repository..." -ForegroundColor Yellow
    git clone https://github.com/luciannistoroiu-ctrl/credit-republic.git
    Set-Location credit-republic
}

# Checkout branch-ul cu Crypto.com MCP
Write-Host "🔄 Checkout branch claude/tradingview-mcp-install-zgnsmc..." -ForegroundColor Yellow
git fetch origin claude/tradingview-mcp-install-zgnsmc
git checkout claude/tradingview-mcp-install-zgnsmc
git pull origin claude/tradingview-mcp-install-zgnsmc

# Du-te în directorul wave_pm
Set-Location "Trading\analysis\wave_pm"

Write-Host ""
Write-Host "✓ Setup complet!" -ForegroundColor Green
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🎯 Rulează optimizatorul cu Crypto.com MCP data:" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Verifica Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python găsit: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python nu e instalat! Instalează de la python.org" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Starting optimizer..." -ForegroundColor Green
Write-Host ""

# Rulează optimizatorul
python optimize_top5_multitf_cryptocom.py

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "✅ Optimizer complet!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
