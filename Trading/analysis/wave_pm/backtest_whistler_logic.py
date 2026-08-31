"""
WAVE•PM Backtest cu Whistler Triple Containment Logic
Foloseste exact logica de entry/exit din Pine Script-ul Whistler

Entry Logic:
1. Breakout peste banda Comprimat + WAVE-PM in crestere
2. SI: Intrare sub banda Lunga SAU iesire din banda Lunga

Exit Logic:
1. Intrare sub banda Lunga superioara
2. SAU: Iesire din banda Lunga inferioara
"""

import sys
sys.path.insert(0, '/home/user/credit-republic/Trading/analysis/wave_pm')

from data_fetcher_cryptocom import DataFetcherCryptoCom
import pandas as pd
import numpy as np
from datetime import datetime
import json

class WhistlerBacktester:
    """Backtest with Whistler Triple Containment Bands logic."""

    # Whistler parameters
    BB_DEV = 1.25  # Bollinger Bands deviation (Whistler standard)
    DEV_MULT = 1.5  # Optimized deviation multiplier
    CHAR_MULT = 2.0  # Optimized characteristic multiplier
    MIN_CHAR_PERIOD = 30  # Minimum RMS window
    EXT_THRESHOLD = 0.60  # Extension threshold (optimized)

    # Wavelengths for scanning
    LENGTHS = [14, 20, 28, 39, 55, 77, 109, 153, 215, 303, 426, 600]

    def __init__(self):
        self.fetcher = DataFetcherCryptoCom()
        self.results = {}

    def tanh_approx(self, x):
        """Approximate tanh using math formula."""
        x = np.clip(x, -40, 40)
        e2x = np.exp(2 * x)
        return (e2x - 1) / (e2x + 1)

    def wave_osc_for_len(self, prices, length, idx):
        """Calculate WAVE-PM oscillator for a given length at bar index."""
        if idx < length:
            return 0.0

        window = prices[idx - length + 1:idx + 1]
        dev = self.DEV_MULT * np.std(window)

        char_len = max(self.MIN_CHAR_PERIOD, round(self.CHAR_MULT * length))
        if idx < char_len:
            return 0.0

        rms_window = prices[idx - char_len + 1:idx + 1]
        # Calculate RMS of deviations in the window
        devs_in_window = [self.DEV_MULT * np.std(prices[max(0, i - length + 1):i + 1]) for i in range(max(0, idx - char_len + 1), idx + 1)]
        rms_val = np.sqrt(np.mean([d ** 2 for d in devs_in_window]))

        return self.tanh_approx(dev / rms_val) if rms_val != 0 else 0.0

    def calculate_bands_at_bar(self, prices, idx):
        """Calculate all 3 bands at a specific bar."""
        oscs = []
        for length in self.LENGTHS:
            osc = self.wave_osc_for_len(prices, length, idx)
            oscs.append(osc)

        oscs = np.array(oscs)
        min_val = np.min(oscs)
        max_val = np.max(oscs)
        min_idx = np.argmin(oscs)
        max_idx = np.argmax(oscs)

        comp_len = self.LENGTHS[min_idx]  # Compressed (most compressed)
        ext_len = self.LENGTHS[max_idx]   # Extended (most extended)

        # Longest above threshold
        longest_above = None
        osc_at_longest = 0.0
        for i, osc in enumerate(oscs):
            if osc >= self.EXT_THRESHOLD:
                cand = self.LENGTHS[i]
                if longest_above is None or cand > longest_above:
                    longest_above = cand
                    osc_at_longest = osc

        # Calculate the 3 bands
        bands = {}

        # Band 1: Compressed
        window = prices[max(0, idx - comp_len + 1):idx + 1]
        basis_comp = np.mean(window)
        dev_comp = np.std(window)
        bands['comp'] = {
            'basis': basis_comp,
            'upper': basis_comp + self.BB_DEV * dev_comp,
            'lower': basis_comp - self.BB_DEV * dev_comp,
            'length': comp_len
        }

        # Band 2: Extended
        window = prices[max(0, idx - ext_len + 1):idx + 1]
        basis_ext = np.mean(window)
        dev_ext = np.std(window)
        bands['ext'] = {
            'basis': basis_ext,
            'upper': basis_ext + self.BB_DEV * dev_ext,
            'lower': basis_ext - self.BB_DEV * dev_ext,
            'length': ext_len
        }

        # Band 3: Longest above threshold
        bands['longest'] = None
        if longest_above is not None:
            window = prices[max(0, idx - longest_above + 1):idx + 1]
            basis_long = np.mean(window)
            dev_long = np.std(window)
            bands['longest'] = {
                'basis': basis_long,
                'upper': basis_long + self.BB_DEV * dev_long,
                'lower': basis_long - self.BB_DEV * dev_long,
                'length': longest_above
            }

        return bands, min_val

    def backtest_symbol(self, symbol: str) -> dict:
        """Backtest a symbol with Whistler logic."""
        print(f"\n{'=' * 70}")
        print(f"📊 Whistler Backtest: {symbol}")
        print(f"Parameters: dev={self.DEV_MULT}, char={self.CHAR_MULT}, ext={self.EXT_THRESHOLD}")
        print(f"{'=' * 70}\n")

        # Fetch data
        print("📥 Fetching data...")
        from datetime import timedelta
        start_date = (datetime.now() - timedelta(days=3650)).strftime('%Y-%m-%d')
        df = self.fetcher.fetch(symbol, interval='1d', start=start_date)

        if df.empty:
            print(f"  ✗ No data available")
            return None

        print(f"  ✓ {len(df)} bars, price {df['close'].iloc[-1]:.4f}")

        prices = df['close'].values
        trades = []
        in_trade = False
        entry_price = 0
        entry_bar = 0

        print(f"\n🔄 Running Whistler backtest...")

        # Calculate bands for all bars
        all_bands = []
        all_min_vals = []
        for i in range(len(prices)):
            bands, min_val = self.calculate_bands_at_bar(prices, i)
            all_bands.append(bands)
            all_min_vals.append(min_val)

        # Trading loop
        for i in range(1, len(prices)):
            price = prices[i]
            prev_price = prices[i - 1]
            bands = all_bands[i]
            prev_bands = all_bands[i - 1]
            min_val = all_min_vals[i]
            prev_min_val = all_min_vals[i - 1]

            # Entry conditions (Whistler logic)
            comp_rising = min_val > prev_min_val
            cond1 = (prev_price <= bands['comp']['upper'] and price > bands['comp']['upper']) and comp_rising

            enter_lower = False
            exit_upper = False
            if bands['longest'] is not None:
                enter_lower = (prev_price >= bands['longest']['lower'] and price < bands['longest']['lower'])
                exit_upper = (prev_price <= bands['longest']['upper'] and price > bands['longest']['upper'])

            cond2 = enter_lower or exit_upper
            long_entry = cond1 and cond2

            # Exit conditions (Whistler logic)
            sl_enter_under_upper = False
            sl_exit_lower = False
            if bands['longest'] is not None:
                sl_enter_under_upper = (prev_price >= bands['longest']['upper'] and price < bands['longest']['upper'])
                sl_exit_lower = (prev_price <= bands['longest']['lower'] and price > bands['longest']['lower'])

            long_exit = sl_enter_under_upper or sl_exit_lower

            # Process entry
            if not in_trade and long_entry:
                in_trade = True
                entry_price = price
                entry_bar = i
                print(f"  🟢 ENTRY #{len(trades)+1} at bar {i}: {price:.4f}")

            # Process exit
            if in_trade and long_exit:
                exit_price = price
                pnl = (exit_price - entry_price) / entry_price * 100
                bars_held = i - entry_bar

                if abs(pnl) > 0.1:  # Only record
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
            'parameters': {
                'dev_mult': self.DEV_MULT,
                'char_mult': self.CHAR_MULT,
                'ext_threshold': self.EXT_THRESHOLD,
                'bb_dev': self.BB_DEV
            },
            'data': {
                'total_bars': len(df),
                'start_price': df['close'].iloc[0],
                'end_price': df['close'].iloc[-1],
                'price_change_pct': (df['close'].iloc[-1] - df['close'].iloc[0]) / df['close'].iloc[0] * 100
            },
            'trades': trades,
            'statistics': stats
        }

    def _calculate_stats(self, trades: list, df: pd.DataFrame) -> dict:
        """Calculate statistics."""
        if not trades:
            return {
                'total_trades': 0,
                'winning_trades': 0,
                'losing_trades': 0,
                'win_rate': 0,
                'avg_win': 0,
                'avg_loss': 0,
                'total_pnl_percent': 0,
                'profit_factor': 0
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
        """Print results."""
        if not result:
            return

        print(f"\n{'=' * 70}")
        print(f"📈 {result['symbol']} Results")
        print(f"{'=' * 70}\n")

        data = result['data']
        print(f"Data Period:")
        print(f"  Start: {data['start_price']:.4f}")
        print(f"  End: {data['end_price']:.4f}")
        print(f"  Buy & Hold: {data['price_change_pct']:+.2f}%")

        stats = result['statistics']
        print(f"\nTrades:")
        print(f"  Total: {stats['total_trades']}")
        print(f"  Wins/Losses: {stats['winning_trades']}/{stats['losing_trades']}")
        print(f"  Win Rate: {stats['win_rate']:.1f}%")
        print(f"  Avg Win/Loss: {stats['avg_win']:+.2f}% / {stats['avg_loss']:+.2f}%")
        print(f"  Total P&L: {stats['total_pnl_percent']:+.2f}%")
        print(f"  Profit Factor: {stats['profit_factor']:.2f}x")

        if result['trades']:
            trades = result['trades']
            best = max(trades, key=lambda t: t['pnl_percent'])
            worst = min(trades, key=lambda t: t['pnl_percent'])
            print(f"\nBest Trade: {best['pnl_percent']:+.2f}%")
            print(f"Worst Trade: {worst['pnl_percent']:+.2f}%")
            print(f"Avg Bars: {sum(t['bars_held'] for t in trades) / len(trades):.0f}")

    def save_report(self):
        """Save report."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'type': 'Whistler Triple Containment Backtest',
            'data_source': 'Crypto.com MCP',
            'results': self.results
        }

        filename = f"backtest_whistler_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n✓ Report saved: {filename}")
        return filename

    def run(self):
        """Run backtest."""
        print("\n" + "=" * 70)
        print("🚀 Whistler Triple Containment Backtest")
        print("=" * 70)
        print(f"\n📊 Data: Crypto.com MCP")
        print(f"⚙️  Logic: Whistler entry/exit conditions")

        for symbol in ['ETHUSD', 'XRPUSD']:
            result = self.backtest_symbol(symbol)
            if result:
                self.results[symbol] = result
                self.print_results(result)

        self.save_report()

        print("\n" + "=" * 70)
        print("✅ Backtest Complete")
        print("=" * 70 + "\n")


def main():
    try:
        bt = WhistlerBacktester()
        bt.run()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
