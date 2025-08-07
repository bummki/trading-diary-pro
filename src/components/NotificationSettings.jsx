import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Bell, BellOff, Volume2, VolumeX, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { 
    isSupported, 
    permission, 
    hasPermission, 
    requestPermission, 
    showTestNotification 
  } = useNotifications()

  const handleRequestPermission = async () => {
    const granted = await requestPermission()
    if (granted) {
      // 권한이 허용되면 테스트 알림 표시
      showTestNotification()
    }
  }

  const getPermissionStatus = () => {
    if (!isSupported) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: '지원되지 않음',
        description: '이 브라우저는 알림을 지원하지 않습니다.'
      }
    }

    switch (permission) {
      case 'granted':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: '허용됨',
          description: '알림이 정상적으로 작동합니다.'
        }
      case 'denied':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: '거부됨',
          description: '브라우저 설정에서 알림 권한을 허용해주세요.'
        }
      default:
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: '대기 중',
          description: '알림 권한을 요청해주세요.'
        }
    }
  }

  const status = getPermissionStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* 알림 권한 상태 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>브라우저 알림</span>
          </CardTitle>
          <CardDescription>
            코인 가격 알람이 트리거될 때 브라우저 알림을 받으세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 권한 상태 표시 */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${status.bgColor}`}>
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
              </div>
              <div>
                <p className="font-medium">알림 권한</p>
                <p className="text-sm text-muted-foreground">{status.description}</p>
              </div>
            </div>
            <Badge variant={hasPermission ? 'default' : 'secondary'}>
              {status.text}
            </Badge>
          </div>

          {/* 권한 요청 버튼 */}
          {isSupported && !hasPermission && (
            <Button onClick={handleRequestPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              알림 권한 허용하기
            </Button>
          )}

          {/* 테스트 알림 버튼 */}
          {hasPermission && (
            <Button variant="outline" onClick={showTestNotification} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              테스트 알림 보내기
            </Button>
          )}

          {/* 권한 거부 시 안내 */}
          {permission === 'denied' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                알림 권한이 거부되었습니다. 브라우저 주소창 옆의 알림 아이콘을 클릭하거나 
                브라우저 설정에서 이 사이트의 알림을 허용해주세요.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>
            알림 동작을 사용자 정의하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 소리 설정 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">알림 소리</p>
                <p className="text-sm text-muted-foreground">
                  알람 트리거 시 소리로 알림
                </p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          {/* 자동 닫기 설정 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellOff className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">자동 닫기</p>
                <p className="text-sm text-muted-foreground">
                  5초 후 알림 자동 닫기
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* 알림 사용법 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>알림 사용법</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <span className="font-medium text-foreground">1.</span>
              <span>브라우저 알림 권한을 허용해주세요.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium text-foreground">2.</span>
              <span>코인 알람을 설정하고 활성화하세요.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium text-foreground">3.</span>
              <span>목표 가격에 도달하면 자동으로 알림을 받습니다.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium text-foreground">4.</span>
              <span>브라우저가 백그라운드에 있어도 알림을 받을 수 있습니다.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

