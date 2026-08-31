"""
WAVE•PM Parameter Optimizer - Find best parameters for any symbol

Testeaza diferite combinatii de parametri si identifica cea mai buna.
Genereaza report comparat cu recomandari.
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_strategy import backtest_symbol
from data_fetcher import DataFetcher, get_prices_series
from itertools import product
import json
from datetime import datetime


class ParameterOptimizer:
    """Optimize WAVE•PM parameters for maximum profitability."""

    def __init__(self, symbol: str):
        """Initialize optimizer for symbol."""
        self.symbol = symbol
        self.fetcher = DataFetcher()
        self.results = []

    def fetch_data(self, interval: str = '1d') -> list:
        """Fetch price data for symbol."""
        print(f"\n📡 Fetching {self.symbol} data...")
        df = self.fetcher.fetch(self.symbol, interval=interval)

        if df.empty:
            print(f"❌ No data fetched for {self.symbol}")
            return None

        prices = get_prices_series(df, column='close')
        print(f"✓ Fetched {len(prices)} bars")
        print(f"  Range: ${prices.min():.2f} - ${prices.max():.2f}")
        pct_return = (prices.iloc[-1] - prices.iloc[0]) / prices.iloc[0] * 100
        print(f"  Return: {pct_return:+.2f}%")

        return prices

    def optimize(
        self,
        prices,
        dev_mult_range=(1.5, 2.5, 0.1),
        char_mult_range=(2.0, 3.5, 0.5),
        ext_threshold_range=(0.60, 0.75, 0.05)
    ):
        """
        Test parameter combinations.

        Args:
            prices: Price series
            dev_mult_range: (min, max, step)
            char_mult_range: (min, max, step)
            ext_threshold_range: (min, max, step)
        """
        print("\n" + "=" * 70)
        print(f"🔧 Optimizing Parameters for {self.symbol}")
        print("=" * 70)

        # Generate parameter ranges
        dev_mults = self._range(dev_mult_range)
        char_mults = self._range(char_mult_range)
        ext_thresholds = self._range(ext_threshold_range)

        total_combos = len(dev_mults) * len(char_mults) * len(ext_thresholds)
        print(f"\nTesting {total_combos} parameter combinations...")
        print("-" * 70)

        combo_num = 0
        for dev_mult in dev_mults:
            for char_mult in char_mults:
                for ext_threshold in ext_thresholds:
                    combo_num += 1
                    pct = (combo_num / total_combos) * 100

                    # Run backtest
                    stats = backtest_symbol(
                        prices,
                        dev_mult=dev_mult,
                        char_mult=char_mult,
                        ext_threshold=ext_threshold
                    )

                    # Store result
                    self.results.append({
                        'dev_mult': dev_mult,
                        'char_mult': char_mult,
                        'ext_threshold': ext_threshold,
                        'trades': stats['trades_count'],
                        'win_rate': stats['win_rate'],
                        'profit_factor': stats['profit_factor'],
                        'total_pnl': stats['total_pnl'],
                        'total_pnl_pct': stats['total_pnl_pct'],
                        'avg_win': stats['avg_win'],
                        'avg_loss': stats['avg_loss'],
                        'largest_win': stats['largest_win'],
                        'largest_loss': stats['largest_loss'],
                    })

                    # Progress
                    if combo_num % max(1, total_combos // 10) == 0:
                        print(f"  {pct:>5.1f}% ({combo_num}/{total_combos})")

        print(f"✓ Tested {total_combos} combinations")

    def get_best_results(self, top_n: int = 10) -> list:
        """Get top N results by profit factor."""
        if not self.results:
            return []

        # Filter: only results with trades
        with_trades = [r for r in self.results if r['trades'] > 0]

        if not with_trades:
            print("⚠️  No parameter set generated trades")
            return self.results

        # Sort by profit factor
        sorted_results = sorted(
            with_trades,
            key=lambda x: (x['profit_factor'], x['total_pnl']),
            reverse=True
        )

        return sorted_results[:top_n]

    def print_results(self):
        """Print optimization results."""
        if not self.results:
            print("No results to display")
            return

        best = self.get_best_results(10)

        if not best:
            print("⚠️  No parameter set generated trades")
            print("\nAll results:")
            print(self._format_results(self.results[:20]))
            return

        print("\n" + "=" * 70)
        print(f"🏆 Top 10 Parameter Sets for {self.symbol}")
        print("=" * 70)
        print(self._format_results(best))

        # Best overall
        best_result = best[0]
        print("\n" + "=" * 70)
        print("⭐ BEST PARAMETER SET")
        print("=" * 70)
        print(f"\ndev_mult = {best_result['dev_mult']:.2f}")
        print(f"char_mult = {best_result['char_mult']:.2f}")
        print(f"ext_threshold = {best_result['ext_threshold']:.2f}")
        print(f"\nMetrics:")
        print(f"  Trades: {best_result['trades']}")
        print(f"  Win Rate: {best_result['win_rate']:.1%}")
        print(f"  Profit Factor: {best_result['profit_factor']:.2f}")
        print(f"  Total P&L: ${best_result['total_pnl']:.2f} ({best_result['total_pnl_pct']:.2f}%)")
        print(f"  Avg Win: ${best_result['avg_win']:.2f}")
        print(f"  Avg Loss: ${best_result['avg_loss']:.2f}")
        print(f"  Largest Win: ${best_result['largest_win']:.2f}")
        print(f"  Largest Loss: ${best_result['largest_loss']:.2f}")

    def save_report(self, filename: str = None):
        """Save results to JSON file."""
        if not self.results:
            print("No results to save")
            return

        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"optimization_report_{self.symbol}_{timestamp}.json"

        report = {
            'symbol': self.symbol,
            'timestamp': datetime.now().isoformat(),
            'total_combinations': len(self.results),
            'best_result': self.get_best_results(1)[0] if self.get_best_results(1) else None,
            'top_10': self.get_best_results(10),
            'all_results': self.results
        }

        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n✓ Report saved: {filename}")
        return filename

    def _range(self, spec):
        """Generate range from (min, max, step)."""
        min_val, max_val, step = spec
        result = []
        current = min_val
        while current <= max_val + 1e-9:  # Floating point safety
            result.append(round(current, 2))
            current += step
        return result

    def _format_results(self, results: list) -> str:
        """Format results as table."""
        lines = []
        lines.append("Rank │ dev_mult │ char_mult │ ext_thresh │ Trades │ Win% │  PF  │  P&L %")
        lines.append("─" * 80)

        for i, r in enumerate(results, 1):
            line = (f"{i:>3}  │ "
                    f"{r['dev_mult']:>6.2f}   │ "
                    f"{r['char_mult']:>7.2f}   │ "
                    f"{r['ext_threshold']:>8.2f}   │ "
                    f"{r['trades']:>6} │ "
                    f"{r['win_rate']*100:>5.1f} │ "
                    f"{r['profit_factor']:>6.2f} │ "
                    f"{r['total_pnl_pct']:>7.2f}%")
            lines.append(line)

        return "\n".join(lines)


def optimize_btc():
    """Optimize parameters for BTC/USD."""
    print("\n" + "=" * 70)
    print("🚀 WAVE•PM Parameter Optimizer - BTC/USD")
    print("=" * 70)

    optimizer = ParameterOptimizer('BTCUSD')

    # Fetch data
    prices = optimizer.fetch_data(interval='1d')
    if prices is None:
        print("\n⚠️  Cannot fetch data")
        print("   Run on local machine with internet access")
        return

    # Optimize
    # BTC-specific ranges (tighter than defaults)
    optimizer.optimize(
        prices,
        dev_mult_range=(1.4, 2.2, 0.2),      # Lower for higher volatility
        char_mult_range=(2.0, 3.0, 0.5),     # Shorter RMS window
        ext_threshold_range=(0.55, 0.70, 0.05)  # Lower for more entries
    )

    # Print results
    optimizer.print_results()

    # Save report
    optimizer.save_report()


def optimize_generic(symbol: str):
    """Optimize parameters for any symbol."""
    print("\n" + "=" * 70)
    print(f"🚀 WAVE•PM Parameter Optimizer - {symbol}")
    print("=" * 70)

    optimizer = ParameterOptimizer(symbol)

    # Fetch data
    prices = optimizer.fetch_data(interval='1d')
    if prices is None:
        print("\n⚠️  Cannot fetch data")
        print("   Run on local machine with internet access")
        return

    # Optimize (standard ranges)
    optimizer.optimize(
        prices,
        dev_mult_range=(1.8, 2.6, 0.2),
        char_mult_range=(2.5, 3.5, 0.5),
        ext_threshold_range=(0.65, 0.75, 0.05)
    )

    # Print results
    optimizer.print_results()

    # Save report
    optimizer.save_report()


def main():
    """Run optimizer."""
    print("\n" + "=" * 70)
    print("WAVE•PM Parameter Optimizer")
    print("=" * 70)
    print("\nUsage:")
    print("  python parameter_optimizer.py AAPL     # Generic stock")
    print("  python parameter_optimizer.py BTCUSD   # BTC (special handling)")
    print("")

    # For demo, optimize BTC
    optimize_btc()


if __name__ == '__main__':
    main()
