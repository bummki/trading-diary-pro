import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * 숫자를 통화 형식으로 포맷팅
 * @param {number} value - 포맷팅할 숫자
 * @param {string} currency - 통화 코드
 * @param {number} decimals - 소수점 자릿수
 */
export function formatCurrency(value, currency = 'usd', decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }

  const currencySymbols = {
    usd: '$',
    krw: '₩',
    eur: '€',
    jpy: '¥'
  }

  const symbol = currencySymbols[currency.toLowerCase()] || '$'
  
  // KRW의 경우 소수점 없이 표시
  if (currency.toLowerCase() === 'krw') {
    return `${symbol}${Math.round(value).toLocaleString()}`
  }

  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`
}

/**
 * 퍼센트 값을 포맷팅
 * @param {number} value - 포맷팅할 퍼센트 값
 * @param {number} decimals - 소수점 자릿수
 */
export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }

  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * 날짜를 상대적 시간으로 포맷팅
 * @param {Date|number} date - 포맷팅할 날짜
 */
export function formatRelativeTime(date) {
  if (!date) return '-'

  const now = new Date()
  const targetDate = typeof date === 'number' ? new Date(date) : date
  const diffInSeconds = Math.floor((now - targetDate) / 1000)

  if (diffInSeconds < 60) {
    return '방금 전'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}일 전`
  }

  return targetDate.toLocaleDateString('ko-KR')
}

/**
 * 코인 이름을 검색 가능한 형태로 정규화
 * @param {string} name - 코인 이름
 */
export function normalizeSearchTerm(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * 코인 목록에서 검색
 * @param {Array} coins - 코인 목록
 * @param {string} searchTerm - 검색어
 */
export function searchCoins(coins, searchTerm) {
  if (!searchTerm) return coins

  const normalizedSearch = normalizeSearchTerm(searchTerm)
  
  return coins.filter(coin => {
    const normalizedName = normalizeSearchTerm(coin.name)
    const normalizedSymbol = normalizeSearchTerm(coin.symbol)
    const normalizedId = normalizeSearchTerm(coin.id)

    return normalizedName.includes(normalizedSearch) ||
           normalizedSymbol.includes(normalizedSearch) ||
           normalizedId.includes(normalizedSearch)
  })
}

/**
 * 알람 조건을 한국어로 변환
 * @param {string} condition - 알람 조건 ('above' 또는 'below')
 */
export function getConditionText(condition) {
  return condition === 'above' ? '이상' : '이하'
}

/**
 * 알람 상태를 한국어로 변환
 * @param {Object} alert - 알람 객체
 */
export function getAlertStatusText(alert) {
  if (alert.isTriggered) return '트리거됨'
  if (alert.isActive) return '활성'
  return '비활성'
}

/**
 * 알람 상태에 따른 색상 클래스 반환
 * @param {Object} alert - 알람 객체
 */
export function getAlertStatusColor(alert) {
  if (alert.isTriggered) return 'bg-green-100 text-green-800'
  if (alert.isActive) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

/**
 * 가격 변동에 따른 색상 클래스 반환
 * @param {number} change - 변동률
 */
export function getPriceChangeColor(change) {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
}

/**
 * 브라우저 알림 권한 요청
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.warn('알림 권한이 거부되었습니다.')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('알림 권한 요청 실패:', error)
    return false
  }
}

/**
 * 브라우저 알림 표시
 * @param {string} title - 알림 제목
 * @param {Object} options - 알림 옵션
 */
export function showNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.warn('알림을 표시할 수 없습니다.')
    return null
  }

  const defaultOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'crypto-alert',
    requireInteraction: true,
    ...options
  }

  try {
    return new Notification(title, defaultOptions)
  } catch (error) {
    console.error('알림 표시 실패:', error)
    return null
  }
}

/**
 * 알람 트리거 시 알림 표시
 * @param {Object} alert - 트리거된 알람
 * @param {number} currentPrice - 현재 가격
 */
export function showAlertNotification(alert, currentPrice) {
  const title = `${alert.coinName} 가격 알람`
  const conditionText = getConditionText(alert.condition)
  const formattedPrice = formatCurrency(currentPrice, alert.currency)
  const formattedTarget = formatCurrency(alert.targetPrice, alert.currency)

  const body = `${alert.coinSymbol.toUpperCase()}이(가) ${formattedTarget} ${conditionText} 조건을 만족했습니다.\n현재 가격: ${formattedPrice}`

  return showNotification(title, {
    body,
    icon: '/favicon.ico',
    tag: `alert-${alert.id}`
  })
}

