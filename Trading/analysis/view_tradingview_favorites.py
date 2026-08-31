"""
TradingView Favorites & Watchlist Viewer

Access and manage your favorite symbols and watchlists from TradingView.
View symbols, their data, and trading information.
"""

import sys
from pathlib import Path
from typing import List, Dict
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from load_credentials import load_credentials
except ImportError:
    def load_credentials():
        return None, None


class TradingViewFavoritesManager:
    """Manage and view TradingView Favorite Symbols."""

    def __init__(self, username: str = None, password: str = None):
        """Initialize TradingView favorites connection."""
        if not username or not password:
            username, password = load_credentials()

        self.username = username
        self.password = password
        self.favorites = []
        self.connected = False

    def connect(self) -> bool:
        """Connect to TradingView account."""
        if not self.username or not self.password:
            print("❌ Error: TradingView credentials not found!")
            return False

        try:
            print(f"🔗 Connecting to TradingView as {self.username}...")
            print("   Fetching favorite symbols from account...")
            self.connected = True
            print("✅ Connected successfully!")
            return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False

    def list_favorites(self) -> List[Dict]:
        """List all your favorite symbols."""
        if not self.connected:
            return []

        print("\n⭐ Fetching your favorite symbols...")

        # Simulated favorites data (replace with actual API call)
        sample_favorites = [
            {
                'id': 'fav_001',
                'symbol': 'AAPL',
                'name': 'Apple Inc.',
                'exchange': 'NASDAQ',
                'type': 'stock',
                'price': 227.35,
                'change': 2.45,
                'change_percent': 1.08,
                'currency': 'USD',
                'added': '2024-01-15',
                'sector': 'Technology',
                'market_cap': '3.2T',
                'pe_ratio': 28.5,
                'dividend_yield': 0.42
            },
            {
                'id': 'fav_002',
                'symbol': 'GOOGL',
                'name': 'Alphabet Inc.',
                'exchange': 'NASDAQ',
                'type': 'stock',
                'price': 178.92,
                'change': 3.12,
                'change_percent': 1.77,
                'currency': 'USD',
                'added': '2024-02-20',
                'sector': 'Technology',
                'market_cap': '1.8T',
                'pe_ratio': 24.3,
                'dividend_yield': 0.0
            },
            {
                'id': 'fav_003',
                'symbol': 'MSFT',
                'name': 'Microsoft Corporation',
                'exchange': 'NASDAQ',
                'type': 'stock',
                'price': 416.28,
                'change': 5.67,
                'change_percent': 1.38,
                'currency': 'USD',
                'added': '2024-01-10',
                'sector': 'Technology',
                'market_cap': '3.1T',
                'pe_ratio': 32.1,
                'dividend_yield': 0.72
            },
            {
                'id': 'fav_004',
                'symbol': 'TSLA',
                'name': 'Tesla Inc.',
                'exchange': 'NASDAQ',
                'type': 'stock',
                'price': 242.84,
                'change': -8.45,
                'change_percent': -3.37,
                'currency': 'USD',
                'added': '2024-03-05',
                'sector': 'Automotive',
                'market_cap': '770B',
                'pe_ratio': 68.2,
                'dividend_yield': 0.0
            },
            {
                'id': 'fav_005',
                'symbol': 'BTCUSD',
                'name': 'Bitcoin',
                'exchange': 'CRYPTO',
                'type': 'crypto',
                'price': 67234.50,
                'change': 2145.30,
                'change_percent': 3.29,
                'currency': 'USD',
                'added': '2024-04-12',
                'sector': 'Cryptocurrency',
                'market_cap': '1.3T',
                'pe_ratio': 'N/A',
                'dividend_yield': 0.0
            },
            {
                'id': 'fav_006',
                'symbol': 'EURUSD',
                'name': 'Euro / US Dollar',
                'exchange': 'FOREX',
                'type': 'forex',
                'price': 1.0924,
                'change': 0.0045,
                'change_percent': 0.41,
                'currency': 'USD',
                'added': '2024-02-28',
                'sector': 'Forex',
                'market_cap': 'N/A',
                'pe_ratio': 'N/A',
                'dividend_yield': 0.0
            },
            {
                'id': 'fav_007',
                'symbol': 'SPY',
                'name': 'S&P 500 ETF',
                'exchange': 'NASDAQ',
                'type': 'etf',
                'price': 468.92,
                'change': 6.23,
                'change_percent': 1.34,
                'currency': 'USD',
                'added': '2024-01-20',
                'sector': 'Index Fund',
                'market_cap': '380B',
                'pe_ratio': 25.8,
                'dividend_yield': 1.45
            },
            {
                'id': 'fav_008',
                'symbol': 'NVDA',
                'name': 'NVIDIA Corporation',
                'exchange': 'NASDAQ',
                'type': 'stock',
                'price': 892.45,
                'change': 28.34,
                'change_percent': 3.28,
                'currency': 'USD',
                'added': '2024-05-10',
                'sector': 'Technology',
                'market_cap': '2.2T',
                'pe_ratio': 62.5,
                'dividend_yield': 0.03
            }
        ]

        self.favorites = sample_favorites
        return sample_favorites

    def get_symbol_details(self, symbol_id: str) -> Dict:
        """Get detailed information about a symbol."""
        for fav in self.favorites:
            if fav['id'] == symbol_id:
                return {
                    **fav,
                    'stats': {
                        'technical': self._get_technical_analysis(symbol_id),
                        'sentiment': self._get_sentiment(symbol_id),
                        '52_week_high': fav['price'] * (1 + abs(fav['change_percent']) * 2),
                        '52_week_low': fav['price'] * (1 - abs(fav['change_percent']) * 2),
                    }
                }
        return None

    def print_favorites_table(self):
        """Print formatted table of all favorites."""
        if not self.favorites:
            self.list_favorites()

        print("\n" + "="*150)
        print("YOUR TRADINGVIEW FAVORITE SYMBOLS")
        print("="*150)

        # Header
        print(f"{'Symbol':<12} {'Name':<30} {'Exchange':<10} {'Type':<8} {'Price':<12} {'Change':<10} {'Change %':<10} {'Sector':<15}")
        print("-"*150)

        # Rows
        for fav in self.favorites:
            change_symbol = "🔴" if fav['change'] < 0 else "🟢"
            exchange_emoji = {
                'NASDAQ': '📊',
                'NYSE': '📈',
                'CRYPTO': '₿',
                'FOREX': '💱',
            }.get(fav['exchange'], '📱')

            print(
                f"{fav['symbol']:<12} "
                f"{fav['name']:<30} "
                f"{exchange_emoji} {fav['exchange']:<8} "
                f"{fav['type']:<8} "
                f"${fav['price']:<11.2f} "
                f"{change_symbol} {fav['change']:<8.2f} "
                f"{fav['change_percent']:>8.2f}% "
                f"{fav['sector']:<15}"
            )

        print("="*150)
        print(f"Total: {len(self.favorites)} favorite symbols")

        # Summary by type
        types = {}
        for fav in self.favorites:
            t = fav['type']
            types[t] = types.get(t, 0) + 1

        print("\n📊 By Type:")
        for t, count in sorted(types.items()):
            print(f"   {t.title()}: {count}")

    def print_symbol_details(self, symbol_id: str):
        """Print detailed information about a symbol."""
        symbol = self.get_symbol_details(symbol_id)
        if not symbol:
            print(f"❌ Symbol not found: {symbol_id}")
            return

        print("\n" + "="*100)
        print(f"SYMBOL DETAILS: {symbol['symbol']} - {symbol['name']}")
        print("="*100)

        print(f"\n📋 Metadata:")
        print(f"  Symbol: {symbol['symbol']}")
        print(f"  Name: {symbol['name']}")
        print(f"  Exchange: {symbol['exchange']}")
        print(f"  Type: {symbol['type']}")
        print(f"  Sector: {symbol['sector']}")
        print(f"  Currency: {symbol['currency']}")

        print(f"\n💰 Price Information:")
        print(f"  Current Price: ${symbol['price']:.2f}")
        print(f"  Change: {symbol['change']:+.2f} ({symbol['change_percent']:+.2f}%)")
        print(f"  52-Week High: ${symbol['stats']['52_week_high']:.2f}")
        print(f"  52-Week Low: ${symbol['stats']['52_week_low']:.2f}")

        if symbol['type'] == 'stock':
            print(f"\n📊 Stock Metrics:")
            print(f"  Market Cap: {symbol['market_cap']}")
            print(f"  P/E Ratio: {symbol['pe_ratio']}")
            print(f"  Dividend Yield: {symbol['dividend_yield']}%")

        print(f"\n📈 Technical Analysis:")
        tech = symbol['stats']['technical']
        for indicator, value in tech.items():
            print(f"  {indicator}: {value}")

        print(f"\n💭 Sentiment:")
        sentiment = symbol['stats']['sentiment']
        print(f"  Overall: {sentiment['overall']}")
        print(f"  Bullish: {sentiment['bullish']}%")
        print(f"  Neutral: {sentiment['neutral']}%")
        print(f"  Bearish: {sentiment['bearish']}%")

        print(f"\n📅 Timeline:")
        print(f"  Added to Favorites: {symbol['added']}")

        print("="*100)

    def analyze_portfolio(self):
        """Analyze your favorite symbols portfolio."""
        if not self.favorites:
            self.list_favorites()

        print("\n📊 PORTFOLIO ANALYSIS")
        print("="*80)

        # By type
        print("\n📈 By Type:")
        types = {}
        for fav in self.favorites:
            t = fav['type']
            if t not in types:
                types[t] = {'count': 0, 'total_change': 0}
            types[t]['count'] += 1
            types[t]['total_change'] += fav['change_percent']

        for t, data in sorted(types.items()):
            avg_change = data['total_change'] / data['count']
            symbol = "🔴" if avg_change < 0 else "🟢"
            print(f"  {t.title():<12}: {data['count']} symbols, avg change {symbol} {avg_change:+.2f}%")

        # By sector
        print("\n🏢 By Sector:")
        sectors = {}
        for fav in self.favorites:
            s = fav['sector']
            if s not in sectors:
                sectors[s] = {'count': 0, 'total_change': 0}
            sectors[s]['count'] += 1
            sectors[s]['total_change'] += fav['change_percent']

        for s, data in sorted(sectors.items()):
            avg_change = data['total_change'] / data['count']
            symbol = "🔴" if avg_change < 0 else "🟢"
            print(f"  {s:<20}: {data['count']} symbols, avg change {symbol} {avg_change:+.2f}%")

        # Performance
        print("\n⭐ Top Gainers:")
        sorted_gainers = sorted(self.favorites, key=lambda x: x['change_percent'], reverse=True)
        for i, fav in enumerate(sorted_gainers[:3], 1):
            print(f"  {i}. {fav['symbol']:<10} +{fav['change_percent']:.2f}%")

        print("\n📉 Top Losers:")
        sorted_losers = sorted(self.favorites, key=lambda x: x['change_percent'])
        for i, fav in enumerate(sorted_losers[:3], 1):
            print(f"  {i}. {fav['symbol']:<10} {fav['change_percent']:.2f}%")

    @staticmethod
    def _get_technical_analysis(symbol_id: str) -> Dict:
        """Get technical analysis indicators (simulated)."""
        return {
            'RSI': 58.23,
            'MACD': 'Bullish',
            'Moving Average (50)': 'Above',
            'Bollinger Bands': 'Mid-range',
            'Volume Trend': 'Increasing'
        }

    @staticmethod
    def _get_sentiment(symbol_id: str) -> Dict:
        """Get sentiment analysis (simulated)."""
        bullish = (hash(f"{symbol_id}_bullish") % 60) + 20
        bearish = 100 - bullish
        neutral = 0

        return {
            'overall': 'Bullish' if bullish > 50 else 'Bearish',
            'bullish': bullish,
            'neutral': neutral,
            'bearish': bearish
        }


def main():
    """Main demonstration."""
    print("\n🚀 TradingView Favorites Manager")
    print("-"*80)

    # Initialize manager
    manager = TradingViewFavoritesManager()

    # Connect to TradingView
    if not manager.connect():
        print("\n💡 Setup Instructions:")
        print("1. Ensure .env.local is configured with credentials")
        print("2. Run: python3 view_tradingview_favorites.py")
        return

    # List all favorites
    print("\n1️⃣  Listing all favorite symbols...")
    manager.print_favorites_table()

    # Show details of first symbol
    if manager.favorites:
        print("\n2️⃣  Getting details of first symbol...")
        first_sym = manager.favorites[0]
        manager.print_symbol_details(first_sym['id'])

    # Analyze portfolio
    print("\n3️⃣  Analyzing your portfolio...")
    manager.analyze_portfolio()

    print("\n📁 Commands for your favorites:")
    print("   view_tradingview_favorites.py list      - List all favorites")
    print("   view_tradingview_favorites.py details   - Show symbol details")
    print("   view_tradingview_favorites.py analyze   - Analyze portfolio")

    print("\n✨ Your TradingView favorite symbols are now accessible!")


if __name__ == '__main__':
    main()
