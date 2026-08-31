# Cum să testezi WAVE•PM Strategy — Ghid Practic

---

## ⚡ SETUP RAPID (5 minute)

### Opțiunea 1: Cu TradingView CSV (OFFLINE - Recomandat)

**1. Exportează date din TradingView**
```
1. Deschide https://www.tradingview.com/chart/
2. Selectează simbol (ex: AAPL)
3. Setează timeframe Daily (1d)
4. Aștepți graficul să se încarce complet
5. Click dreapta pe grafic → "Export data" → Salvează CSV
6. Denumire: AAPL_daily.csv
```

**2. Plasează fișierele**
```bash
mkdir -p Trading/analysis/wave_pm/tradingview_data/
cp AAPL_daily.csv Trading/analysis/wave_pm/tradingview_data/
cp MSFT_daily.csv Trading/analysis/wave_pm/tradingview_data/
# etc. pentru fiecare simbol
```

**3. Rulează backtest**
```bash
cd Trading/analysis/wave_pm
python backtest_wave_pm.py
```

✅ Nu necesită internet!

---

### Opțiunea 2: Cu yfinance (ONLINE)

**1. Asigură-te că ai Python și pip**
```bash
python --version  # 3.8+
pip --version
```

**2. Instalează dependențe**
```bash
pip install yfinance pandas
```

**3. Rulează backtest**
```bash
cd Trading/analysis/wave_pm
python backtest_wave_pm.py
```

⚠️ Necesită internet (funcționează pe mașina ta, nu în cloud)

---

## 🎯 TESTE SIMPLE (Start Here)

### Test 1: Single Symbol Analysis

```python
# test_single_symbol.py
import sys
sys.path.insert(0, 'Trading/analysis/wave_pm')

from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

# Fetch data
fetcher = DataFetcher()
df = fetcher.fetch('AAPL', interval='1d')

if not df.empty:
    prices = get_prices_series(df, column='close')
    stats = backtest_symbol(prices)
    
    print(f"Symbol: AAPL")
    print(f"Trades: {stats['trades_count']}")
    print(f"Win Rate: {stats['win_rate']:.1%}")
    print(f"Profit Factor: {stats['profit_factor']:.2f}")
    print(f"Total P&L: {stats['total_pnl']:.2f} ({stats['total_pnl_pct']:.2f}%)")
else:
    print("No data fetched")
```

**Run it:**
```bash
python test_single_symbol.py
```

---

### Test 2: Multi-Symbol Batch

```python
# test_batch.py
from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA']
fetcher = DataFetcher()

for symbol in symbols:
    df = fetcher.fetch(symbol, interval='1d')
    
    if df.empty:
        print(f"{symbol}: No data")
        continue
    
    prices = get_prices_series(df, column='close')
    stats = backtest_symbol(prices)
    
    print(f"{symbol}: {stats['trades_count']} trades, "
          f"{stats['win_rate']:.0%} win rate, "
          f"PF={stats['profit_factor']:.2f}")
```

---

### Test 3: Multi-Timeframe Analysis

```python
# test_mtf.py
from wave_pm_multitf import MultiTFAnalyzer

analyzer = MultiTFAnalyzer()

# Analizează AAPL pe 4 timeframe-uri
composite = analyzer.analyze_symbol('AAPL', 
                                   timeframes=['1d', '4h', '1h', '15m'])

if composite:
    analyzer.print_composite_report(composite)
    print(f"\nRecommendation: {composite.recommendation}")
    print(f"Confidence: {composite.confidence:.1f}%")
```

---

## 📊 TESTE AVANSATE

### Test 4: Schimbă parametrii strategiei

```python
from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

fetcher = DataFetcher()
df = fetcher.fetch('AAPL', interval='1d')
prices = get_prices_series(df, column='close')

# Test cu parametrii default
print("Default parameters:")
stats1 = backtest_symbol(prices)
print(f"  Trades: {stats1['trades_count']}, Win%: {stats1['win_rate']:.1%}")

# Test cu dev_mult mai mic (mai sensibil)
print("\nWith dev_mult=1.8 (more sensitive):")
stats2 = backtest_symbol(prices, dev_mult=1.8)
print(f"  Trades: {stats2['trades_count']}, Win%: {stats2['win_rate']:.1%}")

# Test cu char_mult mai mare (RMS window mai lung)
print("\nWith char_mult=4.0 (longer RMS window):")
stats3 = backtest_symbol(prices, char_mult=4.0)
print(f"  Trades: {stats3['trades_count']}, Win%: {stats3['win_rate']:.1%}")

# Test cu ext_threshold mai mic (mai multe entries)
print("\nWith ext_threshold=0.6 (lower threshold):")
stats4 = backtest_symbol(prices, ext_threshold=0.6)
print(f"  Trades: {stats4['trades_count']}, Win%: {stats4['win_rate']:.1%}")
```

---

### Test 5: Compară mai multe seturi de parametri

```python
from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

fetcher = DataFetcher()
df = fetcher.fetch('AAPL', interval='1d')
prices = get_prices_series(df, column='close')

param_sets = [
    {'dev_mult': 2.2, 'char_mult': 3.0, 'ext_threshold': 0.7},  # Default
    {'dev_mult': 1.8, 'char_mult': 3.0, 'ext_threshold': 0.7},  # Sensibil
    {'dev_mult': 2.5, 'char_mult': 3.0, 'ext_threshold': 0.7},  # Conservator
    {'dev_mult': 2.2, 'char_mult': 2.5, 'ext_threshold': 0.65}, # Combo
]

print("Parameter Comparison:")
print("-" * 70)

for params in param_sets:
    stats = backtest_symbol(prices, **params)
    print(f"dev={params['dev_mult']}, char={params['char_mult']}, "
          f"ext={params['ext_threshold']}")
    print(f"  Trades: {stats['trades_count']}, "
          f"Win%: {stats['win_rate']:.0%}, "
          f"PF: {stats['profit_factor']:.2f}")
```

