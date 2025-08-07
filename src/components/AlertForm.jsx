import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { POPULAR_COINS, SUPPORTED_CURRENCIES } from '../hooks/useCoinPrices'
import { formatCurrency, cn } from '../lib/utils'

export function AlertForm({ alert = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    coinId: '',
    coinSymbol: '',
    coinName: '',
    targetPrice: '',
    currency: 'usd',
    condition: 'above'
  })
  const [coinSearchOpen, setCoinSearchOpen] = useState(false)
  const [errors, setErrors] = useState({})

  // 편집 모드인 경우 기존 데이터로 폼 초기화
  useEffect(() => {
    if (alert) {
      setFormData({
        coinId: alert.coinId,
        coinSymbol: alert.coinSymbol,
        coinName: alert.coinName,
        targetPrice: alert.targetPrice.toString(),
        currency: alert.currency,
        condition: alert.condition
      })
    }
  }, [alert])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCoinSelect = (coin) => {
    setFormData(prev => ({
      ...prev,
      coinId: coin.id,
      coinSymbol: coin.symbol,
      coinName: coin.name
    }))
    setCoinSearchOpen(false)
    if (errors.coinId) {
      setErrors(prev => ({ ...prev, coinId: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.coinId) {
      newErrors.coinId = '코인을 선택해주세요'
    }

    if (!formData.targetPrice) {
      newErrors.targetPrice = '목표 가격을 입력해주세요'
    } else {
      const price = parseFloat(formData.targetPrice)
      if (isNaN(price) || price <= 0) {
        newErrors.targetPrice = '유효한 가격을 입력해주세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const alertData = {
      ...formData,
      targetPrice: parseFloat(formData.targetPrice)
    }

    onSubmit(alertData)
  }

  const selectedCoin = POPULAR_COINS.find(coin => coin.id === formData.coinId)
  const selectedCurrency = SUPPORTED_CURRENCIES.find(curr => curr.id === formData.currency)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{alert ? '알람 편집' : '새 알람 추가'}</CardTitle>
        <CardDescription>
          원하는 코인의 목표 가격에 도달하면 알림을 받으세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 코인 선택 */}
          <div className="space-y-2">
            <Label htmlFor="coin">코인 선택</Label>
            <Popover open={coinSearchOpen} onOpenChange={setCoinSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={coinSearchOpen}
                  className={cn(
                    "w-full justify-between",
                    !selectedCoin && "text-muted-foreground",
                    errors.coinId && "border-red-500"
                  )}
                >
                  {selectedCoin ? (
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedCoin.symbol.toUpperCase()}
                      </Badge>
                      <span>{selectedCoin.name}</span>
                    </div>
                  ) : (
                    "코인을 선택하세요"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="코인 검색..." />
                  <CommandList>
                    <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {POPULAR_COINS.map((coin) => (
                        <CommandItem
                          key={coin.id}
                          value={coin.id}
                          onSelect={() => handleCoinSelect(coin)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCoin?.id === coin.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {coin.symbol.toUpperCase()}
                            </Badge>
                            <span>{coin.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.coinId && (
              <p className="text-sm text-red-600">{errors.coinId}</p>
            )}
          </div>

          {/* 통화 선택 */}
          <div className="space-y-2">
            <Label htmlFor="currency">통화</Label>
            <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="통화를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    <div className="flex items-center space-x-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 목표 가격 */}
          <div className="space-y-2">
            <Label htmlFor="targetPrice">목표 가격</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {selectedCurrency?.symbol}
              </span>
              <Input
                id="targetPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                className={cn(
                  "pl-8",
                  errors.targetPrice && "border-red-500"
                )}
              />
            </div>
            {errors.targetPrice && (
              <p className="text-sm text-red-600">{errors.targetPrice}</p>
            )}
          </div>

          {/* 알람 조건 */}
          <div className="space-y-2">
            <Label htmlFor="condition">알람 조건</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="조건을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">
                  <div className="flex items-center space-x-2">
                    <span>📈</span>
                    <span>이상 (가격이 목표가 이상일 때)</span>
                  </div>
                </SelectItem>
                <SelectItem value="below">
                  <div className="flex items-center space-x-2">
                    <span>📉</span>
                    <span>이하 (가격이 목표가 이하일 때)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 미리보기 */}
          {formData.coinName && formData.targetPrice && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">알람 미리보기:</p>
              <p className="text-sm font-medium">
                <Badge variant="outline" className="mr-2">
                  {formData.coinSymbol.toUpperCase()}
                </Badge>
                {formData.coinName}이(가) {formatCurrency(parseFloat(formData.targetPrice), formData.currency)} {formData.condition === 'above' ? '이상' : '이하'}일 때 알림
              </p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              {alert ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

