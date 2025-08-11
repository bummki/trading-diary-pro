import { useState, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  ko: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'KR',
      generalSettings: '일반 설정',
      alertSettings: '알람 설정',
      addTrade: '거래 추가',
      
      // Navigation
      dashboard: '대시보드',
      trades: '거래 내역',
      alerts: '코인 알람',
      analysis: '분석',
      
      // Dashboard Cards
      totalAssets: '총 자산',
      todayReturn: '오늘 수익률',
      activeAlerts: '활성 알람',
      previousDay: '전일 대비',
      setAlerts: '설정된 알람',
      alertsTriggered: '개 알람 발생',
      currency: 'KRW',
      locale: 'ko-KR',
      
      // Coin Prices
      popularCoins: '인기 코인 가격',
      lastUpdated: '업데이트',
      refresh: '새로고침',
      priceLoadError: '가격 정보를 불러오는데 실패했습니다',
      realTimePrices: '실시간 코인 가격을 확인하세요',
      justNow: '방금 전',
      
      // Recent Trades
      recentTrades: '최근 거래',
      recentTradesDesc: '최근 거래 내역을 확인하세요',
      noTrades: '아직 거래 기록이 없습니다',
      noTradesDesc: '거래 내역 탭에서 첫 번째 거래를 추가해보세요',
      addFirstTrade: '거래 추가하기',
      
      // Trades Page
      newTrade: '새 거래 추가',
      noTradesData: '거래 내역이 없습니다',
      addFirstTradeDesc: '첫 번째 거래를 추가해보세요',
      
      // Alerts Page
      newAlert: '새 알람 추가',
      firstAlert: '첫 번째 알람 추가',
      triggeredAlerts: '발생한 알람',
      clearAll: '모두 지우기',
      activeAlertsList: '활성 알람',
      noAlertsSet: '설정된 알람이 없습니다',
      noAlertsDesc: '코인 가격 알람을 설정해보세요',
      alertTriggered: '알람 발생',
      target: '목표',
      current: '현재',
      created: '생성',
      above: '이상',
      below: '이하',
      triggered: '발생됨',
      active: '활성',
      inactive: '비활성',
      
      // Add Alert Modal
      addNewAlert: '새 알람 추가',
      selectCoin: '코인 선택',
      selectCoinPlaceholder: '코인을 선택하세요',
      currentPrice: '현재 가격',
      alertCondition: '알람 조건',
      priceAbove: '가격 이상',
      priceBelow: '가격 이하',
      targetPrice: '목표 가격 (USD)',
      targetPricePlaceholder: '목표 가격을 입력하세요',
      cancel: '취소',
      addAlert: '알람 추가',
      
      // Validation
      selectCoinError: '코인을 선택해주세요',
      validPriceError: '유효한 가격을 입력해주세요',
      
      // Analysis Page
      noAnalysisData: '분석 데이터가 없습니다',
      noAnalysisDesc: '거래 데이터가 쌓이면 분석 결과를 확인할 수 있습니다'
    }
  },
  
  en: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'EN',
      generalSettings: 'General Settings',
      alertSettings: 'Alert Settings',
      addTrade: 'Add Trade',
      
      // Navigation
      dashboard: 'Dashboard',
      trades: 'Trade History',
      alerts: 'Coin Alerts',
      analysis: 'Analysis',
      
      // Dashboard Cards
      totalAssets: 'Total Assets',
      todayReturn: 'Today\'s Return',
      activeAlerts: 'Active Alerts',
      previousDay: 'vs Previous Day',
      setAlerts: 'Set Alerts',
      alertsTriggered: ' alerts triggered',
      currency: 'USD',
      locale: 'en-US',
      
      // Coin Prices
      popularCoins: 'Popular Coin Prices',
      lastUpdated: 'Updated',
      refresh: 'Refresh',
      priceLoadError: 'Failed to load price information',
      realTimePrices: 'Check real-time coin prices',
      justNow: 'just now',
      
      // Recent Trades
      recentTrades: 'Recent Trades',
      recentTradesDesc: 'Check your recent trading history',
      noTrades: 'No trading records yet',
      noTradesDesc: 'Add your first trade in the Trade History tab',
      addFirstTrade: 'Add Trade',
      
      // Trades Page
      newTrade: 'Add New Trade',
      noTradesData: 'No trading history',
      addFirstTradeDesc: 'Add your first trade',
      
      // Alerts Page
      newAlert: 'Add New Alert',
      firstAlert: 'Add First Alert',
      triggeredAlerts: 'Triggered Alerts',
      clearAll: 'Clear All',
      activeAlertsList: 'Active Alerts',
      noAlertsSet: 'No alerts set',
      noAlertsDesc: 'Set up coin price alerts',
      alertTriggered: 'Alert Triggered',
      target: 'Target',
      current: 'Current',
      created: 'Created',
      above: 'above',
      below: 'below',
      triggered: 'Triggered',
      active: 'Active',
      inactive: 'Inactive',
      
      // Add Alert Modal
      addNewAlert: 'Add New Alert',
      selectCoin: 'Select Coin',
      selectCoinPlaceholder: 'Please select a coin',
      currentPrice: 'Current Price',
      alertCondition: 'Alert Condition',
      priceAbove: 'Price Above',
      priceBelow: 'Price Below',
      targetPrice: 'Target Price (USD)',
      targetPricePlaceholder: 'Enter target price',
      cancel: 'Cancel',
      addAlert: 'Add Alert',
      
      // Validation
      selectCoinError: 'Please select a coin',
      validPriceError: 'Please enter a valid price',
      
      // Analysis Page
      noAnalysisData: 'No analysis data',
      noAnalysisDesc: 'Analysis results will be available once trading data accumulates'
    }
  },
  
  zh: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'CN',
      generalSettings: '通用设置',
      alertSettings: '警报设置',
      addTrade: '添加交易',
      
      // Navigation
      dashboard: '仪表板',
      trades: '交易历史',
      alerts: '币种警报',
      analysis: '分析',
      
      // Dashboard Cards
      totalAssets: '总资产',
      todayReturn: '今日收益',
      activeAlerts: '活跃警报',
      previousDay: '较前日',
      setAlerts: '设置警报',
      alertsTriggered: "个警报触发",
      currency: "CNY",
      locale: "zh-CN",
      
      // Coin Prices
      popularCoins: '热门币种价格',
      lastUpdated: '更新时间',
      refresh: '刷新',
      priceLoadError: '加载价格信息失败',
      realTimePrices: '查看实时币种价格',
      justNow: '刚刚',
      
      // Recent Trades
      recentTrades: '最近交易',
      recentTradesDesc: '查看您的最近交易历史',
      noTrades: '暂无交易记录',
      noTradesDesc: '在交易历史标签中添加您的第一笔交易',
      addFirstTrade: '添加交易',
      
      // Trades Page
      newTrade: '添加新交易',
      noTradesData: '无交易历史',
      addFirstTradeDesc: '添加您的第一笔交易',
      
      // Alerts Page
      newAlert: '添加新警报',
      firstAlert: '添加第一个警报',
      triggeredAlerts: '触发的警报',
      clearAll: '全部清除',
      activeAlertsList: '活跃警报',
      noAlertsSet: '未设置警报',
      noAlertsDesc: '设置币种价格警报',
      alertTriggered: '警报触发',
      target: '目标',
      current: '当前',
      created: '创建',
      above: '以上',
      below: '以下',
      triggered: '已触发',
      active: '活跃',
      inactive: '非活跃',
      
      // Add Alert Modal
      addNewAlert: '添加新警报',
      selectCoin: '选择币种',
      selectCoinPlaceholder: '请选择币种',
      currentPrice: '当前价格',
      alertCondition: '警报条件',
      priceAbove: '价格以上',
      priceBelow: '价格以下',
      targetPrice: '目标价格 (USD)',
      targetPricePlaceholder: '输入目标价格',
      cancel: '取消',
      addAlert: '添加警报',
      
      // Validation
      selectCoinError: '请选择币种',
      validPriceError: '请输入有效价格',
      
      // Analysis Page
      noAnalysisData: '无分析数据',
      noAnalysisDesc: '交易数据积累后将显示分析结果'
    }
  },
  
  ja: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'JP',
      generalSettings: '一般設定',
      alertSettings: 'アラート設定',
      addTrade: '取引追加',
      
      // Navigation
      dashboard: 'ダッシュボード',
      trades: '取引履歴',
      alerts: 'コインアラート',
      analysis: '分析',
      
      // Dashboard Cards
      totalAssets: '総資産',
      todayReturn: '今日の収益',
      activeAlerts: 'アクティブアラート',
      previousDay: '前日比',
      setAlerts: '設定アラート',
      alertsTriggered: "つのアラートが発生",
      currency: "JPY",
      locale: "ja-JP",
      
      // Coin Prices
      popularCoins: '人気コイン価格',
      lastUpdated: '更新',
      refresh: '更新',
      priceLoadError: '価格情報の読み込みに失敗しました',
      realTimePrices: 'リアルタイムコイン価格を確認',
      justNow: 'たった今',
      
      // Recent Trades
      recentTrades: '最近の取引',
      recentTradesDesc: '最近の取引履歴を確認',
      noTrades: 'まだ取引記録がありません',
      noTradesDesc: '取引履歴タブで最初の取引を追加してください',
      addFirstTrade: '取引追加',
      
      // Trades Page
      newTrade: '新しい取引を追加',
      noTradesData: '取引履歴がありません',
      addFirstTradeDesc: '最初の取引を追加してください',
      
      // Alerts Page
      newAlert: '新しいアラートを追加',
      firstAlert: '最初のアラートを追加',
      triggeredAlerts: '発生したアラート',
      clearAll: 'すべてクリア',
      activeAlertsList: 'アクティブアラート',
      noAlertsSet: '設定されたアラートがありません',
      noAlertsDesc: 'コイン価格アラートを設定してください',
      alertTriggered: 'アラート発生',
      target: 'ターゲット',
      current: '現在',
      created: '作成',
      above: '以上',
      below: '以下',
      triggered: '発生済み',
      active: 'アクティブ',
      inactive: '非アクティブ',
      
      // Add Alert Modal
      addNewAlert: '新しいアラートを追加',
      selectCoin: 'コイン選択',
      selectCoinPlaceholder: 'コインを選択してください',
      currentPrice: '現在価格',
      alertCondition: 'アラート条件',
      priceAbove: '価格以上',
      priceBelow: '価格以下',
      targetPrice: 'ターゲット価格 (USD)',
      targetPricePlaceholder: 'ターゲット価格を入力',
      cancel: 'キャンセル',
      addAlert: 'アラート追加',
      
      // Validation
      selectCoinError: 'コインを選択してください',
      validPriceError: '有効な価格を入力してください',
      
      // Analysis Page
      noAnalysisData: '分析データがありません',
      noAnalysisDesc: '取引データが蓄積されると分析結果を確認できます'
    }
  },
  
  es: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'ES',
      generalSettings: 'Configuración General',
      alertSettings: 'Configuración de Alertas',
      addTrade: 'Agregar Operación',
      
      // Navigation
      dashboard: 'Panel de Control',
      trades: 'Historial de Operaciones',
      alerts: 'Alertas de Criptomonedas',
      analysis: 'Análisis',
      
      // Dashboard Cards
      totalAssets: 'Activos Totales',
      todayReturn: 'Rendimiento de Hoy',
      activeAlerts: 'Alertas Activas',
      previousDay: 'vs Día Anterior',
      setAlerts: 'Establecer Alertas',
      alertsTriggered: " alertas activadas",
      currency: "USD",
      locale: "es-ES",
      
      // Coin Prices
      popularCoins: 'Precios de Criptomonedas Populares',
      lastUpdated: 'Actualizado',
      refresh: 'Actualizar',
      priceLoadError: 'Error al cargar la información de precios',
      realTimePrices: 'Ver precios de criptomonedas en tiempo real',
      justNow: 'justo ahora',
      
      // Recent Trades
      recentTrades: 'Operaciones Recientes',
      recentTradesDesc: 'Consulta tu historial de operaciones recientes',
      noTrades: 'Aún no hay registros de operaciones',
      noTradesDesc: 'Agrega tu primera operación en la pestaña Historial de Operaciones',
      addFirstTrade: 'Agregar Operación',
      
      // Trades Page
      newTrade: 'Agregar Nueva Operación',
      noTradesData: 'No hay historial de operaciones',
      addFirstTradeDesc: 'Agrega tu primera operación',
      
      // Alerts Page
      newAlert: 'Agregar Nueva Alerta',
      firstAlert: 'Agregar Primera Alerta',
      triggeredAlerts: 'Alertas Activadas',
      clearAll: 'Borrar Todo',
      activeAlertsList: 'Alertas Activas',
      noAlertsSet: 'No hay alertas configuradas',
      noAlertsDesc: 'Configura alertas de precios de criptomonedas',
      alertTriggered: 'Alerta Activada',
      target: 'Objetivo',
      current: 'Actual',
      created: 'Creado',
      above: 'por encima',
      below: 'por debajo',
      triggered: 'Activada',
      active: 'Activa',
      inactive: 'Inactiva',
      
      // Add Alert Modal
      addNewAlert: 'Agregar Nueva Alerta',
      selectCoin: 'Seleccionar Criptomoneda',
      selectCoinPlaceholder: 'Por favor, selecciona una criptomoneda',
      currentPrice: 'Precio Actual',
      alertCondition: 'Condición de Alerta',
      priceAbove: 'Precio por Encima',
      priceBelow: 'Precio por Debajo',
      targetPrice: 'Precio Objetivo (USD)',
      targetPricePlaceholder: 'Ingresa el precio objetivo',
      cancel: 'Cancelar',
      addAlert: 'Agregar Alerta',
      
      // Validation
      selectCoinError: 'Por favor, selecciona una criptomoneda',
      validPriceError: 'Por favor, ingresa un precio válido',
      
      // Analysis Page
      noAnalysisData: 'No hay datos de análisis',
      noAnalysisDesc: 'Los resultados del análisis estarán disponibles una vez que se acumulen los datos de operaciones'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: true,
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language)
      document.documentElement.lang = i18n.language
    }
    i18n.on('languageChanged', handleLanguageChange)
    document.documentElement.lang = i18n.language // Initial set
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  const t = (key) => {
    return i18n.t(key)
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'ko', name: '한국어', flag: '🇰🇷', locale: 'ko-KR' },
      { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
      { code: 'zh', name: '中文', flag: '🇨🇳', locale: 'zh-CN' },
      { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja-JP' },
      { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' }
    ]
  }

  return {
    currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages
  }
}



