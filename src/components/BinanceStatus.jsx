import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react'

export const BinanceStatus = ({ 
  connectionStatus, 
  lastUpdated, 
  error, 
  supportedSymbols, 
  onRefresh 
}) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '바이낸스 API 연결됨'
      case 'connecting':
        return '바이낸스 API 연결 중...'
      case 'error':
        return '바이낸스 API 연결 오류'
      default:
        return '바이낸스 API 연결 안됨'
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getStatusIcon()}
          바이낸스 API 상태
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={connectionStatus === 'connecting'}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
          
          {lastUpdated && (
            <div className="text-sm text-gray-600">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              오류: {error}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            지원 심볼: {supportedSymbols?.length || 0}개
            <div className="mt-1 text-xs text-gray-500">
              {supportedSymbols?.join(', ')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

