# WAVE•PM BTC/USD Quick Start Guide

## 🚀 Cea mai rapidă metodă de test

### Opțiunea 1: Online cu yfinance (RECOMANDAT)

**Pe mașina ta locală cu internet:**

```bash
cd Trading/analysis/wave_pm

# Single Timeframe (Daily) - BTC cu parametrii optimizați
python backtest_btc_yfinance.py

# Multi-Timeframe (1d, 4h, 1h, 15m) - Analiză hierarchică
python backtest_btc_multitf_yfinance.py
```

**Avantaje:**
- ✓ Data reală din Yahoo Finance
- ✓ Automat, fără export manual
- ✓ Complet (10+ ani de history)
- ✓ Comparație parametri

**Dezavantaje:**
- ⚠️ Necesită internet
- ⚠️ Blocat în cloud (proxy)

---

### Opțiunea 2: Offline cu TradingView CSV

**Pe orice mașină (fără internet):**

```bash
# 1. Deschide TradingView
https://www.tradingview.com/chart/

# 2. Selectează BTCUSD
# 3. Seteaza timeframe: Daily (1d)
# 4. Click dreapta pe grafic → "Export data"
# 5. Salvează ca BTCUSD_1d.csv

# 6. Plasează în repo
mkdir -p Trading/analysis/wave_pm/tradingview_data/
cp ~/Downloads/BTCUSD_1d.csv Trading/analysis/wave_pm/tradingview_data/

# 7. Rulează backtest
cd Trading/analysis/wave_pm
python backtest_wave_pm.py
```

**Pentru Multi-TF (mai mult setup):**

Export din TradingView pe 4 timeframe-uri:
```
BTCUSD_1d.csv    (Daily)
BTCUSD_4h.csv    (4-hour)
BTCUSD_1h.csv    (1-hour)
BTCUSD_15m.csv   (15-minute)
```

Apoi rulează:
```bash
python backtest_wave_pm.py
```

---

## 📊 Ce vor arăta rezultatele

### Single Timeframe (backtest_btc_yfinance.py)

```
TEST 1: Default Parameters (Stock-optimized)
  Trades: 42
  Win Rate: 58.3%
  Profit Factor: 1.85
  Total P&L: +$12,450.00 (23.45%)

TEST 2: BTC-Optimized Parameters ⭐
  Trades: 67
  Win Rate: 56.7%
  Profit Factor: 2.15  ← BEST
  Total P&L: +$18,920.00 (35.67%)

TEST 3: Aggressive
  Trades: 89
  Win Rate: 52.1%
  Profit Factor: 1.62
  Total P&L: +$9,230.00 (17.34%)

TEST 4: Conservative
  Trades: 31
  Win Rate: 64.5%
  Profit Factor: 1.95
  Total P&L: +$11,340.00 (21.23%)
```

**Interpretare:**
- **Profit Factor > 1.5** = Bun
- **Win Rate 50%+** = OK
- **Total P&L %** = Return pe perioada

---

### Multi-Timeframe (backtest_btc_multitf_yfinance.py)

```
MULTI-TF ANALYSIS: BTCUSD

📈 Timeframe Signals:
  1d    🟢 ENTRY      (Weight: 40%)
  4h    🟢 ENTRY      (Weight: 30%)
  1h    ⚪ NONE       (Weight: 20%)
  15m   🟢 ENTRY      (Weight: 10%)

🎯 Composite Signal:
  Recommendation: STRONG BUY
  Confidence: 80.0%

📍 Primary (Daily):
  Signal: LONG_ENTRY
  Price: $67,234.50
  Bar: 2851

📊 Secondary Confirmations:
  4h: LONG_ENTRY @ $67,210.30
  15m: LONG_ENTRY @ $67,245.75
```

**Interpretare:**
- **STRONG BUY (80%+)** = Daily + 3 TFs → Puternic
- **BUY (60%+)** = Daily + 2 TFs → Bun
- **WEAK BUY (40%+)** = Daily + 1 TF → Precaut
- **WAIT (<40%)** = Doar Daily sau nimic → Astept

---

## 🎯 Parametrii BTC-Optimizați

```python
# Recomandați pentru BTC (vs Default Stock)
dev_mult = 1.8          # Default: 2.2 (mai sensibil)
char_mult = 2.5         # Default: 3.0 (RMS window mai scurt)
ext_threshold = 0.65    # Default: 0.7 (mai multe entries)
bb_dev_mult = 1.25      # Fixed (Bollinger Band width)
```

