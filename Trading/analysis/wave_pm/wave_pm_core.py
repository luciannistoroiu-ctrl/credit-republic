"""
WAVE•PM Core Calculations

Implements Mark Whistler's WAVE•PM (Whistler Active Volatility Energy / Price Mass)
from "Volatility Illuminated" in pure Python.

Core formula per length:
    dev(len)      = devMult × StDev(close, len)          # Population StDev
    charLen(len)  = max(minCharPeriod, round(charMult × len))
    rms(len)      = sqrt( SMA( dev(len)², charLen ) )
    WAVE_PM(len)  = tanh( dev(len) / rms(len) )
"""

import math
import numpy as np
from typing import List, Tuple, Optional
from collections import deque


class WavePMOscillator:
    """
    Calculates WAVE•PM oscillator for a single length.

    Maintains a rolling window of prices and computes:
    - Deviation (band width scaled by multiplier)
    - RMS normalization (self-adjusting window)
    - tanh-squashed oscillator (0 = compressed, 1 = extended)
    """

    def __init__(
        self,
        length: int,
        dev_mult: float = 2.2,
        char_mult: float = 3.0,
        min_char_period: int = 30
    ):
        """
        Initialize oscillator for a specific length.

        Args:
            length: MA/StDev period (e.g., 14, 55, 600)
            dev_mult: Deviation multiplier (Whistler: 2.2)
            char_mult: RMS window scales by this × length (Whistler: 3.0)
            min_char_period: Minimum RMS window size (Whistler: 30)
        """
        self.length = length
        self.dev_mult = dev_mult
        self.char_mult = char_mult
        self.min_char_period = min_char_period

        # Dynamic RMS window (critical: must scale with length)
        self.char_len = max(min_char_period, round(char_mult * length))

        # Rolling windows
        self.prices = deque(maxlen=max(self.length, self.char_len))
        self.deviations_sq = deque(maxlen=self.char_len)

        self.is_ready = False

    def _population_stdev(self, values: deque) -> float:
        """Calculate population standard deviation (divide by N, not N-1)."""
        if len(values) < 2:
            return 0.0

        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        return math.sqrt(variance)

    def _sma(self, values: deque) -> float:
        """Calculate simple moving average."""
        if len(values) == 0:
            return 0.0
        return sum(values) / len(values)

    def update(self, price: float) -> Optional[float]:
        """
        Update with new price bar, return current oscillator value.

        Returns:
            WAVE•PM value in ~[0, 1) if ready, None if warming up.
        """
        self.prices.append(price)

        # Wait until we have enough history for this length
        if len(self.prices) < self.length:
            return None

        # Calculate deviation at this bar
        dev = self.dev_mult * self._population_stdev(self.prices)
        self.deviations_sq.append(dev ** 2)

        # Wait until we have enough deviations for RMS calculation
        if len(self.deviations_sq) < self.char_len:
            return None

        # Calculate RMS (normalizer)
        rms_val = math.sqrt(self._sma(self.deviations_sq))

        if rms_val == 0:
            return 0.0

        # WAVE•PM = tanh(dev / rms)
        ratio = dev / rms_val
        oscillator = math.tanh(ratio)

        self.is_ready = True
        return oscillator

    def get_warmup_bars_needed(self) -> int:
        """How many bars needed before this oscillator produces valid values."""
        return self.length + self.char_len - 1


