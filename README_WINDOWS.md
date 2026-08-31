# 🚀 WAVE•PM Optimizer - Windows Setup Guide

## Quick Start (Recomandat)

### Option 1: Batch Script (CMD)
```bash
# 1. Download setup_windows.bat din repo
# 2. Double-click pe setup_windows.bat
# 3. Astepta sa se completeze!
```

### Option 2: PowerShell Script
```powershell
# 1. Open PowerShell as Administrator
# 2. Navigate to repo folder
# 3. Run:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\setup_windows.ps1
```

## Manual Setup

Daca scripturile nu merg, fa asta manual:

```bash
# 1. Deschide CMD / PowerShell
# 2. Du-te in Documents
cd C:\Users\%USERNAME%\Documents

# 3. Clonează repository
git clone https://github.com/luciannistoroiu-ctrl/credit-republic.git

# 4. Du-te in wave_pm
cd credit-republic\Trading\analysis\wave_pm

# 5. Checkout branch cu Crypto.com MCP
git fetch origin claude/tradingview-mcp-install-zgnsmc
git checkout claude/tradingview-mcp-install-zgnsmc

# 6. Instaleaza dependente
pip install pandas

# 7. Rulează optimizatorul
python optimize_top5_multitf_cryptocom.py
```

## Cerințe

- **Python 3.7+** - Download de la https://python.org
  - ✅ Selectează "Add Python to PATH" during install
- **Git** - Download de la https://git-scm.com
- **Pandas** - Install cu: `pip install pandas`

## Output

Optimizatorul va genera:
- **JSON Report**: `top5_multitf_cryptocom_[timestamp].json`
- **Console Output**: Progress + Best parameters per crypto
- **Data Source**: Crypto.com MCP (FREE, no auth required)

## Troubleshooting

### "Python not found"
```bash
# Verifica installation
python --version

# Daca nu merge, reinstaleaza cu "Add Python to PATH" checked
```

### "Git not found"
```bash
# Instaleaza git de la: https://git-scm.com
```

### "No module named pandas"
```bash
pip install pandas
```

### "Connection error to Crypto.com"
- Optimizer va folosi CSV fallback (TradingView data) automat
- MCP e optional - sistemul merge si fara

## Data Sources

Optimizatorul foloseste chain-ul de fallback:

1. **Crypto.com MCP** (Real-time, FREE) ← Preferred
2. **TradingView CSV** (Offline) ← Fallback
3. **Local Cache** (Cached) ← Last resort

## Next Steps

1. Genereaza report cu `optimize_top5_multitf_cryptocom.py`
2. Salveaza report-ul in `strategy_config.py`
3. Backtestează cu parametrii optimizati

## Support

Repository: https://github.com/luciannistoroiu-ctrl/credit-republic
Branch: `claude/tradingview-mcp-install-zgnsmc`
