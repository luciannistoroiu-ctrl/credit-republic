"""
Trading System Demo - End-to-End Walkthrough

This demonstrates the complete flow of the Trading project:
1. Market data ingestion
2. Technical analysis (RSI)
3. Signal generation
4. Trade execution
5. Performance reporting
"""

import sys
sys.path.insert(0, '../strategies')

from rsi_strategy import RSIStrategy
import json
from datetime import datetime, timedelta


def generate_market_data(days=30, start_price=100):
    """Generate realistic market data for backtesting."""
    prices = [start_price]
    volumes = []

    for i in range(days * 24):  # 24 hours per day
        # Simulate price movement with slight random walk
        change = (hash(f"{i}_price") % 200 - 100) / 1000  # -5% to +5%
        new_price = prices[-1] * (1 + change)
        prices.append(max(new_price, prices[-1] * 0.95))  # Prevent massive drops

        # Simulate volume
        volume = 900000 + (hash(f"{i}_vol") % 400000)
        volumes.append(volume)

    return {
        'prices': prices,
        'volumes': volumes,
        'dates': [(datetime.now() - timedelta(hours=i)).isoformat()
                  for i in range(len(prices)-1, -1, -1)]
    }


def run_backtest(strategy, market_data, lookback_window=50):
    """Run backtest with sliding window analysis."""
    results = {
        'trades_executed': 0,
        'signals_generated': [],
        'trade_history': [],
        'daily_pnl': []
    }

    prices = market_data['prices']
    volumes = market_data['volumes']

    # Process data in chunks (sliding window)
    for i in range(lookback_window, len(prices), 1):
        window_prices = prices[max(0, i-lookback_window):i+1]
        window_volumes = volumes[max(0, i-lookback_window):i+1]

        current_data = {
            'prices': window_prices,
            'volume': window_volumes
        }

        # Analyze market
        signal = strategy.analyze_market(current_data)

        # Record signal
        results['signals_generated'].append({
            'timestamp': i,
            'signal': signal
        })

        # Execute if signal is strong enough
        if signal['confidence'] > 0.6:
            execution = strategy.execute_trade(signal)
            if execution['status'] == 'executed':
                results['trades_executed'] += 1
                results['trade_history'].append({
                    'timestamp': i,
                    'action': signal['action'],
                    'confidence': signal['confidence'],
                    'price': window_prices[-1]
                })

    return results


def print_report(strategy, results, market_data):
    """Print comprehensive trading report."""
    print("\n" + "="*70)
    print("TRADING SYSTEM PERFORMANCE REPORT")
    print("="*70)

    print(f"\n📊 STRATEGY INFO:")
    print(f"  Name: {strategy.name}")
    print(f"  Symbol: {strategy.symbol}")
    print(f"  Timeframe: {strategy.timeframe}")
    print(f"  Parameters: RSI Period={strategy.rsi_period}, "
          f"Oversold={strategy.oversold_level}, "
          f"Overbought={strategy.overbought_level}")

    print(f"\n📈 MARKET DATA:")
    print(f"  Total Price Points: {len(market_data['prices'])}")
    print(f"  Price Range: ${min(market_data['prices']):.2f} - "
          f"${max(market_data['prices']):.2f}")
    print(f"  Starting Price: ${market_data['prices'][0]:.2f}")
    print(f"  Ending Price: ${market_data['prices'][-1]:.2f}")
    print(f"  Price Change: {((market_data['prices'][-1] / market_data['prices'][0]) - 1) * 100:.2f}%")

    print(f"\n🎯 TRADING ACTIVITY:")
    print(f"  Total Signals Generated: {len(results['signals_generated'])}")
    print(f"  Trades Executed: {results['trades_executed']}")
    print(f"  Positions Open: {len(strategy.positions)}")
    print(f"  Trades Closed: {len(strategy.trades)}")

    if results['trade_history']:
        print(f"\n📋 RECENT TRADES:")
        for i, trade in enumerate(results['trade_history'][-5:], 1):
            action_emoji = "🟢" if trade['action'] == 'buy' else "🔴"
            print(f"  {i}. {action_emoji} {trade['action'].upper()} @ ${trade['price']:.2f} "
                  f"(Confidence: {trade['confidence']*100:.1f}%)")

    print(f"\n📊 PERFORMANCE METRICS:")
    metrics = strategy.get_performance_metrics()
    print(f"  Total Trades: {metrics['total_trades']}")
    print(f"  Win Rate: {metrics['win_rate']*100:.1f}%")
    print(f"  Sharpe Ratio: N/A (requires more data)")

    if strategy.rsi_values:
        print(f"\n📈 RSI STATISTICS:")
        print(f"  Current RSI: {strategy.rsi_values[-1]:.2f}")
        print(f"  Average RSI: {sum(strategy.rsi_values) / len(strategy.rsi_values):.2f}")
        print(f"  RSI Range: {min(strategy.rsi_values):.2f} - "
              f"{max(strategy.rsi_values):.2f}")

    print("\n" + "="*70)


def main():
    """Run complete trading demo."""
    print("\n🚀 Trading System Demonstration")
    print("-" * 70)

    # Step 1: Initialize strategy
    print("\n1️⃣  Initializing RSI Strategy for AAPL...")
    strategy = RSIStrategy(symbol='AAPL', timeframe='1h')
    print(f"   ✓ Strategy created: {strategy.name}")

    # Step 2: Generate market data
    print("\n2️⃣  Generating market data (30 days)...")
    market_data = generate_market_data(days=30, start_price=150)
    print(f"   ✓ Generated {len(market_data['prices'])} price points")

    # Step 3: Run backtest
    print("\n3️⃣  Running backtest analysis...")
    results = run_backtest(strategy, market_data)
    print(f"   ✓ Analysis complete: {len(results['signals_generated'])} signals analyzed")

    # Step 4: Generate report
    print("\n4️⃣  Generating performance report...")
    print_report(strategy, results, market_data)

    # Step 5: System summary
    print("\n✅ Demo Complete!")
    print("\nHow the Trading System Works:")
    print("  1. Market data flows in from TradingView screener")
    print("  2. RSI indicator is calculated on the price data")
    print("  3. Trading signals are generated based on RSI levels")
    print("  4. High-confidence signals trigger trade execution")
    print("  5. Performance metrics track strategy profitability")
    print("\n💡 You can customize:")
    print("  • Strategy parameters (RSI periods, overbought/oversold levels)")
    print("  • Data sources (TradingView, Yahoo Finance)")
    print("  • Technical indicators (MACD, Bollinger Bands, etc.)")
    print("  • Risk management (position sizing, stop-loss, take-profit)")


if __name__ == '__main__':
    main()
