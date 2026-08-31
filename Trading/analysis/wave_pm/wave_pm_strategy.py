"""
WAVE•PM Trading Strategy

Implements long entry/exit rules based on 3 dynamic Bollinger Bands
derived from WAVE•PM spectrum metrics.

Entry: Breakout from compression band + WAVE•PM rising + long band trigger
Exit:  Price reverts from long band interaction
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
from enum import Enum

from wave_pm_core import WavePMSpectrum, WavePMBands


class Signal(Enum):
    """Trade signal types."""
    NONE = 0
    LONG_ENTRY = 1
    LONG_EXIT = 2
    LONG_ENTRY_FAILURE = 3  # Exit too close to entry (noise)


@dataclass
class TradeSignal:
    """Represents a single trade signal."""
    bar_index: int
    price: float
    signal: Signal
    details: dict  # Extra context for debugging


class WavePMStrategy:
    """
    Full WAVE•PM strategy implementation.

    Tracks:
    - Spectrum (12-length oscillators + 3 metrics)
    - Bands (3 dynamic Bollinger Bands)
    - Entry/exit signals
    - Active position state
    """

    def __init__(
        self,
        dev_mult: float = 2.2,
        char_mult: float = 3.0,
        min_char_period: int = 30,
        ext_threshold: float = 0.7,
        bb_dev_mult: float = 1.25,
        min_bars_between_entry_exit: int = 2
    ):
        """
        Initialize strategy.

        Args:
            dev_mult: WAVE•PM deviation multiplier (Whistler: 2.2)
            char_mult: RMS window scale (Whistler: 3.0)
            min_char_period: Minimum RMS window (Whistler: 30)
            ext_threshold: Prag for longestAbove (Whistler: 0.7)
            bb_dev_mult: Bollinger Bands multiplier (Whistler: 1.25)
            min_bars_between_entry_exit: Noise filter (min bars between entry & exit)
        """
        self.spectrum = WavePMSpectrum(
            dev_mult=dev_mult,
            char_mult=char_mult,
            min_char_period=min_char_period,
            ext_threshold=ext_threshold
        )
        self.bands = WavePMBands(bb_dev_mult=bb_dev_mult)

        self.min_bars_between_entry_exit = min_bars_between_entry_exit

        # Price history and bands history
        self.prices = []
        self.bands_history = []
        self.metrics_history = []
        self.oscillator_history = []

        # Position tracking
        self.position_active = False
        self.entry_bar_index = None
        self.entry_price = None

        # Signals
        self.signals = []

    def update(self, price: float) -> Optional[TradeSignal]:
        """
        Update strategy with new bar, return signal if any.

        Args:
            price: Close price of current bar

        Returns:
            TradeSignal if entry/exit triggered, None otherwise
        """
        bar_idx = len(self.prices)
        self.prices.append(price)

        # Update spectrum (oscillators + metrics)
        spectrum_ready = self.spectrum.update(price)
        if not spectrum_ready:
            return None

        metrics = self.spectrum.get_metrics()
        oscillators = self.spectrum.get_all_oscillators()

        # Update bands
        bands = self.bands.update(price, metrics)

        # Store history
        self.metrics_history.append(metrics)
        self.oscillator_history.append(oscillators)
        self.bands_history.append(bands)

        # Generate signals
        signal = self._generate_signal(bar_idx, price, metrics, oscillators, bands)

        if signal is not None:
            self.signals.append(signal)

        return signal

    def _generate_signal(
        self,
        bar_idx: int,
        price: float,
        metrics: dict,
        oscillators: dict,
        bands: dict
    ) -> Optional[TradeSignal]:
        """
        Generate entry/exit signal based on current state and conditions.

        Entry: cond1 AND cond2
            cond1: close > upperComp AND minVal > minVal[1]  (breakout + rising)
            cond2: close crosses under lowerLong OR over upperLong

        Exit: price reverts from long band
        """
        # Need at least 2 bars for crossover detection
        if bar_idx < 1:
            return None

        prev_metrics = self.metrics_history[-2] if len(self.metrics_history) > 1 else None
        prev_bands = self.bands_history[-2] if len(self.bands_history) > 1 else None
        prev_price = self.prices[-2]

        # Check if position is active and we should exit
        if self.position_active:
            exit_signal = self._check_exit(bar_idx, price, prev_price, bands, prev_bands)
            if exit_signal is not None:
                self.position_active = False
                return exit_signal

        # Check entry conditions (only if no active position)
        if not self.position_active:
            entry_signal = self._check_entry(
                bar_idx, price, prev_price, metrics, prev_metrics, oscillators, bands, prev_bands
            )
            if entry_signal is not None:
                self.position_active = True
                self.entry_bar_index = bar_idx
                self.entry_price = price
                return entry_signal

        return None

    def _check_entry(
        self,
        bar_idx: int,
        price: float,
        prev_price: float,
        metrics: dict,
        prev_metrics: Optional[dict],
        oscillators: dict,
        bands: dict,
        prev_bands: Optional[dict]
    ) -> Optional[TradeSignal]:
        """Check if entry conditions are met."""
        if prev_metrics is None or prev_bands is None:
            return None

        comp_len = metrics.get('comp_len')
        longest_above = metrics.get('longest_above')

        if not comp_len or not longest_above:
            return None

        comp_band = bands.get('comp')
        long_band = bands.get('long')

        if not comp_band.get('has_value') or not long_band.get('has_value'):
            return None

        prev_comp_band = prev_bands.get('comp')
        prev_long_band = prev_bands.get('long')

        # Condition 1: Breakout from compression + WAVE•PM rising
        upper_comp = comp_band.get('upper')
        prev_upper_comp = prev_comp_band.get('upper')

        # Get minimum oscillator value (represents compression)
        oscs = list(oscillators.values())
        oscs_valid = [o for o in oscs if o is not None]
        min_osc = min(oscs_valid) if oscs_valid else None

        prev_oscs = self.oscillator_history[-2]
        prev_oscs_valid = [o for o in prev_oscs.values() if o is not None]
        prev_min_osc = min(prev_oscs_valid) if prev_oscs_valid else None

        if min_osc is None or prev_min_osc is None:
            return None

        # Breakout detection: price crosses above upper comp band
        breakout = (prev_price <= prev_upper_comp and price > upper_comp)

        # Rising detection: current min_osc > previous min_osc
        comp_rising = min_osc > prev_min_osc

        cond1 = breakout and comp_rising

        # Condition 2: Long band interaction
        upper_long = long_band.get('upper')
        lower_long = long_band.get('lower')
        prev_upper_long = prev_long_band.get('upper')
        prev_lower_long = prev_long_band.get('lower')

        # Both current and previous must have valid long band values
        if (upper_long is None or lower_long is None or
            prev_upper_long is None or prev_lower_long is None):
            return None

        # Cross under lower long band
        cross_under_lower = (prev_price >= prev_lower_long and price < lower_long)

        # Cross over upper long band
        cross_over_upper = (prev_price <= prev_upper_long and price > upper_long)

        cond2 = cross_under_lower or cross_over_upper

        # Entry signal
        if cond1 and cond2:
            return TradeSignal(
                bar_index=bar_idx,
                price=price,
                signal=Signal.LONG_ENTRY,
                details={
                    'cond1_breakout': breakout,
                    'cond1_rising': comp_rising,
                    'cond2_under_lower': cross_under_lower,
                    'cond2_over_upper': cross_over_upper,
                    'comp_len': comp_len,
                    'longest_above': longest_above,
                    'min_osc': min_osc,
                    'upper_comp': upper_comp,
                    'upper_long': upper_long,
                    'lower_long': lower_long
                }
            )

        return None

    def _check_exit(
        self,
        bar_idx: int,
        price: float,
        prev_price: float,
        bands: dict,
        prev_bands: Optional[dict]
    ) -> Optional[TradeSignal]:
        """Check if exit/SL conditions are met."""
        if prev_bands is None:
            return None

        long_band = bands.get('long')
        prev_long_band = prev_bands.get('long')

        if not long_band.get('has_value') or not prev_long_band.get('has_value'):
            return None

        upper_long = long_band.get('upper')
        lower_long = long_band.get('lower')
        prev_upper_long = prev_long_band.get('upper')
        prev_lower_long = prev_long_band.get('lower')

        # Check for None values (can happen if longestAbove drops out)
        if (upper_long is None or lower_long is None or
            prev_upper_long is None or prev_lower_long is None):
            return None

        # Exit condition 1: Price enters below upper long (breakout failed)
        exit1 = (prev_price >= prev_upper_long and price < upper_long)

        # Exit condition 2: Price exits above lower long (bounce failed)
        exit2 = (prev_price <= prev_lower_long and price > lower_long)

        if exit1 or exit2:
            # Noise filter: minimum bars in trade
            bars_in_trade = bar_idx - self.entry_bar_index
            if bars_in_trade < self.min_bars_between_entry_exit:
                return None

            return TradeSignal(
                bar_index=bar_idx,
                price=price,
                signal=Signal.LONG_EXIT,
                details={
                    'exit_under_upper': exit1,
                    'exit_over_lower': exit2,
                    'entry_price': self.entry_price,
                    'entry_bar': self.entry_bar_index,
                    'bars_held': bars_in_trade,
                    'pnl_pct': (price - self.entry_price) / self.entry_price * 100
                }
            )

        return None

    def get_signals(self) -> List[TradeSignal]:
        """Return all signals generated so far."""
        return self.signals

    def get_trades(self) -> List[dict]:
        """
        Extract closed trades from signals.

        Returns:
            List of {entry_bar, entry_price, exit_bar, exit_price, pnl, pnl_pct}
        """
        trades = []
        i = 0
        while i < len(self.signals):
            sig = self.signals[i]
            if sig.signal == Signal.LONG_ENTRY:
                # Find corresponding exit
                for j in range(i + 1, len(self.signals)):
                    exit_sig = self.signals[j]
                    if exit_sig.signal == Signal.LONG_EXIT:
                        entry_price = sig.price
                        exit_price = exit_sig.price
                        pnl = exit_price - entry_price
                        pnl_pct = (pnl / entry_price) * 100

                        trades.append({
                            'entry_bar': sig.bar_index,
                            'entry_price': entry_price,
                            'exit_bar': exit_sig.bar_index,
                            'exit_price': exit_price,
                            'bars_held': exit_sig.bar_index - sig.bar_index,
                            'pnl': pnl,
                            'pnl_pct': pnl_pct
                        })
                        i = j
                        break
            i += 1

        return trades

    def get_current_state(self) -> dict:
        """Return current position and bands state."""
        if not self.spectrum.is_ready:
            return {'ready': False}

        metrics = self.spectrum.get_metrics()
        bands = self.bands_history[-1] if self.bands_history else {}

        return {
            'ready': True,
            'bar_count': len(self.prices),
            'current_price': self.prices[-1],
            'position_active': self.position_active,
            'entry_bar': self.entry_bar_index,
            'entry_price': self.entry_price,
            'comp_len': metrics.get('comp_len'),
            'ext_len': metrics.get('ext_len'),
            'longest_above': metrics.get('longest_above'),
            'bands': {
                'comp': bands.get('comp', {}),
                'ext': bands.get('ext', {}),
                'long': bands.get('long', {})
            }
        }


def backtest_symbol(
    prices: List[float],
    volume: Optional[List[int]] = None,
    **strategy_kwargs
) -> dict:
    """
    Run full backtest on a price series.

    Args:
        prices: List of close prices
        volume: Optional volume list (not used in current strategy)
        **strategy_kwargs: Args to pass to WavePMStrategy.__init__

    Returns:
        Dict with backtest statistics
    """
    strategy = WavePMStrategy(**strategy_kwargs)

    for price in prices:
        strategy.update(price)

    trades = strategy.get_trades()

    # Calculate statistics
    if not trades:
        return {
            'prices_count': len(prices),
            'trades_count': 0,
            'win_count': 0,
            'loss_count': 0,
            'win_rate': 0.0,
            'avg_win': 0.0,
            'avg_loss': 0.0,
            'profit_factor': 0.0,
            'total_pnl': 0.0,
            'total_pnl_pct': 0.0
        }

    winning_trades = [t for t in trades if t['pnl'] > 0]
    losing_trades = [t for t in trades if t['pnl'] < 0]

    total_pnl = sum(t['pnl'] for t in trades)
    total_pnl_pct = sum(t['pnl_pct'] for t in trades)

    gross_profit = sum(t['pnl'] for t in winning_trades) if winning_trades else 0
    gross_loss = abs(sum(t['pnl'] for t in losing_trades)) if losing_trades else 0

    return {
        'prices_count': len(prices),
        'trades_count': len(trades),
        'win_count': len(winning_trades),
        'loss_count': len(losing_trades),
        'win_rate': len(winning_trades) / len(trades) if trades else 0.0,
        'avg_win': gross_profit / len(winning_trades) if winning_trades else 0.0,
        'avg_loss': gross_loss / len(losing_trades) if losing_trades else 0.0,
        'profit_factor': gross_profit / gross_loss if gross_loss > 0 else 0.0,
        'total_pnl': total_pnl,
        'total_pnl_pct': total_pnl_pct,
        'largest_win': max((t['pnl'] for t in winning_trades), default=0.0),
        'largest_loss': min((t['pnl'] for t in losing_trades), default=0.0),
        'avg_bars_held': sum(t['bars_held'] for t in trades) / len(trades) if trades else 0,
        'trades': trades
    }


if __name__ == '__main__':
    # Quick test
    print("Testing WAVE•PM Strategy\n")

    # Generate synthetic data
    prices = [100 + i * 0.5 + (i % 20) * 0.2 for i in range(3000)]

    # Run backtest
    stats = backtest_symbol(prices)

    print("Backtest Results:")
    print(f"  Prices: {stats['prices_count']}")
    print(f"  Trades: {stats['trades_count']}")
    print(f"  Wins: {stats['win_count']} ({stats['win_rate']:.1%})")
    print(f"  Losses: {stats['loss_count']}")
    print(f"  Profit Factor: {stats['profit_factor']:.2f}")
    print(f"  Total P&L: {stats['total_pnl']:.2f} ({stats['total_pnl_pct']:.2f}%)")
    print(f"  Avg Bars/Trade: {stats['avg_bars_held']:.1f}")

    if stats['trades']:
        print(f"\n  First 3 trades:")
        for i, trade in enumerate(stats['trades'][:3]):
            print(f"    {i+1}. Entry @{trade['entry_bar']}: {trade['entry_price']:.2f} → "
                  f"Exit @{trade['exit_bar']}: {trade['exit_price']:.2f} "
                  f"({trade['pnl_pct']:+.2f}%)")
