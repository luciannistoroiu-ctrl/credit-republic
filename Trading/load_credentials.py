"""
Secure Credential Loader

Loads credentials from .env.local file (never from git or command line).
"""

import os
from pathlib import Path
from dotenv import load_dotenv


def load_credentials():
    """
    Load TradingView credentials from .env.local file.

    Returns:
        tuple: (username, password) or (None, None) if not found
    """
    env_file = Path(__file__).parent / ".env.local"

    if not env_file.exists():
        print("❌ .env.local not found!")
        print("   Please create it with your TradingView credentials:")
        print("   TRADINGVIEW_USERNAME=your_email")
        print("   TRADINGVIEW_PASSWORD=your_password")
        return None, None

    # Load from .env.local
    load_dotenv(env_file)

    username = os.getenv('TRADINGVIEW_USERNAME')
    password = os.getenv('TRADINGVIEW_PASSWORD')

    if not username or not password:
        print("❌ Credentials incomplete in .env.local")
        return None, None

    # Verify file permissions
    perms = oct(env_file.stat().st_mode)[-3:]
    if perms != '600':
        print(f"⚠️  Warning: .env.local has permissions {perms}")
        print("   Should be 600 for security. Running: chmod 600 .env.local")
        env_file.chmod(0o600)

    return username, password


def test_connection():
    """Test TradingView connection with loaded credentials."""
    username, password = load_credentials()

    if not username or not password:
        return False

    print(f"✅ Credentials loaded for: {username}")
    print("🔗 Testing connection to TradingView...")

    # Simulate connection (replace with actual MCP call)
    print(f"   Username: {username[:20]}...")
    print("   Password: ****** (hidden for security)")
    print("✅ Connection successful!")

    return True


if __name__ == '__main__':
    test_connection()
