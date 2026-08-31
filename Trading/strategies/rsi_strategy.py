"""
RSI-Based Trading Strategy

Simple strategy using RSI (Relative Strength Index) to generate buy/sell signals.
Demonstrates how the trading system works end-to-end.
"""

from template_strategy import TradingStrategy


class RSIStrategy(TradingStrategy):
    """RSI-based strategy with overbought/oversold signals."""

    def __init__(self, symbol, timeframe='1h', rsi_period=14,
                 oversold_level=30, overbought_level=70):
        super().__init__(name='RSI Strategy', symbol=symbol, timeframe=timeframe)
        self.rsi_period = rsi_period
        self.oversold_level = oversold_level
        self.overbought_level = overbought_level
        self.price_history = []
        self.rsi_values = []

    def calculate_rsi(self, prices):
        """Calculate RSI from price data."""
        if len(prices) < self.rsi_period:
            return None

        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        seed = deltas[:self.rsi_period]
        up = sum(d for d in seed if d > 0) / self.rsi_period
        down = sum(-d for d in seed if d < 0) / self.rsi_period

        for d in deltas[self.rsi_period:]:
            if d > 0:
                up = (up * (self.rsi_period - 1) + d) / self.rsi_period
                down = down * (self.rsi_period - 1) / self.rsi_period
            else:
                up = up * (self.rsi_period - 1) / self.rsi_period
                down = (down * (self.rsi_period - 1) - d) / self.rsi_period

        rs = up / down if down != 0 else 0
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def analyze_market(self, data):
        """
        Analyze market data using RSI indicator.

        Args:
            data: dict with 'prices' (list of close prices) and 'volume'

        Returns:
            dict: Trading signal with action and confidence
        """
        prices = data.get('prices', [])
        if not prices:
            return {'action': 'hold', 'confidence': 0, 'reason': 'No price data'}

        self.price_history.extend(prices)
        rsi = self.calculate_rsi(self.price_history[-50:])

        if rsi is None:
            return {'action': 'hold', 'confidence': 0, 'reason': 'Insufficient data'}

        self.rsi_values.append(rsi)

        # Generate signals based on RSI levels
        if rsi < self.oversold_level:
            confidence = (self.oversold_level - rsi) / self.oversold_level
            return {
                'action': 'buy',
                'confidence': min(confidence, 1.0),
                'rsi': rsi,
                'reason': f'Oversold (RSI: {rsi:.2f})'
            }
        elif rsi > self.overbought_level:
            confidence = (rsi - self.overbought_level) / (100 - self.overbought_level)
            return {
                'action': 'sell',
                'confidence': min(confidence, 1.0),
                'rsi': rsi,
                'reason': f'Overbought (RSI: {rsi:.2f})'
            }
        else:
            return {
                'action': 'hold',
                'confidence': 0.5,
                'rsi': rsi,
                'reason': f'Neutral (RSI: {rsi:.2f})'
            }

    def execute_trade(self, signal):
        """Execute trade with confidence weighting."""
        if signal['confidence'] > 0.6:
            super().execute_trade(signal)
            return {
                'status': 'executed',
                'action': signal['action'],
                'confidence': signal['confidence'],
                'reason': signal.get('reason', '')
            }
        else:
            return {
                'status': 'skipped',
                'reason': 'Low confidence signal'
            }

    def get_summary(self):
        """Get strategy summary with stats."""
        metrics = self.get_performance_metrics()
        return {
            'strategy': self.name,
            'symbol': self.symbol,
            'timeframe': self.timeframe,
            'total_trades': metrics['total_trades'],
            'positions_open': len(self.positions),
            'rsi_current': self.rsi_values[-1] if self.rsi_values else None,
            'price_current': self.price_history[-1] if self.price_history else None,
        }


# Example usage
if __name__ == '__main__':
    # Create strategy instance
    strategy = RSIStrategy(symbol='AAPL', timeframe='1h')

    # Simulate market data
    sample_data = {
        'prices': [150.0, 150.5, 151.0, 150.8, 150.2, 149.5, 148.9, 149.2, 150.1, 150.8],
        'volume': [1000000, 1200000, 900000, 1100000, 1300000, 1400000, 1100000, 1000000, 900000, 1200000]
    }

    # Analyze and execute
    signal = strategy.analyze_market(sample_data)
    print(f"Signal: {signal}")

    execution = strategy.execute_trade(signal)
    print(f"Execution: {execution}")

    summary = strategy.get_summary()
    print(f"\nStrategy Summary:")
    for key, value in summary.items():
        print(f"  {key}: {value}")
