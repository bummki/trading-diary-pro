import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { X, TrendingUp, TrendingDown } from 'lucide-react'

export const AddAlertModal = ({ isOpen, onClose, coinPrices, onAddAlert }) => {
  const [selectedCoin, setSelectedCoin] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [condition, setCondition] = useState('above') // 'above' or 'below'
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!selectedCoin) {
      newErrors.coin = '코인을 선택해주세요'
    }
    
    if (!targetPrice || isNaN(targetPrice) || parseFloat(targetPrice) <= 0) {
      newErrors.price = '유효한 가격을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const coin = coinPrices.find(c => c.id === selectedCoin)
    if (!coin) return

    const alertData = {
      coinId: selectedCoin,
      coinSymbol: coin.symbol,
      coinName: coin.name,
      targetPrice: parseFloat(targetPrice),
      condition,
      currentPrice: coin.price
    }

    onAddAlert(alertData)
    
    // 폼 초기화
    setSelectedCoin('')
    setTargetPrice('')
    setCondition('above')
    setErrors({})
    
    onClose()
  }

  const handleClose = () => {
    setSelectedCoin('')
    setTargetPrice('')
    setCondition('above')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  const selectedCoinData = coinPrices.find(c => c.id === selectedCoin)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">새 알람 추가</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 코인 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                코인 선택
              </label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">코인을 선택하세요</option>
                {coinPrices.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name} (${coin.price.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.coin && (
                <p className="text-red-500 text-xs mt-1">{errors.coin}</p>
              )}
            </div>

            {/* 현재 가격 표시 */}
            {selectedCoinData && (
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">현재 가격</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">${selectedCoinData.price.toFixed(2)}</span>
                    <Badge 
                      variant={selectedCoinData.changePercent >= 0 ? "default" : "destructive"}
                      className={selectedCoinData.changePercent >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {selectedCoinData.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {selectedCoinData.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* 알람 조건 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                알람 조건
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`p-2 border rounded-md text-sm font-medium transition-colors ${
                    condition === 'above'
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                  가격 이상
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`p-2 border rounded-md text-sm font-medium transition-colors ${
                    condition === 'below'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                  가격 이하
                </button>
              </div>
            </div>

            {/* 목표 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 가격 (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="목표 가격을 입력하세요"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                알람 추가
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

