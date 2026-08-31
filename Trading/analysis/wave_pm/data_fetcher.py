"""
Historical Data Fetcher

Fetches OHLCV data from yfinance for backtesting.
Supports stocks, ETFs, crypto, and forex pairs.
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Tuple, Optional
from pathlib import Path


class DataFetcher:
    """Fetch and cache historical data for backtesting."""

    def __init__(self, cache_dir: Optional[str] = None):
        """
        Initialize data fetcher.

        Args:
            cache_dir: Directory to cache CSV files (default: ./data_cache)
        """
        self.cache_dir = Path(cache_dir or './data_cache')
        self.cache_dir.mkdir(exist_ok=True)

    def _get_cache_path(self, symbol: str, interval: str) -> Path:
        """Get cache file path for symbol."""
        return self.cache_dir / f"{symbol}_{interval}.csv"

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
        use_cache: bool = True
    ) -> pd.DataFrame:
        """
        Fetch historical data for a symbol.

        Args:
            symbol: Ticker symbol (AAPL, BTCUSD, EURUSD, etc.)
            start: Start date (YYYY-MM-DD) or None for 1 year ago
            end: End date (YYYY-MM-DD) or None for today
            interval: "1d" (daily), "1h" (hourly), "5m", etc.
            use_cache: Whether to use cached data

        Returns:
            DataFrame with OHLCV columns
        """
        # Default date range: 1 year
        if end is None:
            end = datetime.now().strftime('%Y-%m-%d')
        if start is None:
            start = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

        # Try cache first
        if use_cache:
            cached = self._load_from_cache(symbol, interval)
            if cached is not None and len(cached) > 0:
                return cached

        # Fetch from yfinance
        print(f"Fetching {symbol} ({interval}) from {start} to {end}...")
        try:
            df = yf.download(
                symbol,
                start=start,
                end=end,
                interval=interval,
                progress=False
            )

            if df.empty:
                print(f"  ERROR: No data fetched for {symbol}")
                return pd.DataFrame()

            # Rename columns to lowercase for consistency
            df.columns = [c.lower() for c in df.columns]

            # Ensure required columns exist
            required = ['open', 'high', 'low', 'close', 'volume']
            if not all(col in df.columns for col in required):
                print(f"  WARNING: Missing columns for {symbol}: {df.columns.tolist()}")

            print(f"  ✓ Fetched {len(df)} bars")

            # Save to cache
            if use_cache:
                self._save_to_cache(symbol, interval, df)

            return df

        except Exception as e:
            print(f"  ERROR fetching {symbol}: {e}")
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
