import { useState, useEffect } from 'react'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export const useCoinPrices = () => {
  const [coinPrices, setCoinPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const coinIds = [
    'bitcoin',
    'ethereum', 
    'ripple',
    'dogecoin',
    'cardano',
    'solana',
    'polkadot',
    'chainlink'
  ]

  const coinSymbols = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',
    'dogecoin': 'DOGE',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polkadot': 'DOT',
    'chainlink': 'LINK'
  }

  const coinNames = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'ripple': 'XRP',
    'dogecoin': 'Dogecoin',
    'cardano': 'Cardano',
    'solana': 'Solana',
    'polkadot': 'Polkadot',
    'chainlink': 'Chainlink'
  }

  const fetchCoinPrices = async () => {
    try {
      setLoading(true)
      setError(null)

      const idsParam = coinIds.join(',')
      const url = `${COINGECKO_API_BASE}/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      
      const formattedPrices = coinIds.map(coinId => {
        const coinData = data[coinId]
        if (!coinData) {
          return null
        }

        return {
          id: coinId,
          symbol: coinSymbols[coinId],
          name: coinNames[coinId],
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          changePercent: coinData.usd_24h_change || 0,
          lastUpdated: coinData.last_updated_at
        }
      }).filter(Boolean)

      setCoinPrices(formattedPrices)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('코인 가격 조회 실패:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 초기 로드
    fetchCoinPrices()

    // 60초마다 업데이트 (CoinGecko 무료 API 제한)
    const interval = setInterval(fetchCoinPrices, 60000)

    return () => clearInterval(interval)
  }, [])

  const refreshPrices = () => {
    fetchCoinPrices()
  }

  return {
    coinPrices,
    loading,
    error,
    lastUpdated,
    refreshPrices
  }
}

