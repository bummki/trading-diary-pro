import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 로컬 스토리지에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('trading-diary-theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // 시스템 테마 감지
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // 이전 테마 클래스 제거
    root.classList.remove('light', 'dark')
    
    // 새 테마 클래스 추가
    root.classList.add(theme)
    
    // 로컬 스토리지에 테마 저장
    localStorage.setItem('trading-diary-theme', theme)
    
    // 메타 테마 컬러 업데이트
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#3b82f6')
    }
  }, [theme])

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // 사용자가 수동으로 테마를 설정하지 않은 경우에만 시스템 테마 따라가기
      const savedTheme = localStorage.getItem('trading-diary-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')
  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(systemTheme)
    localStorage.removeItem('trading-diary-theme') // 시스템 테마 따라가기
  }

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }
}

