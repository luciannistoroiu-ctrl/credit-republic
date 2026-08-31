# TradingView Script Viewer & Manager

Accesează, gestionează și sincronizează scripturile Pine Script din contul tău TradingView.

## 🚀 Setup Rapid

### 1. Set Environment Variables

```bash
# Linux/macOS
export TRADINGVIEW_USERNAME="your_username"
export TRADINGVIEW_PASSWORD="your_password"

# Windows (PowerShell)
$env:TRADINGVIEW_USERNAME="your_username"
$env:TRADINGVIEW_PASSWORD="your_password"
```

### 2. Pornește MCP Server

```bash
tradingview-mcp stdio
```

### 3. Rulează Script Manager

```bash
cd Trading/analysis
python3 view_tradingview_scripts.py
```

## 📋 Funcționalități

| Funcție | Descriere |
|---------|-----------|
| **List Scripts** | Vezi toate scripturile tale (publice + private) |
| **View Details** | Informații detaliate despre fiecare script |
| **Download** | Descarcă individual sau în bulk |
| **Sync** | Sincronizează local cu versiunea TradingView |
| **Statistics** | Views, likes, usage metrics |
| **Source Code** | Afișează Pine Script source code |

## 💻 Comenzi

### Afișare listă completa
```bash
TRADINGVIEW_USERNAME="user" TRADINGVIEW_PASSWORD="pass" python3 view_tradingview_scripts.py
```

Output:
```
YOUR TRADINGVIEW SCRIPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID          Name                      Type      Status    Likes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
script_001  RSI Strategy v1           strategy  published  145
script_002  Moving Average Crossover  indicator published  287
script_003  Bollinger Bands Alert     indicator private    0
script_004  Volume Profile            indicator published  523
```

### Detalii Script Specific
```python
from view_tradingview_scripts import TradingViewScriptManager

manager = TradingViewScriptManager(username="user", password="pass")
manager.connect()
manager.print_script_details("script_001")
```

### Sincronizare în Masă
```python
# Descarcă toate scripturile
synced_count = manager.sync_to_local()
print(f"Synced {synced_count} scripts to ./scripts/")
```

## 📊 Exemple de Output

### Metadate Script
```
📋 Metadata:
  ID: script_001
  Type: strategy
  Status: published
  Version: 1.0.1
  Description: RSI-based trading strategy with dynamic levels

📊 Statistics:
  Likes: 145
  Views: 1922
  Comments: 14
  Usage: 425 charts

📅 Timeline:
  Created: 2024-06-15
  Updated: 2024-08-30

🔗 Link: https://www.tradingview.com/script/ABC123/
```

### Source Code Viewer
```
💻 Source Code (first 20 lines):
  1: // Pine Script™ v5
  2: description('Sample Pine Script')
  3: strategy(title='Trading Strategy')
  4: 
  5: rsi = ta.rsi(close, 14)
  6: sma = ta.sma(close, 50)
  7: 
  8: if rsi < 30
  9:     strategy.entry("Long", strategy.long)
 10: if rsi > 70
 11:     strategy.close("Long")
 ...
```

## 🔗 Integrare cu Sistemul Trading

### 1. Importare Strategie
```python
from view_tradingview_scripts import TradingViewScriptManager

# Prelucrează script din TradingView
manager = TradingViewScriptManager()
manager.connect()

# Descarcă script
manager.download_script("script_001", "strategies/rsi_strategy.pine")

# Analizează local
with open("strategies/rsi_strategy.pine") as f:
    pine_code = f.read()
    # Integreaza cu backtester
```

### 2. Update Notificații
```python
# Monitorizează schimbări
def check_updates():
    manager = TradingViewScriptManager()
    manager.connect()
    
    for script in manager.list_scripts():
        if script['updated'] == today:
            print(f"✅ Updated: {script['name']}")
```

## 📁 Structura Fișierelor

```
Trading/
├── analysis/
│   ├── view_tradingview_scripts.py   # Main script manager
│   ├── demo_analysis.py              # Backtesting demo
│   └── scripts/                      # Local script cache
│       ├── RSI_Strategy_v1.pine
│       ├── Moving_Average_Crossover.pine
│       ├── Bollinger_Bands_Alert.pine
│       └── Volume_Profile.pine
├── strategies/
│   ├── rsi_strategy.py               # Python strategy class
│   └── template_strategy.py           # Base template
└── SCRIPT_VIEWER_GUIDE.md            # This file
```

## 🔐 Securitate

### ✅ Best Practices

1. **Niciodată nu comiti credentialele**
   ```bash
   # ❌ WRONG
   export TRADINGVIEW_PASSWORD="secret123" >> .bashrc
   
   # ✅ RIGHT
   export TRADINGVIEW_PASSWORD="$(cat ~/.tv_creds)"
   ```

2. **Foloseste environment variables**
   ```bash
   # .env.local (ignored by git)
   TRADINGVIEW_USERNAME=your_username
   TRADINGVIEW_PASSWORD=your_password
   ```

3. **Rotire regulară a credentialelor**
   - Schimbă parola lunar
   - Generează API keys noi periodic

4. **Activează 2FA pe TradingView**
   - Settings → Security → 2-Factor Authentication

## 🐛 Troubleshooting

### Eroare: "Connection failed"
```bash
# Verifica dacă MCP server rulează
tradingview-mcp --help

# Verifica conexiunea
curl -I https://www.tradingview.com
```

### Eroare: "Credentials not found"
```bash
# Setează variabilele
export TRADINGVIEW_USERNAME="your_username"
export TRADINGVIEW_PASSWORD="your_password"

# Verifica sunt setate
echo $TRADINGVIEW_USERNAME
```

### Scripturile nu se descarcă
```python
# Verifica permisiuni
import os
if not os.access("scripts/", os.W_OK):
    print("❌ No write permission in scripts/ directory")
```

## 🎯 Cazuri de Utilizare

### 1. Sincronizare Automatică
```bash
# Cron job - Ziua la 8 AM
0 8 * * * cd ~/Trading && TRADINGVIEW_USERNAME="user" TRADINGVIEW_PASSWORD="pass" python3 analysis/view_tradingview_scripts.py
```

### 2. Backup Scripts
```bash
# Backup zilnic
tar -czf backup_scripts_$(date +%Y%m%d).tar.gz scripts/
```

### 3. Version Control
```bash
# Track changes
cd scripts/
git init
git add *.pine
git commit -m "Add TradingView scripts"
```

### 4. Integrare CI/CD
```yaml
# GitHub Actions
- name: Sync TradingView Scripts
  env:
    TRADINGVIEW_USERNAME: ${{ secrets.TV_USERNAME }}
    TRADINGVIEW_PASSWORD: ${{ secrets.TV_PASSWORD }}
  run: python3 Trading/analysis/view_tradingview_scripts.py
```

## 📚 Resurse

- [TradingView Pine Script Docs](https://www.tradingview.com/pine_script_docs/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Trading Project Setup](./SETUP_TRADINGVIEW.md)
- [Main Demo](./analysis/demo_analysis.py)

## ✨ Următori Pași

- [ ] Real-time script monitoring
- [ ] Automatic backtesting on updates
- [ ] Performance comparison across scripts
- [ ] AI-powered script analysis
- [ ] Collaborative script sharing

---

**Last Updated:** 2024-08-31  
**Status:** ✅ Operational  
**Support:** See project README