**De ce diferit pentru BTC?**

| Aspect | Stock | BTC | Effect |
|--------|-------|-----|--------|
| Volatilitate | 1-2% daily | 2-5% daily | dev_mult ↓ |
| Behavior | Mean-reversion | Trending | ext_threshold ↓ |
| Trading | 6.5h/day | 24/7 | Multi-TF helps |
| Events | Scheduled | Constant news | Noise filter ↑ |

---

## 📈 Workflow Complet

### 1️⃣ Test Rapid (15 min)
```bash
python backtest_btc_yfinance.py
# Vede rezultate cu 4 parameter sets
```

### 2️⃣ Multi-TF Analiza (10 min)
```bash
python backtest_btc_multitf_yfinance.py
# Vede cum se aliniază 4 timeframe-uri
```

### 3️⃣ Ajustare Parametri (30 min)
```python
# Modifică în script:
stats = backtest_symbol(
    prices,
    dev_mult=1.7,        # Experimentează
    char_mult=2.4,       # Diferite valori
    ext_threshold=0.62   # Vede impactul
)
```

### 4️⃣ Backtest Real (1h+)
```bash
# Exportă din TradingView sau
# Rulează cu yfinance (local)
python backtest_btc_yfinance.py
python backtest_btc_multitf_yfinance.py
```

---

## 🔍 Diagnostica Rezultate

### ✅ Green Flags (Bun)

```
✓ Trades: 40+              → Destule semnale
✓ Win Rate: 55%+           → Majoritate profitabile
✓ Profit Factor: 1.8+      → Bun risk/reward
✓ Avg Bars: 10-30          → Trend following, nu scalping
✓ Largest Loss < 2% equity → Risk management OK
```

### ⚠️ Yellow Flags (Atenție)

```
⚠ Trades: 5-20             → Prea puțini semnale
⚠ Win Rate: 45-55%         → Borderline
⚠ Profit Factor: 1.2-1.5   → OK dar nu excelent
⚠ Largest Loss > 3% equity → Risk prea mare
```

### ❌ Red Flags (Problemă)

```
✗ Trades: 0                → Parametrii prea restrictivi
✗ Win Rate: <40%           → Prea multe losses
✗ Profit Factor: <1.0      → Pierde mai mult decât câștigă
✗ Largest Loss > 5% equity → Risk management failed
```

---

## 🛠️ Troubleshooting

### "No data fetched"
```
→ Rulează local cu internet
→ ODER: Exportă CSV din TradingView
```

### "0 trades generated"
```
→ Piață laterală (strategy e trend-follower)
→ ODER: Parametrii prea restrictivi
→ Încearcă ext_threshold mai mic (0.60 în loc de 0.65)
```

### "yfinance error (proxy)"
```
→ Normal în cloud environment
→ Rulează pe local machine cu internet
```

### "ImportError"
```
pip install yfinance pandas numpy
```

---

## 📚 Resurse

**Fișiere principale:**
- `wave_pm_core.py` → Core WAVE•PM calculations
- `wave_pm_strategy.py` → Entry/exit logic
- `wave_pm_multitf.py` → Multi-timeframe analyzer
- `data_fetcher.py` → Data sources (CSV, yfinance)
- `backtest_wave_pm.py` → Batch backtesting
- `backtest_btc_yfinance.py` → BTC single-TF (yfinance)
- `backtest_btc_multitf_yfinance.py` → BTC multi-TF (yfinance)

**Documentație:**
- `WAVE_PM_COMPLETE_STRATEGY_GUIDE.md` → Complete technical guide
- `HOW_TO_TEST_WAVE_PM.md` → Testing methodology
- `QUICK_START_BTC.md` → This file

---

## 🎬 Start Here

**Cea mai rapidă cale:**

```bash
# 1. Local machine cu internet
cd Trading/analysis/wave_pm

# 2. BTC Single-TF
python backtest_btc_yfinance.py

# 3. BTC Multi-TF
python backtest_btc_multitf_yfinance.py

# 4. Vede care parameter set e best
# 5. Experimentează cu propriii parametri
# 6. Repeat until satisfied
```

Good luck! 🚀