class WavePMSpectrum:
    """
    Manages 12 parallel WAVE•PM oscillators across a geometric spectrum.

    Computes 3 derived metrics per bar:
        1. compLen — Length with most compression (WAVE•PM ≈ 0)
        2. extLen — Length with most extension (WAVE•PM ≈ 1)
        3. longestAbove — Longest length where WAVE•PM ≥ threshold
    """

    # Geometric distribution: ~1.4× ratio
    DEFAULT_LENGTHS = [14, 20, 28, 39, 55, 77, 109, 153, 215, 303, 426, 600]

    def __init__(
        self,
        lengths: Optional[List[int]] = None,
        dev_mult: float = 2.2,
        char_mult: float = 3.0,
        min_char_period: int = 30,
        ext_threshold: float = 0.7
    ):
        """
        Initialize spectrum scanner.

        Args:
            lengths: List of lengths to scan (default: geometric 14→600)
            dev_mult: Deviation multiplier
            char_mult: RMS window scale factor
            min_char_period: Minimum RMS window
            ext_threshold: Prag for "longest above" metric (0.7 = classic)
        """
        self.lengths = lengths or self.DEFAULT_LENGTHS
        self.ext_threshold = ext_threshold

        # Create oscillator for each length
        self.oscillators = [
            WavePMOscillator(
                length=l,
                dev_mult=dev_mult,
                char_mult=char_mult,
                min_char_period=min_char_period
            )
            for l in self.lengths
        ]

        # Current oscillator values
        self.current_oscs = [None] * len(self.lengths)

        # Metrics (updated each bar)
        self.comp_len = None
        self.ext_len = None
        self.longest_above = None

        self.is_ready = False
        self.bar_count = 0

    def update(self, price: float) -> bool:
        """
        Update all oscillators with new price.

        Returns:
            True if spectrum is ready and valid metrics available.
        """
        self.bar_count += 1

        # Update each oscillator
        for i, osc in enumerate(self.oscillators):
            val = osc.update(price)
            self.current_oscs[i] = val

        # Check if all oscillators are ready
        if not self.is_ready:
            max_warmup = max(osc.get_warmup_bars_needed() for osc in self.oscillators)
            if self.bar_count >= max_warmup:
                self.is_ready = True

        if not self.is_ready:
            return False

        # Calculate 3 metrics
        self._calculate_metrics()
        return True

    def _calculate_metrics(self):
        """Calculate compLen, extLen, longestAbove from current oscillators."""
        valid_oscs = [(i, val) for i, val in enumerate(self.current_oscs) if val is not None]

        if not valid_oscs:
            self.comp_len = None
            self.ext_len = None
            self.longest_above = None
            return

        # Metric 1: Most compressed (minimum oscillator value)
        min_idx = min(valid_oscs, key=lambda x: x[1])[0]
        self.comp_len = self.lengths[min_idx]

        # Metric 2: Most extended (maximum oscillator value)
        max_idx = max(valid_oscs, key=lambda x: x[1])[0]
        self.ext_len = self.lengths[max_idx]

        # Metric 3: Longest length where WAVE•PM ≥ threshold
        self.longest_above = None
        for i, val in reversed(valid_oscs):  # Start from longest
            if val >= self.ext_threshold:
                self.longest_above = self.lengths[i]
                break

    def get_oscillator(self, length: int) -> Optional[float]:
        """Get current oscillator value for a specific length."""
        try:
            idx = self.lengths.index(length)
            return self.current_oscs[idx]
        except ValueError:
            return None

    def get_all_oscillators(self) -> dict:
        """Return dict of {length: oscillator_value} for all lengths."""
        return {
            self.lengths[i]: self.current_oscs[i]
            for i in range(len(self.lengths))
        }

    def get_metrics(self) -> dict:
        """Return current 3 metrics: compLen, extLen, longestAbove."""
        return {
            'comp_len': self.comp_len,
            'ext_len': self.ext_len,
            'longest_above': self.longest_above,
            'ready': self.is_ready
        }

    def get_warmup_bars_needed(self) -> int:
        """Total bars needed before all metrics are valid."""
        return max(osc.get_warmup_bars_needed() for osc in self.oscillators)


class WavePMBands:
    """
    Calculates 3 dynamic Bollinger Bands based on WAVE•PM metrics.

    Each band uses:
    - Period: derived from metrics (compLen, extLen, longestAbove)
    - Multiplier: fixed at 1.25 SD (Whistler's standard)
    - Basis: SMA of that period
    - Upper/Lower: ± 1.25 × StDev
    """

    def __init__(self, bb_dev_mult: float = 1.25):
        """
        Initialize band calculator.

        Args:
            bb_dev_mult: Bollinger Bands multiplier (Whistler: 1.25)
        """
        self.bb_dev_mult = bb_dev_mult

        # Rolling windows for each band period
        self.price_windows = {
            'comp': deque(),
            'ext': deque(),
            'long': deque()
        }

        # Current bands
        self.bands = {
            'comp': {'upper': None, 'basis': None, 'lower': None},
            'ext': {'upper': None, 'basis': None, 'lower': None},
            'long': {'upper': None, 'basis': None, 'lower': None}
        }

    def update(self, price: float, metrics: dict) -> dict:
        """
        Update bands based on current price and metrics.

        Args:
            price: Current close price
            metrics: Dict with comp_len, ext_len, longest_above from spectrum

        Returns:
            Dict of {band_name: {upper, basis, lower, has_value}}
        """
        comp_len = metrics.get('comp_len')
        ext_len = metrics.get('ext_len')
        longest_above = metrics.get('longest_above')

        # Update compressed band
        if comp_len:
            self._update_single_band('comp', price, comp_len)

        # Update extended band
        if ext_len:
            self._update_single_band('ext', price, ext_len)

        # Update long band (may be None some bars)
        if longest_above:
            self._update_single_band('long', price, longest_above)
        else:
            self.price_windows['long'].clear()
            self.bands['long'] = {'upper': None, 'basis': None, 'lower': None}

        return self._format_bands()

    def _update_single_band(self, band_name: str, price: float, period: int):
        """Calculate upper/basis/lower for a single band."""
        window = self.price_windows[band_name]
        window.append(price)

        # Only update once we have enough history for this period
        if len(window) < period:
            self.bands[band_name] = {'upper': None, 'basis': None, 'lower': None}
            return

        # Keep only the needed period
        if len(window) > period:
            window.popleft()

        # Calculate basis (SMA)
        basis = sum(window) / len(window)

        # Calculate StDev (population)
        variance = sum((x - basis) ** 2 for x in window) / len(window)
        stdev = math.sqrt(variance)

        # Calculate bands
        upper = basis + self.bb_dev_mult * stdev
        lower = basis - self.bb_dev_mult * stdev

        self.bands[band_name] = {
            'upper': upper,
            'basis': basis,
            'lower': lower
        }

    def _format_bands(self) -> dict:
        """Format bands with validity flags."""
        return {
            band_name: {
                **self.bands[band_name],
                'has_value': self.bands[band_name]['basis'] is not None
            }
            for band_name in ['comp', 'ext', 'long']
        }


