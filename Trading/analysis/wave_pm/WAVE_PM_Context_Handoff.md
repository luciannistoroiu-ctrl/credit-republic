# WAVE•PM Strategy — Context Handoff (din Volatility Illuminated, Mark Whistler)

Acest document rezumă tot ce s-a stabilit într-o conversație anterioară (Claude.ai), ca context pentru portarea logicii în Python / Claude Code. Scripturile Pine originale (`.pine`) însoțesc acest fișier ca referință completă de cod.

---

## 1. Formula de bază WAVE•PM

Din codul MQL4 original al cărții, algoritmul (per lungime `len`):

```
dev(len)      = devMult × StDev(close, len)          # devMult implicit 2.2, StDev populatie (impartire la len, nu len-1)
charLen(len)  = max(minCharPeriod, round(charMult × len))   # fereastra de normalizare RMS
rms(len)      = sqrt( SMA( dev(len)^2, charLen(len) ) )
WAVE_PM(len)  = tanh( dev(len) / rms(len) )           # rezultat in ~[0,1)
```

**Interpretare**: valori aproape de 0 = distribuție comprimată (energie stocată, lateral).
Valori aproape de 1 = distribuție extinsă (energie eliberată, trending).

### Detalii critice de implementare
- **Pine Script nu are `math.tanh()` nativ** — se implementează manual:
  `tanh(x) = (e^2x - 1) / (e^2x + 1)`, cu clamp pe `x` la `[-40, 40]` ca să evite overflow.
  (În Python: folosește direct `math.tanh()` sau `numpy.tanh()`, nu mai e nevoie de workaround.)
- **Fereastra de normalizare RMS trebuie să fie proporțională cu `len`**, nu fixă.
  Bug descoperit: cu o fereastră RMS fixă (ex. 100), lungimile mari (ex. 500+) devin
  "plate" — deviația lor se mișcă prea lent ca o fereastră scurtă să prindă variație
  reală (autocorelație ridicată). Fix: `charLen(len) = max(minCharPeriod, round(charMult × len))`,
  cu `charMult` implicit **3.0** și `minCharPeriod` implicit **30**.
- Consecință: pentru o lungime `len`, ai nevoie de aproximativ `len × (1 + charMult)`
  bare de istoric înainte ca acea lungime să dea valori valide (non-NaN).

---

## 2. Spectrul de 12 lungimi scanate (heatmap)

În loc de doar 2 linii (short=14, long=55, ca în carte), am extins la un spectru de
**12 lungimi**, distribuite **geometric** (nu liniar — liniar ar irosi rezoluția pe
intervalul mare), pe intervalul 14→600:

```
14, 20, 28, 39, 55, 77, 109, 153, 215, 303, 426, 600
```

(raport ≈ ×1.4 între lungimi consecutive)

Pentru fiecare bară, se calculează `WAVE_PM(len)` pe toate cele 12 lungimi simultan.

### Cei 3 metrici derivați (recalculați pe fiecare bară)
1. **Cel mai comprimat** (`compLen`) = lungimea cu valoarea WAVE•PM cea mai mică
2. **Cel mai extins** (`extLen`) = lungimea cu valoarea WAVE•PM cea mai mare
3. **Cea mai lungă ≥ prag** (`longestAbove`) = cea mai lungă dintre cele 12 lungimi a
   cărei valoare WAVE•PM e încă ≥ prag (implicit **0.7**). Poate fi `None`/`NaN` dacă
   nicio lungime nu trece de prag în bara curentă.

---

## 3. Bollinger Bands — bază fixă Whistler (1.25 SD)

Din carte (pag. 113-116, citat aproximativ): Whistler recomandă explicit înlocuirea
multiplicatorului implicit de Bollinger Bands (2.0 SD) cu **1.25 SD**, creând
"Containment Zone" — statistic, puțin peste 70% din distribuție. Combinat cu Quad CCI
(14/50/100-period), ieșirea din această zonă indică o mișcare cu momentum real, nu un
semnal de reversal.

**Decizie de design (confirmată de user)**: multiplicatorul de deviație standard rămâne
**exact 1.25, fix**, pe toate benzile. Ce variază dinamic, bară cu bară, e **doar
perioada** fiecărei benzi (legată de cei 3 metrici de mai sus):

```
Banda "Comprimat"        : SMA(compLen)       ± 1.25 × StDev(compLen)
Banda "Extins"            : SMA(extLen)        ± 1.25 × StDev(extLen)
Banda "Lung" (≥ prag)      : SMA(longestAbove)  ± 1.25 × StDev(longestAbove)   [poate lipsi pe unele bare]
```

---

## 4. Semnal de intrare LONG (definit explicit de user)

Două condiții, ambele adevărate **simultan, pe aceeași bară**:

**Condiția 1** — breakout din compresie + energie în creștere:
```
cond1 = (close crosses above upperComp)  AND  (minVal_azi > minVal_ieri)
```
unde `minVal` = valoarea WAVE•PM la `compLen` (cel mai mic din spectrul de 12, pe
bara curentă). Testul "minVal azi > minVal ieri" e proxy-ul pentru "WAVE•PM e în
creștere" — energia iese din stare de compresie.

**Condiția 2** — interacțiune cu banda "Lung" (necesită `longestAbove` definit acea bară):
```
cond2 = (close crosses UNDER lowerLong)   # pretul intra/coboara in limita inferioara
        OR
        (close crosses OVER upperLong)    # pretul sparge peste limita superioara
```

