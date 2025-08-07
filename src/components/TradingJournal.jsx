import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { PlusCircle, Edit, Trash2, TrendingUp, TrendingDown, Download, Upload } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

// 매매 기법 옵션
const TRADING_STRATEGIES = [
  { value: 'technical', label: '기술적 분석' },
  { value: 'fundamental', label: '기본적 분석' },
  { value: 'momentum', label: '모멘텀 전략' },
  { value: 'value', label: '가치 투자' },
  { value: 'growth', label: '성장주 투자' },
  { value: 'swing', label: '스윙 트레이딩' },
  { value: 'day', label: '데이 트레이딩' },
  { value: 'scalping', label: '스캘핑' },
  { value: 'breakout', label: '돌파 전략' },
  { value: 'reversal', label: '반전 전략' },
  { value: 'trend', label: '추세 추종' },
  { value: 'contrarian', label: '역투자' },
  { value: 'other', label: '기타' }
]

export function TradingJournal() {
  const { t, formatCurrency } = useI18n()
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem('trading-journal-trades')
    return saved ? JSON.parse(saved) : []
  })
  const [showTradeForm, setShowTradeForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState(null)
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: 'buy',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    strategy: '',
    notes: ''
  })

  // 거래 데이터를 로컬 스토리지에 저장
  const saveToStorage = (tradesData) => {
    localStorage.setItem('trading-journal-trades', JSON.stringify(tradesData))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const tradeData = {
      ...formData,
      id: editingTrade ? editingTrade.id : Date.now(),
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      total: parseFloat(formData.quantity) * parseFloat(formData.price)
    }

    let newTrades
    if (editingTrade) {
      newTrades = trades.map(trade => 
        trade.id === editingTrade.id ? tradeData : trade
      )
    } else {
      newTrades = [...trades, tradeData]
    }

    setTrades(newTrades)
    saveToStorage(newTrades)
    resetForm()
  }

  const handleEdit = (trade) => {
    setEditingTrade(trade)
    setFormData({
      symbol: trade.symbol,
      name: trade.name,
      type: trade.type,
      quantity: trade.quantity.toString(),
      price: trade.price.toString(),
      date: trade.date,
      strategy: trade.strategy || '',
      notes: trade.notes || ''
    })
    setShowTradeForm(true)
  }

  const handleDelete = (tradeId) => {
    const newTrades = trades.filter(trade => trade.id !== tradeId)
    setTrades(newTrades)
    saveToStorage(newTrades)
  }

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      type: 'buy',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      strategy: '',
      notes: ''
    })
    setEditingTrade(null)
    setShowTradeForm(false)
  }

  // CSV 다운로드 기능
  const downloadCSV = () => {
    if (trades.length === 0) {
      alert('다운로드할 거래 데이터가 없습니다.')
      return
    }

    const headers = ['날짜', '종목코드', '종목명', '거래유형', '수량', '가격', '총액', '매매기법', '메모']
    const csvContent = [
      headers.join(','),
      ...trades.map(trade => [
        trade.date,
        trade.symbol,
        trade.name,
        trade.type === 'buy' ? '매수' : '매도',
        trade.quantity,
        trade.price,
        trade.total,
        TRADING_STRATEGIES.find(s => s.value === trade.strategy)?.label || '',
        `"${trade.notes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `매매일지_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // CSV 업로드 기능
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target.result
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        
        const uploadedTrades = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue
          
          const values = line.split(',')
          if (values.length >= 7) {
            const trade = {
              id: Date.now() + i,
              date: values[0],
              symbol: values[1],
              name: values[2],
              type: values[3] === '매수' ? 'buy' : 'sell',
              quantity: parseFloat(values[4]) || 0,
              price: parseFloat(values[5]) || 0,
              total: parseFloat(values[6]) || 0,
              strategy: TRADING_STRATEGIES.find(s => s.label === values[7])?.value || '',
              notes: values[8] ? values[8].replace(/"/g, '') : ''
            }
            uploadedTrades.push(trade)
          }
        }

        if (uploadedTrades.length > 0) {
          const newTrades = [...trades, ...uploadedTrades]
          setTrades(newTrades)
          saveToStorage(newTrades)
          alert(`${uploadedTrades.length}개의 거래 데이터를 성공적으로 업로드했습니다.`)
        } else {
          alert('유효한 거래 데이터를 찾을 수 없습니다.')
        }
      } catch (error) {
        alert('CSV 파일을 읽는 중 오류가 발생했습니다.')
        console.error('CSV 업로드 오류:', error)
      }
    }
    reader.readAsText(file, 'UTF-8')
    event.target.value = '' // 파일 입력 초기화
  }

  const calculatePortfolioStats = () => {
    const totalInvested = trades
      .filter(trade => trade.type === 'buy')
      .reduce((sum, trade) => sum + trade.total, 0)
    
    const totalSold = trades
      .filter(trade => trade.type === 'sell')
      .reduce((sum, trade) => sum + trade.total, 0)
    
    const netInvestment = totalInvested - totalSold
    const totalTrades = trades.length
    const buyTrades = trades.filter(trade => trade.type === 'buy').length
    const sellTrades = trades.filter(trade => trade.type === 'sell').length

    return {
      totalInvested,
      totalSold,
      netInvestment,
      totalTrades,
      buyTrades,
      sellTrades
    }
  }

  const stats = calculatePortfolioStats()

  return (
    <div className="space-y-6">
      {/* 매매 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">총 거래 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.buyTrades}</div>
            <p className="text-xs text-muted-foreground">매수 거래</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.sellTrades}</div>
            <p className="text-xs text-muted-foreground">매도 거래</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.netInvestment, 'USD')}
            </div>
            <p className="text-xs text-muted-foreground">순 투자금</p>
          </CardContent>
        </Card>
      </div>

      {/* 거래 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('trades.title')}</CardTitle>
              <CardDescription>{t('trades.description')}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="csv-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('csv-upload').click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                CSV 업로드
              </Button>
              <Button
                variant="outline"
                onClick={downloadCSV}
                disabled={trades.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV 다운로드
              </Button>
              <Button onClick={() => setShowTradeForm(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                거래 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">아직 거래 기록이 없습니다</p>
              <p className="text-sm text-gray-400">첫 번째 거래를 추가하거나 CSV 파일을 업로드하여 매매일지를 시작해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <div key={trade.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4 flex-1">
                    <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                      {trade.type === 'buy' ? (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          매수
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 mr-1" />
                          매도
                        </>
                      )}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium">{trade.name} ({trade.symbol})</p>
                        <p className="text-sm text-gray-500">{trade.date}</p>
                      </div>
                      <div className="flex items-center space-x-4 mb-2">
                        <p className="text-sm">{trade.quantity}주 × ${trade.price}</p>
                        <p className="text-sm font-medium">총액: {formatCurrency(trade.total, 'USD')}</p>
                      </div>
                      {trade.strategy && (
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {TRADING_STRATEGIES.find(s => s.value === trade.strategy)?.label}
                          </Badge>
                        </div>
                      )}
                      {trade.notes && (
                        <div className="bg-white p-2 rounded border text-sm text-gray-700">
                          <strong>메모:</strong> {trade.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(trade)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(trade.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 거래 추가/편집 다이얼로그 */}
      <Dialog open={showTradeForm} onOpenChange={setShowTradeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrade ? '거래 편집' : '새 거래 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">종목 코드</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                  placeholder="AAPL"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">종목명</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="애플"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">거래 유형</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">매수</SelectItem>
                  <SelectItem value="sell">매도</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">수량</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">가격</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="175.50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">거래일</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="strategy">매매 기법</Label>
              <Select value={formData.strategy} onValueChange={(value) => handleInputChange('strategy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="매매 기법을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {TRADING_STRATEGIES.map((strategy) => (
                    <SelectItem key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">거래 메모</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="거래 근거, 시장 상황, 감정 상태, 배운 점 등을 자세히 기록하세요..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                상세한 메모는 향후 투자 패턴 분석과 개선에 도움이 됩니다.
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                취소
              </Button>
              <Button type="submit" className="flex-1">
                {editingTrade ? '수정' : '추가'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

