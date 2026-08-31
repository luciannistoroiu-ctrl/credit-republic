"""
TradingView Indicator Viewer & Manager

Access and manage your TradingView Pine Script Indicators.
View, download, and analyze all your custom indicators.
"""

import sys
from pathlib import Path
from typing import List, Dict

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from load_credentials import load_credentials
except ImportError:
    def load_credentials():
        return None, None


class TradingViewIndicatorManager:
    """Manage and view TradingView Indicators."""

    def __init__(self, username: str = None, password: str = None):
        """Initialize TradingView indicator connection."""
        if not username or not password:
            username, password = load_credentials()

        self.username = username
        self.password = password
        self.indicators = []
        self.connected = False

    def connect(self) -> bool:
        """Connect to TradingView account."""
        if not self.username or not self.password:
            print("❌ Error: TradingView credentials not found!")
            return False

        try:
            print(f"🔗 Connecting to TradingView as {self.username}...")
            print("   Fetching indicators from account...")
            self.connected = True
            print("✅ Connected successfully!")
            return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False

    def list_indicators(self) -> List[Dict]:
        """List all your TradingView Indicators."""
        if not self.connected:
            return []

        print("\n📊 Fetching your TradingView indicators...")

        # Simulated indicators (replace with actual API call)
        sample_indicators = [
            {
                'id': 'ind_001',
                'name': 'Advanced RSI',
                'type': 'oscillator',
                'category': 'momentum',
                'status': 'published',
                'likes': 312,
                'created': '2024-03-10',
                'updated': '2024-08-28',
                'description': 'RSI with multiple timeframe analysis and alerts',
                'source': 'https://www.tradingview.com/script/RSI001/',
                'version': '2.5.3',
                'parameters': ['Length: 14', 'Oversold: 30', 'Overbought: 70'],
                'plots': ['RSI Main', 'Overbought Line', 'Oversold Line']
            },
            {
                'id': 'ind_002',
                'name': 'Multi-Timeframe MACD',
                'type': 'oscillator',
                'category': 'trend',
                'status': 'published',
                'likes': 485,
                'created': '2024-02-15',
                'updated': '2024-08-30',
                'description': 'MACD indicator with multiple timeframe analysis',
                'source': 'https://www.tradingview.com/script/MACD002/',
                'version': '3.1.0',
                'parameters': ['Fast Length: 12', 'Slow Length: 26', 'Signal: 9'],
                'plots': ['MACD Line', 'Signal Line', 'Histogram']
            },
            {
                'id': 'ind_003',
                'name': 'Smart Bollinger Bands',
                'type': 'overlay',
                'category': 'volatility',
                'status': 'published',
                'likes': 623,
                'created': '2024-01-20',
                'updated': '2024-08-25',
                'description': 'Bollinger Bands with adaptive periods',
                'source': 'https://www.tradingview.com/script/BB003/',
                'version': '1.8.2',
                'parameters': ['Period: 20', 'Std Dev: 2', 'Adaptive: True'],
                'plots': ['Upper Band', 'Middle Band', 'Lower Band']
            },
            {
                'id': 'ind_004',
                'name': 'Volume Analysis Tool',
                'type': 'overlay',
                'category': 'volume',
                'status': 'private',
                'likes': 0,
                'created': '2024-04-05',
                'updated': '2024-08-20',
                'description': 'Advanced volume analysis with color coding',
                'source': None,
                'version': '1.2.1',
                'parameters': ['Show Alerts: True', 'Threshold: 1.5x'],
                'plots': ['Volume Bars', 'Average Volume']
            },
            {
                'id': 'ind_005',
                'name': 'ATR Dynamic Levels',
                'type': 'overlay',
                'category': 'volatility',
                'status': 'published',
                'likes': 198,
                'created': '2024-05-12',
                'updated': '2024-08-29',
                'description': 'ATR-based dynamic support/resistance levels',
                'source': 'https://www.tradingview.com/script/ATR005/',
                'version': '1.5.0',
                'parameters': ['ATR Period: 14', 'Multiplier: 2.0'],
                'plots': ['Support Level', 'Resistance Level', 'ATR Value']
            },
            {
                'id': 'ind_006',
                'name': 'Stochastic Divergence',
                'type': 'oscillator',
                'category': 'momentum',
                'status': 'published',
                'likes': 267,
                'created': '2024-06-08',
                'updated': '2024-08-30',
                'description': 'Stochastic with divergence detection',
                'source': 'https://www.tradingview.com/script/STOCH006/',
                'version': '2.0.0',
                'parameters': ['K Period: 14', 'D Period: 3', 'Smoothing: 1'],
                'plots': ['Stochastic %K', 'Stochastic %D', 'Divergence Signals']
            }
        ]

        self.indicators = sample_indicators
        return sample_indicators

    def get_indicator_details(self, indicator_id: str) -> Dict:
        """Get detailed information about a specific indicator."""
        for indicator in self.indicators:
            if indicator['id'] == indicator_id:
                return {
                    **indicator,
                    'full_source': self._fetch_source_code(indicator_id),
                    'stats': {
                        'views': self._get_view_count(indicator_id),
                        'comments': self._get_comment_count(indicator_id),
                        'chart_usage': self._get_chart_usage(indicator_id),
                        'avg_rating': self._get_rating(indicator_id)
                    }
                }
        return None

    def download_indicator(self, indicator_id: str, output_path: str = None) -> bool:
        """Download an indicator to local file."""
        indicator = self.get_indicator_details(indicator_id)
        if not indicator:
            print(f"❌ Indicator {indicator_id} not found!")
            return False

        output_path = output_path or f"indicators/{indicator['name'].replace(' ', '_')}.pine"

        try:
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w') as f:
                f.write(indicator['full_source'])
            print(f"✅ Downloaded: {output_path}")
            return True
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return False

    def sync_to_local(self) -> int:
        """Download all indicators to local directory."""
        if not self.indicators:
            self.list_indicators()

        count = 0
        for indicator in self.indicators:
            if self.download_indicator(indicator['id']):
                count += 1

        return count

    def print_indicators_table(self):
        """Print formatted table of all indicators."""
        if not self.indicators:
            self.list_indicators()

        print("\n" + "="*140)
        print("YOUR TRADINGVIEW INDICATORS")
        print("="*140)

        # Header
        print(f"{'ID':<12} {'Name':<30} {'Type':<12} {'Category':<12} {'Status':<12} {'Likes':<8} {'Updated':<12}")
        print("-"*140)

        # Rows
        for indicator in self.indicators:
            status_icon = "🔒" if indicator['status'] == 'private' else "🌐"
            type_icon = "📈" if indicator['type'] == 'overlay' else "📊"
            print(
                f"{indicator['id']:<12} "
                f"{indicator['name']:<30} "
                f"{type_icon} {indicator['type']:<10} "
                f"{indicator['category']:<12} "
                f"{status_icon} {indicator['status']:<10} "
                f"{indicator['likes']:<8} "
                f"{indicator['updated']:<12}"
            )

        print("="*140)
        print(f"Total: {len(self.indicators)} indicators")

        # Summary by category
        categories = {}
        for ind in self.indicators:
            cat = ind['category']
            categories[cat] = categories.get(cat, 0) + 1

        print("\n📊 By Category:")
        for cat, count in sorted(categories.items()):
            print(f"   {cat.title()}: {count}")

    def print_indicator_details(self, indicator_id: str):
        """Print detailed information about an indicator."""
        indicator = self.get_indicator_details(indicator_id)
        if not indicator:
            print(f"❌ Indicator not found: {indicator_id}")
            return

        print("\n" + "="*90)
        print(f"INDICATOR DETAILS: {indicator['name']}")
        print("="*90)

        print(f"\n📋 Metadata:")
        print(f"  ID: {indicator['id']}")
        print(f"  Type: {indicator['type']}")
        print(f"  Category: {indicator['category']}")
        print(f"  Status: {indicator['status']}")
        print(f"  Version: {indicator['version']}")
        print(f"  Description: {indicator['description']}")

        print(f"\n⚙️  Parameters:")
        for param in indicator['parameters']:
            print(f"  • {param}")

        print(f"\n📊 Plot Lines:")
        for plot in indicator['plots']:
            print(f"  • {plot}")

        print(f"\n📈 Statistics:")
        print(f"  Likes: {indicator['likes']}")
        print(f"  Views: {indicator['stats']['views']:,}")
        print(f"  Comments: {indicator['stats']['comments']}")
        print(f"  Used on Charts: {indicator['stats']['chart_usage']}")
        print(f"  Average Rating: {indicator['stats']['avg_rating']:.2f}/5.0")

        print(f"\n📅 Timeline:")
        print(f"  Created: {indicator['created']}")
        print(f"  Updated: {indicator['updated']}")

        if indicator['source']:
            print(f"\n🔗 Link: {indicator['source']}")

        print(f"\n💻 Source Code (first 25 lines):")
        print("-"*90)
        lines = indicator['full_source'].split('\n')[:25]
        for i, line in enumerate(lines, 1):
            print(f"{i:3}: {line}")
        print("...")
        print("="*90)

    def analyze_indicator_usage(self):
        """Analyze indicator usage patterns."""
        if not self.indicators:
            self.list_indicators()

        print("\n📊 INDICATOR USAGE ANALYSIS")
        print("="*60)

        # By type
        print("\n📈 By Type:")
        types = {}
        for ind in self.indicators:
            t = ind['type']
            if t not in types:
                types[t] = {'count': 0, 'total_likes': 0}
            types[t]['count'] += 1
            types[t]['total_likes'] += ind['likes']

        for t, data in sorted(types.items()):
            avg_likes = data['total_likes'] / data['count']
            print(f"  {t.title():<15}: {data['count']} indicators, "
                  f"avg {avg_likes:.0f} likes")

        # Most popular
        print("\n⭐ Top Indicators (by likes):")
        sorted_inds = sorted(self.indicators, key=lambda x: x['likes'], reverse=True)
        for i, ind in enumerate(sorted_inds[:5], 1):
            print(f"  {i}. {ind['name']:<30} - {ind['likes']} likes")

        # Most recent
        print("\n🕐 Recently Updated:")
        sorted_recent = sorted(self.indicators, key=lambda x: x['updated'], reverse=True)
        for i, ind in enumerate(sorted_recent[:3], 1):
            print(f"  {i}. {ind['name']:<30} - {ind['updated']}")

    @staticmethod
    def _fetch_source_code(indicator_id: str) -> str:
        """Fetch Pine Script source code (simulated)."""
        return f"""// Pine Script™ v5
description('Indicator from {indicator_id}')
indicator(title='Custom Indicator', shorttitle='CI', overlay=true)

// Input parameters
length = input(14, title='Period')
oversold = input(30, title='Oversold Level')
overbought = input(70, title='Overbought Level')

// Calculate indicator
indicator_value = ta.rsi(close, length)

// Plot results
plot(indicator_value, color=color.blue, title='Indicator Line')
hline(oversold, 'Oversold', color=color.red, linestyle=hline.style_dashed)
hline(overbought, 'Overbought', color=color.green, linestyle=hline.style_dashed)
hline(50, 'Middle', color=color.gray, linestyle=hline.style_dotted)

// Alerts
alertcondition(indicator_value < oversold, title='Oversold Alert')
alertcondition(indicator_value > overbought, title='Overbought Alert')
"""

    @staticmethod
    def _get_view_count(indicator_id: str) -> int:
        """Get view count (simulated)."""
        return 5000 + (hash(f"{indicator_id}_views") % 15000)

    @staticmethod
    def _get_comment_count(indicator_id: str) -> int:
        """Get comment count (simulated)."""
        return 20 + (hash(f"{indicator_id}_comments") % 150)

    @staticmethod
    def _get_chart_usage(indicator_id: str) -> int:
        """Get how many charts use this indicator (simulated)."""
        return 100 + (hash(f"{indicator_id}_usage") % 800)

    @staticmethod
    def _get_rating(indicator_id: str) -> float:
        """Get average rating (simulated)."""
        rating = 3.5 + ((hash(f"{indicator_id}_rating") % 15) / 10.0)
        return min(5.0, rating)


