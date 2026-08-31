"""
BTC/USD Multi-Timeframe Analysis cu yfinance

Analizează BTC pe 4 timeframe-uri:
- Daily (40%): Trend principal
- 4h (30%): Trend secundar
- 1h (20%): Timing entry
- 15m (10%): Fine entry points

Rulează pe mașina ta locală cu internet.
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_multitf import MultiTFAnalyzer
from data_fetcher import DataFetcher, get_prices_series


def test_btc_multitf_yfinance():
    """Fetch BTC/USD pe 4 timeframe-uri și analizează."""
    print("\n" + "=" * 70)
    print("🚀 WAVE•PM BTC/USD Multi-Timeframe Analysis (yfinance)")
    print("=" * 70)

    # Initialize analyzer
    analyzer = MultiTFAnalyzer()
    fetcher = DataFetcher()

    timeframes = ['1d', '4h', '1h', '15m']
    weights = {'1d': 0.40, '4h': 0.30, '1h': 0.20, '15m': 0.10}

    print("\n📡 Fetching BTC/USD data from Yahoo Finance...")
    print("-" * 70)

    # Fetch data per timeframe
    tf_data = {}
    for tf in timeframes:
        print(f"  {tf:<5}", end=" ", flush=True)
        df = fetcher.fetch('BTCUSD', interval=tf)

        if df.empty:
            print("✗")
            continue

        print(f"✓ {len(df)} bars")
        tf_data[tf] = df

    if not tf_data:
        print("\n❌ No data fetched")
        print("\n⚠️  Note: yfinance may be blocked in cloud environment")
        print("   Run this script on your local machine with internet:")
        print("   python backtest_btc_multitf_yfinance.py")
        return

    print("\n" + "=" * 70)
    print("📊 Data Summary")
    print("=" * 70)

    for tf in timeframes:
        if tf in tf_data:
            df = tf_data[tf]
            prices = get_prices_series(df, column='close')
            print(f"\n{tf.upper()}:")
            print(f"  Bars: {len(prices)}")
            print(f"  Date range: {df.index[0]} to {df.index[-1]}")
            print(f"  Price: ${prices.min():.2f} - ${prices.max():.2f}")
            pct_return = (prices.iloc[-1] - prices.iloc[0]) / prices.iloc[0] * 100
            print(f"  Return: {pct_return:+.2f}%")

    # Test 1: Default parameters
    print("\n" + "=" * 70)
    print("TEST 1: Multi-TF Analysis (Default Parameters)")
    print("=" * 70)

    composite = analyzer.analyze_symbol(
        'BTCUSD',
        timeframes=timeframes
    )

    if composite:
        analyzer.print_composite_report(composite)
    else:
        print("⚠️  Could not generate composite signal")

    # Test 2: BTC-optimized parameters
    print("\n" + "=" * 70)
    print("TEST 2: Multi-TF Analysis (BTC-Optimized Parameters)")
    print("=" * 70)

    composite_btc = analyzer.analyze_symbol(
        'BTCUSD',
        timeframes=timeframes,
        dev_mult=1.8,
        char_mult=2.5,
        ext_threshold=0.65
    )

    if composite_btc:
        analyzer.print_composite_report(composite_btc)
    else:
        print("⚠️  Could not generate composite signal")

    # Interpretation guide
    print_interpretation_guide()


def print_interpretation_guide():
    """Print guide for interpreting MTF results."""
    print("\n" + "=" * 70)
    print("📖 Multi-TF Scoring Guide")
    print("=" * 70)

    print("""
Hierarchical Weighting:
┌─────────────────────────────────────────────────────────────────┐
│ Daily (40%)  → PRIMARY: Must have ENTRY for composite entry     │
│ 4h (30%)     → +30% confidence if entry                         │
│ 1h (20%)     → +20% confidence if entry                         │
│ 15m (10%)    → +10% confidence if entry                         │
└─────────────────────────────────────────────────────────────────┘

Recommendation Levels:
├─ STRONG BUY   (80%+)  → Daily + 3 lower TFs aligned
├─ BUY          (60%+)  → Daily + 2 lower TFs aligned
├─ WEAK BUY     (40%+)  → Daily + 1 lower TF aligned
└─ WAIT         (<40%)  → Daily only OR no Daily entry

Example 1 (STRONG BUY):
  Daily:  ✓ ENTRY (40%)
  4h:     ✓ ENTRY (+30%) → 70%
  1h:     ✓ ENTRY (+20%) → 90%
  15m:    ✗ NONE         → 90%
  Result: 90% confidence = STRONG BUY

Example 2 (WEAK BUY):
  Daily:  ✓ ENTRY (40%)
  4h:     ✗ NONE         → 40%
  1h:     ✓ ENTRY (+20%) → 60%
  15m:    ✗ NONE         → 60%
  Result: 60% confidence = BUY

Example 3 (WAIT):
  Daily:  ✗ NONE
  4h:     ✓ ENTRY
  1h:     ✓ ENTRY
  15m:    ✓ ENTRY
  Result: No Daily entry = WAIT (entry signals filtered out)

Signal Meanings:
├─ 🟢 ENTRY   → WAVE•PM detected compression + breakout
├─ 🔴 EXIT    → Reversal signal (bounce or breakout failure)
└─ ⚪ NONE    → No signal on this timeframe
""")

    print("=" * 70)
    print("✅ Multi-TF Analysis Guide")
    print("=" * 70 + "\n")


def main():
    """Run BTC multi-TF analysis."""
    try:
        test_btc_multitf_yfinance()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n⚠️  If yfinance is blocked:")
        print("   1. Run this script on your local machine (with internet)")
        print("   2. Or export BTC/USD CSV from TradingView for each TF:")
        print("      - BTCUSD_1d.csv (daily)")
        print("      - BTCUSD_4h.csv (4-hour)")
        print("      - BTCUSD_1h.csv (1-hour)")
        print("      - BTCUSD_15m.csv (15-minute)")
        print("   3. Place in: Trading/analysis/wave_pm/tradingview_data/")
        print("   4. Run: python backtest_wave_pm.py")


if __name__ == '__main__':
    main()
