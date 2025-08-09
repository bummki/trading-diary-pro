/**
 * 다국어 지원을 위한 국제화(i18n) 시스템
 */

// 지원 언어 목록
export const SUPPORTED_LANGUAGES = {
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' }
}

// 번역 데이터
const translations = {
  ko: {
    // 공통
    common: {
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      add: '추가',
      close: '닫기',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      refresh: '새로고침'
    },
    
    // 헤더
    header: {
      title: '매매일지',
      notificationSettings: '알림 설정',
      alertSettings: '알람 설정',
      addTrade: '거래 추가'
    },
    
    // 탭
    tabs: {
      dashboard: '대시보드',
      trades: '거래 내역',
      alerts: '코인 알람',
      analytics: '분석'
    },
    
    // 대시보드
    dashboard: {
      totalAssets: '총 자산',
      todayReturn: '오늘 수익률',
      activeAlerts: '활성 알람',
      popularCoins: '인기 코인 가격',
      popularCoinsDesc: '실시간 코인 가격을 확인하세요',
      recentTrades: '최근 거래',
      recentTradesDesc: '최근 거래 내역을 확인하세요',
      buy: '매수',
      sell: '매도',
      shares: '주',
      settedAlerts: '설정된 알람',
      yesterdayCompare: '전일 대비',
      updated: '업데이트'
    },
    
    // 거래 내역
    trades: {
      title: '거래 내역',
      description: '모든 거래 내역을 관리하세요',
      comingSoon: '거래 내역 기능은 곧 추가될 예정입니다.',
      noTrades: '아직 거래 기록이 없습니다',
      noTradesDesc: '첫 번째 거래를 추가해보세요',
      justNow: '방금 전',
      minutesAgo: '분 전',
      hoursAgo: '시간 전',
      daysAgo: '일 전',
      weeksAgo: '주 전',
      monthsAgo: '개월 전',
      yearsAgo: '년 전'
    },
    
    // 코인 알람
    alerts: {
      title: '코인 가격 알람',
      description: '원하는 가격에 도달하면 알림을 받으세요',
      totalAlerts: '전체 알람',
      activeAlerts: '활성 알람',
      triggeredAlerts: '트리거됨',
      inactiveAlerts: '비활성',
      addNewAlert: '새 알람 추가',
      editAlert: '알람 편집',
      noAlerts: '알람이 없습니다',
      noAlertsDesc: '첫 번째 가격 알람을 추가하여\n원하는 가격에 도달했을 때 알림을 받아보세요',
      
      // 알람 폼
      form: {
        selectCoin: '코인 선택',
        selectCoinPlaceholder: '코인을 선택하세요',
        currency: '통화',
        targetPrice: '목표 가격',
        targetPricePlaceholder: '0.00',
        alertCondition: '알람 조건',
        above: '📈이상 (가격이 목표가 이상일 때)',
        below: '📉이하 (가격이 목표가 이하일 때)',
        add: '추가',
        update: '수정',
        cancel: '취소'
      },
      
      // 알람 목록
      list: {
        active: '활성',
        inactive: '비활성',
        triggered: '트리거됨',
        above: '이상',
        below: '이하',
        createdAt: '생성일',
        triggeredAt: '트리거일'
      }
    },
    
    // 분석
    analytics: {
      title: '투자 분석',
      description: '투자 성과를 분석하고 개선점을 찾아보세요',
      comingSoon: '분석 기능은 곧 추가될 예정입니다.'
    },
    
    // 알림 설정
    notifications: {
      title: '알림 설정',
      browserNotifications: '브라우저 알림',
      browserNotificationsDesc: '코인 가격 알람이 트리거될 때 브라우저 알림을 받으세요',
      notificationPermission: '알림 권한',
      granted: '허용됨',
      denied: '거부됨',
      pending: '대기 중',
      notSupported: '지원되지 않음',
      grantedDesc: '알림이 정상적으로 작동합니다.',
      deniedDesc: '브라우저 설정에서 알림 권한을 허용해주세요.',
      pendingDesc: '알림 권한을 요청해주세요.',
      notSupportedDesc: '이 브라우저는 알림을 지원하지 않습니다.',
      allowNotifications: '알림 권한 허용하기',
      sendTestNotification: '테스트 알림 보내기',
      notificationSettings: '알림 설정',
      notificationSettingsDesc: '알림 동작을 사용자 정의하세요',
      notificationSound: '알림 소리',
      notificationSoundDesc: '알람 트리거 시 소리로 알림',
      autoClose: '자동 닫기',
      autoCloseDesc: '5초 후 알림 자동 닫기',
      howToUse: '알림 사용법',
      step1: '브라우저 알림 권한을 허용해주세요.',
      step2: '코인 알람을 설정하고 활성화하세요.',
      step3: '목표 가격에 도달하면 자동으로 알림을 받습니다.',
      step4: '브라우저가 백그라운드에 있어도 알림을 받을 수 있습니다.',
      permissionDeniedWarning: '알림 권한이 거부되었습니다. 브라우저 주소창 옆의 알림 아이콘을 클릭하거나 브라우저 설정에서 이 사이트의 알림을 허용해주세요.'
    },
    
    // 알림 메시지
    alertNotifications: {
      priceAlert: '가격 알람',
      priceReached: '목표 가격에 도달했습니다!',
      currentPrice: '현재 가격',
      targetPrice: '목표 가격',
      testNotification: '테스트 알림',
      testNotificationBody: '알림이 정상적으로 작동합니다!'
    },

    // 푸터
    footer: {
      description: '전문적인 매매일지 작성과 실시간 코인 가격 알람을 한 곳에서 관리하세요. 투자 성과를 체계적으로 기록하고 분석하여 더 나은 투자 결정을 내릴 수 있습니다.',
      features: '주요 기능',
      tradingJournal: '매매일지 관리',
      cryptoAlerts: '코인 가격 알람',
      realTimePrice: '실시간 가격 모니터링',
      csvExport: 'CSV 내보내기/가져오기',
      multiLanguage: '다국어 지원',
      howToUse: '사용 방법',
      step1: '거래 내역을 추가하여 포트폴리오를 구성하세요',
      step2: '코인 가격 알람을 설정하여 기회를 놓치지 마세요',
      step3: '매매 기법과 상세한 메모로 투자 패턴을 분석하세요',
      step4: 'CSV 기능으로 데이터를 백업하고 관리하세요',
      aboutService: '서비스 소개',
      seoDescription: 'TradingDiaryPro는 개인 투자자를 위한 올인원 투자 관리 플랫폼입니다. 매매일지 작성, 코인 가격 알람, 실시간 시장 데이터 모니터링 기능을 제공하여 체계적인 투자 관리를 도와드립니다.',
      keywords: '주요 키워드',
      keywordsList: '매매일지, 투자일기, 코인알람, 암호화폐, 비트코인, 이더리움, 투자관리, 포트폴리오, 주식투자, 가격알림, 실시간차트, 투자분석, 수익률계산, 매매기록',
      copyright: '모든 권리 보유.'
    }
  },
  
  en: {
    // 공통
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh'
    },
    
    // 헤더
    header: {
      title: 'Trading Journal',
      notificationSettings: 'Notification Settings',
      alertSettings: 'Alert Settings',
      addTrade: 'Add Trade'
    },
    
    // 탭
    tabs: {
      dashboard: 'Dashboard',
      trades: 'Trades',
      alerts: 'Crypto Alerts',
      analytics: 'Analytics'
    },
    
    // 대시보드
    dashboard: {
      totalAssets: 'Total Assets',
      todayReturn: 'Today\'s Return',
      activeAlerts: 'Active Alerts',
      popularCoins: 'Popular Coin Prices',
      popularCoinsDesc: 'Check real-time cryptocurrency prices',
      recentTrades: 'Recent Trades',
      recentTradesDesc: 'View your recent trading history',
      buy: 'Buy',
      sell: 'Sell',
      shares: 'shares',
      settedAlerts: 'Set Alerts',
      yesterdayCompare: 'vs Yesterday',
      updated: 'Updated'
    },
    
    // 거래 내역
    trades: {
      title: 'Trading History',
      description: 'Manage all your trading records',
      comingSoon: 'Trading history feature coming soon.',
      noTrades: 'No trading records yet',
      noTradesDesc: 'Add your first trade',
      justNow: 'just now',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago',
      daysAgo: 'days ago',
      weeksAgo: 'weeks ago',
      monthsAgo: 'months ago',
      yearsAgo: 'years ago'
    },
    
    // 코인 알람
    alerts: {
      title: 'Crypto Price Alerts',
      description: 'Get notified when your target price is reached',
      totalAlerts: 'Total Alerts',
      activeAlerts: 'Active Alerts',
      triggeredAlerts: 'Triggered',
      inactiveAlerts: 'Inactive',
      addNewAlert: 'Add New Alert',
      editAlert: 'Edit Alert',
      noAlerts: 'No alerts yet',
      noAlertsDesc: 'Add your first price alert to get\nnotified when your target price is reached',
      
      // 알람 폼
      form: {
        selectCoin: 'Select Coin',
        selectCoinPlaceholder: 'Choose a cryptocurrency',
        currency: 'Currency',
        targetPrice: 'Target Price',
        targetPricePlaceholder: '0.00',
        alertCondition: 'Alert Condition',
        above: '📈Above (when price is above target)',
        below: '📉Below (when price is below target)',
        add: 'Add',
        update: 'Update',
        cancel: 'Cancel'
      },
      
      // 알람 목록
      list: {
        active: 'Active',
        inactive: 'Inactive',
        triggered: 'Triggered',
        above: 'above',
        below: 'below',
        createdAt: 'Created',
        triggeredAt: 'Triggered'
      }
    },
    
    // 분석
    analytics: {
      title: 'Investment Analytics',
      description: 'Analyze your investment performance and find improvements',
      comingSoon: 'Analytics feature coming soon.'
    },
    
    // 알림 설정
    notifications: {
      title: 'Notification Settings',
      browserNotifications: 'Browser Notifications',
      browserNotificationsDesc: 'Receive browser notifications when crypto price alerts are triggered',
      notificationPermission: 'Notification Permission',
      granted: 'Granted',
      denied: 'Denied',
      pending: 'Pending',
      notSupported: 'Not Supported',
      grantedDesc: 'Notifications are working properly.',
      deniedDesc: 'Please allow notification permission in browser settings.',
      pendingDesc: 'Please request notification permission.',
      notSupportedDesc: 'This browser does not support notifications.',
      allowNotifications: 'Allow Notifications',
      sendTestNotification: 'Send Test Notification',
      notificationSettings: 'Notification Settings',
      notificationSettingsDesc: 'Customize notification behavior',
      notificationSound: 'Notification Sound',
      notificationSoundDesc: 'Play sound when alert is triggered',
      autoClose: 'Auto Close',
      autoCloseDesc: 'Automatically close notification after 5 seconds',
      howToUse: 'How to Use Notifications',
      step1: 'Allow browser notification permission.',
      step2: 'Set up and activate crypto alerts.',
      step3: 'Receive automatic notifications when target price is reached.',
      step4: 'Get notifications even when browser is in background.',
      permissionDeniedWarning: 'Notification permission denied. Please click the notification icon next to the address bar or allow notifications for this site in browser settings.'
    },
    
    // 알림 메시지
    alertNotifications: {
      priceAlert: 'Price Alert',
      priceReached: 'Target price reached!',
      currentPrice: 'Current Price',
      targetPrice: 'Target Price',
      testNotification: 'Test Notification',
      testNotificationBody: 'Notifications are working properly!'
    },

    // 푸터
    footer: {
      description: 'Manage professional trading journals and real-time crypto price alerts in one place. Record and analyze your investment performance systematically to make better investment decisions.',
      features: 'Key Features',
      tradingJournal: 'Trading Journal Management',
      cryptoAlerts: 'Crypto Price Alerts',
      realTimePrice: 'Real-time Price Monitoring',
      csvExport: 'CSV Export/Import',
      multiLanguage: 'Multi-language Support',
      howToUse: 'How to Use',
      step1: 'Add trading records to build your portfolio',
      step2: 'Set crypto price alerts to never miss opportunities',
      step3: 'Analyze investment patterns with trading strategies and detailed notes',
      step4: 'Backup and manage data with CSV functionality',
      aboutService: 'About Service',
      seoDescription: 'TradingDiaryPro is an all-in-one investment management platform for individual investors. It provides trading journal creation, crypto price alerts, and real-time market data monitoring to help systematic investment management.',
      keywords: 'Keywords',
      keywordsList: 'trading journal, investment diary, crypto alerts, cryptocurrency, bitcoin, ethereum, investment management, portfolio, stock trading, price alerts, real-time charts, investment analysis, profit calculation, trading records',
      copyright: 'All rights reserved.'
    }
  },
  
  zh: {
    // 공통
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      refresh: '刷新'
    },
    
    // 헤더
    header: {
      title: '交易日志',
      notificationSettings: '通知设置',
      alertSettings: '警报设置',
      addTrade: '添加交易'
    },
    
    // 탭
    tabs: {
      dashboard: '仪表板',
      trades: '交易记录',
      alerts: '加密货币警报',
      analytics: '分析'
    },
    
    // 대시보드
    dashboard: {
      totalAssets: '总资产',
      todayReturn: '今日收益',
      activeAlerts: '活跃警报',
      popularCoins: '热门币种价格',
      popularCoinsDesc: '查看实时加密货币价格',
      recentTrades: '最近交易',
      recentTradesDesc: '查看您的最近交易记录',
      buy: '买入',
      sell: '卖出',
      shares: '股',
      settedAlerts: '设置警报',
      yesterdayCompare: '较昨日',
      updated: '更新'
    },
    
    // 거래 내역
    trades: {
      title: '交易历史',
      description: '管理您的所有交易记录',
      comingSoon: '交易历史功能即将推出。',
      noTrades: '暂无交易记录',
      noTradesDesc: '添加您的第一笔交易',
      justNow: '刚刚',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前',
      weeksAgo: '周前',
      monthsAgo: '个月前',
      yearsAgo: '年前'
    },
    
    // 코인 알람
    alerts: {
      title: '加密货币价格警报',
      description: '当达到目标价格时获得通知',
      totalAlerts: '总警报',
      activeAlerts: '活跃警报',
      triggeredAlerts: '已触发',
      inactiveAlerts: '非活跃',
      addNewAlert: '添加新警报',
      editAlert: '编辑警报',
      noAlerts: '暂无警报',
      noAlertsDesc: '添加您的第一个价格警报\n当达到目标价格时获得通知',
      
      // 알람 폼
      form: {
        selectCoin: '选择币种',
        selectCoinPlaceholder: '选择一个加密货币',
        currency: '货币',
        targetPrice: '目标价格',
        targetPricePlaceholder: '0.00',
        alertCondition: '警报条件',
        above: '📈高于（当价格高于目标时）',
        below: '📉低于（当价格低于目标时）',
        add: '添加',
        update: '更新',
        cancel: '取消'
      },
      
      // 알람 목록
      list: {
        active: '活跃',
        inactive: '非活跃',
        triggered: '已触发',
        above: '高于',
        below: '低于',
        createdAt: '创建时间',
        triggeredAt: '触发时间'
      }
    },
    
    // 분석
    analytics: {
      title: '投资分析',
      description: '分析您的投资表现并找到改进点',
      comingSoon: '分析功能即将推出。'
    },
    
    // 알림 설정
    notifications: {
      title: '通知设置',
      browserNotifications: '浏览器通知',
      browserNotificationsDesc: '当加密货币价格警报触发时接收浏览器通知',
      notificationPermission: '通知权限',
      granted: '已允许',
      denied: '已拒绝',
      pending: '待处理',
      notSupported: '不支持',
      grantedDesc: '通知正常工作。',
      deniedDesc: '请在浏览器设置中允许通知权限。',
      pendingDesc: '请请求通知权限。',
      notSupportedDesc: '此浏览器不支持通知。',
      allowNotifications: '允许通知',
      sendTestNotification: '发送测试通知',
      notificationSettings: '通知设置',
      notificationSettingsDesc: '自定义通知行为',
      notificationSound: '通知声音',
      notificationSoundDesc: '警报触发时播放声音',
      autoClose: '自动关闭',
      autoCloseDesc: '5秒后自动关闭通知',
      howToUse: '如何使用通知',
      step1: '允许浏览器通知权限。',
      step2: '设置并激活加密货币警报。',
      step3: '当达到目标价格时自动接收通知。',
      step4: '即使浏览器在后台也能接收通知。',
      permissionDeniedWarning: '通知权限被拒绝。请点击地址栏旁边的通知图标或在浏览器设置中允许此网站的通知。'
    },
    
    // 알림 메시지
    alertNotifications: {
      priceAlert: '价格警报',
      priceReached: '已达到目标价格！',
      currentPrice: '当前价格',
      targetPrice: '目标价格',
      testNotification: '测试通知',
      testNotificationBody: '通知正常工作！'
    },

    // 푸터
    footer: {
      description: '在一个地方管理专业的交易日志和实时加密货币价格警报。系统地记录和分析您的投资表现，做出更好的投资决策。',
      features: '主要功能',
      tradingJournal: '交易日志管理',
      cryptoAlerts: '加密货币价格警报',
      realTimePrice: '实时价格监控',
      csvExport: 'CSV导出/导入',
      multiLanguage: '多语言支持',
      howToUse: '使用方法',
      step1: '添加交易记录构建您的投资组合',
      step2: '设置加密货币价格警报，不错过机会',
      step3: '通过交易策略和详细笔记分析投资模式',
      step4: '使用CSV功能备份和管理数据',
      aboutService: '关于服务',
      seoDescription: 'TradingDiaryPro是为个人投资者打造的一体化投资管理平台。提供交易日志创建、加密货币价格警报和实时市场数据监控，帮助系统化投资管理。',
      keywords: '关键词',
      keywordsList: '交易日志, 投资日记, 加密货币警报, 加密货币, 比特币, 以太坊, 投资管理, 投资组合, 股票交易, 价格警报, 实时图表, 投资分析, 利润计算, 交易记录',
      copyright: '版权所有。'
    }
  },
  
  ja: {
    // 공통
    common: {
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      cancel: 'キャンセル',
      confirm: '確認',
      save: '保存',
      delete: '削除',
      edit: '編集',
      add: '追加',
      close: '閉じる',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      search: '検索',
      filter: 'フィルター',
      sort: 'ソート',
      refresh: '更新'
    },
    
    // 헤더
    header: {
      title: '取引日記',
      notificationSettings: '通知設定',
      alertSettings: 'アラート設定',
      addTrade: '取引追加'
    },
    
    // 탭
    tabs: {
      dashboard: 'ダッシュボード',
      trades: '取引履歴',
      alerts: '暗号通貨アラート',
      analytics: '分析'
    },
    
    // 대시보드
    dashboard: {
      totalAssets: '総資産',
      todayReturn: '今日の収益',
      activeAlerts: 'アクティブアラート',
      popularCoins: '人気コイン価格',
      popularCoinsDesc: 'リアルタイム暗号通貨価格を確認',
      recentTrades: '最近の取引',
      recentTradesDesc: '最近の取引履歴を確認',
      buy: '買い',
      sell: '売り',
      shares: '株',
      settedAlerts: '設定済みアラート',
      yesterdayCompare: '前日比',
      updated: '更新'
    },
    
    // 거래 내역
    trades: {
      title: '取引履歴',
      description: 'すべての取引記録を管理',
      comingSoon: '取引履歴機能は近日公開予定です。',
      noTrades: '取引記録がありません',
      noTradesDesc: '最初の取引を追加してください',
      justNow: 'たった今',
      minutesAgo: '分前',
      hoursAgo: '時間前',
      daysAgo: '日前',
      weeksAgo: '週間前',
      monthsAgo: 'ヶ月前',
      yearsAgo: '年前'
    },
    
    // 코인 알람
    alerts: {
      title: '暗号通貨価格アラート',
      description: '目標価格に達したときに通知を受け取る',
      totalAlerts: '総アラート',
      activeAlerts: 'アクティブアラート',
      triggeredAlerts: 'トリガー済み',
      inactiveAlerts: '非アクティブ',
      addNewAlert: '新しいアラートを追加',
      editAlert: 'アラート編集',
      noAlerts: 'アラートがありません',
      noAlertsDesc: '最初の価格アラートを追加して\n目標価格に達したときに通知を受け取りましょう',
      
      // 알람 폼
      form: {
        selectCoin: 'コイン選択',
        selectCoinPlaceholder: '暗号通貨を選択',
        currency: '通貨',
        targetPrice: '目標価格',
        targetPricePlaceholder: '0.00',
        alertCondition: 'アラート条件',
        above: '📈以上（価格が目標以上の時）',
        below: '📉以下（価格が目標以下の時）',
        add: '追加',
        update: '更新',
        cancel: 'キャンセル'
      },
      
      // 알람 목록
      list: {
        active: 'アクティブ',
        inactive: '非アクティブ',
        triggered: 'トリガー済み',
        above: '以上',
        below: '以下',
        createdAt: '作成日',
        triggeredAt: 'トリガー日'
      }
    },
    
    // 분석
    analytics: {
      title: '投資分析',
      description: '投資パフォーマンスを分析し改善点を見つける',
      comingSoon: '分析機能は近日公開予定です。'
    },
    
    // 알림 설정
    notifications: {
      title: '通知設定',
      browserNotifications: 'ブラウザ通知',
      browserNotificationsDesc: '暗号通貨価格アラートがトリガーされたときにブラウザ通知を受け取る',
      notificationPermission: '通知権限',
      granted: '許可済み',
      denied: '拒否済み',
      pending: '保留中',
      notSupported: 'サポートされていません',
      grantedDesc: '通知が正常に動作しています。',
      deniedDesc: 'ブラウザ設定で通知権限を許可してください。',
      pendingDesc: '通知権限をリクエストしてください。',
      notSupportedDesc: 'このブラウザは通知をサポートしていません。',
      allowNotifications: '通知を許可',
      sendTestNotification: 'テスト通知を送信',
      notificationSettings: '通知設定',
      notificationSettingsDesc: '通知動作をカスタマイズ',
      notificationSound: '通知音',
      notificationSoundDesc: 'アラートトリガー時に音で通知',
      autoClose: '自動閉じる',
      autoCloseDesc: '5秒後に通知を自動で閉じる',
      howToUse: '通知の使い方',
      step1: 'ブラウザ通知権限を許可してください。',
      step2: '暗号通貨アラートを設定し有効化してください。',
      step3: '目標価格に達すると自動で通知を受け取ります。',
      step4: 'ブラウザがバックグラウンドでも通知を受け取れます。',
      permissionDeniedWarning: '通知権限が拒否されました。アドレスバーの横の通知アイコンをクリックするか、ブラウザ設定でこのサイトの通知を許可してください。'
    },
    
    // 알림 메시지
    alertNotifications: {
      priceAlert: '価格アラート',
      priceReached: '目標価格に達しました！',
      currentPrice: '現在価格',
      targetPrice: '目標価格',
      testNotification: 'テスト通知',
      testNotificationBody: '通知が正常に動作しています！'
    },

    // 푸터
    footer: {
      description: 'プロフェッショナルな取引日記とリアルタイム暗号通貨価格アラートを一箇所で管理。投資パフォーマンスを体系的に記録・分析し、より良い投資判断を行えます。',
      features: '主要機能',
      tradingJournal: '取引日記管理',
      cryptoAlerts: '暗号通貨価格アラート',
      realTimePrice: 'リアルタイム価格監視',
      csvExport: 'CSVエクスポート/インポート',
      multiLanguage: '多言語サポート',
      howToUse: '使用方法',
      step1: '取引記録を追加してポートフォリオを構築',
      step2: '暗号通貨価格アラートを設定して機会を逃さない',
      step3: '取引戦略と詳細なメモで投資パターンを分析',
      step4: 'CSV機能でデータをバックアップ・管理',
      aboutService: 'サービスについて',
      seoDescription: 'TradingDiaryProは個人投資家向けのオールインワン投資管理プラットフォームです。取引日記作成、暗号通貨価格アラート、リアルタイム市場データ監視機能を提供し、体系的な投資管理をサポートします。',
      keywords: 'キーワード',
      keywordsList: '取引日記, 投資日記, 暗号通貨アラート, 暗号通貨, ビットコイン, イーサリアム, 投資管理, ポートフォリオ, 株式取引, 価格アラート, リアルタイムチャート, 投資分析, 利益計算, 取引記録',
      copyright: '全著作権所有。'
    }
  }
}

