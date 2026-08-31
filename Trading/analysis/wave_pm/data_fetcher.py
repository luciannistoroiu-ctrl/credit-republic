"""
Historical Data Fetcher

Fetches OHLCV data from multiple sources:
1. TradingView CSV exports (preferred - offline)
2. yfinance (requires internet)
3. Cached CSV files

Supports stocks, ETFs, crypto, and forex pairs.
"""

import pandas as pd
from datetime import datetime, timedelta
from typing import List, Tuple, Optional
from pathlib import Path

try:
    import yfinance as yf
    HAS_YFINANCE = True
except ImportError:
    HAS_YFINANCE = False


class DataFetcher:
    """Fetch and cache historical data for backtesting."""

    def __init__(self, cache_dir: Optional[str] = None, tradingview_dir: Optional[str] = None):
        """
        Initialize data fetcher.

        Args:
            cache_dir: Directory to cache CSV files (default: ./data_cache)
            tradingview_dir: Directory with TradingView CSV exports (default: ./tradingview_data)
        """
        self.cache_dir = Path(cache_dir or './data_cache')
        self.cache_dir.mkdir(exist_ok=True)

        self.tradingview_dir = Path(tradingview_dir or './tradingview_data')
        self.tradingview_dir.mkdir(exist_ok=True)

    def _get_cache_path(self, symbol: str, interval: str) -> Path:
        """Get cache file path for symbol."""
        return self.cache_dir / f"{symbol}_{interval}.csv"

    def _get_tradingview_paths(self, symbol: str) -> List[Path]:
        """Find TradingView CSV files for symbol (*.csv pattern)."""
        tv_files = list(self.tradingview_dir.glob(f"*{symbol}*.csv"))
        tv_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        return tv_files

    def _load_from_tradingview(self, symbol: str) -> Optional[pd.DataFrame]:
        """Load data from TradingView CSV export if available."""
        tv_files = self._get_tradingview_paths(symbol)

        if not tv_files:
            return None

        try:
            tv_file = tv_files[0]
            print(f"  Loading from TradingView: {tv_file.name}")

            df = pd.read_csv(tv_file)

            # Normalize column names (TradingView uses different naming)
            df.columns = [c.lower().strip() for c in df.columns]

            # Handle date column (TradingView: 'time', yfinance: index)
            if 'time' in df.columns:
                df['time'] = pd.to_datetime(df['time'])
                df.set_index('time', inplace=True)
            elif 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'])
                df.set_index('date', inplace=True)

            # Normalize column names (TradingView may use different names)
            rename_map = {
                'open': 'open',
                'high': 'high',
                'low': 'low',
                'close': 'close',
                'volume': 'volume'
            }
            df.rename(columns=rename_map, inplace=True)

            return df
        except Exception as e:
            print(f"  Error loading TradingView file: {e}")
            return None

    def _load_from_cache(self, symbol: str, interval: str) -> Optional[pd.DataFrame]:
        """Load data from cache if available."""
        cache_path = self._get_cache_path(symbol, interval)
        if cache_path.exists():
            try:
                df = pd.read_csv(cache_path, index_col=0, parse_dates=True)
                return df
            except Exception as e:
                print(f"Error loading cache for {symbol}: {e}")
                return None
        return None

    def _save_to_cache(self, symbol: str, interval: str, df: pd.DataFrame):
        """Save data to cache."""
        cache_path = self._get_cache_path(symbol, interval)
        try:
            df.to_csv(cache_path)
        except Exception as e:
            print(f"Error saving cache for {symbol}: {e}")

    def fetch(
        self,
        symbol: str,
        start: Optional[str] = None,
        end: Optional[str] = None,
        interval: str = "1d",
        use_cache: bool = True,
        prefer_tradingview: bool = True
    ) -> pd.DataFrame:
        """
        Fetch historical data for a symbol.

        Sources (in order of preference):
        1. TradingView CSV exports (offline, most reliable)
        2. Cache (local CSV)
        3. yfinance (requires internet)

        Args:
            symbol: Ticker symbol (AAPL, BTCUSD, EURUSD, etc.)
            start: Start date (YYYY-MM-DD) or None for 1 year ago
            end: End date (YYYY-MM-DD) or None for today
            interval: "1d" (daily), "1h" (hourly), "5m", etc.
            use_cache: Whether to use cached data
            prefer_tradingview: Try TradingView CSV first

        Returns:
            DataFrame with OHLCV columns
        """
        print(f"Fetching {symbol} ({interval})...", end=" ", flush=True)

        # Try TradingView CSV first (offline, no internet needed)
        if prefer_tradingview:
            tv_data = self._load_from_tradingview(symbol)
            if tv_data is not None and len(tv_data) > 0:
                print(f"✓ {len(tv_data)} bars from TradingView")
                return tv_data

        # Try cache
        if use_cache:
            cached = self._load_from_cache(symbol, interval)
            if cached is not None and len(cached) > 0:
                print(f"✓ {len(cached)} bars from cache")
                return cached

        # Fall back to yfinance if available
        if not HAS_YFINANCE:
            print("✗ yfinance not available (no internet)")
            print(f"\n  💡 To use yfinance, ensure it's installed: pip install yfinance")
            print(f"  💡 Or place TradingView CSV in ./tradingview_data/{symbol}*.csv")
            return pd.DataFrame()

        # Default date range: 1 year
        if end is None:
            end = datetime.now().strftime('%Y-%m-%d')
        if start is None:
            start = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

        try:
            import yfinance as yf
            df = yf.download(
                symbol,
                start=start,
                end=end,
                interval=interval,
                progress=False
            )

            if df.empty:
                print(f"✗ No data from yfinance")
                return pd.DataFrame()

            # Rename columns to lowercase for consistency
            df.columns = [c.lower() for c in df.columns]

            # Ensure required columns exist
            required = ['open', 'high', 'low', 'close', 'volume']
            if not all(col in df.columns for col in required):
                print(f"  WARNING: Missing columns for {symbol}: {df.columns.tolist()}")

            print(f"✓ {len(df)} bars from yfinance")

            # Save to cache
            if use_cache:
                self._save_to_cache(symbol, interval, df)

            return df

        except Exception as e:
            print(f"✗ yfinance error: {e}")
            return pd.DataFrame()

    def fetch_multiple(
        self,
        symbols: List[str],
        start: Optional[str] = None,
        end: Optional[str] = None,
        interval: str = "1d"
    ) -> dict:
        """
        Fetch data for multiple symbols.

        Args:
            symbols: List of ticker symbols
            start: Start date
            end: End date
            interval: Interval

        Returns:
            Dict of {symbol: DataFrame}
        """
        data = {}
        for symbol in symbols:
            df = self.fetch(symbol, start=start, end=end, interval=interval)
            if not df.empty:
                data[symbol] = df
        return data

    @staticmethod
    def print_tradingview_export_instructions():
        """Print instructions for exporting data from TradingView."""
        print("\n" + "=" * 80)
        print("HOW TO EXPORT DATA FROM TRADINGVIEW")
        print("=" * 80)

        print("\n1. Open TradingView chart (https://www.tradingview.com/chart/)")
        print("2. Select your symbol and timeframe")
        print("3. Wait for chart to load completely")
        print("4. Right-click on the chart → 'Export data'")
        print("5. Save as CSV (e.g., AAPL_1d.csv)")
        print("6. Place in: ./tradingview_data/AAPL_1d.csv")
        print("\n✓ The backtest will automatically load from TradingView exports!")
        print("=" * 80 + "\n")


def get_prices_series(df: pd.DataFrame, column: str = 'close') -> List[float]:
    """Extract price series from OHLCV dataframe."""
    if df.empty:
        return []
    return df[column].dropna().tolist()


def get_volume_series(df: pd.DataFrame) -> List[float]:
    """Extract volume series from OHLCV dataframe."""
    if df.empty:
        return []
    return df['volume'].dropna().tolist()


if __name__ == '__main__':
    # Quick test: fetch data for favorite symbols
    print("Testing Data Fetcher\n")

    fetcher = DataFetcher()

    # Your favorite symbols
    symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPY']

    # Fetch data
    print("Fetching 1 year of daily data...\n")
    data = fetcher.fetch_multiple(symbols, interval='1d')

    # Show summary
    print("\nData Summary:")
    for symbol, df in data.items():
        if not df.empty:
            print(f"\n{symbol}:")
            print(f"  Bars: {len(df)}")
            print(f"  Date range: {df.index[0].date()} to {df.index[-1].date()}")
            print(f"  Price range: ${df['close'].min():.2f} - ${df['close'].max():.2f}")
            print(f"  Last close: ${df['close'].iloc[-1]:.2f}")
