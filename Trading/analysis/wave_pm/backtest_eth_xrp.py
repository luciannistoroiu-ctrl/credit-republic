"""
WAVE•PM Backtest for ETH & XRP with Optimized Parameters
Uses Crypto.com MCP data with multi-timeframe analysis

Optimized parameters from cloud optimization:
- ETHUSD: dev=1.5, char=2.0, ext=0.60, confidence=40%
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from wave_pm_multitf import MultiTFAnalyzer
from data_fetcher_cryptocom import DataFetcherCryptoCom
from wave_pm_strategy import WavePMStrategy
import pandas as pd
from datetime import datetime
import json

class BacktesterMTF:
    """Backtest WAVE•PM strategy on ETH & XRP."""

    # Optimized parameters from cloud run
    STRATEGIES = {
        'ETHUSD': {
            'dev_mult': 1.5,
            'char_mult': 2.0,
            'ext_threshold': 0.60,
            'timeframes': ['1d', '4h', '1h', '15m'],
            'weights': {'1d': 0.40, '4h': 0.30, '1h': 0.20, '15m': 0.10}
        },
        'XRPUSD': {
            'dev_mult': 1.5,  # Test same as ETHUSD (can be tuned)
            'char_mult': 2.0,
            'ext_threshold': 0.60,
            'timeframes': ['1d', '4h', '1h', '15m'],
            'weights': {'1d': 0.40, '4h': 0.30, '1h': 0.20, '15m': 0.10}
        }
    }

    TIMEFRAME_PERIODS = {
        '1d': '10y',
        '4h': '2y',
        '1h': '1y',
        '15m': '60d'
    }

    def __init__(self):
        self.fetcher = DataFetcherCryptoCom()
        self.results = {}

    def backtest_symbol(self, symbol: str, config: dict) -> dict:
        """Backtest a single symbol."""
        print(f"\n{'=' * 70}")
        print(f"📊 Backtest: {symbol}")
        print(f"Parameters: dev={config['dev_mult']}, char={config['char_mult']}, ext={config['ext_threshold']}")
        print(f"{'=' * 70}\n")

        # Fetch multi-timeframe data
        print("📥 Fetching data...")
        tf_data = {}
        for tf in config['timeframes']:
            start_date = None
            if tf in self.TIMEFRAME_PERIODS:
                from datetime import timedelta
                period = self.TIMEFRAME_PERIODS[tf]
                period_map = {
                    '60d': timedelta(days=60),
                    '1y': timedelta(days=365),
                    '2y': timedelta(days=730),
                    '10y': timedelta(days=3650),
                }
                days = period_map.get(period, timedelta(days=365))
                start_date = (datetime.now() - days).strftime('%Y-%m-%d')

            df = self.fetcher.fetch(symbol, interval=tf, start=start_date)
            if not df.empty:
                tf_data[tf] = df
                print(f"  ✓ {tf}: {len(df)} bars, price {df['close'].iloc[-1]:.4f}")

        if not tf_data:
            print(f"  ✗ No data available")
            return None

        # Run backtest on primary timeframe (1d)
        primary_tf = '1d'
        if primary_tf not in tf_data:
            print(f"  ✗ Missing primary timeframe {primary_tf}")
            return None

        df = tf_data[primary_tf].copy()
        strategy = WavePMStrategy(
            dev_mult=config['dev_mult'],
            char_mult=config['char_mult'],
            ext_threshold=config['ext_threshold']
        )

        # Simulate trading
        trades = []
        in_trade = False
        entry_price = 0
        entry_bar = 0

        print(f"\n🔄 Running backtest on {primary_tf}...")

        prices = df['close'].tolist()
        for i, price in enumerate(prices):
            strategy.update(price)
            state = strategy.get_current_state()
            signals = strategy.get_signals()

            # Entry signal
            if not in_trade and signals:
                latest_signal = signals[-1]
                if latest_signal.signal.name == 'LONG_ENTRY':
                    in_trade = True
                    entry_price = price
                    entry_bar = i
                    print(f"  🟢 ENTRY #{len(trades)+1} at bar {i}: {price:.4f}")

            # Exit signal
            if in_trade and signals:
                latest_signal = signals[-1]
                if latest_signal.signal.name == 'LONG_EXIT' or latest_signal.signal.name == 'NONE':
                    # Take profit or stop loss
                    exit_price = price
                    pnl = (exit_price - entry_price) / entry_price * 100
                    bars_held = i - entry_bar

                    if abs(pnl) > 0.5:  # Only record significant moves
                        trades.append({
                            'entry_bar': entry_bar,
                            'exit_bar': i,
                            'entry_price': entry_price,
                            'exit_price': exit_price,
                            'pnl_percent': pnl,
                            'bars_held': bars_held
                        })
                        print(f"  🔴 EXIT #{len(trades)} at bar {i}: {exit_price:.4f} | P&L: {pnl:+.2f}%")

                    in_trade = False

        # Calculate statistics
        stats = self._calculate_stats(trades, df)

        return {
            'symbol': symbol,
            'parameters': config,
            'data': {
                'timeframes': list(tf_data.keys()),
                'total_bars': len(df),
                'start_price': df['close'].iloc[0],
                'end_price': df['close'].iloc[-1],
                'price_change_pct': (df['close'].iloc[-1] - df['close'].iloc[0]) / df['close'].iloc[0] * 100
            },
            'trades': trades,
            'statistics': stats
        }

    def _calculate_stats(self, trades: list, df: pd.DataFrame) -> dict:
        """Calculate backtest statistics."""
        if not trades:
            return {
                'total_trades': 0,
                'winning_trades': 0,
                'losing_trades': 0,
                'win_rate': 0,
                'avg_win': 0,
                'avg_loss': 0,
                'total_pnl_percent': 0,
                'max_drawdown_percent': 0
            }

        pnls = [t['pnl_percent'] for t in trades]
        wins = [p for p in pnls if p > 0]
        losses = [p for p in pnls if p < 0]

        return {
            'total_trades': len(trades),
            'winning_trades': len(wins),
            'losing_trades': len(losses),
            'win_rate': len(wins) / len(trades) * 100 if trades else 0,
            'avg_win': sum(wins) / len(wins) if wins else 0,
            'avg_loss': sum(losses) / len(losses) if losses else 0,
            'total_pnl_percent': sum(pnls),
            'profit_factor': abs(sum(wins)) / abs(sum(losses)) if losses else 0
        }

    def print_results(self, result: dict):
        """Print backtest results."""
        if not result:
            return

        print(f"\n{'=' * 70}")
        print(f"📈 {result['symbol']} Backtest Results")
        print(f"{'=' * 70}\n")

        # Data summary
        data = result['data']
        print(f"Data Period:")
        print(f"  Start Price: {data['start_price']:.4f}")
        print(f"  End Price: {data['end_price']:.4f}")
        print(f"  Buy & Hold: {data['price_change_pct']:+.2f}%")
        print(f"  Total Bars: {data['total_bars']}")

        # Trade statistics
        stats = result['statistics']
        print(f"\nTrade Statistics:")
        print(f"  Total Trades: {stats['total_trades']}")
        print(f"  Winning Trades: {stats['winning_trades']}")
        print(f"  Losing Trades: {stats['losing_trades']}")
        print(f"  Win Rate: {stats['win_rate']:.1f}%")
        print(f"  Avg Win: {stats['avg_win']:+.2f}%")
        print(f"  Avg Loss: {stats['avg_loss']:+.2f}%")
        print(f"  Total P&L: {stats['total_pnl_percent']:+.2f}%")
        print(f"  Profit Factor: {stats['profit_factor']:.2f}x")

        # Best and worst trades
        if result['trades']:
            trades = result['trades']
            best_trade = max(trades, key=lambda t: t['pnl_percent'])
            worst_trade = min(trades, key=lambda t: t['pnl_percent'])

            print(f"\nBest Trade: {best_trade['pnl_percent']:+.2f}%")
            print(f"Worst Trade: {worst_trade['pnl_percent']:+.2f}%")
            print(f"Avg Bars per Trade: {sum(t['bars_held'] for t in trades) / len(trades):.0f}")

    def save_report(self):
        """Save backtest report to JSON."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'type': 'WAVE•PM Multi-Timeframe Backtest',
            'data_source': 'Crypto.com MCP (FREE)',
            'results': self.results
        }

        filename = f"backtest_eth_xrp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n✓ Report saved: {filename}")
        return filename

    def run(self):
        """Run backtest for all symbols."""
        print("\n" + "=" * 70)
        print("🚀 WAVE•PM Backtest - ETH & XRP")
        print("=" * 70)
        print(f"\n📊 Data Source: Crypto.com MCP (FREE)")
        print(f"⏰ Timeframes: 1d (40%), 4h (30%), 1h (20%), 15m (10%)")

        for symbol, config in self.STRATEGIES.items():
            result = self.backtest_symbol(symbol, config)
            if result:
                self.results[symbol] = result
                self.print_results(result)

        self.save_report()

        print("\n" + "=" * 70)
        print("✅ Backtest Complete")
        print("=" * 70 + "\n")


def main():
    """Run backtest."""
    try:
        bt = BacktesterMTF()
        bt.run()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
