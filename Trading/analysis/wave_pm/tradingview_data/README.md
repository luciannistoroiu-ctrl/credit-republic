# TradingView CSV Exports

Place TradingView CSV exports here for offline backtesting.

## How to Export from TradingView

1. **Open TradingView**: https://www.tradingview.com/chart/
2. **Select Symbol**: Open the chart for your symbol (AAPL, MSFT, NVDA, etc.)
3. **Set Timeframe**: Select "Daily" or your preferred interval
4. **Wait**: Let the chart fully load (important!)
5. **Export**: Right-click on chart → "Export data" → "Download as CSV"
6. **Save**: Place file in this directory with naming like:
   - `AAPL_daily.csv`
   - `MSFT_1d.csv`
   - `BTCUSD_daily.csv`

## File Format

TradingView CSV exports have columns like:
```
time,open,high,low,close,volume
2025-01-01,100.0,102.0,99.5,101.5,1000000
2025-01-02,101.5,103.0,101.0,102.0,1200000
```

The backtest harness will automatically:
- Detect CSV files matching the symbol
- Normalize column names
- Convert dates to proper datetime format
- Run backtest with full OHLCV data

## Supported Symbols

Place CSV exports for these favorites:
- AAPL (Apple)
- GOOGL (Alphabet)
- MSFT (Microsoft)
- TSLA (Tesla)
- BTCUSD (Bitcoin)
- EURUSD (EUR/USD)
- SPY (S&P 500 ETF)
- NVDA (NVIDIA)

## Testing

Once you've added CSV files, run:
```bash
cd ..
python backtest_wave_pm.py
```

The backtest will find and load your CSV data automatically.

---

**Note**: File naming is flexible - any CSV with the symbol name will be found.
Examples: `AAPL.csv`, `aapl_data.csv`, `AAPL_2025.csv` all work.
