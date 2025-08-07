import { useState, useEffect } from 'react'
import { 
  getCurrentLanguage, 
  setLanguage, 
  t, 
  formatCurrency, 
  formatDate, 
  SUPPORTED_LANGUAGES 
} from '../lib/i18n'

/**
 * 다국어 지원을 위한 React 훅
 */
export const useI18n = () => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())

  /**
   * 언어 변경
   * @param {string} language - 변경할 언어 코드
   */
  const changeLanguage = (language) => {
    setLanguage(language)
    setCurrentLang(language)
  }

  /**
   * 번역 함수 (t 함수의 래퍼)
   * @param {string} key - 번역 키
   * @param {Object} params - 치환할 매개변수
   * @returns {string} 번역된 텍스트
   */
  const translate = (key, params = {}) => {
    return t(key, params)
  }

  return {
    currentLanguage: currentLang,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    t: translate,
    formatCurrency,
    formatDate
  }
}

/**
 * 언어 선택기 컴포넌트에서 사용할 훅
 */
export const useLanguageSelector = () => {
  const { currentLanguage, supportedLanguages, changeLanguage } = useI18n()

  const languageOptions = Object.values(supportedLanguages).map(lang => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`,
    name: lang.name,
    flag: lang.flag
  }))

  return {
    currentLanguage,
    languageOptions,
    changeLanguage
  }
}

