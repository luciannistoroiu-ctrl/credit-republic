"""
BTC/USD Backtesting cu yfinance - Direct online data fetching

Rulează pe mașina ta locală cu internet (nu în cloud).
Fetch BTC/USD din Yahoo Finance și backtest cu parametrii optimizați pentru crypto.
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_strategy import backtest_symbol
from data_fetcher import DataFetcher, get_prices_series


def test_btc_with_yfinance():
    """Fetch BTC/USD real data from yfinance și backtest."""
    print("\n" + "=" * 70)
    print("🚀 WAVE•PM BTC/USD Backtesting (yfinance)")
    print("=" * 70)

    # Initialize fetcher
    fetcher = DataFetcher()

    print("\n📡 Fetching BTC/USD data from Yahoo Finance...")
    print("-" * 70)

    # Fetch BTC/USD data (daily, last 10 years)
    df = fetcher.fetch('BTCUSD', interval='1d')

    if df.empty:
        print("❌ No data fetched")
        print("\n⚠️  Note: yfinance may be blocked in cloud environment")
        print("   Run this script on your local machine with internet:")
        print("   python backtest_btc_yfinance.py")
        return

    prices = get_prices_series(df, column='close')

    print(f"✓ Fetched {len(prices)} bars of BTC/USD data")
    print(f"  Date range: {df.index[0]} to {df.index[-1]}")
    print(f"  Price range: ${prices.min():.2f} - ${prices.max():.2f}")
    print(f"  Return: {((prices.iloc[-1] - prices.iloc[0]) / prices.iloc[0] * 100):.2f}%")

    # Test 1: Default parameters
    print("\n" + "=" * 70)
    print("TEST 1: Default Parameters (Stock-optimized)")
    print("=" * 70)
    print("\nParameters: dev_mult=2.2, char_mult=3.0, ext_threshold=0.7")
    stats1 = backtest_symbol(prices)
    print_results(stats1)

    # Test 2: BTC-optimized parameters
    print("\n" + "=" * 70)
    print("TEST 2: BTC-Optimized Parameters (RECOMMENDED)")
    print("=" * 70)
    print("\nParameters: dev_mult=1.8, char_mult=2.5, ext_threshold=0.65")
    stats2 = backtest_symbol(
        prices,
        dev_mult=1.8,
        char_mult=2.5,
        ext_threshold=0.65
    )
    print_results(stats2)

    # Test 3: Aggressive (high volatility)
    print("\n" + "=" * 70)
    print("TEST 3: Aggressive (High Volatility)")
    print("=" * 70)
    print("\nParameters: dev_mult=1.5, char_mult=2.0, ext_threshold=0.60")
    stats3 = backtest_symbol(
        prices,
        dev_mult=1.5,
        char_mult=2.0,
        ext_threshold=0.60
    )
    print_results(stats3)

    # Test 4: Conservative
    print("\n" + "=" * 70)
    print("TEST 4: Conservative")
    print("=" * 70)
    print("\nParameters: dev_mult=2.5, char_mult=3.5, ext_threshold=0.70")
    stats4 = backtest_symbol(
        prices,
        dev_mult=2.5,
        char_mult=3.5,
        ext_threshold=0.70
    )
    print_results(stats4)

    # Summary
    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)

    results = [
        ("Default (Stocks)", stats1),
        ("BTC-Optimized ⭐", stats2),
        ("Aggressive", stats3),
        ("Conservative", stats4)
    ]

    print("\nParameter Set Comparison:")
    print("-" * 70)
    print(f"{'Method':<25} {'Trades':<8} {'Win%':<8} {'PF':<8} {'P&L':<12}")
    print("-" * 70)

    for name, stats in results:
        trades = stats['trades_count']
        win_pct = stats['win_rate'] * 100 if trades > 0 else 0
        pf = stats['profit_factor']
        pnl = stats['total_pnl']

        print(f"{name:<25} {trades:<8} {win_pct:>6.1f}%  {pf:>6.2f}   ${pnl:>10.2f}")

    print("-" * 70)

    # Find best
    best_name, best_stats = max(results, key=lambda x: x[1]['profit_factor'])

    if best_stats['profit_factor'] > 0:
        print(f"\n✓ BEST: {best_name}")
        print(f"  Profit Factor: {best_stats['profit_factor']:.2f}")
        print(f"  Win Rate: {best_stats['win_rate']:.1%}")
        print(f"  Total P&L: ${best_stats['total_pnl']:.2f} ({best_stats['total_pnl_pct']:.2f}%)")
    else:
        print(f"\n⚠️  No profitable parameter set on this data")
        print(f"   BTC may be in range-bound period (strategy = trend follower)")

    print("\n" + "=" * 70)
    print("✅ BTC Backtesting Complete")
    print("=" * 70 + "\n")


def print_results(stats):
    """Print detailed backtest results."""
    trades = stats['trades_count']

    if trades == 0:
        print("  ⚠️  No trades generated")
        print("     (Market may be range-bound or parameter threshold too strict)")
        return

    print(f"  Trades: {trades}")
    print(f"  Win Rate: {stats['win_rate']:.1%} ({stats['win_count']} wins, {stats['loss_count']} losses)")
    print(f"  Profit Factor: {stats['profit_factor']:.2f}")
    print(f"  Avg Win: ${stats['avg_win']:.2f} | Avg Loss: ${stats['avg_loss']:.2f}")
    print(f"  Largest Win: ${stats['largest_win']:.2f} | Largest Loss: ${stats['largest_loss']:.2f}")
    print(f"  Avg Bars/Trade: {stats['avg_bars_held']:.1f}")
    print(f"  Total P&L: ${stats['total_pnl']:.2f} ({stats['total_pnl_pct']:.2f}%)")

    # Show first 3 trades
    if trades > 0:
        print(f"\n  First {min(3, trades)} trades:")
        for i, trade in enumerate(stats['trades'][:3], 1):
            entry_bar = trade['entry_bar']
            exit_bar = trade['exit_bar']
            entry_price = trade['entry_price']
            exit_price = trade['exit_price']
            pnl = trade['pnl']
            pnl_pct = trade['pnl_pct']

            print(f"    {i}. Bars {entry_bar}-{exit_bar}: "
                  f"${entry_price:.2f} → ${exit_price:.2f} | "
                  f"P&L: ${pnl:+.2f} ({pnl_pct:+.2f}%)")


def main():
    """Run BTC backtesting."""
    try:
        test_btc_with_yfinance()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n⚠️  If yfinance is blocked:")
        print("   1. Run this script on your local machine (with internet)")
        print("   2. Or export BTC/USD CSV from TradingView manually")
        print("   3. Place in: Trading/analysis/wave_pm/tradingview_data/BTCUSD_1d.csv")
        print("   4. Then run: python backtest_wave_pm.py")


if __name__ == '__main__':
    main()
