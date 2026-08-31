"""
WAVE•PM Batch Backtesting

Fetches historical data for favorite symbols and runs full backtests,
generating performance reports for strategy analysis.
"""

import sys
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime, timedelta

from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import backtest_symbol as run_backtest


class BacktestHarness:
    """Run backtests across multiple symbols and generate reports."""

    def __init__(self, cache_dir: Optional[str] = None):
        """
        Initialize backtester.

        Args:
            cache_dir: Directory for data cache (default: ./data_cache)
        """
        self.fetcher = DataFetcher(cache_dir=cache_dir)
        self.results = {}

    def backtest_symbol(
        self,
        symbol: str,
        start: Optional[str] = None,
        end: Optional[str] = None,
        interval: str = "1d",
        **strategy_kwargs
    ) -> dict:
        """
        Fetch data and run backtest for a single symbol.

        Args:
            symbol: Ticker symbol (AAPL, BTCUSD, etc.)
            start: Start date (YYYY-MM-DD) or None for 1 year ago
            end: End date (YYYY-MM-DD) or None for today
            interval: Candle interval ("1d", "1h", etc.)
            **strategy_kwargs: Arguments to pass to WavePMStrategy

        Returns:
            Dict with backtest statistics
        """
        print(f"\nBacktesting {symbol}...")

        # Fetch data
        df = self.fetcher.fetch(symbol, start=start, end=end, interval=interval, use_cache=True)

        if df.empty:
            print(f"  ✗ No data fetched for {symbol}")
            return {
                'symbol': symbol,
                'status': 'failed',
                'error': 'No data fetched',
                'bars_count': 0
            }

        # Extract prices
        prices = get_prices_series(df, column='close')

        if not prices:
            print(f"  ✗ No valid prices for {symbol}")
            return {
                'symbol': symbol,
                'status': 'failed',
                'error': 'No valid prices',
                'bars_count': 0
            }

        # Run backtest
        try:
            stats = run_backtest(prices, **strategy_kwargs)
            stats['symbol'] = symbol
            stats['status'] = 'success'
            stats['date_range'] = f"{df.index[0].date()} to {df.index[-1].date()}"

            print(f"  ✓ {stats['trades_count']} trades")
            if stats['trades_count'] > 0:
                print(f"    Win rate: {stats['win_rate']:.1%}")
                print(f"    Profit factor: {stats['profit_factor']:.2f}")
                print(f"    Total P&L: {stats['total_pnl']:.2f} ({stats['total_pnl_pct']:.2f}%)")

            self.results[symbol] = stats
            return stats

        except Exception as e:
            print(f"  ✗ Backtest failed: {e}")
            return {
                'symbol': symbol,
                'status': 'failed',
                'error': str(e),
                'bars_count': len(prices)
            }

    def backtest_symbols(
        self,
        symbols: List[str],
        start: Optional[str] = None,
        end: Optional[str] = None,
        interval: str = "1d",
        **strategy_kwargs
    ) -> Dict[str, dict]:
        """
        Run backtests for multiple symbols.

        Args:
            symbols: List of ticker symbols
            start: Start date
            end: End date
            interval: Candle interval
            **strategy_kwargs: Arguments to pass to WavePMStrategy

        Returns:
            Dict of {symbol: stats}
        """
        for symbol in symbols:
            self.backtest_symbol(symbol, start=start, end=end, interval=interval, **strategy_kwargs)

        return self.results

    def generate_report(self) -> str:
        """
        Generate performance report from all backtests.

        Returns:
            Formatted report string
        """
        if not self.results:
            return "No backtests completed."

        successful = [s for s in self.results.values() if s.get('status') == 'success']

        if not successful:
            return "All backtests failed."

        # Sort by profit factor (descending)
        successful.sort(key=lambda x: x.get('profit_factor', 0), reverse=True)

        report = []
        report.append("\n" + "=" * 80)
        report.append("WAVE•PM BACKTEST PERFORMANCE REPORT")
        report.append("=" * 80)
        report.append("")

        # Summary table
        report.append(f"{'Symbol':<10} {'Trades':<8} {'Win%':<8} {'PF':<8} {'P&L':<12} {'Date Range':<20}")
        report.append("-" * 80)

        total_trades = 0
        total_wins = 0
        total_pnl = 0.0

        for s in successful:
            symbol = s['symbol']
            trades = s['trades_count']
            win_rate = s['win_rate'] * 100 if trades > 0 else 0
            pf = s['profit_factor'] if trades > 0 else 0
            pnl = s['total_pnl']
            pnl_pct = s['total_pnl_pct']
            date_range = s.get('date_range', 'N/A')

            report.append(
                f"{symbol:<10} {trades:<8} {win_rate:>6.1f}% {pf:>6.2f}   "
                f"{pnl:>8.2f} ({pnl_pct:>6.2f}%)  {date_range:<20}"
            )

            total_trades += trades
            total_wins += s['win_count']
            total_pnl += pnl

        report.append("-" * 80)
        overall_win_rate = (total_wins / total_trades * 100) if total_trades > 0 else 0
        report.append(
            f"{'TOTAL':<10} {total_trades:<8} {overall_win_rate:>6.1f}%           "
            f"{total_pnl:>8.2f}"
        )
        report.append("=" * 80)

        # Detailed stats for each symbol
        report.append("\n\nDETAILED RESULTS:")
        report.append("")

        for s in successful:
            report.append(f"\n{s['symbol']}  ({s['date_range']})")
            report.append("-" * 40)
            report.append(f"  Bars analyzed:  {s['prices_count']}")
            report.append(f"  Total trades:   {s['trades_count']}")

            if s['trades_count'] > 0:
                report.append(f"  Winning trades: {s['win_count']} ({s['win_rate']:.1%})")
                report.append(f"  Losing trades:  {s['loss_count']} ({1 - s['win_rate']:.1%})")
                report.append(f"  Profit factor:  {s['profit_factor']:.2f}")
                report.append(f"  Avg win:        {s['avg_win']:.2f}")
                report.append(f"  Avg loss:       {s['avg_loss']:.2f}")
                report.append(f"  Largest win:    {s['largest_win']:.2f}")
                report.append(f"  Largest loss:   {s['largest_loss']:.2f}")
                report.append(f"  Avg bars/trade: {s['avg_bars_held']:.1f}")
                report.append(f"  Total P&L:      {s['total_pnl']:.2f} ({s['total_pnl_pct']:.2f}%)")
            else:
                report.append("  No trades generated (strategy conditions not met)")

        # Failed backtests
        failed = [s for s in self.results.values() if s.get('status') == 'failed']
        if failed:
            report.append("\n\nFAILED BACKTESTS:")
            report.append("-" * 40)
            for s in failed:
                report.append(f"  {s['symbol']}: {s.get('error', 'Unknown error')}")

        return "\n".join(report)

    def save_report(self, filename: str = "backtest_report.txt"):
        """Save report to file."""
        report = self.generate_report()
        with open(filename, 'w') as f:
            f.write(report)
        print(f"\nReport saved to {filename}")


