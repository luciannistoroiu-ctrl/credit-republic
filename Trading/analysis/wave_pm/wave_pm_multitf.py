"""
WAVE•PM Multi-Timeframe (MTF) Analysis

Hierarchical analysis across 4 timeframes:
- Daily (40%): Primary trend confirmation
- 4h (30%): Secondary trend confirmation
- 1h (20%): Entry timing
- 15m (10%): Fine entry points

Entry signal requires Daily confirmation + weighted composite score.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import pandas as pd
from datetime import datetime, timedelta

from data_fetcher import DataFetcher, get_prices_series
from wave_pm_strategy import WavePMStrategy


@dataclass
class MTFSignal:
    """Multi-timeframe signal."""
    symbol: str
    timeframe: str
    signal_type: str  # 'ENTRY', 'EXIT', 'NONE'
    price: float
    bar_index: int
    details: dict


@dataclass
class CompositeSignal:
    """Composite signal across timeframes."""
    symbol: str
    datetime: str
    primary_signal: Optional[MTFSignal]  # From Daily
    secondary_signals: List[MTFSignal]  # From 4h, 1h, 15m
    confidence: float  # 0-100%
    weighting: Dict[str, float]  # Score per timeframe
    recommendation: str  # 'STRONG BUY', 'BUY', 'WAIT', 'SELL'


class MultiTFAnalyzer:
    """
    Analyze WAVE•PM across multiple timeframes with hierarchical weighting.

    Timeframes (importance weight):
    - 1d: 40% (Daily trend)
    - 4h: 30% (Secondary trend)
    - 1h: 20% (Entry confirmation)
    - 15m: 10% (Fine timing)
    """

    # Hierarchical timeframe weights
    TIMEFRAME_WEIGHTS = {
        '1d': 0.40,
        '4h': 0.30,
        '1h': 0.20,
        '15m': 0.10
    }

    # Signal values for scoring
    SIGNAL_SCORES = {
        'LONG_ENTRY': 1.0,
        'LONG_EXIT': -1.0,
        'NONE': 0.0
    }

    def __init__(self, cache_dir: Optional[str] = None, tradingview_dir: Optional[str] = None, fetcher=None):
        """
        Initialize MTF analyzer.

        Args:
            cache_dir: Directory for cached data
            tradingview_dir: Directory for TradingView CSV exports
            fetcher: Optional custom data fetcher (defaults to DataFetcher)
        """
        if fetcher is not None:
            self.fetcher = fetcher
        else:
            self.fetcher = DataFetcher(cache_dir=cache_dir, tradingview_dir=tradingview_dir)
        self.strategies = {}  # {timeframe: WavePMStrategy}
        self.signals = {}  # {timeframe: List[MTFSignal]}

    def _get_start_date_for_period(self, period: str) -> str:
        """Convert period string to start date (YYYY-MM-DD format)."""
        end_date = datetime.now()
        period_map = {
            '60d': timedelta(days=60),
            '1y': timedelta(days=365),
            '2y': timedelta(days=730),
            '10y': timedelta(days=3650),
        }
        days = period_map.get(period, timedelta(days=365))
        start_date = end_date - days
        return start_date.strftime('%Y-%m-%d')

    def analyze_symbol(
        self,
        symbol: str,
        timeframes: Optional[List[str]] = None,
        timeframe_periods: Optional[Dict[str, str]] = None,
        **strategy_kwargs
    ) -> Optional[CompositeSignal]:
        """
        Analyze symbol across multiple timeframes.

        Args:
            symbol: Ticker symbol (AAPL, BTCUSD, etc.)
            timeframes: List of timeframes (default: ['1d', '4h', '1h', '15m'])
            timeframe_periods: Dict mapping timeframes to periods (e.g., {'15m': '60d'})
            **strategy_kwargs: Args for WavePMStrategy

        Returns:
            CompositeSignal with hierarchical analysis
        """
        if timeframes is None:
            timeframes = ['1d', '4h', '1h', '15m']

        print(f"\n📊 Multi-TF Analysis: {symbol}")
        print("-" * 60)

        # Fetch data for each timeframe
        tf_data = {}
        for tf in timeframes:
            print(f"  {tf:<5}", end=" ", flush=True)

            # Determine start date if timeframe_periods provided
            start_date = None
            if timeframe_periods and tf in timeframe_periods:
                start_date = self._get_start_date_for_period(timeframe_periods[tf])

            df = self.fetcher.fetch(symbol, interval=tf, start=start_date)

            if df.empty:
                print("✗")
                continue

            print(f"✓ {len(df)} bars")
            tf_data[tf] = df

        if not tf_data:
            print("  ✗ No data fetched")
            return None

        # Analyze each timeframe
        print("\n  Analyzing...", flush=True)
        tf_signals = {}
        tf_states = {}

        for tf in timeframes:
            if tf not in tf_data:
                continue

            prices = get_prices_series(tf_data[tf], column='close')
            strategy = WavePMStrategy(**strategy_kwargs)

            # Run strategy on all bars
            for price in prices:
                strategy.update(price)

            # Get current state and latest signal
            state = strategy.get_current_state()
            signals = strategy.get_signals()

            tf_signals[tf] = signals
            tf_states[tf] = state

        # Generate composite signal
        composite = self._compute_composite_signal(symbol, tf_signals, tf_states)
        return composite

    def analyze_symbol_cached(
        self,
        symbol: str,
        tf_data: Dict[str, pd.DataFrame],
        **strategy_kwargs
    ) -> Optional[CompositeSignal]:
        """
        Analyze symbol with pre-fetched data (no fetching).

        Args:
            symbol: Ticker symbol
            tf_data: Dict of {timeframe: DataFrame}
            **strategy_kwargs: Args for WavePMStrategy

        Returns:
            CompositeSignal with hierarchical analysis
        """
        if not tf_data:
            return None

        tf_signals = {}
        tf_states = {}

        for tf in tf_data:
            df = tf_data[tf]
            if df.empty:
                continue

            prices = get_prices_series(df, column='close')
            strategy = WavePMStrategy(**strategy_kwargs)

            for price in prices:
                strategy.update(price)

            state = strategy.get_current_state()
            signals = strategy.get_signals()

            tf_signals[tf] = signals
            tf_states[tf] = state

        composite = self._compute_composite_signal(symbol, tf_signals, tf_states)
        return composite

    def _compute_composite_signal(
        self,
        symbol: str,
        tf_signals: Dict[str, List],
        tf_states: Dict[str, dict]
    ) -> Optional[CompositeSignal]:
        """
        Compute composite signal from timeframe signals.

        Hierarchical logic:
        - Daily (40%): MUST have entry for composite entry
        - 4h (30%): Adds 30% confidence if entry
        - 1h (20%): Adds 20% confidence if entry
        - 15m (10%): Adds 10% confidence if entry
        """
        primary_signal = None
        secondary_signals = []
        weighting = {}

        # Extract latest signal per timeframe
        for tf in ['1d', '4h', '1h', '15m']:
            if tf not in tf_signals or not tf_signals[tf]:
                weighting[tf] = 0.0
                continue

            signals = tf_signals[tf]
            latest_signal = signals[-1]

            # Convert to MTFSignal
            mtf_sig = MTFSignal(
                symbol=symbol,
                timeframe=tf,
                signal_type=latest_signal.signal.name,
                price=latest_signal.price,
                bar_index=latest_signal.bar_index,
                details=latest_signal.details
            )

            # Scoring based on signal type
            signal_score = self.SIGNAL_SCORES.get(latest_signal.signal.name, 0.0)
            weighting[tf] = signal_score

            # Daily is primary, rest are secondary
            if tf == '1d' and signal_score > 0:
                primary_signal = mtf_sig
            else:
                secondary_signals.append(mtf_sig)

        # Calculate composite confidence
        if primary_signal is None or primary_signal.signal_type != 'LONG_ENTRY':
            # No entry on Daily = no composite entry
            return CompositeSignal(
                symbol=symbol,
                datetime="N/A",
                primary_signal=primary_signal,
                secondary_signals=secondary_signals,
                confidence=0.0,
                weighting=weighting,
                recommendation='WAIT'
            )

        # Daily has entry - calculate confidence from lower TFs
        confidence = 40.0  # Base 40% from Daily entry

        for tf in ['4h', '1h', '15m']:
            if weighting.get(tf, 0) > 0:
                confidence += self.TIMEFRAME_WEIGHTS[tf] * 100

        confidence = min(confidence, 100.0)

        # Generate recommendation
        if confidence >= 80:
            recommendation = 'STRONG BUY'
        elif confidence >= 60:
            recommendation = 'BUY'
        elif confidence >= 40:
            recommendation = 'WEAK BUY'
        else:
            recommendation = 'WAIT'

        return CompositeSignal(
            symbol=symbol,
            datetime=str(primary_signal.bar_index),
            primary_signal=primary_signal,
            secondary_signals=secondary_signals,
            confidence=confidence,
            weighting=weighting,
            recommendation=recommendation
        )

    def print_composite_report(self, composite: CompositeSignal):
        """Print formatted MTF analysis report."""
        print("\n" + "=" * 70)
        print(f"MULTI-TF ANALYSIS: {composite.symbol}")
        print("=" * 70)

        print(f"\n📈 Timeframe Signals:")
        print("-" * 70)

        # Show each timeframe
        for tf, weight in composite.weighting.items():
            signal_map = {1.0: '🟢 ENTRY', -1.0: '🔴 EXIT', 0.0: '⚪ NONE'}
            signal_str = signal_map.get(weight, '?')
            weight_pct = self.TIMEFRAME_WEIGHTS[tf] * 100
            print(f"  {tf:<5} {signal_str:<15} (Weight: {weight_pct:>5.0f}%)")

        print("\n" + "-" * 70)
        print(f"\n🎯 Composite Signal:")
        print(f"  Recommendation: {composite.recommendation}")
        print(f"  Confidence: {composite.confidence:.1f}%")

        if composite.primary_signal:
            print(f"\n📍 Primary (Daily):")
            print(f"  Signal: {composite.primary_signal.signal_type}")
            print(f"  Price: ${composite.primary_signal.price:.2f}")
            print(f"  Bar: {composite.primary_signal.bar_index}")

        if composite.secondary_signals:
            print(f"\n📊 Secondary Confirmations:")
            for sig in composite.secondary_signals:
                if sig.weighting > 0:
                    print(f"  {sig.timeframe}: {sig.signal_type} @ ${sig.price:.2f}")

        print("\n" + "=" * 70)

    @staticmethod
    def batch_analyze(
        symbols: List[str],
        timeframes: Optional[List[str]] = None,
        fetcher=None,
        **strategy_kwargs
    ) -> Dict[str, CompositeSignal]:
        """
        Analyze multiple symbols with MTF.

        Args:
            symbols: List of symbols
            timeframes: Timeframes to analyze
            fetcher: Optional custom data fetcher
            **strategy_kwargs: Strategy parameters

        Returns:
            Dict of {symbol: CompositeSignal}
        """
        analyzer = MultiTFAnalyzer(fetcher=fetcher)
        results = {}

        for symbol in symbols:
            composite = analyzer.analyze_symbol(symbol, timeframes, **strategy_kwargs)
            if composite:
                results[symbol] = composite

        return results


def main():
    """Demo: Analyze favorite symbols with MTF."""
    print("\n🚀 WAVE•PM Multi-Timeframe Analysis")
    print("=" * 70)

    symbols = ['AAPL', 'MSFT', 'NVDA']
    timeframes = ['1d', '4h', '1h', '15m']

    analyzer = MultiTFAnalyzer()

    for symbol in symbols:
        composite = analyzer.analyze_symbol(symbol, timeframes=timeframes)

        if composite:
            analyzer.print_composite_report(composite)
        else:
            print(f"\n❌ Failed to analyze {symbol}")

    print("\n✓ Multi-TF analysis complete")


if __name__ == '__main__':
    main()
