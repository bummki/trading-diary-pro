import { useState, useEffect, useCallback } from 'react'

// CoinGecko API 기본 URL
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

// 인기 코인 목록
export const POPULAR_COINS = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'solana', symbol: 'sol', name: 'Solana' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB' }
]

// 지원되는 통화 목록
export const SUPPORTED_CURRENCIES = [
  { id: 'usd', name: 'USD', symbol: '$' },
  { id: 'krw', name: 'KRW', symbol: '₩' },
  { id: 'eur', name: 'EUR', symbol: '€' },
  { id: 'jpy', name: 'JPY', symbol: '¥' }
]

/**
 * CoinGecko API를 사용하여 코인 가격을 가져오는 커스텀 훅
 */
export const useCoinPrices = () => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * 특정 코인들의 가격을 가져오는 함수
   * @param {string[]} coinIds - 코인 ID 배열
   * @param {string[]} currencies - 통화 배열
   * @param {boolean} includeChange - 24시간 변동률 포함 여부
   */
  const fetchPrices = useCallback(async (coinIds, currencies = ['usd'], includeChange = true) => {
    if (!coinIds || coinIds.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        ids: coinIds.join(','),
        vs_currencies: currencies.join(','),
        include_24hr_change: includeChange.toString(),
        include_last_updated_at: 'true'
      })

      const response = await fetch(`${COINGECKO_API_BASE}/simple/price?${params}`)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // 가격 데이터를 상태에 업데이트
      setPrices(prevPrices => ({
        ...prevPrices,
        ...data
      }))

      return data
    } catch (err) {
      console.error('코인 가격 가져오기 실패:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 단일 코인의 가격을 가져오는 함수
   * @param {string} coinId - 코인 ID
   * @param {string} currency - 통화
   */
  const fetchSinglePrice = useCallback(async (coinId, currency = 'usd') => {
    return fetchPrices([coinId], [currency])
  }, [fetchPrices])

  /**
   * 코인 목록을 가져오는 함수
   */
  const fetchCoinsList = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${COINGECKO_API_BASE}/coins/list`)
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('코인 목록 가져오기 실패:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 특정 코인의 현재 가격을 반환하는 함수
   * @param {string} coinId - 코인 ID
   * @param {string} currency - 통화
   */
  const getPrice = useCallback((coinId, currency = 'usd') => {
    const coinData = prices[coinId]
    if (!coinData) return null

    return coinData[currency] || null
  }, [prices])

  /**
   * 특정 코인의 24시간 변동률을 반환하는 함수
   * @param {string} coinId - 코인 ID
   * @param {string} currency - 통화
   */
  const getChange24h = useCallback((coinId, currency = 'usd') => {
    const coinData = prices[coinId]
    if (!coinData) return null

    return coinData[`${currency}_24h_change`] || null
  }, [prices])

  /**
   * 특정 코인의 마지막 업데이트 시간을 반환하는 함수
   * @param {string} coinId - 코인 ID
   */
  const getLastUpdated = useCallback((coinId) => {
    const coinData = prices[coinId]
    if (!coinData) return null

    return coinData.last_updated_at ? new Date(coinData.last_updated_at * 1000) : null
  }, [prices])

  return {
    prices,
    loading,
    error,
    fetchPrices,
    fetchSinglePrice,
    fetchCoinsList,
    getPrice,
    getChange24h,
    getLastUpdated
  }
}

/**
 * 실시간 가격 모니터링을 위한 커스텀 훅
 * @param {string[]} coinIds - 모니터링할 코인 ID 배열
 * @param {string[]} currencies - 통화 배열
 * @param {number} interval - 업데이트 간격 (밀리초)
 */
export const useRealTimePrices = (coinIds = [], currencies = ['usd'], interval = 20000) => {
  const { fetchPrices, ...rest } = useCoinPrices()

  useEffect(() => {
    if (!coinIds || coinIds.length === 0) return

    // 초기 가격 가져오기
    fetchPrices(coinIds, currencies)

    // 주기적으로 가격 업데이트
    const intervalId = setInterval(() => {
      fetchPrices(coinIds, currencies)
    }, interval)

    return () => clearInterval(intervalId)
  }, [coinIds, currencies, interval, fetchPrices])

  return { fetchPrices, ...rest }
}

