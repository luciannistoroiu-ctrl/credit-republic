# WAVE•PM Advanced Analysis Tools

Ghid complet pentru optimizare parametri și analiză comparativă.

---

## 🎯 Overview

După backtesting simplu, următorii pași:
1. **Optimizare Parametri** - Găsit best parameters pentru orice simbol
2. **Comparație Strategie** - Compara performance pe mai multe simboluri
3. **Analiza Performanței** - Detaliază care simboluri funcționează cel mai bine

---

## 1️⃣ Parameter Optimizer

### Ce face?

Testează sute de combinații de parametri și identifica cea mai bună.

```
dev_mult:      1.4 → 2.2 (step 0.2)     = 5 valori
char_mult:     2.0 → 3.0 (step 0.5)     = 3 valori
ext_threshold: 0.55 → 0.70 (step 0.05)  = 4 valori

Total: 5 × 3 × 4 = 60 combinații testdate
```

### Utilizare

**Local machine (cu internet):**

```bash
cd Trading/analysis/wave_pm
python parameter_optimizer.py
```

**Output:**
```
🚀 WAVE•PM Parameter Optimizer - BTCUSD

📡 Fetching BTCUSD data...
✓ Fetched 2851 bars
  Range: $3,000 - $67,500
  Return: +1850%

🔧 Optimizing Parameters for BTCUSD
Testing 60 parameter combinations...
──────────────────────────────────────
  10.0% (6/60)
  20.0% (12/60)
  30.0% (18/60)
  ...
✓ Tested 60 combinations

🏆 Top 10 Parameter Sets for BTCUSD

Rank │ dev_mult │ char_mult │ ext_thresh │ Trades │ Win% │  PF  │  P&L %
────────────────────────────────────────────────────────────────────────────
  1  │   1.70   │   2.50   │   0.60   │   156 │ 58.3 │ 2.34 │  45.67%
  2  │   1.80   │   2.50   │   0.65   │   134 │ 59.1 │ 2.18 │  42.34%
  3  │   1.60   │   2.00   │   0.60   │   167 │ 56.8 │ 2.12 │  40.89%
  4  │   1.90   │   2.50   │   0.65   │   128 │ 60.2 │ 2.05 │  38.56%
  ...

⭐ BEST PARAMETER SET

dev_mult = 1.70
char_mult = 2.50
ext_threshold = 0.60

Metrics:
  Trades: 156
  Win Rate: 58.3%
  Profit Factor: 2.34
  Total P&L: $12,450.00 (45.67%)
  Avg Win: $89.50
  Avg Loss: -$52.30
  Largest Win: $567.80
  Largest Loss: -$234.90
  Avg Bars/Trade: 12.3

✓ Report saved: optimization_report_BTCUSD_20240315_143022.json
```

### Parameter Ranges (De ce?)

#### BTC-Optimized (pentru crypto):
```python
dev_mult = 1.4 → 2.2
char_mult = 2.0 → 3.0  
ext_threshold = 0.55 → 0.70
```

**De ce?**
- BTC: 3-5× mai volatil decât stocks
- dev_mult ↓ = mai sensibil la volatilitate
- ext_threshold ↓ = mai multe entry signals
- RMS window mai scurt (char_mult ↓)

#### Stock-Optimized (pentru NYSE/NASDAQ):
```python
dev_mult = 1.8 → 2.6
char_mult = 2.5 → 3.5
ext_threshold = 0.65 → 0.75
```

**De ce?**
- Stocks: volatilitate mai mică
- dev_mult ↑ = mai selectiv (fewer false signals)
- ext_threshold ↑ = fewer entries
- RMS window mai lung

### Cum să-l Customizez?

Modifică în `parameter_optimizer.py`:

