# Trading Project Configuration

# Market Data Settings
MARKET_DATA = {
    'sources': ['tradingview', 'yahoo_finance'],
    'update_frequency': '1h',
    'default_timeframe': '1h',
}

# Analysis Settings
TECHNICAL_ANALYSIS = {
    'enabled_indicators': [
        'RSI', 'MACD', 'Bollinger Bands', 'Moving Averages',
        'Stochastic', 'ATR', 'ADX', 'Volume Profile'
    ],
    'lookback_period': 100,
}

# Backtesting Settings
BACKTEST = {
    'initial_capital': 10000,
    'commission': 0.001,  # 0.1%
    'slippage': 0.0005,   # 0.05%
    'walk_forward_period': '1M',
}

# Logging & Monitoring
LOGGING = {
    'level': 'INFO',
    'format': 'json',
    'path': 'data/logs/',
}

# Sentiment Analysis
SENTIMENT = {
    'enabled': True,
    'sources': ['news_feeds', 'social_media'],
    'update_frequency': '30m',
}
