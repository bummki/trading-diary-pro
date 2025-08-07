import { useState, useEffect, useCallback } from 'react'
import { showAlertNotification } from '../lib/utils'

/**
 * 브라우저 알림 관리를 위한 커스텀 훅
 */
export const useNotifications = () => {
  const [permission, setPermission] = useState('default')
  const [isSupported, setIsSupported] = useState(false)

  // 브라우저 알림 지원 여부 및 권한 상태 확인
  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    } else {
      setIsSupported(false)
      console.warn('이 브라우저는 알림을 지원하지 않습니다.')
    }
  }, [])

  /**
   * 알림 권한 요청
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return false
    }

    if (permission === 'granted') {
      return true
    }

    if (permission === 'denied') {
      console.warn('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('알림 권한 요청 실패:', error)
      return false
    }
  }, [isSupported, permission])

  /**
   * 기본 알림 표시
   * @param {string} title - 알림 제목
   * @param {Object} options - 알림 옵션
   */
  const showNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('알림을 표시할 수 없습니다. 권한을 확인해주세요.')
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
      const notification = new Notification(title, defaultOptions)
      
      // 알림 클릭 시 창 포커스
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // 자동 닫기 (옵션)
      if (options.autoClose !== false) {
        setTimeout(() => {
          notification.close()
        }, options.duration || 5000)
      }

      return notification
    } catch (error) {
      console.error('알림 표시 실패:', error)
      return null
    }
  }, [isSupported, permission])

  /**
   * 알람 트리거 알림 표시
   * @param {Object} alert - 트리거된 알람
   * @param {number} currentPrice - 현재 가격
   */
  const showAlertNotification = useCallback((alert, currentPrice) => {
    return showAlertNotification(alert, currentPrice)
  }, [])

  /**
   * 테스트 알림 표시
   */
  const showTestNotification = useCallback(() => {
    return showNotification('테스트 알림', {
      body: '알림이 정상적으로 작동합니다!',
      icon: '/favicon.ico',
      tag: 'test-notification'
    })
  }, [showNotification])

  return {
    isSupported,
    permission,
    hasPermission: permission === 'granted',
    requestPermission,
    showNotification,
    showAlertNotification,
    showTestNotification
  }
}

/**
 * 알람 트리거 시 알림을 자동으로 표시하는 훅
 * @param {Array} triggeredAlerts - 트리거된 알람 목록
 * @param {Function} onNotificationShown - 알림 표시 후 콜백
 */
export const useAlertNotifications = (triggeredAlerts = [], onNotificationShown) => {
  const { showAlertNotification, hasPermission } = useNotifications()

  useEffect(() => {
    if (!hasPermission || !triggeredAlerts.length) return

    // 새로 트리거된 알람들에 대해 알림 표시
    triggeredAlerts.forEach(alert => {
      if (alert.triggeredPrice) {
        const notification = showAlertNotification(alert, alert.triggeredPrice)
        
        if (notification && onNotificationShown) {
          onNotificationShown(alert, notification)
        }
      }
    })
  }, [triggeredAlerts, hasPermission, showAlertNotification, onNotificationShown])

  return { showAlertNotification, hasPermission }
}