# ============================================================================
# Utility Functions
# ============================================================================

def calculate_wave_pm_batch(prices: List[float], length: int, **kwargs) -> List[Optional[float]]:
    """
    Calculate WAVE•PM for a batch of prices.

    Args:
        prices: List of close prices
        length: Single length to calculate
        **kwargs: dev_mult, char_mult, min_char_period (optional)

    Returns:
        List of oscillator values (None during warmup)
    """
    osc = WavePMOscillator(length, **kwargs)
    return [osc.update(p) for p in prices]


def calculate_spectrum_batch(
    prices: List[float],
    lengths: Optional[List[int]] = None,
    **kwargs
) -> Tuple[List[dict], List[dict]]:
    """
    Calculate full spectrum for a batch of prices.

    Args:
        prices: List of close prices
        lengths: List of lengths (default: geometric 14→600)
        **kwargs: dev_mult, char_mult, min_char_period, ext_threshold

    Returns:
        Tuple of (oscillators_per_bar, metrics_per_bar)
        where each bar has {length: value} and {comp_len, ext_len, longest_above}
    """
    spectrum = WavePMSpectrum(lengths=lengths, **kwargs)

    oscillators = []
    metrics = []

    for price in prices:
        spectrum.update(price)
        oscillators.append(spectrum.get_all_oscillators().copy())
        metrics.append(spectrum.get_metrics().copy())

    return oscillators, metrics


if __name__ == '__main__':
    # Quick test: calculate WAVE•PM on synthetic prices
    print("Testing WAVE•PM Core\n")

    # Generate synthetic trending data (need enough for longest length 600 + RMS window ~1800)
    prices = [100 + i * 0.5 + (i % 20) * 0.2 for i in range(3000)]

    # Test single oscillator
    print("1. Single Oscillator (length=14):")
    osc_vals = calculate_wave_pm_batch(prices, length=14)
    valid_vals = [v for v in osc_vals if v is not None]
    print(f"   Warmup: {len(osc_vals) - len(valid_vals)} bars")
    print(f"   Valid values: {len(valid_vals)}")
    print(f"   Range: [{min(valid_vals):.4f}, {max(valid_vals):.4f}]")
    print(f"   Last 3 values: {[f'{v:.4f}' for v in valid_vals[-3:]]}\n")

    # Test full spectrum
    print("2. Full Spectrum (12 lengths):")
    oscs, metrics = calculate_spectrum_batch(prices)

    # Find first ready bar
    ready_idx = next((i for i, m in enumerate(metrics) if m['ready']), None)
    if ready_idx is not None:
        print(f"   Warmup: {ready_idx} bars")
        print(f"   First ready metrics: {metrics[ready_idx]}\n")

        # Show last 5 bars
        print("   Last 5 bars:")
        for i in range(-5, 0):
            m = metrics[i]
            print(f"     Bar {len(prices) + i}: compLen={m['comp_len']}, extLen={m['ext_len']}, longest={m['longest_above']}")
    else:
        print("   ERROR: Spectrum never became ready (not enough data)")
