import { useState, useEffect, useCallback } from 'react'
import { useCoinPrices } from './useCoinPrices'
import { showAlertNotification } from '../lib/utils'

/**
 * 알람 관리를 위한 커스텀 훅
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [triggeredAlerts, setTriggeredAlerts] = useState([])
  const { fetchPrices, getPrice } = useCoinPrices()

  // 로컬 스토리지에서 알람 데이터 로드
  useEffect(() => {
    const savedAlerts = localStorage.getItem('crypto-alerts')
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts)
        setAlerts(parsedAlerts)
      } catch (error) {
        console.error('알람 데이터 로드 실패:', error)
      }
    }
  }, [])

  // 알람 데이터를 로컬 스토리지에 저장
  const saveAlertsToStorage = useCallback((alertsData) => {
    try {
      localStorage.setItem('crypto-alerts', JSON.stringify(alertsData))
    } catch (error) {
      console.error('알람 데이터 저장 실패:', error)
    }
  }, [])

  /**
   * 새 알람 추가
   * @param {Object} alertData - 알람 데이터
   */
  const addAlert = useCallback((alertData) => {
    const newAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coinId: alertData.coinId,
      coinSymbol: alertData.coinSymbol,
      coinName: alertData.coinName,
      targetPrice: parseFloat(alertData.targetPrice),
      currency: alertData.currency || 'usd',
      condition: alertData.condition, // 'above' 또는 'below'
      isActive: true,
      isTriggered: false,
      createdAt: Date.now(),
      triggeredAt: null
    }

    const updatedAlerts = [...alerts, newAlert]
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)

    return newAlert
  }, [alerts, saveAlertsToStorage])

  /**
   * 알람 수정
   * @param {string} alertId - 알람 ID
   * @param {Object} updates - 업데이트할 데이터
   */
  const updateAlert = useCallback((alertId, updates) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, ...updates }
        : alert
    )
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)
  }, [alerts, saveAlertsToStorage])

  /**
   * 알람 삭제
   * @param {string} alertId - 알람 ID
   */
  const deleteAlert = useCallback((alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId)
    setAlerts(updatedAlerts)
    saveAlertsToStorage(updatedAlerts)
  }, [alerts, saveAlertsToStorage])

  /**
   * 알람 활성화/비활성화
   * @param {string} alertId - 알람 ID
   * @param {boolean} isActive - 활성화 여부
   */
  const toggleAlert = useCallback((alertId, isActive) => {
    updateAlert(alertId, { isActive })
  }, [updateAlert])

  /**
   * 알람 조건 확인 및 트리거
   * @param {Object} alert - 알람 객체
   * @param {number} currentPrice - 현재 가격
   */
  const checkAlertCondition = useCallback((alert, currentPrice) => {
    if (!alert.isActive || alert.isTriggered || currentPrice === null) {
      return false
    }

    const { condition, targetPrice } = alert
    
    if (condition === 'above' && currentPrice >= targetPrice) {
      return true
    }
    
    if (condition === 'below' && currentPrice <= targetPrice) {
      return true
    }

    return false
  }, [])

  /**
   * 알람 트리거 처리
   * @param {Object} alert - 트리거된 알람
   * @param {number} currentPrice - 현재 가격
   */
  const triggerAlert = useCallback((alert, currentPrice) => {
    const triggeredAlert = {
      ...alert,
      isTriggered: true,
      triggeredAt: Date.now(),
      triggeredPrice: currentPrice
    }

    // 알람 상태 업데이트
    updateAlert(alert.id, {
      isTriggered: true,
      triggeredAt: Date.now()
    })

    // 트리거된 알람 목록에 추가
    setTriggeredAlerts(prev => [...prev, triggeredAlert])

    // 브라우저 알림 표시
    try {
      showAlertNotification(alert, currentPrice)
    } catch (error) {
      console.error('브라우저 알림 표시 실패:', error)
    }

    return triggeredAlert
  }, [updateAlert])

  /**
   * 모든 활성 알람 확인
   */
  const checkAllAlerts = useCallback(async () => {
    const activeAlerts = alerts.filter(alert => alert.isActive && !alert.isTriggered)
    
    if (activeAlerts.length === 0) return []

    // 필요한 코인 ID와 통화 추출
    const coinIds = [...new Set(activeAlerts.map(alert => alert.coinId))]
    const currencies = [...new Set(activeAlerts.map(alert => alert.currency))]

    try {
      // 가격 데이터 가져오기
      await fetchPrices(coinIds, currencies, false)

      const triggeredAlerts = []

      // 각 알람 확인
      for (const alert of activeAlerts) {
        const currentPrice = getPrice(alert.coinId, alert.currency)
        
        if (checkAlertCondition(alert, currentPrice)) {
          const triggered = triggerAlert(alert, currentPrice)
          triggeredAlerts.push(triggered)
        }
      }

      return triggeredAlerts
    } catch (error) {
      console.error('알람 확인 중 오류:', error)
      return []
    }
  }, [alerts, fetchPrices, getPrice, checkAlertCondition, triggerAlert])

  /**
   * 트리거된 알람 목록 초기화
   */
  const clearTriggeredAlerts = useCallback(() => {
    setTriggeredAlerts([])
  }, [])

  /**
   * 알람 통계 계산
   */
  const getAlertStats = useCallback(() => {
    const total = alerts.length
    const active = alerts.filter(alert => alert.isActive && !alert.isTriggered).length
    const triggered = alerts.filter(alert => alert.isTriggered).length
    const inactive = alerts.filter(alert => !alert.isActive).length

    return { total, active, triggered, inactive }
  }, [alerts])

  return {
    alerts,
    triggeredAlerts,
    addAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    checkAllAlerts,
    clearTriggeredAlerts,
    getAlertStats
  }
}

/**
 * 실시간 알람 모니터링을 위한 커스텀 훅
 * @param {number} interval - 확인 간격 (밀리초)
 */
export const useRealTimeAlerts = (interval = 20000) => {
  const alertsHook = useAlerts()
  const { checkAllAlerts } = alertsHook

  useEffect(() => {
    // 초기 알람 확인
    checkAllAlerts()

    // 주기적으로 알람 확인
    const intervalId = setInterval(() => {
      checkAllAlerts()
    }, interval)

    return () => clearInterval(intervalId)
  }, [checkAllAlerts, interval])

  return alertsHook
}

