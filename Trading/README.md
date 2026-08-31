# Trading Project

Advanced trading intelligence and analysis using TradingView screener integration.

## Features

- Real-time market data via TradingView Screener
- Technical analysis with 30+ indicators
- Trade backtesting with walk-forward analysis
- Market sentiment tracking
- Performance monitoring with equity curves
- Integration with Yahoo Finance data

## Setup

### Prerequisites
- Python 3.11+
- tradingview-mcp-server installed

### Configuration

The project uses MCP (Model Context Protocol) for seamless Claude integration.

## Project Structure

```
Trading/
├── data/           # Market data and logs
├── strategies/     # Trading strategies
├── analysis/       # Analysis notebooks and scripts
├── config/         # Configuration files
└── README.md       # This file
```

## Usage

Start the MCP server:
```bash
tradingview-mcp stdio
```

Then use Claude to analyze markets, backtest strategies, and track performance.