def main():
    """Run full backtest suite on favorite symbols."""
    print("WAVE•PM Batch Backtester\n")

    # Favorite symbols from Trading system
    symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BTCUSD', 'EURUSD', 'SPY', 'NVDA']

    # Date range: 1 year of daily data
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

    print(f"Backtesting {len(symbols)} symbols")
    print(f"Period: {start_date} to {end_date}")
    print(f"Interval: Daily (1d)")
    print(f"\nData sources (in order):")
    print(f"  1. TradingView CSV exports (./tradingview_data/)")
    print(f"  2. Cached CSV files (./data_cache/)")
    print(f"  3. yfinance (requires internet)\n")

    # Create harness
    harness = BacktestHarness()

    # Run backtests (use default strategy parameters)
    results = harness.backtest_symbols(
        symbols,
        start=start_date,
        end=end_date,
        interval='1d'
    )

    # Print report
    print(harness.generate_report())

    # Save to file
    harness.save_report()

    # If no data was fetched, show instructions
    successful = [s for s in results.values() if s.get('status') == 'success']
    if not successful:
        print("\n" + "=" * 80)
        print("⚠️  NO DATA FETCHED - HOW TO FIX")
        print("=" * 80)
        print("\nOption 1: Use TradingView CSV exports (Recommended - Offline)")
        print("-" * 80)
        print("1. Open TradingView: https://www.tradingview.com/chart/")
        print("2. Open chart for each symbol (AAPL, MSFT, NVDA, etc.)")
        print("3. Right-click chart → 'Export data' → Save CSV")
        print("4. Place files in: ./tradingview_data/")
        print("   Example: ./tradingview_data/AAPL_daily.csv")
        print("5. Re-run backtest")
        print("\nOption 2: Run on machine with internet access")
        print("-" * 80)
        print("1. Ensure yfinance is installed: pip install yfinance")
        print("2. Run backtest on machine with internet")
        print("3. Data will be cached for offline use")
        print("=" * 80 + "\n")


if __name__ == '__main__':
    main()