---

## 📈 INTERPRETARE REZULTATE

### Ce înseamnă output-urile

```
Trades: 15
→ Strategie a generat 15 entry-uri pe perioada testată

Win Rate: 66%
→ 10 din 15 trade-uri au fost profitabile

Profit Factor: 2.5
→ Pentru fiecare $ pierdut, ai câștigat $2.50
→ Valori > 1.5 = bun

Total P&L: +450.50 (18.75%)
→ Profit total și %return pe perioada
```

### Red Flags (Semnale de atenție)

```
❌ Trades: 0
   → Strategie nu a déclenșé entry-uri
   → Fie parametrii prea restrictivi, fie piață laterală

❌ Win Rate: 20%
   → Prea puține câștiguri
   → Strategie nu e adapted pentru acest simbol

❌ Profit Factor: 0.8
   → Pierde mai mult decât câștigă
   → Parameters trebuie recalibrate
```

### Green Flags (Semnale pozitive)

```
✅ Trades: 10+
   → Strategie generează suficiente semnale

✅ Win Rate: 50%+
   → Cel puțin jumătate din trade-uri profitabile

✅ Profit Factor: 1.5+
   → Bun risk/reward
```

---

## 🔧 WORKFLOW COMPLET DE TESTARE

### Pasul 1: Datele

```bash
# TradingView CSV
mkdir tradingview_data
# Export CSV pentru fiecare simbol și plasează în folder-ul asta

# ODER: Conexiune internet
pip install yfinance
```

### Pasul 2: Test simplu

```bash
cd Trading/analysis/wave_pm
python -c "
from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

fetcher = DataFetcher()
df = fetcher.fetch('AAPL')
if not df.empty:
    prices = get_prices_series(df)
    stats = backtest_symbol(prices)
    print(f'Trades: {stats[\"trades_count\"]}')
    print(f'Win%: {stats[\"win_rate\"]:.0%}')
    print(f'PF: {stats[\"profit_factor\"]:.2f}')
"
```

### Pasul 3: Batch test

```bash
python backtest_wave_pm.py
```

### Pasul 4: MTF analysis

```bash
python -c "
from wave_pm_multitf import MultiTFAnalyzer

analyzer = MultiTFAnalyzer()
composite = analyzer.analyze_symbol('AAPL')
if composite:
    analyzer.print_composite_report(composite)
"
```

### Pasul 5: Parametri tunning

```bash
# Crează script cu diferite parametri
# Compară rezultate
# Selectează best set
```

---

## 🎬 QUICK START SCRIPT

Copiază și rulează asta:

```bash
#!/bin/bash
# quick_test.sh

cd Trading/analysis/wave_pm

echo "🚀 WAVE•PM Quick Test"
echo "===================="
echo ""

echo "1. Testing single symbol (AAPL)..."
python -c "
from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol

fetcher = DataFetcher()
df = fetcher.fetch('AAPL')

if not df.empty:
    prices = get_prices_series(df)
    stats = backtest_symbol(prices)
    
    print(f'✓ AAPL')
    print(f'  Trades: {stats[\"trades_count\"]}')
    print(f'  Win Rate: {stats[\"win_rate\"]:.1%}')
    print(f'  Profit Factor: {stats[\"profit_factor\"]:.2f}')
    print(f'  P&L: {stats[\"total_pnl\"]:.2f}')
else:
    print('✗ No data fetched - add TradingView CSV or use internet')
"

echo ""
echo "2. Testing multi-symbol batch..."
python backtest_wave_pm.py | tail -20

echo ""
echo "✓ Test complete!"
```

---

## 📋 CHECKLIST: De unde să începi

- [ ] Instalez Python 3.8+
- [ ] Copiez WAVE•PM code din repo
- [ ] Export CSV din TradingView SAU mă conectez pe machine cu internet
- [ ] Rulează: `python backtest_wave_pm.py`
- [ ] Verific output (trades, win rate, profit factor)
- [ ] Testez single symbol
- [ ] Testez multi-symbol batch
- [ ] Testez MTF analysis
- [ ] Ajustez parametrii pe baza rezultatelor
- [ ] Documentez best parameters

---

## ❓ TROUBLESHOOTING

**"No data fetched"**
```
→ Plasează CSV în ./tradingview_data/
→ ODER: Conectează internet și instalează yfinance
```

**"0 trades generated"**
```
→ Parametrii prea restrictivi
→ Sau piață laterală (strategy pentru trendul)
→ Încearcă ext_threshold mai mic (0.6 în loc de 0.7)
```

**"Import error"**
```
cd Trading/analysis/wave_pm
python -c "from wave_pm_core import WavePMSpectrum; print('OK')"
```

**"Module not found"**
```
pip install pandas yfinance
```

---

## 🎯 RECOMANDARE

**Pentru început:**
1. Export 3 simboluri din TradingView (AAPL, MSFT, SPY)
2. Rulează `python backtest_wave_pm.py`
3. Vede ce se întâmplă
4. Ajustează parametrii și re-testează

**Cel mai rapid test:**
```bash
cd Trading/analysis/wave_pm
python backtest_wave_pm.py
```

Good luck! 🚀
