import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Bell, Settings, Globe, TrendingUp, TrendingDown, BarChart3, RefreshCw, Plus, Trash2, Power, PowerOff } from 'lucide-react'
import { useCoinPrices } from './hooks/useCoinPrices'
import { useAlerts } from './hooks/useAlerts'
import { useLanguage } from './hooks/useLanguage'
import { AddAlertModal } from './components/AddAlertModal'
import { LanguageSelector } from './components/LanguageSelector'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddAlertModal, setShowAddAlertModal] = useState(false)
  const { coinPrices, loading, error, lastUpdated, refreshPrices } = useCoinPrices()
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

  // 브라우저 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const tabs = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'trades', label: t('trades') },
    { id: 'alerts', label: t('alerts') },
    { id: 'analysis', label: t('analysis') }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
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
            <Button size="sm" className="hidden md:flex" onClick={() => {/* TODO: setIsAddTradeOpen(true) */}}>
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
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            {/* Summary Cards             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('totalAssets')}</CardTitle>
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₩0</div>
                  <p className="text-xs text-gray-500 mt-1">₩0 (0.00%)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('todayReturn')}</CardTitle>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.00%</div>
                  <p className="text-xs text-gray-500 mt-1">{t('previousDay')}</p>
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

            {/* Coin Prices Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">인기 코인 가격</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-500">
                    {lastUpdated ? `업데이트: ${lastUpdated.toLocaleTimeString('ko-KR')}` : '실시간 코인 가격을 확인하세요'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshPrices}
                    disabled={loading}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>새로고침</span>
                  </Button>
                </div>
              </div>

              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-600 text-sm">
                      가격 정보를 불러오는데 실패했습니다: {error}
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
                          업데이트: {coin.lastUpdated ? new Date(coin.lastUpdated * 1000).toLocaleTimeString('ko-KR') : '방금 전'}
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
                <h2 className="text-lg font-semibold text-gray-900">최근 거래</h2>
                <p className="text-sm text-gray-500">최근 거래 내역을 확인하세요</p>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">아직 거래 기록이 없습니다</h3>
                  <p className="text-gray-500 mb-4">거래 내역 탭에서 첫 번째 거래를 추가해보세요</p>
                  <Button onClick={() => setActiveTab('trades')}>
                    거래 추가하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">거래 내역</h2>
              <Button>새 거래 추가</Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">거래 내역이 없습니다</h3>
                <p className="text-gray-500">첫 번째 거래를 추가해보세요</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">코인 알람</h2>
              <Button onClick={() => setShowAddAlertModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                새 알람 추가
              </Button>
            </div>

            {/* 발생한 알람 */}
            {triggeredAlerts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">발생한 알람</h3>
                  <Button variant="outline" size="sm" onClick={clearTriggeredAlerts}>
                    모두 지우기
                  </Button>
                </div>
                <div className="space-y-2">
                  {triggeredAlerts.map((alert, index) => (
                    <Card key={index} className="border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{alert.coinSymbol}</span>
                              <span className="text-gray-600">{alert.coinName}</span>
                              <Badge variant="destructive">알람 발생</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              목표: ${alert.targetPrice} {alert.condition === 'above' ? '이상' : '이하'} → 
                              현재: ${alert.currentPrice?.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {alert.triggeredAt?.toLocaleString('ko-KR')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 활성 알람 목록 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">활성 알람</h3>
              {alerts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Bell className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">설정된 알람이 없습니다</h3>
                    <p className="text-gray-500 mb-4">코인 가격 알람을 설정해보세요</p>
                    <Button onClick={() => setShowAddAlertModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      첫 번째 알람 추가
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => {
                    const coin = coinPrices.find(c => c.id === alert.coinId)
                    const currentPrice = coin?.price || 0
                    const priceDistance = alert.condition === 'above' 
                      ? ((alert.targetPrice - currentPrice) / currentPrice * 100)
                      : ((currentPrice - alert.targetPrice) / currentPrice * 100)
                    
                    return (
                      <Card key={alert.id} className={`${alert.isTriggered ? 'border-red-200 bg-red-50' : alert.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">{alert.coinSymbol}</span>
                                <span className="text-gray-600">{alert.coinName}</span>
                                <Badge 
                                  variant={alert.isTriggered ? "destructive" : alert.isActive ? "default" : "secondary"}
                                  className={
                                    alert.isTriggered ? "bg-red-100 text-red-800" :
                                    alert.isActive ? "bg-green-100 text-green-800" : 
                                    "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {alert.isTriggered ? "발생됨" : alert.isActive ? "활성" : "비활성"}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                  목표: ${alert.targetPrice} {alert.condition === 'above' ? '이상' : '이하'}
                                </p>
                                <p>
                                  현재: ${currentPrice.toFixed(2)} 
                                  {!alert.isTriggered && (
                                    <span className={`ml-2 ${priceDistance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                      ({priceDistance > 0 ? '+' : ''}{priceDistance.toFixed(1)}%)
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  생성: {alert.createdAt?.toLocaleDateString('ko-KR')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAlert(alert.id)}
                                className="flex items-center space-x-1"
                              >
                                {alert.isActive ? (
                                  <PowerOff className="w-4 h-4" />
                                ) : (
                                  <Power className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeAlert(alert.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">분석</h2>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <TrendingUp className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">분석 데이터가 없습니다</h3>
                <p className="text-gray-500">거래 데이터가 쌓이면 분석 결과를 확인할 수 있습니다</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Add Alert Modal */}
      <AddAlertModal
        isOpen={showAddAlertModal}
        onClose={() => setShowAddAlertModal(false)}
        coinPrices={coinPrices}
        onAddAlert={addAlert}
      />

      {/* Mobile Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-[60] md:hidden pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="mb-3 rounded-2xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur pointer-events-auto">
            <div className="flex items-center justify-around p-3">
              <button 
                type="button"
                id="btn-alarm" 
                className="px-4 py-2 text-sm rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                onClick={() => setShowAddAlertModal(true)}
              >
                {t('alertSettings')}
              </button>
              <button 
                type="button"
                id="btn-addtrade" 
                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                onClick={() => {/* TODO: setIsAddTradeOpen(true) */}}
              >
                {t('addTrade')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

