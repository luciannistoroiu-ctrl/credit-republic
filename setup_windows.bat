@echo off
REM WAVE•PM Optimizer - Windows Setup & Run Script
REM Clonează repo și rulează optimizatorul automat

echo ======================================================================
echo 🚀 WAVE•PM Crypto.com MCP Optimizer - Windows Setup
echo ======================================================================

REM Setează directorul
cd /d C:\Users\%USERNAME%\Documents

REM Verifică dacă repository e deja clonat
if exist credit-republic (
    echo ✓ Repository deja clonat
    cd credit-republic
) else (
    echo 📥 Clonează repository...
    git clone https://github.com/luciannistoroiu-ctrl/credit-republic.git
    cd credit-republic
)

REM Checkout branch-ul cu Crypto.com MCP
echo 🔄 Checkout branch claude/tradingview-mcp-install-zgnsmc...
git fetch origin claude/tradingview-mcp-install-zgnsmc
git checkout claude/tradingview-mcp-install-zgnsmc
git pull origin claude/tradingview-mcp-install-zgnsmc

REM Du-te în directorul wave_pm
cd Trading\analysis\wave_pm

echo.
echo ✓ Setup complet!
echo.
echo ======================================================================
echo 🎯 Rulează optimizatorul cu Crypto.com MCP data:
echo ======================================================================
echo.

REM Verifica Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python nu e instalat! Instalează de la python.org
    pause
    exit /b 1
)

echo ✓ Python găsit
echo ✓ Starting optimizer...
echo.

REM Rulează optimizatorul
python optimize_top5_multitf_cryptocom.py

echo.
echo ======================================================================
echo ✅ Optimizer complet!
echo ======================================================================
pause
