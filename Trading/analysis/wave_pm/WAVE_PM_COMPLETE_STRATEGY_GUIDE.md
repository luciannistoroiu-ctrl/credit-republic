# WAVE•PM Strategy — Complete Technical Analysis

**Autor**: Mark Whistler ("Volatility Illuminated")  
**Implementare**: Python Port for WAVE•PM Trading  
**Data**: 2026-08-31

---

## 📋 CUPRINS

1. [Core Formula](#1-core-formula)
2. [12-Length Spectrum](#2-12-length-spectrum)
3. [3 Derived Metrics](#3-3-derived-metrics)
4. [Bollinger Bands (Dynamic)](#4-bollinger-bands-dynamic)
5. [Entry Conditions](#5-entry-conditions)
6. [Exit Conditions](#6-exit-conditions)
7. [Multi-Timeframe Hierarchy](#7-multi-timeframe-hierarchy)
8. [Implementation Parameters](#8-implementation-parameters)
9. [Signal Workflow](#9-signal-workflow)
10. [Performance Analysis](#10-performance-analysis)

---

## 1. CORE FORMULA

### Principiul de bază

WAVE•PM măsoară dacă piața este în **compresie energetică** (lateral, prea o vreme) sau **extensie energetică** (trending, eliberând energie).

### Formula matematică (per lungime)

```
dev(len)      = devMult × StDev(close, len)          # Deviation band
charLen(len)  = max(minCharPeriod, round(charMult × len))  # RMS window
rms(len)      = sqrt( SMA( dev(len)², charLen ) )    # Normalization
WAVE_PM(len)  = tanh(dev(len) / rms(len))             # Squashed to [0,1)
```

### Parametri difauciți

```python
dev_mult = 2.2                # Whistler's original
char_mult = 3.0               # RMS window scale
min_char_period = 30          # Minimum RMS window
```

### Interpretare

| WAVE•PM | Sens | Piață |
|---------|------|-------|
| ≈ 0 | Comprimat | Energia stocată, lateral |
| ≈ 0.5 | Neutru | Tranziție |
| ≈ 1.0 | Extins | Energia eliberată, trending |

---

## 2. 12-LENGTH SPECTRUM

### De ce 12 lungimi?

- **Diversitate**: Scanează rezoluție pe interval 14→600
- **Distribuție geometrică**: ~1.4× ratio între lungimi (nu liniar)
- **Corelații slabe**: Lungimi diferite = diferite niveluri de autocorelare

### Lungimile utilizate

```
14, 20, 28, 39, 55, 77, 109, 153, 215, 303, 426, 600
```

**Rație**: 20/14 ≈ 1.43, 28/20 ≈ 1.40, etc.

### Calcul paralel

```
Pentru fiecare bară (price_t):

oscilator_14 = tanh(dev(14, t) / rms(14, t))      → ~[-0.5, 0.95]
oscilator_20 = tanh(dev(20, t) / rms(20, t))      → ~[-0.4, 0.92]
...
oscilator_600 = tanh(dev(600, t) / rms(600, t))   → ~[-0.1, 0.89]
```

### Înțelegerea oscilatorilor

- **Lungimi scurte (14-55)**: Reacții rapide, dar "zgomot"
- **Lungimi medii (77-215)**: Echilibru între semnal și zgomot
- **Lungimi lungi (303-600)**: Doar trenduri majore, mai puțin "zgomot"

---

## 3. 3 DERIVED METRICS

Calcula **pe fiecare bară** din cei 12 oscilatoric

### Metrica 1: compLen (Cel mai comprimat)

```python
compLen = lungimea cu WAVE•PM cel mai mic
```

**Ce înseamnă**: Piața e cea mai comprimată la acea rezoluție.

**Exemple**:
- compLen=14 → Piața e comprimată pe termen scurt
- compLen=303 → Piața e comprimată chiar și pe termene mai lungi

### Metrica 2: extLen (Cel mai extins)

```python
extLen = lungimea cu WAVE•PM cel mai mare
```

**Ce înseamnă**: Energia se eliberează la acea rezoluție.

**Implicații**:
- Dacă extLen=14 și compLen=600 → Mici osciații, dar trend major
- Dacă extLen=600 și compLen=14 → Trend puternic pe toate scalele

### Metrica 3: longestAbove (Cea mai lungă ≥ 0.7)

```python
longestAbove = max(lungime cu WAVE•PM ≥ 0.7)
```

**Ce înseamnă**: Până la ce rezoluție se menține extensie?

| longestAbove | Interpretare |
|--------------|--------------|
| 14 | Doar termen scurt e trending |
| 55 | Trend pe 2 săptămâni |
| 300+ | Trend pe 1+ luni (puternic) |
| None | Nimic nu e trending |

---

## 4. BOLLINGER BANDS (DYNAMIC)

### Concept

3 seturi de Bollinger Bands cu:
- **Basis**: SMA(period) = media mobilă
- **Upper**: basis + 1.25 × StDev(period)
- **Lower**: basis - 1.25 × StDev(period)

**De ce 1.25, nu 2.0?**
- 2.0 SD = 95% din distribuție (prea larg)
- 1.25 SD = 70-80% din distribuție (Whistler's "Containment Zone")

### 3 Band-uri dinamice

#### Banda 1: Comprimat (Compression Band)

```
Period = compLen
Band = SMA(compLen) ± 1.25 × SD(compLen)
```

**Utilizare**: Detectează ieșire din compresie

#### Banda 2: Extins (Extension Band)

```
Period = extLen
Band = SMA(extLen) ± 1.25 × SD(extLen)
```

**Utilizare**: Detectează extindere extremă

#### Banda 3: Lung (Long Band) ← IMPORTANT

```
Period = longestAbove (dacă nu None)
Band = SMA(longestAbove) ± 1.25 × SD(longestAbove)
```

**Utilizare**: Confirmă sau refuză entry-ul

**Observație**: Long Band poate fi None pe unele bare (dacă longestAbove = None)

---

## 5. ENTRY CONDITIONS

### Conceptul general

**Entry necesită 2 condiții SIMULTANE pe aceeași bară:**

```
LONG_ENTRY = (Condiția 1) AND (Condiția 2)
```

### Condiția 1: Breakout din compresie + Energie în creștere

```
Breakout:    close(t) > upperComp(t)   AND   close(t-1) ≤ upperComp(t-1)
Rising:      minVal(t) > minVal(t-1)   [unde minVal = min(toți oscilatoric)]

cond1 = Breakout AND Rising
```

**Ce se întâmplă**:
1. Preț traversează band-ul de compresie
2. În același timp, energia minimă crește (ieșire din compresie)

**De ce ambele?**
- Breakout fără energia în creștere = fals semnal (pică înapoi imediat)
- Energia în creștere fără breakout = încă nu e gata

### Condiția 2: Interacție cu banda Long

```
Cross_Under:  close(t) < lowerLong(t)   AND   close(t-1) ≥ lowerLong(t-1)
Cross_Over:   close(t) > upperLong(t)   AND   close(t-1) ≤ upperLong(t-1)

cond2 = Cross_Under OR Cross_Over
```

**Ce înseamnă**:
- **Cross_Under**: Preț intră sub banda de jos (test suport → bounce?)
- **Cross_Over**: Preț sparge peste banda de sus (continuare trend?)

### Exemplu complet de Entry

```
Bar 2500:
  upperComp(2500) = 150.5
  upperComp(2499) = 150.2
  close(2500) = 150.8  ✓ Breakout (150.8 > 150.5)
  
  minVal(2500) = 0.35
  minVal(2499) = 0.32  ✓ Rising (0.35 > 0.32)
  
  cond1 = TRUE ✓
  
  lowerLong(2500) = 145.2
  lowerLong(2499) = 145.5
  close(2500) = 144.9  ✓ Cross_Under (144.9 < 145.2, AND prev ≥ 145.5)
  
  cond2 = TRUE ✓
  
  LONG_ENTRY = TRUE ✓ → Signal!
```

---

## 6. EXIT CONDITIONS

### Exit/Stop-Loss

```
EXIT = (close crosses under upperLong) OR (close crosses over lowerLong)
```

**Logica**:
- **Breakout failed**: Preț revine sub upperLong (entry-ul nu a lucrat)
- **Bounce failed**: Preț trece peste lowerLong (bounce-ul s-a terminat)

### Noise Filter

```
bars_in_trade = current_bar - entry_bar

if bars_in_trade < min_bars_between_entry_exit (default=2):
    → ignore signal, stay in trade
```

**De ce**: Evită whipsaw-uri (entry și exit pe aceeași mișcare)

### Exemplu de Exit

```
Bar 2502:
  Intrare la bar 2500 @ 150.8
  upperLong(2502) = 151.3
  close(2502) = 150.9
  
  Verificare: 150.9 < 151.3? Nu, deci no exit
  
Bar 2503:
  upperLong(2503) = 151.1
  close(2503) = 150.7
  
  Verificare: 150.7 < 151.1? Și prev(2502) >= 151.1?
  Previos: 150.9 >= 151.1? Nu
  
  Deci NU e crossover valid încă
  
Bar 2504:
  upperLong(2504) = 151.0
  close(2504) = 150.5
  lowerLong(2504) = 145.0
  close(2504) = 150.5
  
  Verificare: 150.5 > 145.0? Da
  Prev(2503): 150.7 <= 145.0? Nu
  
  Deci NU e crossover
  
  ... eventually ...
  
Bar 2507:
  upperLong(2507) = 150.8
  close(2507) = 150.5
  close(prev) = 150.9
  
  Verificare: 150.5 < 150.8? Da
  Prev >= 150.8? 150.9 >= 150.8? Da! ✓
  
  EXIT! P&L = 150.5 - 150.8 = -0.3 = -0.20%
```

---

## 7. MULTI-TIMEFRAME HIERARCHY

### Arhitectura MTF

```
Daily (40% weight)
    ↓
    Trebuie ENTRY
    ↓
    4h (30% weight) → +30% dacă ENTRY
    1h (20% weight) → +20% dacă ENTRY
    15m (10% weight) → +10% dacă ENTRY
```

### Scoring Confidence

```python
base_confidence = 40% (Daily entry)

if 4h_has_entry: confidence += 30%
if 1h_has_entry: confidence += 20%
if 15m_has_entry: confidence += 10%

max_confidence = 100%
```

### Recomandări

| Confidence | Recomandare | Ce se întâmplă |
|-----------|-------------|----------------|
| 80%+ | STRONG BUY | Daily + 3/3 TF confirm |
| 60%+ | BUY | Daily + 2/3 TF confirm |
| 40%+ | WEAK BUY | Daily + 1/3 TF confirm |
| <40% | WAIT | Daily nu are entry |

### Exemplu MTF

```
Daily:   Entry signal ✓ (breakout + rising)
4h:      Entry signal ✓ (same conditions)
1h:      No entry (no confluence)
15m:     Entry signal ✓

Scoring:
  base = 40% (Daily)
  + 30% (4h entry) = 70%
  + 0% (1h no entry) = 70%
  + 10% (15m entry) = 80%
  
Recommendation: STRONG BUY (80%)
→ Execute entry with high confidence
```

---

## 8. IMPLEMENTATION PARAMETERS

### Core WAVE•PM

```python
dev_mult = 2.2                    # Deviation multiplier
char_mult = 3.0                   # RMS window scales by this
min_char_period = 30              # Minimum RMS window
ext_threshold = 0.7               # Threshold for longestAbove
```

### Bollinger Bands

```python
bb_dev_mult = 1.25                # Fixed 1.25 SD (Whistler)
```

### Noise Filter

```python
min_bars_between_entry_exit = 2   # Min bars to hold
```

### Data Sources (în ordine)

```python
1. TradingView CSV exports        # Offline, preferred
2. Cached CSV files               # ./data_cache/
3. yfinance                       # Requires internet
```

### Timeframes suportate

```
'1d'    = Daily
'4h'    = 4-hour
'1h'    = 1-hour
'15m'   = 15-minute
(Orice interval suportat de yfinance)
```

---

## 9. SIGNAL WORKFLOW

### Workflow complet

```
1. Fetch Data
   ↓
2. Initialize Strategy
   └─ Create 12 oscillators
   └─ Create 3 Bollinger Bands
   └─ Setup position tracking
   ↓
3. Bar-by-bar Update
   ├─ Update 12 oscillators with new price
   ├─ Wait for warmup (~2500 bars for longest length)
   ├─ Calculate 3 metrics (compLen, extLen, longestAbove)
   ├─ Update 3 Bollinger Bands
   ├─ Check entry conditions (if no position)
   ├─ Check exit conditions (if position active)
   ├─ Emit signal (LONG_ENTRY, LONG_EXIT, or NONE)
   ↓
4. Extract Trades
   └─ Pair LONG_ENTRY → LONG_EXIT signals
   └─ Calculate P&L per trade
   └─ Track statistics (win rate, profit factor, etc.)
   ↓
5. Generate Report
   └─ Summary statistics
   └─ Trade-by-trade breakdown
   └─ Performance metrics
```

### Warmup Period

```python
# Calcul:
max_oscillator_warmup = max(
    osc.get_warmup_bars_needed()  # for each oscillator
)

# Pentru longest length (600):
length = 600
char_len = max(30, round(3.0 * 600)) = 1800
warmup = length + char_len - 1 = 600 + 1800 - 1 = 2399 bars

# Interpretare: 
# Trebuie ~2400 de bare înainte ca metricile să fie valide
# Pentru data zilnică: ~10 luni de istoric
```

---

## 10. PERFORMANCE ANALYSIS

### Metrici colectate

```python
{
    'prices_count': int,           # Total bars processed
    'trades_count': int,           # Total closed trades
    'win_count': int,              # Winning trades
    'loss_count': int,             # Losing trades
    'win_rate': float,             # % of winning trades (0-1)
    'avg_win': float,              # Average win size
    'avg_loss': float,             # Average loss size
    'profit_factor': float,        # Gross profit / Gross loss
    'total_pnl': float,            # Sum of all P&L
    'total_pnl_pct': float,        # Total % return
    'largest_win': float,          # Max profit per trade
    'largest_loss': float,         # Max loss per trade
    'avg_bars_held': float,        # Average trade duration
    'trades': [                    # List of all trades
        {
            'entry_bar': int,
            'entry_price': float,
            'exit_bar': int,
            'exit_price': float,
            'bars_held': int,
            'pnl': float,
            'pnl_pct': float
        },
        ...
    ]
}
```

### Cum să citești raportul

**Win Rate**
```
win_rate = 0.65 → 65% din trade-uri sunt profitabile
```

**Profit Factor**
```
profit_factor = 2.5

→ Pentru fiecare $ pierdut, câștigi $2.50
→ Valori > 1.5 sunt considerate bune
```

**P&L Pct**
```
total_pnl_pct = 18.5%

→ Strategie a generat 18.5% return pe perioada testată
```

---

## 🎯 REZUMAT: DE CE FUNCȚIONEAZĂ?

### Avantajele

1. **Adaptiv**: Benzile se schimbă cu volatilitatea reală
2. **Multi-rezoluție**: 12 lungimi ≠ o singură perspectivă
3. **Selectiv**: Dual conditions = mai puține false signals
4. **Risc definit**: Exit clar, SL la banda upperLong

### Dezavantaje

1. **Lag**: Warmup ~2400 bare = 10 luni de istoric
2. **Trend-oriented**: Slabă pe piețe laterale (sideways)
3. **Parameter-dependent**: Mici schimbări = mare impact
4. **Pune-și-uită**: Nu are risk management dinamic (fixed SL)

### Când funcționează cel mai bine

✅ Piețe trending (1h-4h timeframes)  
✅ Volatilitate în creștere (se detectează bine)  
✅ Multi-TF confluence (Daily confirms = semnale mai bune)  

❌ Piețe laterale (sideways) = whipsaws  
❌ News events (gap-uri)  
❌ Piețe cu volatilitate joasă constant  

---

## 📊 FLOW COMPLET: De la Date la Decizie

```
TradingView CSV → Data Fetcher → Cache
                      ↓
                  Data Cleaned
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
    WAVE•PM Core            Bollinger Bands
    (12 oscilatori)         (3 benzi dinamice)
        ↓                           ↓
        └─────────────┬─────────────┘
                      ↓
            Metrica Calculation
        (compLen, extLen, longestAbove)
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
    Entry Check (cond1 & cond2)  Exit Check
        ↓                           ↓
        └─────────────┬─────────────┘
                      ↓
                Signal Emit
        (LONG_ENTRY / LONG_EXIT / NONE)
                      ↓
            Trade Extraction & Pairing
                      ↓
        P&L Calculation per Trade
                      ↓
        Backtest Report Generation
                      ↓
        ┌─────────────┴──────────────┐
        ↓                            ↓
    Single-TF Report         Multi-TF Report
    (Win rate, PF, etc.)     (Confidence score)
```

---

## 🔧 CALIBRATION QUICK REFERENCE

| Parameter | Default | Range | Effect |
|-----------|---------|-------|--------|
| dev_mult | 2.2 | 1.5-3.0 | Higher = more sensitive |
| char_mult | 3.0 | 2.0-4.0 | Higher = longer RMS window |
| ext_threshold | 0.7 | 0.5-0.9 | Lower = more entries |
| bb_dev_mult | 1.25 | 1.0-2.0 | Fixed per Whistler |
| min_bars_between_entry_exit | 2 | 1-5 | Higher = less whipsaws |

---

**Final Note**: Aceasta e WAVE•PM în totality. E un sistem complet, dar necesită discipline și înțelegere a dinamicii pieței pentru a-l folosi efectiv. 🚀