**Intrare LONG** = `cond1 AND cond2`.

---

## 5. Semnal de ieșire / Stop-Loss (definit explicit de user)

Simetricul condiției 2, pe aceeași bandă "Lung":
```
exitSL = (close crosses UNDER upperLong)   # pretul revine sub limita superioara (breakout esuat)
         OR
         (close crosses OVER lowerLong)    # pretul iese peste limita inferioara (bounce esuat)
```

**Notă**: acest exit/SL a fost adăugat ca semnal vizual (săgeți) într-un *indicator*, nu
într-un `strategy()` cu poziții reale — nu există încă reguli de dimensionare
poziție/TP secundar legate explicit de acest exit. Într-un script anterior (strategy,
neactualizat cu acest exit exact) s-au folosit ca ipoteze proprii (nu din carte):
SL = revenire sub `basisComp`, TP = atingerea marginii benzii Lung — **de verificat/
înlocuit** cu regula de mai sus dacă porți logica în Python ca strategie completă.

---

## 6. Fidelitate față de carte — discrepanțe găsite la recitire (pag. 256-261)

La cererea utilizatorului, am recitit secțiunea "WAVE•PM, WVAV and Quad CCI" din carte
și am identificat diferențe reale între strategia inițial construită (bazată pe
breakout de bandă simplu + context multi-timeframe inventat) și ce descrie efectiv
Whistler:

1. Condiția lui reală de intrare: **ambele** WAVE•PM (short ȘI long) sub 0.5 ȘI în
   creștere — nu neapărat legat de o "spargere de bandă" literal.
2. Confirmarea lui folosește **Quad CCI** (50/100-perioade intrând în Containment
   Zone) — complet absent din scripturile construite aici.
3. Pragul de **0.9** la Whistler înseamnă "stai deoparte, risc de reversal" — NU
   target de profit (diferit de cum a fost folosit inițial ca "bandă Extins = TP").
4. Whistler așteaptă **re-compresie** (ambele WAVE•PM sub ~0.5 din nou) înainte de
   următoarea intrare — o regulă de "cool-down" absentă din scripturile curente.
5. La el, benchmark-ul central e **VWAP** (Cap. 9-10), nu SMA — scripturile curente
   folosesc SMA. (Userul a confirmat că vrea VWAP la un moment dat, dar conversația
   nu a mai revenit la asta — rămâne de implementat separat dacă e nevoie.)
6. Ierarhia "15m/1h/4h/1d" din scriptul MTF e **invenția conversației**, nu ceva din
   carte — Whistler compară lungimi diferite ale aceluiași indicator (14 vs 50 vs 100),
   pe același grafic, nu timeframe-uri de chart diferite.

**Concluzie**: regulile din secțiunile 4-5 de mai sus (cele efectiv implementate în
ultimul script) sunt o interpretare/simplificare a userului, confirmată explicit de
el — nu o reproducere 1:1 a regulilor exacte ale lui Whistler. Ambele sunt valide ca
punct de plecare, dar merită păstrată distincția dacă se compară rezultate cu ce
descrie cartea literal.

---

## 7. Fișiere Pine Script produse

| Fișier | Ce face |
|---|---|
| `WAVE_PM.pine` | Varianta originală, 2 linii (short=14, long=55), fidelă cărții |
| `WAVE_PM_Heatmap.pine` | Heatmap orizontal, 12 lungimi (14→600), tabel cu cei 3 metrici |
| `WAVE_PM_Dynamic_Bollinger.pine` | 3 benzi Bollinger (Comprimat/Extins/Lung), 1.25 SD fix, perioadă dinamică, + săgeți entry/exit + etichete pe grafic |
| `WAVE_PM_Long_Entry_Strategy.pine` | Strategy() cu reguli long-only (condițiile din secțiunea 4) |

**Pentru portare în Python**: cel mai relevant e `WAVE_PM_Dynamic_Bollinger.pine`
(conține formula finală + cei 3 metrici + condițiile de entry/exit din secțiunile
4-5, cele mai recente și confirmate de user).

---

## 8. Implementare Python — Roadmap

Fișierele `.pine` sunt complete ca referință. Următorii pași:

1. **wave_pm_core.py** — Core WAVE•PM calculations (tanh, RMS, oscillator per length)
2. **wave_pm_analyzer.py** — 12-length spectrum + 3 metrics (compLen, extLen, longestAbove)
3. **wave_pm_strategy.py** — Long entry/exit logic per conditions from section 4-5
4. **backtest_wave_pm.py** — Backtesting against user's favorite symbols (AAPL, NVDA, MSFT, TSLA, BTCUSD, etc.)
5. **Optional variants**:
   - `wave_pm_whistler_exact.py` — Rules faithful to book (Quad CCI, VWAP, re-compression cool-down)
   - `wave_pm_mtf.py` — Multi-timeframe analysis if extended

---

## 📚 Referințe

- **Carte**: "Volatility Illuminated" by Mark Whistler (Chapter 9-10: VWAP & Quad CCI, Chapter 15: WAVE•PM)
- **Cod MQL4 original**: Din cartă, adaptat în Pine v5/v6
- **Conversație Claude.ai anterioare**: Porțiuni complete ale strategiei + discuții pe fidelitate vs. carte

---

**Generated:** 2024-08-31  
**Status:** ✅ Ready for Python port  
**Fidelity note:** User's simplified interpretation (sections 4-5) confirmed; book's exact rules documented (section 6)
