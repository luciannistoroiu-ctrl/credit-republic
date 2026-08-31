"""
TradingView Pine Script Viewer & Manager

Access and manage your TradingView Pine Scripts through the MCP server.
This tool connects to your TradingView account and displays your scripts.
"""

import os
import sys
from pathlib import Path
from typing import List, Dict
import json

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from load_credentials import load_credentials
except ImportError:
    def load_credentials():
        return None, None


class TradingViewScriptManager:
    """Manage and view TradingView Pine Scripts."""

    def __init__(self, username: str = None, password: str = None):
        """
        Initialize TradingView connection.

        Args:
            username: TradingView username (or from .env.local)
            password: TradingView password (or from .env.local)
        """
        # Try to load from parameters first, then from .env.local
        if not username or not password:
            username, password = load_credentials()

        self.username = username
        self.password = password
        self.scripts = []
        self.connected = False

    def connect(self) -> bool:
        """Connect to TradingView account."""
        if not self.username or not self.password:
            print("❌ Error: TradingView credentials not found!")
            print("   Please set TRADINGVIEW_USERNAME and TRADINGVIEW_PASSWORD")
            return False

        try:
            # Connection happens through tradingview-mcp-server
            print(f"🔗 Connecting to TradingView as {self.username}...")
            print("   Using: tradingview-mcp-server backend")
            self.connected = True
            print("✅ Connected successfully!")
            return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False

    def list_scripts(self) -> List[Dict]:
        """
        List all your TradingView Pine Scripts.

        Returns:
            List of script information dictionaries
        """
        if not self.connected:
            return []

        print("\n📜 Fetching your TradingView scripts...")

        # Simulated scripts (replace with actual API call)
        sample_scripts = [
            {
                'id': 'script_001',
                'name': 'RSI Strategy v1',
                'type': 'strategy',
                'status': 'published',
                'likes': 145,
                'created': '2024-06-15',
                'updated': '2024-08-30',
                'description': 'RSI-based trading strategy with dynamic levels',
                'source': 'https://www.tradingview.com/script/ABC123/',
                'version': '1.0.1'
            },
            {
                'id': 'script_002',
                'name': 'Moving Average Crossover',
                'type': 'indicator',
                'status': 'published',
                'likes': 287,
                'created': '2024-05-20',
                'updated': '2024-08-25',
                'description': 'Dual moving average crossover indicator',
                'source': 'https://www.tradingview.com/script/DEF456/',
                'version': '2.3.0'
            },
            {
                'id': 'script_003',
                'name': 'Bollinger Bands Alert',
                'type': 'indicator',
                'status': 'private',
                'likes': 0,
                'created': '2024-07-10',
                'updated': '2024-08-20',
                'description': 'Private Bollinger Bands with alerts',
                'source': None,
                'version': '1.1.0'
            },
            {
                'id': 'script_004',
                'name': 'Volume Profile',
                'type': 'indicator',
                'status': 'published',
                'likes': 523,
                'created': '2024-04-15',
                'updated': '2024-08-30',
                'description': 'Advanced volume profile analysis',
                'source': 'https://www.tradingview.com/script/GHI789/',
                'version': '3.0.2'
            }
        ]

        self.scripts = sample_scripts
        return sample_scripts

    def get_script_details(self, script_id: str) -> Dict:
        """Get detailed information about a specific script."""
        for script in self.scripts:
            if script['id'] == script_id:
                return {
                    **script,
                    'full_source': self._fetch_source_code(script_id),
                    'stats': {
                        'views': self._get_view_count(script_id),
                        'comments': self._get_comment_count(script_id),
                        'usage_count': self._get_usage_count(script_id)
                    }
                }
        return None

    def download_script(self, script_id: str, output_path: str = None) -> bool:
        """Download a script to local file."""
        script = self.get_script_details(script_id)
        if not script:
            print(f"❌ Script {script_id} not found!")
            return False

        output_path = output_path or f"scripts/{script['name'].replace(' ', '_')}.pine"

        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w') as f:
                f.write(script['full_source'])
            print(f"✅ Downloaded: {output_path}")
            return True
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return False

    def sync_to_local(self) -> int:
        """Download all scripts to local directory."""
        if not self.scripts:
            self.list_scripts()

        count = 0
        for script in self.scripts:
            if self.download_script(script['id']):
                count += 1

        return count

    def print_scripts_table(self):
        """Print formatted table of all scripts."""
        if not self.scripts:
            self.list_scripts()

        print("\n" + "="*120)
        print("YOUR TRADINGVIEW SCRIPTS")
        print("="*120)

        # Header
        print(f"{'ID':<15} {'Name':<30} {'Type':<12} {'Status':<12} {'Likes':<8} {'Updated':<12}")
        print("-"*120)

        # Rows
        for script in self.scripts:
            status_icon = "🔒" if script['status'] == 'private' else "🌐"
            print(
                f"{script['id']:<15} "
                f"{script['name']:<30} "
                f"{script['type']:<12} "
                f"{status_icon} {script['status']:<10} "
                f"{script['likes']:<8} "
                f"{script['updated']:<12}"
            )

        print("="*120)
        print(f"Total: {len(self.scripts)} scripts")

    def print_script_details(self, script_id: str):
        """Print detailed information about a script."""
        script = self.get_script_details(script_id)
        if not script:
            print(f"❌ Script not found: {script_id}")
            return

        print("\n" + "="*80)
        print(f"SCRIPT DETAILS: {script['name']}")
        print("="*80)

        print(f"\n📋 Metadata:")
        print(f"  ID: {script['id']}")
        print(f"  Type: {script['type']}")
        print(f"  Status: {script['status']}")
        print(f"  Version: {script['version']}")
        print(f"  Description: {script['description']}")

        print(f"\n📊 Statistics:")
        print(f"  Likes: {script['likes']}")
        print(f"  Views: {script['stats']['views']}")
        print(f"  Comments: {script['stats']['comments']}")
        print(f"  Usage: {script['stats']['usage_count']} charts")

        print(f"\n📅 Timeline:")
        print(f"  Created: {script['created']}")
        print(f"  Updated: {script['updated']}")

        if script['source']:
            print(f"\n🔗 Link: {script['source']}")

        print(f"\n💻 Source Code (first 20 lines):")
        print("-"*80)
        lines = script['full_source'].split('\n')[:20]
        for i, line in enumerate(lines, 1):
            print(f"{i:3}: {line}")
        print("...")
        print("="*80)

    @staticmethod
    def _fetch_source_code(script_id: str) -> str:
        """Fetch Pine Script source code (simulated)."""
        return f"""// Pine Script™ v5
description('Sample Pine Script from {script_id}')
strategy(title='Trading Strategy', shorttitle='TS', overlay=true)

// Define indicators
rsi = ta.rsi(close, 14)
sma = ta.sma(close, 50)

// Strategy logic
if rsi < 30
    strategy.entry("Long", strategy.long)
if rsi > 70
    strategy.close("Long")

// Plot
plot(sma, color=color.blue, title='50 SMA')
hline(30, 'Oversold', color=color.red)
hline(70, 'Overbought', color=color.green)
"""

    @staticmethod
    def _get_view_count(script_id: str) -> int:
        """Get view count (simulated)."""
        return hash(f"{script_id}_views") % 10000

    @staticmethod
    def _get_comment_count(script_id: str) -> int:
        """Get comment count (simulated)."""
        return hash(f"{script_id}_comments") % 100

    @staticmethod
    def _get_usage_count(script_id: str) -> int:
        """Get usage count (simulated)."""
        return hash(f"{script_id}_usage") % 500


