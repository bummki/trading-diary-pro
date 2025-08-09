import { useState, useCallback, useEffect } from 'react'

// Binance API base URL
const BINANCE_API_BASE = 'https://api.binance.com/api/v3'

// List of popular coins supported by the app.
// The `id` property corresponds to the internal identifier used throughout the app.
// The `symbol` property holds the short ticker symbol of the asset (without currency suffix).
export const POPULAR_COINS = [
  { id: 'bitcoin',   symbol: 'btc',  name: 'Bitcoin' },
  { id: 'ethereum',  symbol: 'eth',  name: 'Ethereum' },
  { id: 'ripple',    symbol: 'xrp',  name: 'XRP' },
  { id: 'dogecoin',  symbol: 'doge', name: 'Dogecoin' },
  { id: 'cardano',   symbol: 'ada',  name: 'Cardano' },
  { id: 'solana',    symbol: 'sol',  name: 'Solana' },
  { id: 'polkadot',  symbol: 'dot',  name: 'Polkadot' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
  { id: 'litecoin',  symbol: 'ltc',  name: 'Litecoin' },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB' },
]

// Supported currencies. Binance provides prices in quote assets (e.g. USDT),
// so we expose USD as the only supported fiat currency here.  If additional
// currency conversion is needed (e.g. KRW), conversions should be handled
// externally via a separate FX API.
export const SUPPORTED_CURRENCIES = [
  { id: 'usd', name: 'USD', symbol: '$' },
]

/**
 * Hook to fetch and manage cryptocurrency prices using Binance REST API.
 *
 * The Binance API returns prices quoted against USDT. For each requested coin,
 * this hook fetches the 24‑hour ticker data via the `/api/v3/ticker/24hr` endpoint.
 * It then extracts the last traded price and 24‑hour price change percentage.
 *
 * Prices are stored under the coin's `id` with a nested object containing
 * `usd` for the price and `usd_24h_change` for the 24‑hour percentage change.
 * A `last_updated_at` field (Unix timestamp in seconds) is included to aid
 * consumers in showing when the data was refreshed.
 */
export const useCoinPrices = () => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Map a coin ID to its Binance trading pair (e.g. 'btc' → 'BTCUSDT')
  const mapCoinIdToBinanceSymbol = useCallback((coinId) => {
    const coin = POPULAR_COINS.find((c) => c.id === coinId)
    if (!coin) return null
    return `${coin.symbol.toUpperCase()}USDT`
  }, [])

  // Inverse: map a Binance symbol back to the internal coin ID
  const mapSymbolToCoinId = useCallback((symbol) => {
    const base = symbol.replace(/USDT$/, '').toLowerCase()
    const coin = POPULAR_COINS.find((c) => c.symbol.toLowerCase() === base)
    return coin ? coin.id : null
  }, [])

  /**
   * Fetch prices for an array of coin IDs.  This function will
   * request data for all provided coins in one API call by constructing
   * a list of Binance symbols.  The API returns an array of ticker objects
   * containing price, price change, and timestamps.
   *
   * @param {string[]} coinIds Array of coin IDs to fetch
   */
  const fetchPrices = useCallback(
    async (coinIds = []) => {
      if (!coinIds || coinIds.length === 0) return
      setLoading(true)
      setError(null)
      try {
        // Build the list of Binance symbols from the coin IDs
        const symbols = coinIds.map((id) => mapCoinIdToBinanceSymbol(id)).filter(Boolean)
        if (symbols.length === 0) return

        // Encode the symbols array as a JSON string for the URL parameter
        const symbolsParam = encodeURIComponent(JSON.stringify(symbols))
        const url = `${BINANCE_API_BASE}/ticker/24hr?symbols=${symbolsParam}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        // The API returns either an array or an object; normalize to array
        const items = Array.isArray(data) ? data : [data]
        const updated = {}
        items.forEach((item) => {
          const coinId = mapSymbolToCoinId(item.symbol)
          if (!coinId) return
          const price = parseFloat(item.lastPrice)
          const changePercent = parseFloat(item.priceChangePercent)
          // Binance provides closeTime in milliseconds; convert to seconds
          const lastUpdated = item.closeTime
            ? Math.floor(item.closeTime / 1000)
            : Math.floor(Date.now() / 1000)
          updated[coinId] = {
            usd: price,
            usd_24h_change: changePercent,
            last_updated_at: lastUpdated,
          }
        })
        setPrices((prev) => ({ ...prev, ...updated }))
        return updated
      } catch (err) {
        console.error('코인 가격 가져오기 실패:', err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [mapCoinIdToBinanceSymbol, mapSymbolToCoinId],
  )

  /** Fetch the price for a single coin by delegating to fetchPrices */
  const fetchSinglePrice = useCallback((coinId) => fetchPrices([coinId]), [fetchPrices])

  /** Return the static list of supported coins */
  const fetchCoinsList = useCallback(async () => POPULAR_COINS, [])

  /** Getters for components */
  const getPrice = useCallback((coinId) => prices[coinId]?.usd ?? null, [prices])
  const getChange24h = useCallback((coinId) => prices[coinId]?.usd_24h_change ?? null, [prices])
  const getLastUpdated = useCallback(
    (coinId) =>
      prices[coinId]?.last_updated_at
        ? new Date(prices[coinId].last_updated_at * 1000)
        : null,
    [prices],
  )

  return {
    prices,
    loading,
    error,
    fetchPrices,
    fetchSinglePrice,
    fetchCoinsList,
    getPrice,
    getChange24h,
    getLastUpdated,
  }
}

/**
 * Hook to monitor coin prices in real time.  Polls the Binance API at a
 * specified interval to refresh prices for the given set of coin IDs.
 *
 * @param {string[]} coinIds Array of coin IDs to monitor
 * @param {string[]} currencies Currently ignored; kept for API compatibility
 * @param {number} interval Interval in milliseconds between updates
 */
export const useRealTimePrices = (coinIds = [], currencies = ['usd'], interval = 20000) => {
  const { fetchPrices, ...rest } = useCoinPrices()

  useEffect(() => {
    if (!coinIds || coinIds.length === 0) return
    // Fetch initially
    fetchPrices(coinIds)
    // Set up interval polling
    const id = setInterval(() => {
      fetchPrices(coinIds)
    }, interval)
    return () => clearInterval(id)
  }, [coinIds, currencies, interval, fetchPrices])

  return rest
}
