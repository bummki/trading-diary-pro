import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { TrendingUp, TrendingDown, Bell, PlusCircle, BarChart3, Wallet, Settings } from 'lucide-react'
import { AlertForm } from './components/AlertForm'
import { AlertList } from './components/AlertList'
import { CoinPriceGrid } from './components/CoinPriceCard'
import { NotificationSettings } from './components/NotificationSettings'
import { LanguageSelector } from './components/LanguageSelector'
import { ThemeToggle } from './components/ThemeToggle'
import { useRealTimeAlerts } from './hooks/useAlerts'
import { useRealTimePrices, POPULAR_COINS } from './hooks/useCoinPrices'
import { useNotifications } from './hooks/useNotifications'
import { useTheme } from './hooks/useTheme'
import { TradingJournal } from './components/TradingJournal'
import { useI18n } from './hooks/useI18n'
import './App.css'
import './styles/dark-theme.css'

import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)

  // 다국어 지원 훅
  const { t, formatCurrency } = useI18n()

  // 테마 관리 훅
  const { theme } = useTheme()

  // 알림 관리 훅
  const { requestPermission } = useNotifications()

  // 알람 관리 훅
  const {
    alerts,
    triggeredAlerts,
    addAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    getAlertStats,
    clearTriggeredAlerts
  } = useRealTimeAlerts(20000) // 20초마다 알람 확인

  // 코인 가격 데이터 훅
  const coinIds = POPULAR_COINS.slice(0, 8).map(coin => coin.id) // 상위 8개 코인만 표시
  const { prices, loading } = useRealTimePrices(coinIds, ['usd'], 30000) // 30초마다 가격 업데이트

  // 초기 알림 권한 요청
  useEffect(() => {
    const initializeNotifications = async () => {
      await requestPermission()
    }
    initializeNotifications()
  }, [requestPermission])

  // 초기 포트폴리오 데이터 (사용자가 거래를 시작하기 전 상태)
  const portfolioData = {
    totalValue: 0,
    todayChange: 0,
    todayChangePercent: 0
  }

  const recentTrades = []

  const alertStats = getAlertStats()

  const handleAddAlert = (alertData) => {
    addAlert(alertData)
    setShowAlertForm(false)
  }

  const handleEditAlert = (alert) => {
    setEditingAlert(alert)
    setShowAlertForm(true)
  }

  const handleUpdateAlert = (alertData) => {
    if (editingAlert) {
      updateAlert(editingAlert.id, alertData)
      setEditingAlert(null)
      setShowAlertForm(false)
    }
  }

  const handleCancelForm = () => {
    setShowAlertForm(false)
    setEditingAlert(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="bg-card border-b border-border px-2 sm:px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-3 h-3 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">TradingDiaryPro</h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <LanguageSelector />
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowNotificationSettings(true)}
              className="hidden sm:flex"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('header.notificationSettings')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowNotificationSettings(true)}
              className="sm:hidden p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('alerts')}
              className="hidden sm:flex"
            >
              <Bell className="w-4 h-4 mr-2" />
              {t('header.alertSettings')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('alerts')}
              className="sm:hidden p-2"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => setActiveTab("trades")} className="hidden sm:flex">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("header.addTrade")}
            </Button>
            <Button size="sm" onClick={() => setActiveTab("trades")} className="sm:hidden p-2">
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2 sm:py-3">{t('tabs.dashboard')}</TabsTrigger>
            <TabsTrigger value="trades" className="text-xs sm:text-sm py-2 sm:py-3">{t('tabs.trades')}</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs sm:text-sm py-2 sm:py-3">{t('tabs.alerts')}</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3">{t('tabs.analytics')}</TabsTrigger>
          </TabsList>

          {/* 대시보드 탭 */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* 포트폴리오 요약 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="min-w-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{t('dashboard.totalAssets')}</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold truncate">
                    ₩{portfolioData.totalValue.toLocaleString()}
                  </div>
                  <div className={`flex items-center text-xs ${portfolioData.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolioData.todayChange > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : portfolioData.todayChange < 0 ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : null}
                    {portfolioData.todayChange === 0 ? '₩0 (0.00%)' : 
                     `₩${Math.abs(portfolioData.todayChange).toLocaleString()} (${portfolioData.todayChangePercent}%)`}
                  </div>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{t('dashboard.todayReturn')}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {portfolioData.todayChangePercent === 0 ? '0.00%' : 
                     portfolioData.todayChangePercent > 0 ? `+${portfolioData.todayChangePercent}%` : 
                     `${portfolioData.todayChangePercent}%`}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t('dashboard.yesterdayCompare')}</p>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{t('dashboard.activeAlerts')}</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{alertStats.active}</div>
                  <p className="text-xs text-muted-foreground truncate">{t('dashboard.settedAlerts')}</p>
                </CardContent>
              </Card>
            </div>

            {/* 코인 가격 현황 */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.popularCoins')}</CardTitle>
                <CardDescription>{t('dashboard.popularCoinsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <CoinPriceGrid 
                  coins={POPULAR_COINS.slice(0, 8)} 
                  prices={prices} 
                  currency="usd" 
                />
              </CardContent>
            </Card>

            {/* 최근 거래 */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentTrades')}</CardTitle>
                <CardDescription>{t('dashboard.recentTradesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTrades.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">{t('trades.noTrades')}</p>
                    <p className="text-sm text-gray-400">{t('trades.noTradesDesc')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type === 'buy' ? t('dashboard.buy') : t('dashboard.sell')}
                          </Badge>
                          <div>
                            <p className="font-medium">{trade.name} ({trade.symbol})</p>
                            <p className="text-sm text-gray-500">{trade.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{trade.quantity}{t('dashboard.shares')}</p>
                          <p className="text-sm text-gray-500">${trade.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 거래 내역 탭 */}
          <TabsContent value="trades">
            <TradingJournal />
          </TabsContent>

          {/* 코인 알람 탭 */}
          <TabsContent value="alerts" className="space-y-6">
            {/* 알람 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{alertStats.total}</div>
                  <p className="text-xs text-muted-foreground">{t('alerts.totalAlerts')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{alertStats.active}</div>
                  <p className="text-xs text-muted-foreground">{t('alerts.activeAlerts')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{alertStats.triggered}</div>
                  <p className="text-xs text-muted-foreground">{t('alerts.triggeredAlerts')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-600">{alertStats.inactive}</div>
                  <p className="text-xs text-muted-foreground">{t('alerts.inactiveAlerts')}</p>
                </CardContent>
              </Card>
            </div>

            {/* 알람 목록 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('alerts.title')}</CardTitle>
                    <CardDescription>{t('alerts.description')}</CardDescription>
                  </div>
                  <Button onClick={() => setShowAlertForm(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t('alerts.addNewAlert')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AlertList
                  alerts={alerts}
                  onEdit={handleEditAlert}
                  onDelete={deleteAlert}
                  onToggle={toggleAlert}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 분석 탭 */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.title')}</CardTitle>
                <CardDescription>{t('analytics.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">{t('analytics.comingSoon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* 알람 추가/편집 다이얼로그 */}
      <Dialog open={showAlertForm} onOpenChange={setShowAlertForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAlert ? t('alerts.editAlert') : t('alerts.addNewAlert')}</DialogTitle>
          </DialogHeader>
          <AlertForm
            alert={editingAlert}
            onSubmit={editingAlert ? handleUpdateAlert : handleAddAlert}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>

      {/* 알림 설정 다이얼로그 */}
      <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('notifications.title')}</DialogTitle>
          </DialogHeader>
          <NotificationSettings />
        </DialogContent>
      </Dialog>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}

export default App

