# WAVE•PM Strategy — TradingView to Python Port

**Source**: "Volatility Illuminated" by Mark Whistler  
**Status**: Pine Script implementations complete, Python port in progress

---

## 📊 What is WAVE•PM?

WAVE•PM (Whistler Active Volatility Energy / Price Mass) is a volatility energy indicator that measures whether market price distribution is **expanding (releasing energy)** or **compressing (storing energy)**.

**Key insight**: It does NOT tell you direction — only whether volatility is building or dissipating. Perfect for identifying breakout setup points.

### Core Formula

For each length `len`:

```
dev(len)      = 2.2 × StDev(close, len)          # Deviation multiplier
charLen(len)  = max(30, round(3.0 × len))        # RMS window (scales with length)
rms(len)      = sqrt( SMA(dev(len)², charLen) )  # Self-normalizer
WAVE_PM(len)  = tanh(dev(len) / rms(len))        # Squashed to ~[0, 1)
```

**Interpretation**:
- `WAVE_PM ≈ 0` → Energy compressed (confined, "storing")
- `WAVE_PM ≈ 1` → Energy extended (expanding, "releasing")

---

## 📁 Files in This Directory

### Pine Script Implementations

| File | Purpose | Complexity |
|------|---------|-----------|
| `WAVE_PM.pine` | Original 2-leg indicator (short=14, long=55) | ⭐ Simple |
| `WAVE_PM_Heatmap.pine` | Spectrum scanner (12 lengths: 14→600) | ⭐⭐ Medium |
| `WAVE_PM_Dynamic_Bollinger.pine` | 3 dynamic Bollinger Bands + entry/exit signals | ⭐⭐⭐ Advanced |
| `WAVE_PM_Long_Entry_Strategy.pine` | Full strategy() with backtest-ready logic | ⭐⭐⭐ Advanced |

### Documentation

| File | Purpose |
|------|---------|
| `WAVE_PM_Context_Handoff.md` | Complete technical handoff (formula, metrics, entry/exit rules) |
| `README.md` | This file |

### Python Modules (To Build)

| Module | Purpose |
|--------|---------|
| `wave_pm_core.py` | Core WAVE•PM calculations |
| `wave_pm_analyzer.py` | 12-length spectrum + 3 metrics |
| `wave_pm_strategy.py` | Long entry/exit logic |
| `backtest_wave_pm.py` | Backtest against historical data |

---

## 🔑 Key Concepts

### The 3 Dynamic Metrics

Calculated **every bar** from 12 parallel WAVE•PM oscillators:

1. **`compLen`** — The length with the most **compressed** energy (WAVE•PM closest to 0)
2. **`extLen`** — The length with the most **extended** energy (WAVE•PM closest to 1)
3. **`longestAbove`** — The longest length whose WAVE•PM is still ≥ threshold (default 0.7)

These drive **dynamic Bollinger Bands**:

```
Compressed band  : SMA(compLen)     ± 1.25 SD
Extended band    : SMA(extLen)      ± 1.25 SD
Long band        : SMA(longestAbove) ± 1.25 SD  [may be NaN some bars]
```

