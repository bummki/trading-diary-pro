import { useState, useEffect } from 'react'

export const useAlerts = (coinPrices) => {
  const [alerts, setAlerts] = useState([])
  const [triggeredAlerts, setTriggeredAlerts] = useState([])

  // 로컬 스토리지에서 알람 불러오기
  useEffect(() => {
    const savedAlerts = localStorage.getItem('tradingDiaryAlerts')
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts))
      } catch (error) {
        console.error('알람 데이터 로드 실패:', error)
      }
    }
  }, [])

  // 알람 저장
  useEffect(() => {
    localStorage.setItem('tradingDiaryAlerts', JSON.stringify(alerts))
  }, [alerts])

  // 가격 변동 시 알람 체크
  useEffect(() => {
    if (coinPrices.length === 0 || alerts.length === 0) return

    const newTriggeredAlerts = []

    alerts.forEach(alert => {
      if (!alert.isActive) return

      const coin = coinPrices.find(c => c.id === alert.coinId)
      if (!coin) return

      const currentPrice = coin.price
      let isTriggered = false

      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        isTriggered = true
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        isTriggered = true
      }

      if (isTriggered && !alert.isTriggered) {
        newTriggeredAlerts.push({
          ...alert,
          triggeredAt: new Date(),
          currentPrice: currentPrice
        })

        // 알람 상태 업데이트
        setAlerts(prev => prev.map(a => 
          a.id === alert.id 
            ? { ...a, isTriggered: true, triggeredAt: new Date() }
            : a
        ))
      }
    })

    if (newTriggeredAlerts.length > 0) {
      setTriggeredAlerts(prev => [...prev, ...newTriggeredAlerts])
      
      // 브라우저 알림 표시
      newTriggeredAlerts.forEach(alert => {
        showNotification(alert)
      })
    }
  }, [coinPrices, alerts])

  const showNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const coin = coinPrices.find(c => c.id === alert.coinId)
      const notification = new Notification(`${coin?.name || alert.coinId} 가격 알람`, {
        body: `목표 가격 ${alert.targetPrice}에 도달했습니다! 현재 가격: $${alert.currentPrice.toFixed(2)}`,
        icon: '/favicon.ico'
      })

      setTimeout(() => notification.close(), 5000)
    }
  }

  const addAlert = (alertData) => {
    const newAlert = {
      id: Date.now().toString(),
      ...alertData,
      createdAt: new Date(),
      isActive: true,
      isTriggered: false
    }
    setAlerts(prev => [...prev, newAlert])
    return newAlert
  }

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const toggleAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: !alert.isActive, isTriggered: false }
        : alert
    ))
  }

  const clearTriggeredAlerts = () => {
    setTriggeredAlerts([])
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const getActiveAlertsCount = () => {
    return alerts.filter(alert => alert.isActive && !alert.isTriggered).length
  }

  const getTriggeredAlertsCount = () => {
    return triggeredAlerts.length
  }

  return {
    alerts,
    triggeredAlerts,
    addAlert,
    removeAlert,
    toggleAlert,
    clearTriggeredAlerts,
    requestNotificationPermission,
    getActiveAlertsCount,
    getTriggeredAlertsCount
  }
}

