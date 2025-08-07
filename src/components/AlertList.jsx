import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog.jsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx'
import { Edit, Trash2, MoreVertical, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react'
import { formatCurrency, formatRelativeTime, getConditionText, getAlertStatusColor, getPriceChangeColor } from '../lib/utils'
import { useCoinPrices } from '../hooks/useCoinPrices'

export function AlertList({ alerts, onEdit, onDelete, onToggle }) {
  const [deleteAlertId, setDeleteAlertId] = useState(null)
  const { getPrice, getChange24h } = useCoinPrices()

  const handleDeleteConfirm = () => {
    if (deleteAlertId) {
      onDelete(deleteAlertId)
      setDeleteAlertId(null)
    }
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">알람이 없습니다</h3>
          <p className="text-muted-foreground text-center mb-4">
            첫 번째 가격 알람을 추가하여<br />
            원하는 가격에 도달했을 때 알림을 받아보세요
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const currentPrice = getPrice(alert.coinId, alert.currency)
        const change24h = getChange24h(alert.coinId, alert.currency)
        const conditionText = getConditionText(alert.condition)
        const statusColor = getAlertStatusColor(alert)

        return (
          <Card key={alert.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* 왼쪽: 코인 정보 및 알람 조건 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {alert.coinSymbol.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{alert.coinName}</span>
                    <Badge className={statusColor}>
                      {alert.isTriggered ? '트리거됨' : alert.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      {alert.condition === 'above' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-muted-foreground">
                        {formatCurrency(alert.targetPrice, alert.currency)} {conditionText}
                      </span>
                    </div>
                    
                    {currentPrice && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground">현재:</span>
                        <span className="font-medium">
                          {formatCurrency(currentPrice, alert.currency)}
                        </span>
                        {change24h !== null && (
                          <span className={`text-xs ${getPriceChangeColor(change24h)}`}>
                            ({change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {alert.isTriggered ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>트리거됨: {formatRelativeTime(alert.triggeredAt)}</span>
                        </div>
                      ) : (
                        <span>생성됨: {formatRelativeTime(alert.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 컨트롤 */}
                <div className="flex items-center space-x-3">
                  {/* 활성화/비활성화 스위치 */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={(checked) => onToggle(alert.id, checked)}
                      disabled={alert.isTriggered}
                    />
                    <span className="text-xs text-muted-foreground">
                      {alert.isActive ? '활성' : '비활성'}
                    </span>
                  </div>

                  {/* 더보기 메뉴 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(alert)}>
                        <Edit className="mr-2 h-4 w-4" />
                        편집
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteAlertId(alert.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* 진행률 표시 (활성 알람만) */}
              {alert.isActive && !alert.isTriggered && currentPrice && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>목표까지</span>
                    <span>
                      {alert.condition === 'above' 
                        ? `${((currentPrice / alert.targetPrice) * 100).toFixed(1)}%`
                        : `${((alert.targetPrice / currentPrice) * 100).toFixed(1)}%`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        alert.condition === 'above' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, alert.condition === 'above' 
                          ? (currentPrice / alert.targetPrice) * 100
                          : (alert.targetPrice / currentPrice) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deleteAlertId} onOpenChange={() => setDeleteAlertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알람 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 알람을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