**Important**: Multiplier is **always 1.25 SD** (Whistler's recommendation). Only the **period** varies dynamically.

---

## 📈 Long Entry Rules (User's Interpretation)

**BOTH conditions must be TRUE on the same bar:**

### Condition 1: Breakout + WAVE•PM Rising

```python
comp_rising = wave_pm[compLen][today] > wave_pm[compLen][yesterday]
cond1 = close.crosses_above(upper_compressed) AND comp_rising
```

The price breaks out of compression AND energy is increasing.

### Condition 2: Long Band Interaction

```python
cond2 = (close.crosses_under(lower_long) OR close.crosses_over(upper_long))
```

The price either:
- Drops below the lower long band (enter if bouncing up), or
- Spikes above the upper long band (enter if trending)

### Entry Signal

```python
long_entry = cond1 AND cond2
```

---

## ❌ Exit / Stop-Loss Rules

```python
exit_signal = (close.crosses_under(upper_long) OR close.crosses_over(lower_long))
```

Exit when price reverts from the long band interaction (breakout failed or bounce ended).

---

## ⚙️ Critical Implementation Details

### 1. RMS Window Scales with Length

**CRITICAL BUG FIX**: The RMS normalization window MUST scale proportionally with the length parameter. Otherwise, long lengths (300+) become flat and fail to detect real volatility changes.

```python
# CORRECT:
char_len = max(30, round(3.0 * length))  # scales with length

# WRONG (causes flattening):
char_len = 100  # fixed — ignores length scaling
```

### 2. tanh Implementation

Python has `math.tanh()`, so use it directly:

```python
import math
wave_pm = math.tanh(dev / rms)  # Simple!
```

Pine Script doesn't, so we had to implement:

```pine
f_tanh(x) =>
    xx = math.max(-40.0, math.min(40.0, x))  // Clamp to avoid exp() overflow
    e2x = math.exp(2 * xx)
    (e2x - 1) / (e2x + 1)
```

### 3. Population vs. Sample StDev

Use **population** StDev (divide by N, not N-1):

```python
# Population StDev (Whistler's original)
std = prices.std(ddof=0)

# NOT sample StDev
# std = prices.std(ddof=1)  # Wrong!
```

### 4. Geometric Length Distribution

12 lengths, ~1.4× ratio between consecutive:

```
14, 20, 28, 39, 55, 77, 109, 153, 215, 303, 426, 600
```

Not linear (1, 2, 3, ...) — geometric spreads resolution better across the range.

---

## 📊 Backtest Setup

### Symbols to Test (Your Favorites)

```python
symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTCUSD', 'EURUSD', 'SPY', 'NVDA']
```

Pulled from `view_tradingview_favorites.py` (already integrated into Trading system).

### Metrics to Collect

- Win rate (% of trades profitable)
- Profit factor (gross profit / gross loss)
- Max drawdown
- Sharpe ratio
- Longest winning/losing streak
- Average trade duration

### Sample Backtest Code Structure

```python
from wave_pm_strategy import WavePMStrategy
from backtest_wave_pm import backtest_symbol

strategy = WavePMStrategy()

for symbol in symbols:
    trades = backtest_symbol(symbol, start='2023-01-01', end='2024-08-31')
    print(f"{symbol}: {len(trades)} trades, win rate {trades.win_rate:.1%}")
```

---

## 🔍 Discrepancies: User's Rules vs. Whistler's Book

See **section 6** of `WAVE_PM_Context_Handoff.md` for full details.

**TL;DR**:
- Your implementation: Dynamic bands + breakout/band-interaction entry
- Whistler's book: Both WAVE•PM < 0.5 & rising + **Quad CCI** confirmation + **VWAP** benchmark
- Status: Both valid; yours is simpler, book's is more nuanced

Optional: Build a `wave_pm_whistler_exact.py` variant matching the book exactly.

---

## 🚀 Next Steps

### Phase 1: Core Python Port ✓
- [ ] `wave_pm_core.py` — Calculate WAVE•PM for any length
- [ ] `wave_pm_analyzer.py` — 12-length spectrum + 3 metrics
- [ ] Unit tests for formula accuracy vs. Pine

### Phase 2: Strategy Implementation
- [ ] `wave_pm_strategy.py` — Entry/exit logic
- [ ] Integration with `view_tradingview_favorites.py` for symbol list
- [ ] Manual spot checks on historical charts

### Phase 3: Backtesting
- [ ] `backtest_wave_pm.py` — Full backtest harness
- [ ] Run against 8 favorite symbols
- [ ] Generate performance report

### Phase 4 (Optional)
- [ ] `wave_pm_whistler_exact.py` — Book-faithful variant with Quad CCI + VWAP
- [ ] `wave_pm_mtf.py` — Multi-timeframe version if desired
- [ ] Real-time monitoring + alerts

---

## 📚 How to Use This Directory

### 1. Review Pine Scripts

```bash
# Open in TradingView to see live execution
# Recommended viewing order:
1. WAVE_PM.pine               # Understand the basic formula
2. WAVE_PM_Heatmap.pine       # Visualize the 12-length spectrum
3. WAVE_PM_Dynamic_Bollinger.pine  # See 3-band system + entry/exit
4. WAVE_PM_Long_Entry_Strategy.pine # Full strategy with backtest logic
```

### 2. Reference Technical Details

```bash
# Understand every algorithm detail:
cat WAVE_PM_Context_Handoff.md
# Sections 1-5: Formula, metrics, entry/exit rules
# Section 6: Known discrepancies vs. book
# Section 7: File summary
```

### 3. Implement Python Port

```bash
# Create modules (in progress):
python wave_pm_core.py              # Test with: python -m pytest
python wave_pm_analyzer.py
python wave_pm_strategy.py
python backtest_wave_pm.py --symbol AAPL
```

---

## 🔗 Integration with Trading System

Already connected:
- ✅ `view_tradingview_favorites.py` — 8 symbols ready to backtest
- ✅ `view_tradingview_indicators.py` — 6 indicators for confirmation
- ✅ `view_tradingview_scripts.py` — 4 scripts for context
- ⏳ `wave_pm_strategy.py` — Pending implementation

Roadmap:
1. Backtest WAVE•PM on each favorite symbol
2. Compare with other indicators (RSI, MACD, Bollinger Bands)
3. Identify best symbols & timeframes for this strategy
4. Build composite scoring system

---

## 📖 References

- **Book**: "Volatility Illuminated" by Mark Whistler
  - Chapter 9-10: VWAP & Quad CCI foundation
  - Chapter 15: WAVE•PM in detail
  - Example trades: Pages 256-261
  
- **Pine Script Docs**: https://www.tradingview.com/pine_script_docs/

- **Your Trading System**: `/home/user/credit-republic/Trading/`
  - Favorites: `view_tradingview_favorites.py`
  - Indicators: `view_tradingview_indicators.py`
  - Scripts: `view_tradingview_scripts.py`

---

**Last Updated**: 2024-08-31  
**Status**: 🟡 Pine scripts complete, Python port to start  
**Author**: Claude Code + User collaboration based on Mark Whistler's algorithm