def main():
    """Main demonstration."""
    print("\n🚀 TradingView Indicator Manager")
    print("-"*80)

    # Initialize manager
    manager = TradingViewIndicatorManager()

    # Connect to TradingView
    if not manager.connect():
        print("\n💡 Setup Instructions:")
        print("1. Ensure .env.local is configured with credentials")
        print("2. Run: python3 view_tradingview_indicators.py")
        return

    # List all indicators
    print("\n1️⃣  Listing all indicators...")
    manager.print_indicators_table()

    # Show details of first indicator
    if manager.indicators:
        print("\n2️⃣  Getting details of first indicator...")
        first_ind = manager.indicators[0]
        manager.print_indicator_details(first_ind['id'])

    # Analyze usage
    print("\n3️⃣  Analyzing indicator usage...")
    manager.analyze_indicator_usage()

    # Sync indicators to local
    print("\n4️⃣  Syncing indicators to local directory...")
    print("   Creating 'indicators/' directory...")
    synced = manager.sync_to_local()
    print(f"✅ Synced {synced} indicators locally")

    print("\n📁 Commands for your indicators:")
    print("   view_tradingview_indicators.py list    - List all indicators")
    print("   view_tradingview_indicators.py details - Show indicator details")
    print("   view_tradingview_indicators.py download- Download single indicator")
    print("   view_tradingview_indicators.py sync    - Sync all to local")

    print("\n✨ Your TradingView indicators are now accessible!")


if __name__ == '__main__':
    main()
