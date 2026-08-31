"""
WAVE•PM Strategy Comparison - Compare across multiple symbols and timeframes

Analyzeaza strategia pe mai multe simboluri si identifica care lucreaza cel mai bine.
Genereaza raport comparat cu matrici performance.
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_strategy import backtest_symbol
from data_fetcher import DataFetcher, get_prices_series
import json
from datetime import datetime


class StrategyComparison:
    """Compare WAVE•PM strategy across multiple symbols."""

    def __init__(self):
        """Initialize comparator."""
        self.fetcher = DataFetcher()
        self.results = {}

    def backtest_symbol(self, symbol: str, interval: str = '1d', **kwargs) -> dict:
        """Backtest symbol with given parameters."""
        print(f"  {symbol:<10}", end=" ", flush=True)

        # Fetch data
        df = self.fetcher.fetch(symbol, interval=interval)

        if df.empty:
            print("✗ No data")
            return None

        # Get prices
        prices = get_prices_series(df, column='close')

        # Run strategy
        stats = backtest_symbol(prices, **kwargs)
        print(f"✓ {stats['trades_count']:>3} trades")

        return stats

    def compare_symbols(
        self,
        symbols: list,
        interval: str = '1d',
        **strategy_kwargs
    ):
        """Compare strategy across symbols."""
        print(f"\n📊 Backtesting {len(symbols)} symbols...")
        print("-" * 70)

        for symbol in symbols:
            stats = self.backtest_symbol(symbol, interval=interval, **strategy_kwargs)
            if stats:
                self.results[symbol] = stats

        return self.results

    def print_comparison(self):
        """Print comparison table."""
        if not self.results:
            print("No results to display")
            return

        print("\n" + "=" * 70)
        print("📈 Strategy Comparison Results")
        print("=" * 70)

        # Header
        print("\n{:<10} │ {:<8} │ {:<8} │ {:<8} │ {:<12} │ {:<10}".format(
            "Symbol", "Trades", "Win%", "PF", "P&L ($)", "Return %"
        ))
        print("-" * 70)

        # Results sorted by profit factor
        sorted_results = sorted(
            self.results.items(),
            key=lambda x: x[1]['profit_factor'] if x[1]['trades_count'] > 0 else 0,
            reverse=True
        )

        for symbol, stats in sorted_results:
            if stats['trades_count'] == 0:
                print("{:<10} │ {:>6}  │ {:>6}  │ {:>6}  │ {:>10}  │ {:>8}".format(
                    symbol, "0", "N/A", "N/A", "N/A", "N/A"
                ))
            else:
                print("{:<10} │ {:<8} │ {:<7.1f}% │ {:<8.2f} │ ${:>10.2f} │ {:<8.2f}%".format(
                    symbol,
                    stats['trades_count'],
                    stats['win_rate'] * 100,
                    stats['profit_factor'],
                    stats['total_pnl'],
                    stats['total_pnl_pct']
                ))

        # Summary statistics
        print("\n" + "=" * 70)
        print("📊 Summary Statistics")
        print("=" * 70)

        results_with_trades = [s for s in self.results.values() if s['trades_count'] > 0]

        if results_with_trades:
            avg_trades = sum(s['trades_count'] for s in results_with_trades) / len(results_with_trades)
            avg_win_rate = sum(s['win_rate'] for s in results_with_trades) / len(results_with_trades)
            avg_pf = sum(s['profit_factor'] for s in results_with_trades) / len(results_with_trades)
            avg_pnl = sum(s['total_pnl_pct'] for s in results_with_trades) / len(results_with_trades)

            print(f"\nAcross {len(results_with_trades)} symbols with trades:")
            print(f"  Avg Trades/Symbol: {avg_trades:.1f}")
            print(f"  Avg Win Rate: {avg_win_rate:.1%}")
            print(f"  Avg Profit Factor: {avg_pf:.2f}")
            print(f"  Avg Return %: {avg_pnl:.2f}%")

            # Best and worst
            best = max(results_with_trades, key=lambda x: x['profit_factor'])
            worst = min(results_with_trades, key=lambda x: x['profit_factor'])

            best_symbol = [k for k, v in self.results.items() if v == best][0]
            worst_symbol = [k for k, v in self.results.items() if v == worst][0]

            print(f"\n  Best: {best_symbol} (PF: {best['profit_factor']:.2f})")
            print(f"  Worst: {worst_symbol} (PF: {worst['profit_factor']:.2f})")

    def print_detailed(self, symbol: str = None):
        """Print detailed results for symbol."""
        if symbol and symbol in self.results:
            stats = self.results[symbol]
            print(f"\n📍 Detailed Results: {symbol}")
            print("-" * 70)
            print(f"  Trades: {stats['trades_count']}")

            if stats['trades_count'] > 0:
                print(f"  Win Rate: {stats['win_rate']:.1%}")
                print(f"  Profit Factor: {stats['profit_factor']:.2f}")
                print(f"  Avg Win: ${stats['avg_win']:.2f}")
                print(f"  Avg Loss: ${stats['avg_loss']:.2f}")
                print(f"  Largest Win: ${stats['largest_win']:.2f}")
                print(f"  Largest Loss: ${stats['largest_loss']:.2f}")
                print(f"  Avg Bars/Trade: {stats['avg_bars_held']:.1f}")
                print(f"  Total P&L: ${stats['total_pnl']:.2f} ({stats['total_pnl_pct']:.2f}%)")

                # First 3 trades
                if stats['trades_count'] > 0:
                    print(f"\n  First 3 trades:")
                    for i, trade in enumerate(stats['trades'][:3], 1):
                        print(f"    {i}. Bars {trade['entry_bar']}-{trade['exit_bar']}: "
                              f"${trade['entry_price']:.2f} → ${trade['exit_price']:.2f} | "
                              f"P&L: ${trade['pnl']:+.2f} ({trade['pnl_pct']:+.2f}%)")
            else:
                print("  No trades generated")

    def save_report(self, filename: str = None):
        """Save results to JSON."""
        if not self.results:
            print("No results to save")
            return

        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"comparison_report_{timestamp}.json"

        report = {
            'timestamp': datetime.now().isoformat(),
            'symbols': list(self.results.keys()),
            'results': self.results
        }

        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n✓ Report saved: {filename}")


def compare_stocks():
    """Compare strategy on popular stocks."""
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN']

    print("\n" + "=" * 70)
    print("🚀 WAVE•PM Strategy Comparison - Tech Stocks")
    print("=" * 70)

    comparator = StrategyComparison()
    comparator.compare_symbols(symbols, interval='1d')
    comparator.print_comparison()

    # Detailed on best
    if comparator.results:
        best_symbol = max(
            comparator.results.items(),
            key=lambda x: x[1]['profit_factor'] if x[1]['trades_count'] > 0 else 0
        )[0]
        comparator.print_detailed(best_symbol)

    comparator.save_report()


def compare_crypto():
    """Compare strategy on crypto assets."""
    symbols = ['BTCUSD', 'ETHUSD']

    print("\n" + "=" * 70)
    print("🚀 WAVE•PM Strategy Comparison - Crypto")
    print("=" * 70)

    comparator = StrategyComparison()
    # BTC-optimized parameters
    comparator.compare_symbols(
        symbols,
        interval='1d',
        dev_mult=1.8,
        char_mult=2.5,
        ext_threshold=0.65
    )
    comparator.print_comparison()

    comparator.save_report()


def compare_mixed():
    """Compare across stocks, crypto, forex."""
    symbols = ['AAPL', 'SPY', 'BTCUSD', 'EURUSD', 'GBPUSD']

    print("\n" + "=" * 70)
    print("🚀 WAVE•PM Strategy Comparison - Mixed Portfolio")
    print("=" * 70)

    comparator = StrategyComparison()
    comparator.compare_symbols(symbols, interval='1d')
    comparator.print_comparison()

    # Detailed on top 3
    print("\n" + "=" * 70)
    print("📍 Detailed Results - Top 3")
    print("=" * 70)

    sorted_results = sorted(
        comparator.results.items(),
        key=lambda x: x[1]['profit_factor'] if x[1]['trades_count'] > 0 else 0,
        reverse=True
    )

    for symbol, _ in sorted_results[:3]:
        comparator.print_detailed(symbol)

    comparator.save_report()


def main():
    """Run comparison."""
    print("\n" + "=" * 70)
    print("WAVE•PM Strategy Comparison")
    print("=" * 70)
    print("\nAvailable comparisons:")
    print("  1. Tech Stocks (AAPL, MSFT, GOOGL, NVDA, TSLA, AMZN)")
    print("  2. Crypto (BTCUSD, ETHUSD)")
    print("  3. Mixed Portfolio (Stocks, Crypto, Forex)")

    # For demo, run mixed comparison
    print("\n" + "=" * 70)
    print("Running: Mixed Portfolio Comparison")
    print("=" * 70)

    compare_mixed()


if __name__ == '__main__':
    main()
