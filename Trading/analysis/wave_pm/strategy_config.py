"""
Strategy Configuration Manager

Saves and loads optimized strategy parameters from optimizer results.
Connects optimizer outputs to coin screener and backtesting tools.

Usage:
    # Save optimized parameters from optimizer report
    python strategy_config.py --save top5_multitf_optimization_20240831_120000.json

    # Load parameters for specific crypto
    python strategy_config.py --load BTCUSD

    # List all saved strategies
    python strategy_config.py --list

    # Export for screener
    python strategy_config.py --export-screener
"""

import json
import os
from pathlib import Path
from datetime import datetime
import argparse


class StrategyConfig:
    """Manage strategy parameter configurations."""

    CONFIG_DIR = Path('./strategy_configs')
    DEFAULT_CONFIG = 'default_strategy.json'
    CURRENT_CONFIG = 'current_strategy.json'

    def __init__(self):
        self.CONFIG_DIR.mkdir(exist_ok=True)

    def save_from_optimizer_report(self, report_path: str):
        """Extract best parameters from optimizer JSON report and save."""
        print(f"\n📥 Loading optimizer report: {report_path}")

        try:
            with open(report_path, 'r') as f:
                report = json.load(f)
        except Exception as e:
            print(f"❌ Error reading report: {e}")
            return

        best_per_crypto = report.get('best_per_crypto', {})

        if not best_per_crypto:
            print("❌ No best parameters found in report")
            return

        print(f"\n✓ Found optimal parameters for {len(best_per_crypto)} cryptos")
        print("=" * 70)

        # Save each crypto's strategy
        saved_strategies = {}

        for symbol, params in best_per_crypto.items():
            strategy_data = {
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'source_report': report_path,
                'parameters': {
                    'dev_mult': params['dev_mult'],
                    'char_mult': params['char_mult'],
                    'ext_threshold': params['ext_threshold'],
                },
                'performance': {
                    'entry_signals': params.get('entry_signals', 0),
                    'total_signals': params.get('total_signals', 0),
                    'avg_confidence': params.get('avg_confidence', 0),
                    'quality_score': params.get('quality_score', 0),
                }
            }

            # Save to file
            filename = self.CONFIG_DIR / f"{symbol}_strategy.json"
            with open(filename, 'w') as f:
                json.dump(strategy_data, f, indent=2)

            saved_strategies[symbol] = filename

            # Print summary
            params_dict = strategy_data['parameters']
            perf = strategy_data['performance']

            print(f"\n✓ {symbol}")
            print(f"   Parameters:")
            print(f"     • dev_mult = {params_dict['dev_mult']}")
            print(f"     • char_mult = {params_dict['char_mult']}")
            print(f"     • ext_threshold = {params_dict['ext_threshold']}")
            print(f"   Performance:")
            print(f"     • Entry Signals: {perf['entry_signals']}")
            print(f"     • Avg Confidence: {perf['avg_confidence']:.2f}")
            print(f"     • Quality Score: {perf['quality_score']:.0f}")

        # Save summary
        summary = {
            'timestamp': datetime.now().isoformat(),
            'source_report': report_path,
            'strategies': {symbol: str(path) for symbol, path in saved_strategies.items()},
            'description': 'Optimized strategies for top 5 cryptos (multi-timeframe)'
        }

        summary_path = self.CONFIG_DIR / 'strategies_summary.json'
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)

        print(f"\n" + "=" * 70)
        print(f"✅ Saved {len(saved_strategies)} strategies to {self.CONFIG_DIR}/")
        print(f"📄 Summary: {summary_path}")

    def load_strategy(self, symbol: str) -> dict:
        """Load strategy parameters for a symbol."""
        filename = self.CONFIG_DIR / f"{symbol}_strategy.json"

        if not filename.exists():
            print(f"❌ Strategy not found for {symbol}")
            return {}

        try:
            with open(filename, 'r') as f:
                strategy = json.load(f)
            return strategy
        except Exception as e:
            print(f"❌ Error loading strategy: {e}")
            return {}

    def list_strategies(self):
        """List all saved strategies."""
        strategies = list(self.CONFIG_DIR.glob('*_strategy.json'))

        if not strategies:
            print("❌ No saved strategies found")
            return

        print("\n📋 Saved Strategies")
        print("=" * 70)

        for strategy_file in sorted(strategies):
            with open(strategy_file, 'r') as f:
                data = json.load(f)

            symbol = data['symbol']
            params = data['parameters']
            perf = data['performance']

            print(f"\n✓ {symbol}")
            print(f"   Parameters: dev={params['dev_mult']}, char={params['char_mult']}, ext={params['ext_threshold']}")
            print(f"   Quality Score: {perf['quality_score']:.0f}")

    def export_for_screener(self) -> dict:
        """Export all strategies for coin screener."""
        strategies = {}
        summary_file = self.CONFIG_DIR / 'strategies_summary.json'

        if summary_file.exists():
            with open(summary_file, 'r') as f:
                summary = json.load(f)

            for symbol in summary.get('strategies', {}):
                strategy = self.load_strategy(symbol)
                if strategy:
                    strategies[symbol] = strategy['parameters']

        return strategies

    def get_all_strategies(self) -> dict:
        """Get all strategies as dict."""
        strategies = {}
        summary_file = self.CONFIG_DIR / 'strategies_summary.json'

        if summary_file.exists():
            with open(summary_file, 'r') as f:
                summary = json.load(f)

            for symbol in summary.get('strategies', {}):
                strategy = self.load_strategy(symbol)
                if strategy:
                    strategies[symbol] = strategy['parameters']

        return strategies


def main():
    """CLI for strategy configuration."""
    parser = argparse.ArgumentParser(description='Strategy Configuration Manager')
    parser.add_argument('--save', type=str, help='Save from optimizer report (JSON file path)')
    parser.add_argument('--load', type=str, help='Load strategy for symbol (e.g., BTCUSD)')
    parser.add_argument('--list', action='store_true', help='List all saved strategies')
    parser.add_argument('--export-screener', action='store_true', help='Export strategies for screener')

    args = parser.parse_args()

    config = StrategyConfig()

    if args.save:
        config.save_from_optimizer_report(args.save)

    elif args.load:
        strategy = config.load_strategy(args.load)
        if strategy:
            print(f"\n✓ Strategy for {args.load}:")
            print(json.dumps(strategy, indent=2))

    elif args.export_screener:
        strategies = config.export_for_screener()
        if strategies:
            print("\n✓ Screener Configuration:")
            print(json.dumps(strategies, indent=2))
        else:
            print("❌ No strategies found")

    elif args.list:
        config.list_strategies()

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
