# TradingView Indicators Manager

Accesează, gestionează și sincronizează toți indicatorii Pine Script din contul tău.

## 🚀 Start Rapid

```bash
cd Trading/analysis
python3 view_tradingview_indicators.py
```

## 📊 Ce Poți Face

### 1. **Vezi Toți Indicatorii**
```
YOUR TRADINGVIEW INDICATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID       Name                    Type      Category    Likes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ind_001  Advanced RSI            oscillator momentum   312
ind_002  Multi-Timeframe MACD    oscillator trend      485
ind_003  Smart Bollinger Bands   overlay   volatility  623
ind_004  Volume Analysis Tool    overlay   volume      0 🔒
ind_005  ATR Dynamic Levels      overlay   volatility  198
ind_006  Stochastic Divergence   oscillator momentum   267
```

### 2. **Detalii Indicator**

```bash
python3 -c "
from view_tradingview_indicators import TradingViewIndicatorManager
m = TradingViewIndicatorManager()
m.connect()
m.print_indicator_details('ind_001')
"
```

Output:
```
INDICATOR DETAILS: Advanced RSI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Metadata:
  Type: oscillator
  Category: momentum
  Version: 2.5.3
  Description: RSI with multiple timeframe analysis

⚙️  Parameters:
  • Length: 14
  • Oversold: 30
  • Overbought: 70

📊 Plot Lines:
  • RSI Main
  • Overbought Line
  • Oversold Line

📈 Statistics:
  Likes: 312
  Views: 11,478
  Comments: 80
  Used on Charts: 557
  Rating: 4.70/5.0
```

### 3. **Descarcă Local**

```bash
# Descarca toti indicatorii
python3 -c "
from view_tradingview_indicators import TradingViewIndicatorManager
m = TradingViewIndicatorManager()
m.connect()
m.sync_to_local()
"
```

Rezultat:
```
indicators/
├── Advanced_RSI.pine
├── Multi-Timeframe_MACD.pine
├── Smart_Bollinger_Bands.pine
├── Volume_Analysis_Tool.pine
├── ATR_Dynamic_Levels.pine
└── Stochastic_Divergence.pine
```

### 4. **Analiza de Utilizare**

```
📊 INDICATOR USAGE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 By Type:
  Oscillator: 3 indicators, avg 355 likes
  Overlay: 3 indicators, avg 274 likes

⭐ Top Indicators:
  1. Smart Bollinger Bands - 623 likes
  2. Multi-Timeframe MACD - 485 likes
  3. Advanced RSI - 312 likes
```

## 🔍 Categorii Indicatori

| Tip | Descriere | Exemple |
|-----|-----------|---------|
| **Oscillator** | Oscilează între limite | RSI, MACD, Stochastic |
| **Overlay** | Se suprapune pe grafic | Bollinger Bands, ATR, SMA |
| **Trend** | Analizează trend-uri | MACD, Moving Averages |
| **Momentum** | Measurează putere | RSI, Stochastic |
| **Volatility** | Volatilitate piață | Bollinger Bands, ATR |
| **Volume** | Analiză volum | OBV, Volume Profile |

## 💻 Cod Python

### Listare Indicatori

```python
from view_tradingview_indicators import TradingViewIndicatorManager

manager = TradingViewIndicatorManager()
manager.connect()
indicators = manager.list_indicators()

for ind in indicators:
    print(f"{ind['name']}: {ind['likes']} likes")
```

### Filtru Categoria

```python
# Doar indicatori de Momentum
momentum_inds = [i for i in manager.indicators if i['category'] == 'momentum']
print(f"Found {len(momentum_inds)} momentum indicators")
```

### Descarcă Specific

```python
# Descarcă doar un indicator
manager.download_indicator('ind_001', 'my_rsi.pine')
```

### Analiza Populari

```python
# Top 5 indicatori
top = sorted(manager.indicators, key=lambda x: x['likes'], reverse=True)[:5]
for ind in top:
    print(f"{ind['name']}: {ind['likes']} 👍")
```

## 📁 Structura Fișierelor