```python
def optimize_custom_symbol(symbol: str):
    optimizer = ParameterOptimizer(symbol)
    prices = optimizer.fetch_data(interval='1d')
    
    # Custom ranges
    optimizer.optimize(
        prices,
        dev_mult_range=(1.5, 2.5, 0.1),      # Finer steps = slower
        char_mult_range=(2.0, 3.5, 0.25),
        ext_threshold_range=(0.60, 0.75, 0.02)
    )
    
    optimizer.print_results()
    optimizer.save_report()

optimize_custom_symbol('AAPL')
```

---

## 2️⃣ Strategy Comparison

### Ce face?

Compara performance pe mai multe simboluri, identifica care merge cel mai bine.

```
Input: Lista de simboluri (AAPL, MSFT, BTCUSD, EURUSD, etc.)
Output: Tabel comparat + statistici agregate
```

### Utilizare

**Local machine:**

```bash
python strategy_comparison.py
```

**Output:**

```
🚀 WAVE•PM Strategy Comparison - Mixed Portfolio

📊 Backtesting 5 symbols...
──────────────────────────────────────────────
  AAPL        ✓ 28 trades
  MSFT        ✓ 35 trades
  BTCUSD      ✓ 156 trades
  EURUSD      ✓ 12 trades
  GBPUSD      ✓ 18 trades

📈 Strategy Comparison Results

Symbol     │ Trades  │ Win%   │ PF     │ P&L ($)    │ Return %
──────────────────────────────────────────────────────────────────
BTCUSD     │ 156     │ 58.3%  │ 2.34   │ $12,450.00 │ 45.67%
MSFT       │ 35      │ 62.1%  │ 1.89   │ $2,340.00  │ 18.45%
AAPL       │ 28      │ 64.3%  │ 1.78   │ $1,890.00  │ 15.67%
GBPUSD     │ 18      │ 55.6%  │ 1.42   │ $780.00    │ 12.34%
EURUSD     │ 12      │ 50.0%  │ 0.95   │ -$340.00   │ -5.67%

📊 Summary Statistics

Across 4 symbols with trades:
  Avg Trades/Symbol: 57.8
  Avg Win Rate: 58.1%
  Avg Profit Factor: 1.68
  Avg Return %: 17.59%

  Best: BTCUSD (PF: 2.34)
  Worst: EURUSD (PF: 0.95)

📍 Detailed Results - Top 3

BTCUSD:
  Trades: 156
  Win Rate: 58.3%
  Profit Factor: 2.34
  ...

MSFT:
  Trades: 35
  Win Rate: 62.1%
  Profit Factor: 1.89
  ...

AAPL:
  Trades: 28
  Win Rate: 64.3%
  Profit Factor: 1.78
  ...

✓ Report saved: comparison_report_20240315_143052.json
```

### Custom Comparisons

**Numai crypto:**
```python
from strategy_comparison import StrategyComparison

comparator = StrategyComparison()
comparator.compare_symbols(
    ['BTCUSD', 'ETHUSD', 'XRPUSD'],
    interval='1d',
    dev_mult=1.8,      # BTC-optimized
    char_mult=2.5,
    ext_threshold=0.65
)
comparator.print_comparison()
```

**Numai tech stocks:**
```python
comparator = StrategyComparison()
comparator.compare_symbols(
    ['AAPL', 'MSFT', 'GOOGL', 'NVDA'],
    interval='1d',
    dev_mult=2.2,      # Stock defaults
    char_mult=3.0,
    ext_threshold=0.7
)
comparator.print_comparison()
```

**Timeframe comparison (1 simbol, mai multe TF):**
```python
comparator = StrategyComparison()

for interval in ['1d', '4h', '1h']:
    print(f"\n{interval.upper()} results:")
    results = comparator.compare_symbols(['AAPL'], interval=interval)
    comparator.print_detailed('AAPL')
```

---

## 3️⃣ Workflow Complet

### Pasul 1: Backtest Rapid (BTC)
```bash
python backtest_btc_yfinance.py
# → Vede care parameter set e aproximativ bun
```

### Pasul 2: Optimizare Precisă
```bash
python parameter_optimizer.py
# → Testează 60+ combinații
# → Găsit EXACT best parameters
# → Salvează report JSON
```

