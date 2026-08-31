# Conectarea la TradingView

## 1. Instalează MCP Server
```bash
pip install tradingview-mcp-server
# deja instalat ✓
```

## 2. Configurare Cont TradingView

### A. Genereaza API Key (dacă este necesar)
1. Mergi la https://www.tradingview.com/settings/api/
2. Creaza o nouă cheie API
3. Salveaza-o în siguranță (o vei folosi pentru autentificare)

### B. Configureaza Credentialele

Creaza fișierul `.env` în directorul Trading:
```bash
TRADINGVIEW_USERNAME=your_username
TRADINGVIEW_PASSWORD=your_password
# SAU dacă folosești API key
TRADINGVIEW_API_KEY=your_api_key
```

## 3. Porneste MCP Server

```bash
# Cu stdio transport (pentru Claude)
tradingview-mcp stdio

# SAU cu HTTP transport
tradingview-mcp streamable-http --host localhost --port 8000
```

## 4. Configurare Claude Integration

Adauga în `.claude/settings.json`:
```json
{
  "mcpServers": {
    "tradingview": {
      "command": "tradingview-mcp",
      "args": ["stdio"],
      "env": {
        "TRADINGVIEW_USERNAME": "your_username",
        "TRADINGVIEW_PASSWORD": "your_password"
      }
    }
  }
}
```

## 5. Ce Poți Face

Odată conectat, poți:

### 📊 Screener Access
- Acces la TradingView Screener
- Filtrare instrumente după criterii tehnice
- Analiză fundamentală și tehnică

### 📈 Market Data
- OHLCV (Open, High, Low, Close, Volume) data
- Timframes: 1m, 5m, 15m, 1h, 4h, daily, weekly, monthly
- Real-time updates

### 🔧 Technical Analysis
- 30+ indicatori pre-calculati
- RSI, MACD, Bollinger Bands, Moving Averages, etc.
- Custom indicator support

### 📉 Backtesting
- Test strategii pe date istorice
- Walk-forward analysis
- Performance metrics

## 6. Example - Accesare Date

```python
from tradingview_mcp_server import client

# Conecteaza
client = client.connect(username="your_user", password="your_pass")

# Prelucrare date
data = client.get_screener_data(
    market="stocks",
    filter="[{\"left\": \"Perf.1M\", \"operation\": \"above\", \"right\": 0}]"
)

# Analiza
for instrument in data['data']:
    print(f"Symbol: {instrument['s']}, Perf 1M: {instrument['Perf.1M']}%")
```

## 7. Securitate

⚠️ **IMPORTANT:**
- Niciodată nu comite `.env` fișiere la Git
- Foloseşte environment variables pentru credentiale
- Rotire regulară a API keys
- Foloseste 2FA pe contul TradingView

## 8. Troubleshooting

**"Connection refused"**
```bash
# Verifica dacă MCP server rulează
tradingview-mcp --help
```

**"Invalid credentials"**
- Verifica username/password
- Asigura-te că contul este activ
- Verifica dacă e nevoie de 2FA setup

**"No data returned"**
- Verifica conexiunea internet
- Asigura-te că TradingView API e disponibil
- Verifica dacă filtrul screener este valid

## 9. Resurse Utile

- [TradingView API Docs](https://www.tradingview.com/pine_script_docs/)
- [MCP Server GitHub](https://github.com/your-org/tradingview-mcp-server)
- [Trading Project README](./README.md)
