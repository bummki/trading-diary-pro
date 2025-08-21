import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Bell, Settings, Globe, TrendingUp, TrendingDown, BarChart3, RefreshCw, Plus, Trash2, Power, PowerOff, BookOpen } from 'lucide-react'
import { useCoinPrices } from './hooks/useCoinPrices'
import { useBinanceAPI } from './hooks/useBinanceAPI'
import { useAlerts } from './hooks/useAlerts'
import { useLanguage } from './hooks/useLanguage'
import { useKPI } from './hooks/useKPI'
import { AddAlertModal } from './components/AddAlertModal'
import AddTradeModalV2 from './components/AddTradeModalV2'
import DiaryModal from './components/DiaryModal'
import { LanguageSelector } from './components/LanguageDropdown'
import AppFooter from './components/AppFooter'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddAlertModal, setShowAddAlertModal] = useState(false)
  const [showAddTradeModal, setShowAddTradeModal] = useState(false)
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [trades, setTrades] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const { coinPrices, loading, error, lastUpdated, refreshPrices, getBinanceSymbol, getTickerBySymbol, getAllTickers } = useCoinPrices()
  const { 
    tickers: binanceTickers, 
    loading: binanceLoading, 
    error: binanceError, 
    connectionStatus,
    fetch24hrTicker,
    getSymbolPrice,
    getAllPrices,
    refreshData: refreshBinanceData,
    supportedSymbols 
  } = useBinanceAPI()
  const { 
    alerts, 
    triggeredAlerts, 
    addAlert, 
    removeAlert, 
    toggleAlert, 
    clearTriggeredAlerts,
    requestNotificationPermission,
    getActiveAlertsCount,
    getTriggeredAlertsCount 
  } = useAlerts(coinPrices)
  const { t } = useLanguage()
  const kpi = useKPI(trades)

  // 브라우저 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // localStorage에서 거래 데이터 로드
  useEffect(() => {
    const savedTrades = localStorage.getItem('trades')
    if (savedTrades) {
      try {
        setTrades(JSON.parse(savedTrades))
      } catch (error) {
        console.error('Failed to load trades from localStorage:', error)
      }
    }
  }, [])

  // localStorage에서 일지 데이터 로드
  useEffect(() => {
    const savedDiaries = localStorage.getItem('diaryEntries')
    if (savedDiaries) {
      try {
        setDiaryEntries(JSON.parse(savedDiaries))
      } catch (error) {
        console.error('Failed to load diary entries from localStorage:', error)
      }
    }
  }, [])

  // 거래 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades))
  }, [trades])

  // 일지 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries))
  }, [diaryEntries])

  const deleteTrade = (id) => {
    setTrades(prev => prev.filter(trade => trade.id !== id))
  }

  const addTrade = (trade) => {
    setTrades(prev => [trade, ...prev])
  }

  const saveDiary = (diary, editingId) => {
    if (diary === null) {
      // 삭제
      setDiaryEntries(prev => prev.filter(d => d.id !== editingId))
    } else if (editingId) {
      // 수정
      setDiaryEntries(prev => prev.map(d => d.id === editingId ? diary : d))
    } else {
      // 새로 추가
      setDiaryEntries(prev => [diary, ...prev])
    }
  }

  const tabs = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'trades', label: t('trades') },
    { id: 'alerts', label: t('alerts') },
    { id: 'analysis', label: t('analysis') },
    { id: 'diary', label: t('tradingDiary') }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat(t("locale"), {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('US$', '$')
  }

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{t('appName')}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => setShowAddAlertModal(true)}>
              <Bell className="w-4 h-4 mr-2" />
              {t('alertSettings')}
            </Button>
            <Button size="sm" className="hidden md:flex" onClick={() => setShowAddTradeModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addTrade')}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => { 
                if (tab.id === 'diary') {
                  setShowDiaryModal(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t("totalTrades")}</CardTitle>
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.totalTrades}</div>
                  <p className="text-xs text-gray-500 mt-1">{t("completedTrades")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t("cumulativePnl")}</CardTitle>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpi.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.totalPnl >= 0 ? '+' : ''}{kpi.totalPnl.toFixed(0)} {t("currency")}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("winRate")}: {kpi.winRate.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('activeAlerts')}</CardTitle>
                  <Bell className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getActiveAlertsCount()}</div>
                  <p className="text-xs text-gray-500 mt-1">{t('setAlerts')}</p>
                  {getTriggeredAlertsCount() > 0 && (
                    <Badge variant="destructive" className="mt-2">
                      {getTriggeredAlertsCount()}{t('alertsTriggered')}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* KPI 상세 정보 */}
            {kpi.totalTrades > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{t("avgPnl")}</CardTitle>
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${kpi.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.avgPnl >= 0 ? '+' : ''}{kpi.avgPnl.toFixed(0)} {t("currency")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t("avgPerTrade")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{t("maxProfit")}</CardTitle>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      +{kpi.maxProfit.toFixed(0)} {t("currency")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t("singleTradeMax")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{t("maxLoss")}</CardTitle>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {kpi.maxLoss.toFixed(0)} {t("currency")}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t("singleTradeMax")}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Coin Prices Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t("popularCoins")}</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-500">
                    {lastUpdated ? `${t("updated")}: ${lastUpdated.toLocaleTimeString(t("locale"))}` : t("realTimePrices")}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshPrices}
                    disabled={loading}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{t("refresh")}</span>
                  </Button>
                </div>
              </div>

              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-600 text-sm">
                      {t("priceLoadError")}: {error}
                    </p>
                  </CardContent>
                </Card>
              )}

              {loading && coinPrices.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-4 bg-gray-200 rounded"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="w-12 h-6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-24 h-6 bg-gray-200 rounded mb-1"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coinPrices.map((coin) => (
                    <Card key={coin.symbol} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">{coin.symbol}</span>
                            <span className="text-sm text-gray-700">{coin.name}</span>
                          </div>
                          <Badge 
                            variant={coin.changePercent >= 0 ? "default" : "destructive"}
                            className={coin.changePercent >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {coin.changePercent >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {formatChange(coin.changePercent)}
                          </Badge>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(coin.price)}
                        </div>
                      <p className="text-xs text-gray-500 mt-1">
                          {t("updated")}: {coin.lastUpdated ? new Date(coin.lastUpdated * 1000).toLocaleTimeString(t("locale")) : t("justNow")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Trades Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{t("recentTrades")}
                </h2>
                <p className="text-sm text-gray-500">{t("recentTradesDesc")}</p>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noTrades")}</h3>
                  <p className="text-gray-500 mb-4">{t("noTradesDesc")}</p>
                  <Button onClick={() => setActiveTab('trades')}>
                    {t("addFirstTrade")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{t("trades")}</h2>
              <Button onClick={() => setShowAddTradeModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("newTrade")}
              </Button>
            </div>

            {/* KPI 요약 */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {kpi.totalTrades > 0 ? `+${kpi.totalPnl.toFixed(0)} ${t("currency")}` : `0 ${t("currency")}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("cumulativePnl")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {kpi.totalTrades > 0 ? `${kpi.winRate.toFixed(1)}%` : `0.0%`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("winRate")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {kpi.totalTrades > 0 ? `${kpi.avgPnl.toFixed(0)} ${t("currency")}` : `0 ${t("currency")}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("avgPnl")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {kpi.totalTrades > 0 ? `${kpi.maxProfit.toFixed(0)} ${t("currency")}` : `0 ${t("currency")}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("maxProfit")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {kpi.totalTrades > 0 ? `${kpi.maxLoss.toFixed(0)} ${t("currency")}` : `0 ${t("currency")}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("maxLoss")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {kpi.totalTrades}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t("totalTrades")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Trades Table */}
            {trades.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noTradesData")}</h3>
                  <p className="text-gray-500 mb-4">{t("addFirstTradeDesc")}</p>
                  <Button onClick={() => setShowAddTradeModal(true)}>
                    {t("newTrade")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("date")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("type")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("symbol")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("entryPrice")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("exitPrice")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("quantity")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("pnl")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(trade.date).toLocaleDateString(t("locale"))}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type === 'buy' ? t('buy') : t('sell')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{trade.symbol}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{formatPrice(trade.entryPrice)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{formatPrice(trade.exitPrice)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{trade.quantity}</td>
                        <td className={`py-3 px-4 whitespace-nowrap text-sm font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} {t("currency")}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={() => deleteTrade(trade.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{t("alerts")}</h2>
              <Button onClick={() => setShowAddAlertModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("newAlert")}
              </Button>
            </div>

            {triggeredAlerts.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">{t("triggeredAlerts")}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearTriggeredAlerts}>
                    {t("clearAll")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {triggeredAlerts.map((alert, index) => (
                      <li key={index} className="text-sm text-red-700">
                        <Bell className="w-4 h-4 inline-block mr-2" />
                        {alert.coin} {t("alertTriggered")}! {t("target")}: {formatPrice(alert.targetPrice)}, {t("current")}: {formatPrice(alert.currentPrice)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <h3 className="text-xl font-bold text-gray-900">{t("activeAlertsList")}</h3>
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Bell className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noAlertsSet")}</h3>
                  <p className="text-gray-500 mb-4">{t("noAlertsDesc")}</p>
                  <Button onClick={() => setShowAddAlertModal(true)}>
                    {t("firstAlert")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("coin")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("condition")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("target")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("current")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("created")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("status")}</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {alerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{alert.coin}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                          {alert.condition === 'above' ? t('priceAbove') : t('priceBelow')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{formatPrice(alert.targetPrice)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{formatPrice(coinPrices.find(c => c.symbol === alert.coin)?.price || 0)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(alert.createdAt).toLocaleDateString(t("locale"))}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">
                          <Badge variant={alert.triggered ? 'destructive' : (alert.active ? 'default' : 'secondary')}>
                            {alert.triggered ? t('triggered') : (alert.active ? t('active') : t('inactive'))}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={() => toggleAlert(alert.id)}>
                            {alert.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("analysis")}</h2>
            {kpi.totalTrades === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noAnalysisData")}</h3>
                  <p className="text-gray-500 mb-4">{t("noAnalysisDesc")}</p>
                  <Button onClick={() => setActiveTab('trades')}>
                    {t("addFirstTrade")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PnL Over Time Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("cumulativePnl")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Chart will go here */}
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      {t("chartPlaceholder")}
                    </div>
                  </CardContent>
                </Card>

                {/* Win Rate Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("winRate")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Chart will go here */}
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      {t("chartPlaceholder")}
                    </div>
                  </CardContent>
                </Card>

                {/* Trade Distribution by Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("tradeDistribution")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Chart will go here */}
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      {t("chartPlaceholder")}
                    </div>
                  </CardContent>
                </Card>

                {/* PnL by Symbol */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("pnlBySymbol")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Chart will go here */}
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      {t("chartPlaceholder")}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {showAddAlertModal && (
          <AddAlertModal
            isOpen={showAddAlertModal}
            onClose={() => setShowAddAlertModal(false)}
            onAddAlert={addAlert}
            coinPrices={coinPrices}
          />
        )}

        {showAddTradeModal && (
          <AddTradeModalV2
            isOpen={showAddTradeModal}
            onClose={() => setShowAddTradeModal(false)}
            onAddTrade={addTrade}
          />
        )}

        {showDiaryModal && (
          <DiaryModal
            isOpen={showDiaryModal}
            onClose={() => setShowDiaryModal(false)}
            onSaveDiary={saveDiary}
            diaryEntries={diaryEntries}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;