### Pasul 3: Comparație pe Simboluri
```bash
python strategy_comparison.py
# → Vede cum merge pe alte simboluri
# → Identifica care merge cel mai bine
# → Identifica care nu merge
```

### Pasul 4: Decizie
```
Dacă BTCUSD e best (PF 2.34):
  → Foloseștidej parametrii optimizați pentru crypto: 1.70/2.50/0.60
  
Dacă AAPL e bun (PF 1.78):
  → Foloseștidej parametrii stock: 2.2/3.0/0.7
  
Dacă EURUSD e rău (PF 0.95):
  → Evitá forex, sau ajustează parametrii
```

---

## 📊 Interpretare Rapoarte

### JSON Report (optimization_report_*.json)

```json
{
  "symbol": "BTCUSD",
  "timestamp": "2024-03-15T14:30:22",
  "total_combinations": 60,
  "best_result": {
    "dev_mult": 1.70,
    "char_mult": 2.50,
    "ext_threshold": 0.60,
    "trades": 156,
    "win_rate": 0.583,
    "profit_factor": 2.34,
    "total_pnl": 12450.00,
    "total_pnl_pct": 45.67
  },
  "top_10": [
    { ... },
    { ... }
  ],
  "all_results": [
    { ...60 combinations... }
  ]
}
```

### Cum să citești?

1. **best_result** = Optimii parametri, stop reading
2. **top_10** = Alternative dacă best nu-ți place
3. **all_results** = Full dataset, import în Excel

---

## 🎯 Best Practices

### 1. Optimization Time
```
60 combinații × 2-3 sec/combo = 2-3 minute per symbol
```

### 2. Noise Filtering
```
Ignore combinații cu < 10 trades
(Prea puțin pentru validare statistică)
```

### 3. Walk-Forward Testing
```
Optimizer pe: 2015-2020 (5 ani)
Test pe: 2020-2024 (4 ani)
→ Validează dacă parametrii hold în viitor
```

### 4. Multi-Symbol Optimization
```
WRONG: Optimizează pentru AAPL, foloșeștidej pe BTCUSD
RIGHT: Optimizează per asset class (stocks, crypto, forex)
```

### 5. Robustness Check
```
Best parameters: 1.70/2.50/0.60 (PF 2.34)
Second best:    1.80/2.50/0.65 (PF 2.18)

Close results = Robust (OK to use)
Very different = Fragile (Be careful)
```

---

## ⚡ Performance Tips

### Faster Optimization (Trade precision for speed)

```python
optimizer.optimize(
    prices,
    dev_mult_range=(1.5, 2.2, 0.3),      # Fewer values
    char_mult_range=(2.0, 3.0, 0.75),    # Larger steps
    ext_threshold_range=(0.60, 0.70, 0.10)  # Coarser grid
)
# 60 combos → 9 combos (6.6× faster)
```

### Finer Optimization (For final tuning)

```python
optimizer.optimize(
    prices,
    dev_mult_range=(1.65, 1.75, 0.02),    # Very fine
    char_mult_range=(2.45, 2.55, 0.05),
    ext_threshold_range=(0.58, 0.62, 0.01)
)
# Focus around best from coarse grid
```

---

## 📁 Output Files

```
Trading/analysis/wave_pm/
├── optimization_report_BTCUSD_20240315_143022.json
├── comparison_report_20240315_143052.json
└── (import these into Excel for analysis)
```

**Excel Analysis:**
```
1. Copy JSON to Excel
2. Create pivot table: dev_mult vs char_mult → profit_factor
3. Identify hotspots
4. Validate against walk-forward results
```

---

## 🚀 Quick Start

**Cel mai rapid test pe BTC:**

```bash
# 1. Run quick backtest
python backtest_btc_yfinance.py

# 2. Optimize parameters
python parameter_optimizer.py

# 3. Compare with other symbols
python strategy_comparison.py

# 4. Vede rezultate + use best parameters
```

Good luck! 🎯