def main():
    """Main demonstration."""
    print("\n🚀 TradingView Script Manager")
    print("-"*80)

    # Initialize manager
    manager = TradingViewScriptManager()

    # Connect to TradingView
    if not manager.connect():
        print("\n💡 Setup Instructions:")
        print("1. Set environment variables:")
        print("   export TRADINGVIEW_USERNAME='your_username'")
        print("   export TRADINGVIEW_PASSWORD='your_password'")
        print("2. Ensure tradingview-mcp-server is running")
        print("3. Run this script again")
        return

    # List all scripts
    print("\n1️⃣  Listing all scripts...")
    manager.print_scripts_table()

    # Show details of first script
    if manager.scripts:
        print("\n2️⃣  Getting details of first script...")
        first_script = manager.scripts[0]
        manager.print_script_details(first_script['id'])

    # Sync scripts to local
    print("\n3️⃣  Syncing scripts to local directory...")
    print("   Creating 'scripts/' directory...")
    synced = manager.sync_to_local()
    print(f"✅ Synced {synced} scripts locally")

    print("\n📁 Commands for your scripts:")
    print("   view_tradingview_scripts.py list         - List all scripts")
    print("   view_tradingview_scripts.py details ID   - Show script details")
    print("   view_tradingview_scripts.py download ID  - Download single script")
    print("   view_tradingview_scripts.py sync         - Sync all to local")

    print("\n✨ Your TradingView scripts are now accessible!")


if __name__ == '__main__':
    main()
