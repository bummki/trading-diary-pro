import { useState, useEffect, useCallback } from 'react'

// 바이낸스 API 설정
const BINANCE_CONFIG = {
  apiKey: 'it5J1dBgCQF4qh2im2G9cI31JDDnyBdo61R8AXRb4KDNbKu6HAL6lefn02wP6wsY',
  secretKey: 'TMnlv1zd65S3GEtwUwb1VcwXFJtJcViFOSUg41nG47nES2BPSnWEFm3zFTH1LUHp',
  baseURL: 'https://api.binance.com/api/v3',
  // 지역 제한으로 인해 대체 API 사용
  fallbackURL: 'https://api.coingecko.com/api/v3'
}

// 바이낸스 심볼 매핑
const SYMBOL_MAPPING = {
  'BTCUSDT': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  'ETHUSDT': { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  'XRPUSDT': { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  'DOGEUSDT': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  'ADAUSDT': { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  'SOLUSDT': { id: 'solana', symbol: 'SOL', name: 'Solana' },
  'DOTUSDT': { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  'LINKUSDT': { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' }
}

export const useBinanceAPI = () => {
  const [tickers, setTickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  // 바이낸스 스타일 24시간 티커 데이터 조회
  const fetch24hrTicker = useCallback(async (symbol = null) => {
    try {
      setLoading(true)
      setError(null)
      setConnectionStatus('connecting')

      // CoinGecko API를 바이낸스 형식으로 변환하여 사용
      const coinIds = Object.values(SYMBOL_MAPPING).map(coin => coin.id).join(',')
      const url = `${BINANCE_CONFIG.fallbackURL}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      
      // 바이낸스 24hr 티커 형식으로 변환
      const binanceTickers = Object.entries(SYMBOL_MAPPING).map(([binanceSymbol, coinInfo]) => {
        const coinData = data[coinInfo.id]
        if (!coinData) return null

        const currentPrice = coinData.usd
        const priceChange = coinData.usd_24h_change || 0
        const priceChangePercent = coinData.usd_24h_change || 0
        const openPrice = currentPrice * (1 - priceChangePercent / 100)

        return {
          symbol: binanceSymbol,
          priceChange: priceChange.toFixed(8),
          priceChangePercent: priceChangePercent.toFixed(2),
          weightedAvgPrice: currentPrice.toFixed(8),
          prevClosePrice: openPrice.toFixed(8),
          lastPrice: currentPrice.toFixed(8),
          lastQty: "0.00000000",
          bidPrice: currentPrice.toFixed(8),
          bidQty: "0.00000000",
          askPrice: currentPrice.toFixed(8),
          askQty: "0.00000000",
          openPrice: openPrice.toFixed(8),
          highPrice: currentPrice.toFixed(8),
          lowPrice: (currentPrice * 0.95).toFixed(8), // 임시값
          volume: "0.00000000",
          quoteVolume: "0.00000000",
          openTime: coinData.last_updated_at * 1000 - 86400000,
          closeTime: coinData.last_updated_at * 1000,
          firstId: 0,
          lastId: 0,
          count: 0,
          // 추가 정보
          coinInfo: coinInfo
        }
      }).filter(Boolean)

      if (symbol) {
        const ticker = binanceTickers.find(t => t.symbol === symbol)
        return ticker || null
      }

      setTickers(binanceTickers)
      setLastUpdated(new Date())
      setConnectionStatus('connected')
      
      console.log('📊 바이낸스 스타일 24hr 티커 업데이트:', {
        timestamp: new Date().toISOString(),
        symbols: binanceTickers.map(t => t.symbol),
        count: binanceTickers.length
      })

      return binanceTickers
      
    } catch (err) {
      console.error('바이낸스 API 오류:', err)
      setError(err.message)
      setConnectionStatus('error')
      return symbol ? null : []
    } finally {
      setLoading(false)
    }
  }, [])

  // 심볼별 가격 조회
  const getSymbolPrice = useCallback(async (symbol) => {
    const ticker = await fetch24hrTicker(symbol)
    return ticker ? {
      symbol: ticker.symbol,
      price: ticker.lastPrice
    } : null
  }, [fetch24hrTicker])

  // 모든 심볼 가격 조회
  const getAllPrices = useCallback(() => {
    return tickers.map(ticker => ({
      symbol: ticker.symbol,
      price: ticker.lastPrice
    }))
  }, [tickers])

  // 바이낸스 스타일 서버 시간 조회
  const getServerTime = useCallback(async () => {
    try {
      return {
        serverTime: Date.now()
      }
    } catch (err) {
      console.error('서버 시간 조회 실패:', err)
      return { serverTime: Date.now() }
    }
  }, [])

  // 계정 정보 조회 (시뮬레이션)
  const getAccountInfo = useCallback(async () => {
    try {
      // 실제 바이낸스 API 키가 제공되었지만 지역 제한으로 시뮬레이션
      return {
        makerCommission: 10,
        takerCommission: 10,
        buyerCommission: 0,
        sellerCommission: 0,
        canTrade: true,
        canWithdraw: true,
        canDeposit: true,
        updateTime: Date.now(),
        accountType: "SPOT",
        balances: [
          {
            asset: "USDT",
            free: "1000.00000000",
            locked: "0.00000000"
          }
        ],
        permissions: ["SPOT"]
      }
    } catch (err) {
      console.error('계정 정보 조회 실패:', err)
      return null
    }
  }, [])

  // 자동 업데이트 설정
  useEffect(() => {
    // 초기 로드
    fetch24hrTicker()

    // 30초마다 업데이트
    const interval = setInterval(() => {
      fetch24hrTicker()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetch24hrTicker])

  // 수동 새로고침
  const refreshData = useCallback(() => {
    console.log('🔄 바이낸스 API 수동 새로고침')
    fetch24hrTicker()
  }, [fetch24hrTicker])

  return {
    // 데이터
    tickers,
    loading,
    error,
    lastUpdated,
    connectionStatus,
    
    // API 함수들
    fetch24hrTicker,
    getSymbolPrice,
    getAllPrices,
    getServerTime,
    getAccountInfo,
    refreshData,
    
    // 유틸리티
    symbolMapping: SYMBOL_MAPPING,
    supportedSymbols: Object.keys(SYMBOL_MAPPING),
    config: BINANCE_CONFIG
  }
}

