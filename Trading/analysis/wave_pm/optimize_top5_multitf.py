"""
WAVE•PM Top 5 Crypto Multi-Timeframe Optimizer

Testeaza top 5 cryptos (BTC, ETH, BNB, SOL, XRP) cu multiple combinatii de parametri
pe 4 timeframe-uri cu pondere ierarhica:
- Daily (1d): 40% (trend principal)
- 4-hour (4h): 30% (trend secundar)
- Hourly (1h): 20% (timing intrare)
- 15-minute (15m): 10% (fine entry points)

Usage:
    python optimize_top5_multitf.py
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_multitf import MultiTFAnalyzer
from data_fetcher import DataFetcher
from itertools import product
import json
from datetime import datetime


class MultiTFCryptoOptimizer:
    """Optimize WAVE•PM parameters across multiple timeframes for top 5 cryptos."""

    # Top 5 cryptos by market cap
    TOP5_CRYPTOS = [
        'BTCUSD',
        'ETHUSD',
        'BNBUSD',
        'SOLUSD',
        'XRPUSD'
    ]

    TIMEFRAMES = ['1d', '4h', '1h', '15m']
    WEIGHTS = {'1d': 0.40, '4h': 0.30, '1h': 0.20, '15m': 0.10}

    # Timeframe-specific periods (yfinance limitations)
    TIMEFRAME_PERIODS = {
        '1d': '10y',   # 10 years of daily data
        '4h': '2y',    # 2 years of 4h data
        '1h': '1y',    # 1 year of hourly data
        '15m': '60d'   # 60 days only (yfinance limitation)
    }

    def __init__(self):
        self.fetcher = DataFetcher()
        self.analyzer = MultiTFAnalyzer()
        self.results = {}
        self.best_params_per_crypto = {}

    def test_parameter_set(self, symbol: str, dev_mult: float, char_mult: float,
                          ext_threshold: float) -> dict:
        """Test a single parameter set across all timeframes."""
        try:
            # Analyze with multi-timeframe (with timeframe-specific periods)
            composite_signal = self.analyzer.analyze_symbol(
                symbol=symbol,
                timeframes=self.TIMEFRAMES,
                timeframe_periods=self.TIMEFRAME_PERIODS,
                dev_mult=dev_mult,
                char_mult=char_mult,
                ext_threshold=ext_threshold
            )

            if not composite_signal:
                return None

            # Extract metrics from composite signal
            confidence = composite_signal.get('confidence', 0) if isinstance(composite_signal, dict) else \
                        (composite_signal.confidence if hasattr(composite_signal, 'confidence') else 0)

            weighting = composite_signal.get('weighting', {}) if isinstance(composite_signal, dict) else \
                       (composite_signal.weighting if hasattr(composite_signal, 'weighting') else {})

            total_score = sum(weighting.values()) if weighting else 0

            if total_score == 0:
                return None

            return {
                'entry_signals': 1 if confidence > 50 else 0,
                'exit_signals': 0,
                'total_signals': 1 if confidence > 0 else 0,
                'confidence_avg': confidence / 100 if confidence else 0
            }
        except Exception as e:
            print(f"    ❌ Error: {e}")
            return None

    def optimize_symbol(self, symbol: str) -> list:
        """Optimize parameter combinations for a symbol."""
        print(f"\n{'=' * 70}")
        print(f"🔍 Optimizing {symbol} (Multi-Timeframe)")
        print(f"{'=' * 70}")

        # Parameter ranges
        dev_mult_range = [1.5, 1.7, 1.8, 1.9, 2.0, 2.2]
        char_mult_range = [2.0, 2.3, 2.5, 2.8, 3.0]
        ext_threshold_range = [0.60, 0.65, 0.70]

        results = []
        total_combos = len(dev_mult_range) * len(char_mult_range) * len(ext_threshold_range)

        print(f"Testing {total_combos} parameter combinations...")
        print(f"Timeframes: 1d (40%), 4h (30%), 1h (20%), 15m (10%)")
        print("-" * 70)

        combo_count = 0
        for dev_mult, char_mult, ext_threshold in product(
            dev_mult_range, char_mult_range, ext_threshold_range
        ):
            combo_count += 1

            if combo_count % 10 == 0:
                progress = (combo_count / total_combos) * 100
                print(f"  {progress:.0f}% ({combo_count}/{total_combos})")

            stats = self.test_parameter_set(symbol, dev_mult, char_mult, ext_threshold)

            if stats and stats['total_signals'] > 0:
                results.append({
                    'dev_mult': dev_mult,
                    'char_mult': char_mult,
                    'ext_threshold': ext_threshold,
                    'entry_signals': stats['entry_signals'],
                    'exit_signals': stats['exit_signals'],
                    'total_signals': stats['total_signals'],
                    'avg_confidence': stats['confidence_avg'],
                })

        # Sort by signal quality (total signals + confidence)
        for r in results:
            r['quality_score'] = r['total_signals'] * r['avg_confidence']

        results.sort(key=lambda x: x['quality_score'], reverse=True)

        print(f"\n✓ Found {len(results)} viable parameter sets")

        return results

    def print_results(self, symbol: str, results: list):
        """Print results for a symbol."""
        if not results:
            print(f"\n⚠️  No viable parameters found for {symbol}")
            return

        print(f"\n🏆 Top 5 Parameter Sets for {symbol}")
        print("-" * 100)
        print(
            f"{'Rank':<5} {'dev_mult':<8} {'char_mult':<10} {'ext_thr':<8} "
            f"{'Entries':<8} {'Conf':<8} {'Score':<10}"
        )
        print("-" * 100)

        for i, res in enumerate(results[:5], 1):
            print(
                f"{i:<5} {res['dev_mult']:<8.1f} {res['char_mult']:<10.1f} "
                f"{res['ext_threshold']:<8.2f} {res['entry_signals']:<8} "
                f"{res['avg_confidence']:>6.2f}   {res['quality_score']:>8.0f}"
            )

        best = results[0]
        print("-" * 100)
        print(f"\n⭐ BEST PARAMETERS FOR {symbol}:")
        print(f"   dev_mult = {best['dev_mult']}")
        print(f"   char_mult = {best['char_mult']}")
        print(f"   ext_threshold = {best['ext_threshold']}")
        print(f"   Quality Score: {best['quality_score']:.0f}")

        self.best_params_per_crypto[symbol] = best

    def print_comparison(self):
        """Compare results across cryptos."""
        print("\n" + "=" * 100)
        print("📊 Multi-Timeframe Comparison (Best Params per Crypto)")
        print("=" * 100)

        if not self.best_params_per_crypto:
            print("No results")
            return

        sorted_cryptos = sorted(
            self.best_params_per_crypto.items(),
            key=lambda x: x[1]['quality_score'],
            reverse=True
        )

        print(
            f"\n{'Crypto':<10} {'dev_mult':<10} {'char_mult':<12} {'ext_thr':<10} "
            f"{'Signals':<10} {'Confidence':<12} {'Score':<10}"
        )
        print("-" * 100)

        for symbol, params in sorted_cryptos:
            print(
                f"{symbol:<10} {params['dev_mult']:<10.1f} {params['char_mult']:<12.1f} "
                f"{params['ext_threshold']:<10.2f} {params['total_signals']:<10} "
                f"{params['avg_confidence']:>10.2f}     {params['quality_score']:>8.0f}"
            )

        print("-" * 100)

        best_symbol, best_params = sorted_cryptos[0]
        print(f"\n🏆 BEST MULTI-TF STRATEGY: {best_symbol}")
        print(f"   Parameters: dev={best_params['dev_mult']}, char={best_params['char_mult']}, "
              f"ext={best_params['ext_threshold']}")
        print(f"   Quality Score: {best_params['quality_score']:.0f}")

    def save_report(self):
        """Save results to JSON."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'type': 'Multi-Timeframe Optimization',
            'timeframes': self.TIMEFRAMES,
            'timeframe_weights': self.WEIGHTS,
            'timeframe_periods': self.TIMEFRAME_PERIODS,
            'best_per_crypto': self.best_params_per_crypto,
        }

        filename = f"top5_multitf_optimization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n✓ Report saved: {filename}")
        return filename

    def run(self):
        """Run full optimization."""
        print("\n" + "=" * 70)
        print("🚀 WAVE•PM Top 5 Crypto Multi-Timeframe Optimizer")
        print("=" * 70)
        print(f"\nTimeframe Weights:")
        print(f"  • Daily (1d): 40% (primary) - 10 years history")
        print(f"  • 4-hour (4h): 30% - 2 years history")
        print(f"  • Hourly (1h): 20% - 1 year history")
        print(f"  • 15-min (15m): 10% - 60 days (yfinance limit)")
        print(f"\nOptimizing for top 5 cryptos...")

        for symbol in self.TOP5_CRYPTOS:
            results = self.optimize_symbol(symbol)
            self.results[symbol] = results
            self.print_results(symbol, results)

        self.print_comparison()
        report_file = self.save_report()

        print("\n" + "=" * 70)
        print("✅ Multi-Timeframe Optimization Complete")
        print("=" * 70)
        print(f"\n💾 Configuration saved. Next step:")
        print(f"   python strategy_config.py --save {report_file}")
        print("=" * 70 + "\n")


def main():
    """Run optimizer."""
    try:
        optimizer = MultiTFCryptoOptimizer()
        optimizer.run()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
