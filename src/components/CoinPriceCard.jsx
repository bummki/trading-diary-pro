import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatPercent, formatRelativeTime, getPriceChangeColor } from '../lib/utils'

export function CoinPriceCard({ 
  coinId, 
  coinName, 
  coinSymbol, 
  price, 
  change24h, 
  lastUpdated, 
  currency = 'usd',
  className = '' 
}) {
  const changeColor = getPriceChangeColor(change24h)
  const ChangeIcon = change24h > 0 ? TrendingUp : change24h < 0 ? TrendingDown : Minus

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs font-mono">
            {coinSymbol.toUpperCase()}
          </Badge>
          <CardTitle className="text-sm font-medium">{coinName}</CardTitle>
        </div>
        {change24h !== null && (
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <ChangeIcon className="h-3 w-3" />
            <span className="text-xs font-medium">
              {formatPercent(change24h)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {price !== null ? formatCurrency(price, currency) : '-'}
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              업데이트: {formatRelativeTime(lastUpdated)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function CoinPriceGrid({ coins, prices, currency = 'usd', className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {coins.map((coin) => {
        const coinData = prices[coin.id] || {}
        const price = coinData[currency]
        const change24h = coinData[`${currency}_24h_change`]
        const lastUpdated = coinData.last_updated_at ? new Date(coinData.last_updated_at * 1000) : null

        return (
          <CoinPriceCard
            key={coin.id}
            coinId={coin.id}
            coinName={coin.name}
            coinSymbol={coin.symbol}
            price={price}
            change24h={change24h}
            lastUpdated={lastUpdated}
            currency={currency}
          />
        )
      })}
    </div>
  )
}