// 현재 언어 상태
let currentLanguage = 'ko'

/**
 * 현재 언어 설정
 * @param {string} language - 언어 코드
 */
export const setLanguage = (language) => {
  if (SUPPORTED_LANGUAGES[language]) {
    currentLanguage = language
    localStorage.setItem('preferred-language', language)
  }
}

/**
 * 현재 언어 가져오기
 * @returns {string} 현재 언어 코드
 */
export const getCurrentLanguage = () => {
  return currentLanguage
}

/**
 * 저장된 언어 설정 로드
 */
export const loadSavedLanguage = () => {
  const saved = localStorage.getItem('preferred-language')
  if (saved && SUPPORTED_LANGUAGES[saved]) {
    currentLanguage = saved
  } else {
    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0]
    if (SUPPORTED_LANGUAGES[browserLang]) {
      currentLanguage = browserLang
    }
  }
}

/**
 * 번역 텍스트 가져오기
 * @param {string} key - 번역 키 (예: 'common.loading', 'alerts.title')
 * @param {Object} params - 치환할 매개변수
 * @returns {string} 번역된 텍스트
 */
export const t = (key, params = {}) => {
  const keys = key.split('.')
  let value = translations[currentLanguage]
  
  // 중첩된 키 탐색
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 키를 찾을 수 없으면 영어로 폴백
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          // 영어에도 없으면 키 자체를 반환
          return key
        }
      }
      break
    }
  }
  
  // 문자열이 아니면 키 반환
  if (typeof value !== 'string') {
    return key
  }
  
  // 매개변수 치환
  let result = value
  Object.keys(params).forEach(param => {
    result = result.replace(new RegExp(`{${param}}`, 'g'), params[param])
  })
  
  return result
}

/**
 * 통화 포맷팅
 * @param {number} amount - 금액
 * @param {string} currency - 통화 코드
 * @returns {string} 포맷된 금액
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const locale = {
    ko: 'ko-KR',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP'
  }[currentLanguage] || 'en-US'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: currency.toLowerCase() === 'krw' ? 0 : 2,
    maximumFractionDigits: currency.toLowerCase() === 'krw' ? 0 : 8
  }).format(amount)
}

/**
 * 날짜 포맷팅
 * @param {Date|number} date - 날짜
 * @param {Object} options - 포맷 옵션
 * @returns {string} 포맷된 날짜
 */
export const formatDate = (date, options = {}) => {
  const locale = {
    ko: 'ko-KR',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP'
  }[currentLanguage] || 'en-US'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date))
}

// 초기화
loadSavedLanguage()

