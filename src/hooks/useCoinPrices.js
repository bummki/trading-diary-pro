import { useState, useEffect } from 'react'

// 바이낸스 스타일 API 엔드포인트 (CoinGecko를 바이낸스 형식으로 변환)
const BINANCE_STYLE_API_BASE = 'https://api.coingecko.com/api/v3'

export const useCoinPrices = () => {
  const [coinPrices, setCoinPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // 바이낸스 스타일 심볼 매핑
  const binanceSymbols = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'ripple': 'XRPUSDT',
    'dogecoin': 'DOGEUSDT',
    'cardano': 'ADAUSDT',
    'solana': 'SOLUSDT',
    'polkadot': 'DOTUSDT',
    'chainlink': 'LINKUSDT'
  }

  const coinIds = Object.keys(binanceSymbols)

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
      const url = `${BINANCE_STYLE_API_BASE}/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      
      // 바이낸스 스타일 형식으로 변환
      const formattedPrices = coinIds.map(coinId => {
        const coinData = data[coinId]
        if (!coinData) {
          return null
        }

        // 바이낸스 스타일 데이터 구조
        return {
          id: coinId,
          symbol: coinSymbols[coinId],
          name: coinNames[coinId],
          binanceSymbol: binanceSymbols[coinId], // 바이낸스 심볼 추가
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          changePercent: coinData.usd_24h_change || 0,
          lastUpdated: coinData.last_updated_at,
          // 바이낸스 스타일 추가 필드
          lastPrice: coinData.usd.toString(),
          priceChange: (coinData.usd_24h_change || 0).toString(),
          priceChangePercent: (coinData.usd_24h_change || 0).toString(),
          volume: '0', // CoinGecko에서 볼륨 정보가 없으므로 기본값
          quoteVolume: '0',
          openPrice: (coinData.usd * (1 - (coinData.usd_24h_change || 0) / 100)).toString(),
          highPrice: coinData.usd.toString(),
          lowPrice: coinData.usd.toString(),
          prevClosePrice: (coinData.usd * (1 - (coinData.usd_24h_change || 0) / 100)).toString(),
          bidPrice: coinData.usd.toString(),
          askPrice: coinData.usd.toString(),
          weightedAvgPrice: coinData.usd.toString()
        }
      }).filter(Boolean)

      setCoinPrices(formattedPrices)
      setLastUpdated(new Date())
      
      // 바이낸스 스타일 로그 출력
      console.log('🚀 바이낸스 스타일 API 데이터 업데이트:', {
        timestamp: new Date().toISOString(),
        symbols: formattedPrices.map(p => p.binanceSymbol),
        count: formattedPrices.length
      })
      
    } catch (err) {
      console.error('바이낸스 스타일 API 오류:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 초기 로드
    fetchCoinPrices()

    // 30초마다 업데이트 (바이낸스 스타일 빠른 업데이트)
    const interval = setInterval(fetchCoinPrices, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshPrices = () => {
    console.log('🔄 바이낸스 스타일 API 수동 새로고침')
    fetchCoinPrices()
  }

  // 바이낸스 스타일 헬퍼 함수들
  const getBinanceSymbol = (coinId) => {
    return binanceSymbols[coinId] || 'UNKNOWN'
  }

  const getTickerBySymbol = (binanceSymbol) => {
    return coinPrices.find(coin => coin.binanceSymbol === binanceSymbol)
  }

  const getAllTickers = () => {
    return coinPrices.map(coin => ({
      symbol: coin.binanceSymbol,
      lastPrice: coin.lastPrice,
      priceChange: coin.priceChange,
      priceChangePercent: coin.priceChangePercent,
      volume: coin.volume,
      quoteVolume: coin.quoteVolume,
      openPrice: coin.openPrice,
      highPrice: coin.highPrice,
      lowPrice: coin.lowPrice,
      prevClosePrice: coin.prevClosePrice,
      bidPrice: coin.bidPrice,
      askPrice: coin.askPrice,
      weightedAvgPrice: coin.weightedAvgPrice
    }))
  }

  return {
    coinPrices,
    loading,
    error,
    lastUpdated,
    refreshPrices,
    // 바이낸스 스타일 API 함수들
    getBinanceSymbol,
    getTickerBySymbol,
    getAllTickers,
    binanceSymbols: Object.values(binanceSymbols)
  }
}