```
Trading/
├── analysis/
│   ├── view_tradingview_indicators.py    # Main indicator manager
│   ├── view_tradingview_scripts.py       # Script manager
│   ├── indicators/                       # Downloaded indicators
│   │   ├── Advanced_RSI.pine
│   │   ├── Multi-Timeframe_MACD.pine
│   │   ├── Smart_Bollinger_Bands.pine
│   │   ├── Volume_Analysis_Tool.pine
│   │   ├── ATR_Dynamic_Levels.pine
│   │   └── Stochastic_Divergence.pine
│   └── scripts/                          # Downloaded scripts
└── INDICATORS_GUIDE.md                   # This file
```

## 🔗 Integrare cu Strategii

### 1. Importa Indicator în Strategie

```python
# Citeste indicator source
with open('indicators/Advanced_RSI.pine') as f:
    rsi_code = f.read()

# Folosește în strategie
from strategies.rsi_strategy import RSIStrategy
strategy = RSIStrategy(symbol='AAPL')
```

### 2. Backtesting cu Indicatori

```python
from view_tradingview_indicators import TradingViewIndicatorManager

manager = TradingViewIndicatorManager()
manager.connect()

# Prelucrează indicatori
for ind in manager.list_indicators():
    # Analiza per indicator
    print(f"Testing {ind['name']}...")
```

### 3. Monitoring Automat

```bash
# Script pentru a verifica updates zilnic
#!/bin/bash
cd Trading
python3 analysis/view_tradingview_indicators.py > indicators_report_$(date +%Y%m%d).txt
```

## 📊 Statistici Indicator

### Metrice Disponibile

```
📈 Statistics:
  ├── Likes: Numarul de aprecieri
  ├── Views: Vizionari totali
  ├── Comments: Comentarii utilizatori
  ├── Chart Usage: Grafice care il folosesc
  └── Rating: Evaluare medie (1-5)
```

### Interpretare

- **Likes > 500**: Indicator popular
- **Views > 10K**: Interes mare
- **Rating > 4.5**: Calitate ridicata
- **Chart Usage > 500**: Utilizare frecventa

## 🎯 Cazuri de Utilizare

### 1. Version Control Indicators

```bash
cd Trading/indicators
git init
git add *.pine
git commit -m "Add TradingView indicators"
```

### 2. Backup Regular

```bash
# Zilnic la 8 AM
0 8 * * * cd ~/Trading && python3 analysis/view_tradingview_indicators.py
```

### 3. Raport Zilnic

```bash
python3 -c "
from view_tradingview_indicators import TradingViewIndicatorManager
m = TradingViewIndicatorManager()
m.connect()
m.analyze_indicator_usage()
" > indicators_report.txt
```

### 4. Comparare Indicatori

```python
# Compara indicatori din diferite categorii
categories = {}
for ind in manager.indicators:
    cat = ind['category']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(ind)

for cat, inds in categories.items():
    avg_likes = sum(i['likes'] for i in inds) / len(inds)
    print(f"{cat}: avg {avg_likes:.0f} likes")
```

## 🐛 Troubleshooting

### Nu sunt conectat

```bash
# Verifica credentiale
echo $TRADINGVIEW_USERNAME
echo $TRADINGVIEW_PASSWORD

# Sau verifica .env.local
cat Trading/.env.local
```

### Indicatori nu se descarca

```bash
# Verifica permisiuni
ls -la indicators/

# Creeaza directorul
mkdir -p indicators/
```

### Source code gol

```python
# Verifica indicator exists
manager.print_indicators_table()

# Verifica detailsile
manager.print_indicator_details('ind_001')
```

## ✨ Urmatoare Pasi

- [ ] Real-time indicator monitoring
- [ ] Automatic backtest with indicators
- [ ] Alert on indicator changes
- [ ] Performance tracking per indicator
- [ ] Collaborative indicator sharing

## 📚 Resurse

- [TradingView Indicators](https://www.tradingview.com/indicators/)
- [Pine Script Documentation](https://www.tradingview.com/pine_script_docs/)
- [Script Manager Guide](./SCRIPT_VIEWER_GUIDE.md)
- [Setup Guide](./SETUP_TRADINGVIEW.md)

---

**Last Updated:** 2024-08-31  
**Status:** ✅ Operational  
**Indicators:** 6 active

