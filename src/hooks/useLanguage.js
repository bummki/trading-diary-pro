import { useState, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  ko: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'KR',
      generalSettings: '일반 설정',
      alertSettings: '알람 설정',
      addTrade: '거래 추가',
      
      // Navigation
      dashboard: '대시보드',
      trades: '거래 내역',
      alerts: '코인 알람',
      analysis: '분석',
      
      // Dashboard Cards
      totalAssets: '총 자산',
      totalTrades: '총 거래',
      cumulativePnl: '누적 손익',
      todayReturn: '오늘 수익률',
      activeAlerts: '활성 알람',
      previousDay: '전일 대비',
      setAlerts: '설정된 알람',
      alertsTriggered: '개 알람 발생',
      currency: 'KRW',
      locale: 'ko-KR',
      completedTrades: '완료된 거래',
      winRate: '승률',
      avgPnl: '평균 손익',
      avgPerTrade: '거래당 평균',
      maxProfit: '최대 수익',
      maxLoss: '최대 손실',
      singleTradeMax: '단일 거래 최대',
      tradingDiary: '매매일지',

      // Footer
      footer_about_title: 'TradingDiaryPro 소개',
      footer_about_desc1: 'TradingDiaryPro는 암호화폐 및 주식 투자자를 위한 올인원 매매일지 및 분석 도구입니다. 복잡한 시장 데이터를 한눈에 파악하고, 개인의 투자 기록을 체계적으로 관리하며, 심층적인 분석을 통해 투자 전략을 개선할 수 있도록 돕습니다.',
      footer_about_desc2: '실시간 코인 가격 알림, 상세한 거래 내역 관리, 그리고 직관적인 성과 지표 대시보드를 제공하여 사용자가 정보에 기반한 현명한 투자 결정을 내릴 수 있도록 지원합니다. 특히 한국 투자자들의 요구를 반영하여 개발되었으며, 국내외 주요 암호화폐 및 주식 시장 데이터를 통합적으로 제공합니다.',
      footer_features_title: '주요 기능',
      footer_feature1: '실시간 코인 가격 및 알림: 중요한 매수 매도 시점을 놓치지 않도록 도와줍니다.',
      footer_feature2: '매매일지 작성 및 관리: 자신만의 투자 기록을 체계화하고 학습 효과를 극대화합니다.',
      footer_feature3: '성과 지표 대시보드: 자신의 투자 성과를 객관적으로 평가하고 강점과 약점을 파악합니다.',
      footer_feature4: '다국어 지원: 한국어를 포함한 다양한 언어를 지원하여 전 세계 사용자들이 편리하게 이용할 수 있습니다.',
      footer_feature5: '데이터 내보내기 가져오기: 데이터 백업 및 다른 분석 도구와의 연동이 용이합니다.',
      footer_usage_title: 'TradingDiaryPro 사용법',
      footer_usage1_strong: '접근 및 시작',
      footer_usage1_text: '별도의 회원가입 로그인 기능 없이 웹 브라우저에서 바로 접근하여 사용할 수 있습니다. 모든 데이터는 로컬 브라우저에 안전하게 저장됩니다.',
      footer_usage2_strong: '대시보드 확인',
      footer_usage2_text: '앱 실행 시 대시보드에서 실시간 코인 가격, 주요 성과 지표 요약, 최근 거래 내역을 한눈에 확인하세요.',
      footer_usage3_strong: '매매일지 작성',
      footer_usage3_text: '상단 메뉴의 \'매매일지\' 탭에서 새 일지 작성 폼에 정보를 입력하고 저장하세요. 주식 종목 자동 인식 기능도 활용할 수 있습니다.',
      footer_usage4_strong: '거래 내역 관리',
      footer_usage4_text: '\'거래 내역\' 탭에서 모든 매매 기록을 확인, 수정, 삭제할 수 있습니다.',
      footer_usage5_strong: '알림 설정',
      footer_usage5_text: '\'코인 알림\' 탭에서 특정 코인의 가격 알림을 설정하여 중요한 시점을 놓치지 마세요.',
      footer_usage6_strong: '데이터 백업 및 복원',
      footer_usage6_text: '\'매매일지\' 모달 내 \'내보내기\' \'가져오기\' 버튼으로 데이터를 안전하게 관리하세요.',
      footer_contact_title: '문의 및 지원',
      footer_contact_desc1: 'TradingDiaryPro 사용 중 궁금한 점이나 기술적인 문제가 발생하면 언제든지 다음 이메일 주소로 문의해 주세요:',
      footer_contact_desc2: '저희 팀은 사용자 여러분의 성공적인 투자를 위해 최선을 다하겠습니다. 감사합니다.',
      footer_copyright: 'All rights reserved.',

      
      // Coin Prices
      popularCoins: '인기 코인 가격',
      lastUpdated: '업데이트',
      refresh: '새로고침',
      priceLoadError: '가격 정보를 불러오는데 실패했습니다',
      realTimePrices: '실시간 코인 가격을 확인하세요',
      justNow: '방금 전',
      
      // Recent Trades
      recentTrades: '최근 거래',
      recentTradesDesc: '최근 거래 내역을 확인하세요',
      noTrades: '아직 거래 기록이 없습니다',
      noTradesDesc: '거래 내역 탭에서 첫 번째 거래를 추가해보세요',
      addFirstTrade: '거래 추가하기',
      
      // Trades Page
      newTrade: '새 거래 추가',
      noTradesData: '거래 내역이 없습니다',
      addFirstTradeDesc: '첫 번째 거래를 추가해보세요',
      
      // Alerts Page
      newAlert: '새 알람 추가',
      firstAlert: '첫 번째 알람 추가',
      triggeredAlerts: '발생한 알람',
      clearAll: '모두 지우기',
      activeAlertsList: '활성 알람',
      noAlertsSet: '설정된 알람이 없습니다',
      noAlertsDesc: '코인 가격 알람을 설정해보세요',
      alertTriggered: '알람 발생',
      target: '목표',
      current: '현재',
      created: '생성',
      above: '이상',
      below: '이하',
      triggered: '발생됨',
      active: '활성',
      inactive: '비활성',
      
      // Add Alert Modal
      addNewAlert: '새 알람 추가',
      selectCoin: '코인 선택',
      selectCoinPlaceholder: '코인을 선택하세요',
      currentPrice: '현재 가격',
      alertCondition: '알람 조건',
      priceAbove: '가격 이상',
      priceBelow: '가격 이하',
      targetPrice: '목표 가격 (USD)',
      targetPricePlaceholder: '목표 가격을 입력하세요',
      cancel: '취소',
      addAlert: '알람 추가',
      
      // Validation
      selectCoinError: '코인을 선택해주세요',
      validPriceError: '유효한 가격을 입력해주세요',
      
      // Analysis Page
      noAnalysisData: '분석 데이터가 없습니다',
      noAnalysisDesc: '거래 데이터가 쌓이면 분석 결과를 확인할 수 있습니다'
    }
  },
  
  en: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'EN',
      generalSettings: 'General Settings',
      alertSettings: 'Alert Settings',
      addTrade: 'Add Trade',
      
      // Navigation
      dashboard: 'Dashboard',
      trades: 'Trade History',
      alerts: 'Coin Alerts',
      analysis: 'Analysis',
      
      // Dashboard Cards
      totalAssets: 'Total Assets',
      totalTrades: 'Total Trades',
      cumulativePnl: 'Cumulative PnL',
      todayReturn: 'Today\'s Return',
      activeAlerts: 'Active Alerts',
      previousDay: 'vs Previous Day',
      setAlerts: 'Set Alerts',
      alertsTriggered: ' alerts triggered',
      currency: 'USD',
      locale: 'en-US',
      completedTrades: 'completed trades',
      winRate: 'Win Rate',
      avgPnl: 'Avg. PnL',
      avgPerTrade: 'Avg. per trade',
      maxProfit: 'Max Profit',
      maxLoss: 'Max Loss',
      singleTradeMax: 'Single trade max',
      tradingDiary: 'Trading Diary',

      // Footer
      footer_about_title: 'About TradingDiaryPro',
      footer_about_desc1: 'TradingDiaryPro is an all-in-one trading journal and analysis tool for cryptocurrency and stock investors. It helps you grasp complex market data at a glance, systematically manage your personal investment records, and improve your investment strategies through in-depth analysis.',
      footer_about_desc2: 'We provide real-time coin price alerts, detailed transaction history management, and an intuitive performance metric dashboard to help users make informed investment decisions. Developed with the needs of Korean investors in mind, it provides integrated data from major domestic and international cryptocurrency and stock markets.',
      footer_features_title: 'Key Features',
      footer_feature1: 'Real-time Coin Prices and Alerts: Helps you not miss important buy and sell timings.',
      footer_feature2: 'Trading Journal Creation and Management: Systematize your investment records and maximize learning effects.',
      footer_feature3: 'Performance Metric Dashboard: Objectively evaluate your investment performance and identify strengths and weaknesses.',
      footer_feature4: 'Multi-language Support: Supports various languages including Korean, allowing users worldwide to use it conveniently.',
      footer_feature5: 'Data Export and Import: Easily manage data backups and link with other analysis tools.',
      footer_usage_title: 'How to Use TradingDiaryPro',
      footer_usage1_strong: 'Access and Start',
      footer_usage1_text: 'You can access and use it directly from your web browser without separate registration or login. All data is securely stored in your local browser.',
      footer_usage2_strong: 'Check Dashboard',
      footer_usage2_text: 'Upon launching the app, check real-time coin prices, key performance metric summaries, and recent transaction history at a glance on the dashboard.',
      footer_usage3_strong: 'Create Trading Journal',
      footer_usage3_text: 'In the \'Trading Journal\' tab in the top menu, enter information into the new journal creation form and save it. You can also use the automatic stock recognition feature.',
      footer_usage4_strong: 'Manage Transaction History',
      footer_usage4_text: 'In the \'Transaction History\' tab, you can view, modify, and delete all trading records.',
      footer_usage5_strong: 'Set Alerts',
      footer_usage5_text: 'In the \'Coin Alerts\' tab, set price alerts for specific coins so you don\'t miss important moments.',
      footer_usage6_strong: 'Data Backup and Restore',
      footer_usage6_text: 'Securely manage your data with the \'Export\' and \'Import\' buttons within the \'Trading Journal\' modal.',
      footer_contact_title: 'Inquiries and Support',
      footer_contact_desc1: 'If you have any questions or technical issues while using TradingDiaryPro, please contact us at the following email address:',
      footer_contact_desc2: 'Our team will do our best to support your successful investment. Thank you.',
      footer_copyright: 'All rights reserved.',

      
      // Coin Prices
      popularCoins: 'Popular Coin Prices',
      lastUpdated: 'Updated',
      refresh: 'Refresh',
      priceLoadError: 'Failed to load price information',
      realTimePrices: 'Check real-time coin prices',
      justNow: 'just now',
      
      // Recent Trades
      recentTrades: 'Recent Trades',
      recentTradesDesc: 'Check your recent trading history',
      noTrades: 'No trading records yet',
      noTradesDesc: 'Add your first trade in the Trade History tab',
      addFirstTrade: 'Add Trade',
      
      // Trades Page
      newTrade: 'Add New Trade',
      noTradesData: 'No trading history',
      addFirstTradeDesc: 'Add your first trade',
      
      // Alerts Page
      newAlert: 'Add New Alert',
      firstAlert: 'Add First Alert',
      triggeredAlerts: 'Triggered Alerts',
      clearAll: 'Clear All',
      activeAlertsList: 'Active Alerts',
      noAlertsSet: 'No alerts set',
      noAlertsDesc: 'Set up coin price alerts',
      alertTriggered: 'Alert Triggered',
      target: 'Target',
      current: 'Current',
      created: 'Created',
      above: 'above',
      below: 'below',
      triggered: 'Triggered',
      active: 'Active',
      inactive: 'Inactive',
      
      // Add Alert Modal
      addNewAlert: 'Add New Alert',
      selectCoin: 'Select Coin',
      selectCoinPlaceholder: 'Please select a coin',
      currentPrice: 'Current Price',
      alertCondition: 'Alert Condition',
      priceAbove: 'Price Above',
      priceBelow: 'Price Below',
      targetPrice: 'Target Price (USD)',
      targetPricePlaceholder: 'Enter target price',
      cancel: 'Cancel',
      addAlert: 'Add Alert',
      
      // Validation
      selectCoinError: 'Please select a coin',
      validPriceError: 'Please enter a valid price',
      
      // Analysis Page
      noAnalysisData: 'No analysis data',
      noAnalysisDesc: 'Analysis results will be available once trading data accumulates'
    }
  },
  
  zh: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'CN',
      generalSettings: '通用设置',
      alertSettings: '警报设置',
      addTrade: '添加交易',
      
      // Navigation
      dashboard: '仪表板',
      trades: '交易历史',
      alerts: '币种警报',
      analysis: '分析',
      
      // Dashboard Cards
      totalAssets: '总资产',
      totalTrades: '总交易',
      cumulativePnl: '累计盈亏',
      todayReturn: '今日收益',
      activeAlerts: '活跃警报',
      previousDay: '较前日',
      setAlerts: '设置警报',
      alertsTriggered: "个警报触发",
      currency: "CNY",
      locale: "zh-CN",
      completedTrades: '已完成交易',
      winRate: '胜率',
      avgPnl: '平均盈亏',
      avgPerTrade: '每笔交易平均',
      maxProfit: '最大利润',
      maxLoss: '最大亏损',
      singleTradeMax: '单笔交易最大',
      tradingDiary: "交易日记",

      // Footer
      footer_about_title: "关于 TradingDiaryPro",
      footer_about_desc1: "TradingDiaryPro 是一款为加密货币和股票投资者设计的一体化交易日志和分析工具。它帮助您一目了然地掌握复杂的市场数据，系统地管理您的个人投资记录，并通过深入分析改进您的投资策略。",
      footer_about_desc2: "我们提供实时币种价格警报、详细的交易历史管理以及直观的绩效指标仪表板，帮助用户做出明智的投资决策。该工具在开发时充分考虑了韩国投资者的需求，并集成了国内外主要加密货币和股票市场的数据。",
      footer_features_title: "主要功能",
      footer_feature1: "实时币种价格和警报：帮助您不错过重要的买卖时机。",
      footer_feature2: "交易日志创建和管理：系统化您的投资记录，最大限度地提高学习效果。",
      footer_feature3: "绩效指标仪表板：客观评估您的投资绩效，找出优势和劣势。",
      footer_feature4: "多语言支持：支持包括韩语在内的多种语言，方便全球用户使用。",
      footer_feature5: "数据导出和导入：轻松管理数据备份并与其他分析工具联动。",
      footer_usage_title: "如何使用 TradingDiaryPro",
      footer_usage1_strong: "访问和开始",
      footer_usage1_text: "您无需单独注册或登录，即可直接通过网络浏览器访问和使用。所有数据都安全地存储在您的本地浏览器中。",
      footer_usage2_strong: "查看仪表板",
      footer_usage2_text: "启动应用程序后，在仪表板上一目了然地查看实时币种价格、关键绩效指标摘要和最近的交易历史。",
      footer_usage3_strong: "创建交易日志",
      footer_usage3_text: "在顶部菜单的“交易日志”选项卡中，将信息输入到新的日志创建表单中并保存。您还可以使用自动股票识别功能。",
      footer_usage4_strong: "管理交易历史",
      footer_usage4_text: "在“交易历史”选项卡中，您可以查看、修改和删除所有交易记录。",
      footer_usage5_strong: "设置警报",
      footer_usage5_text: "在“币种警报”选项卡中，为特定币种设置价格警报，这样您就不会错过重要时刻。",
      footer_usage6_strong: "数据备份和恢复",
      footer_usage6_text: "使用“交易日志”模态框中的“导出”和“导入”按钮安全地管理您的数据。",
      footer_contact_title: "咨询与支持",
      footer_contact_desc1: "如果您在使用 TradingDiaryPro 过程中有任何疑问或遇到技术问题，请随时通过以下电子邮件地址联系我们：",
      footer_contact_desc2: "我们的团队将竭尽全力支持您的成功投资。谢谢。",
      footer_copyright: "保留所有权利。",

      
      // Coin Prices
      popularCoins: '热门币种价格',
      lastUpdated: '更新时间',
      refresh: '刷新',
      priceLoadError: '加载价格信息失败',
      realTimePrices: '查看实时币种价格',
      justNow: '刚刚',
      
      // Recent Trades
      recentTrades: '最近交易',
      recentTradesDesc: '查看您的最近交易历史',
      noTrades: '暂无交易记录',
      noTradesDesc: '在交易历史标签中添加您的第一笔交易',
      addFirstTrade: '添加交易',
      
      // Trades Page
      newTrade: '添加新交易',
      noTradesData: '无交易历史',
      addFirstTradeDesc: '添加您的第一笔交易',
      
      // Alerts Page
      newAlert: '添加新警报',
      firstAlert: '添加第一个警报',
      triggeredAlerts: '触发的警报',
      clearAll: '全部清除',
      activeAlertsList: '活跃警报',
      noAlertsSet: '未设置警报',
      noAlertsDesc: '设置币种价格警报',
      alertTriggered: '警报触发',
      target: '目标',
      current: '当前',
      created: '创建',
      above: '以上',
      below: '以下',
      triggered: '已触发',
      active: '活跃',
      inactive: '非活跃',
      
      // Add Alert Modal
      addNewAlert: '添加新警报',
      selectCoin: '选择币种',
      selectCoinPlaceholder: '请选择币种',
      currentPrice: '当前价格',
      alertCondition: '警报条件',
      priceAbove: '价格以上',
      priceBelow: '价格以下',
      targetPrice: '目标价格 (USD)',
      targetPricePlaceholder: '输入目标价格',
      cancel: '取消',
      addAlert: '添加警报',
      
      // Validation
      selectCoinError: '请选择币种',
      validPriceError: '请输入有效价格',
      
      // Analysis Page
      noAnalysisData: '无分析数据',
      noAnalysisDesc: '交易数据积累后将显示分析结果'
    }
  },
  
  ja: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'JP',
      generalSettings: '一般設定',
      alertSettings: 'アラート設定',
      addTrade: '取引追加',
      
      // Navigation
      dashboard: 'ダッシュボード',
      trades: '取引履歴',
      alerts: 'コインアラート',
      analysis: '分析',
      
      // Dashboard Cards
      totalAssets: '総資産',
      totalTrades: '総取引',
      cumulativePnl: '累積損益',
      todayReturn: '今日の収益',
      activeAlerts: 'アクティブアラート',
      previousDay: '前日比',
      setAlerts: '設定アラート',
      alertsTriggered: "つのアラートが発生",
      currency: "JPY",
      locale: "ja-JP",
      completedTrades: '完了した取引',
      winRate: '勝率',
      avgPnl: '平均損益',
      avgPerTrade: '取引あたりの平均',
      maxProfit: '最大利益',
      maxLoss: '最大損失',
      singleTradeMax: '単一取引の最大',
      tradingDiary: '取引日記',

      // Footer
      footer_about_title: 'TradingDiaryProについて',
      footer_about_desc1: 'TradingDiaryProは、暗号通貨および株式投資家向けオールインワンの取引日誌および分析ツールです。複雑な市場データを一目で把握し、個人の投資記録を体系的に管理し、詳細な分析を通じて投資戦略を改善するのに役立ちます。',
      footer_about_desc2: 'リアルタイムのコイン価格アラート、詳細な取引履歴管理、直感的なパフォーマンス指標ダッシュボードを提供し、ユーザーが情報に基づいた賢明な投資決定を下せるよう支援します。特に韓国の投資家のニーズを考慮して開発されており、国内外の主要な暗号通貨および株式市場データを統合して提供します。',
      footer_features_title: '主な機能',
      footer_feature1: 'リアルタイムコイン価格とアラート：重要な売買タイミングを逃さないようにします。',
      footer_feature2: '取引日誌の作成と管理：投資記録を体系化し、学習効果を最大化します。',
      footer_feature3: 'パフォーマンス指標ダッシュボード：投資パフォーマンスを客観的に評価し、強みと弱みを特定します。',
      footer_feature4: '多言語対応：韓国語を含む多様な言語をサポートし、世界中のユーザーが便利に利用できます。',
      footer_feature5: 'データのエクスポートとインポート：データのバックアップと他の分析ツールとの連携が容易になります。',
      footer_usage_title: 'TradingDiaryProの使用方法',
      footer_usage1_strong: 'アクセスと開始',
      footer_usage1_text: '個別の登録やログインなしで、Webブラウザから直接アクセスして使用できます。すべてのデータはローカルブラウザに安全に保存されます。',
      footer_usage2_strong: 'ダッシュボードの確認',
      footer_usage2_text: 'アプリ起動時、ダッシュボードでリアルタイムのコイン価格、主要なパフォーマンス指標の概要、最近の取引履歴を一目で確認できます。',
      footer_usage3_strong: '取引日誌の作成',
      footer_usage3_text: '上部メニューの「取引日誌」タブで、新しい日誌作成フォームに情報を入力して保存します。株式銘柄の自動認識機能も活用できます。',
      footer_usage4_strong: '取引履歴の管理',
      footer_usage4_text: '「取引履歴」タブで、すべての売買記録を確認、修正、削除できます。',
      footer_usage5_strong: 'アラート設定',
      footer_usage5_text: '「コインアラート」タブで、特定のコインの価格アラートを設定し、重要なタイミングを逃さないようにします。',
      footer_usage6_strong: 'データのバックアップと復元',
      footer_usage6_text: '「取引日誌」モーダル内の「エクスポート」および「インポート」ボタンでデータを安全に管理します。',
      footer_contact_title: 'お問い合わせとサポート',
      footer_contact_desc1: 'TradingDiaryProの使用中にご不明な点や技術的な問題が発生した場合は、いつでも以下のメールアドレスまでお問い合わせください：',
      footer_contact_desc2: '私たちのチームは、皆様の成功した投資のために最善を尽くします。ありがとうございます。',
      footer_copyright: '無断複写・転載を禁じます。',
      
      // Coin Prices
      popularCoins: '人気コイン価格',
      lastUpdated: '更新',
      refresh: '更新',
      priceLoadError: '価格情報の読み込みに失敗しました',
      realTimePrices: 'リアルタイムコイン価格を確認',
      justNow: 'たった今',
      
      // Recent Trades
      recentTrades: '最近の取引',
      recentTradesDesc: '最近の取引履歴を確認',
      noTrades: 'まだ取引記録がありません',
      noTradesDesc: '取引履歴タブで最初の取引を追加してください',
      addFirstTrade: '取引追加',
      
      // Trades Page
      newTrade: '新しい取引を追加',
      noTradesData: '取引履歴がありません',
      addFirstTradeDesc: '最初の取引を追加してください',
      
      // Alerts Page
      newAlert: '新しいアラートを追加',
      firstAlert: '最初のアラートを追加',
      triggeredAlerts: '発生したアラート',
      clearAll: 'すべてクリア',
      activeAlertsList: 'アクティブアラート',
      noAlertsSet: '設定されたアラートがありません',
      noAlertsDesc: 'コイン価格アラートを設定してください',
      alertTriggered: 'アラート発生',
      target: 'ターゲット',
      current: '現在',
      created: '作成',
      above: '以上',
      below: '以下',
      triggered: '発生済み',
      active: 'アクティブ',
      inactive: '非アクティブ',
      
      // Add Alert Modal
      addNewAlert: '新しいアラートを追加',
      selectCoin: 'コイン選択',
      selectCoinPlaceholder: 'コインを選択してください',
      currentPrice: '現在価格',
      alertCondition: 'アラート条件',
      priceAbove: '価格以上',
      priceBelow: '価格以下',
      targetPrice: 'ターゲット価格 (USD)',
      targetPricePlaceholder: 'ターゲット価格を入力',
      cancel: 'キャンセル',
      addAlert: 'アラート追加',
      
      // Validation
      selectCoinError: 'コインを選択してください',
      validPriceError: '有効な価格を入力してください',
      
      // Analysis Page
      noAnalysisData: '分析データがありません',
      noAnalysisDesc: '取引データが蓄積されると分析結果を確認できます'
    }
  },
  
  es: {
    translation: {
      // Header
      appName: 'TradingDiaryPro',
      language: 'ES',
      generalSettings: 'Configuración General',
      alertSettings: 'Configuración de Alertas',
      addTrade: 'Agregar Operación',
      
      // Navigation
      dashboard: 'Panel de Control',
      trades: 'Historial de Operaciones',
      alerts: 'Alertas de Criptomonedas',
      analysis: 'Análisis',
      
      // Dashboard Cards
      totalAssets: 'Activos Totales',
      totalTrades: 'Operaciones Totales',
      cumulativePnl: 'Ganancia/Pérdida Acumulada',
      todayReturn: 'Rendimiento de Hoy',
      activeAlerts: 'Alertas Activas',
      previousDay: 'vs Día Anterior',
      setAlerts: 'Establecer Alertas',
      alertsTriggered: " alertas activadas",
      currency: "USD",
      locale: "es-ES",
      completedTrades: 'operaciones completadas',
      winRate: 'Tasa de Ganancia',
      avgPnl: 'Ganancia/Pérdida Promedio',
      avgPerTrade: 'Promedio por operación',
      maxProfit: 'Máxima Ganancia',
      maxLoss: 'Máxima Pérdida',
      singleTradeMax: 'Máximo por operación única',
      tradingDiary: 'Diario de Trading',

      // Footer
      footer_about_title: 'Acerca de TradingDiaryPro',
      footer_about_desc1: 'TradingDiaryPro es una herramienta integral de diario de trading y análisis para inversores de criptomonedas y acciones. Te ayuda a comprender datos complejos del mercado de un vistazo, gestionar sistemáticamente tus registros de inversión personal y mejorar tus estrategias de inversión a través de análisis profundos.',
      footer_about_desc2: 'Proporcionamos alertas de precios de criptomonedas en tiempo real, gestión detallada del historial de transacciones y un panel de métricas de rendimiento intuitivo para ayudar a los usuarios a tomar decisiones de inversión informadas. Desarrollado teniendo en cuenta las necesidades de los inversores coreanos, proporciona datos integrados de los principales mercados de criptomonedas y acciones nacionales e internacionales.',
      footer_features_title: 'Características Principales',
      footer_feature1: 'Precios de Criptomonedas y Alertas en Tiempo Real: Te ayuda a no perderte momentos importantes de compra y venta.',
      footer_feature2: 'Creación y Gestión de Diario de Trading: Sistematiza tus registros de inversión y maximiza los efectos de aprendizaje.',
      footer_feature3: 'Panel de Métricas de Rendimiento: Evalúa objetivamente tu rendimiento de inversión e identifica fortalezas y debilidades.',
      footer_feature4: 'Soporte Multiidioma: Soporta varios idiomas incluyendo coreano, permitiendo que usuarios de todo el mundo lo usen convenientemente.',
      footer_feature5: 'Exportación e Importación de Datos: Gestiona fácilmente copias de seguridad de datos y enlaza con otras herramientas de análisis.',
      footer_usage_title: 'Cómo Usar TradingDiaryPro',
      footer_usage1_strong: 'Acceso e Inicio',
      footer_usage1_text: 'Puedes acceder y usar directamente desde tu navegador web sin registro o inicio de sesión separado. Todos los datos se almacenan de forma segura en tu navegador local.',
      footer_usage2_strong: 'Verificar Panel de Control',
      footer_usage2_text: 'Al iniciar la aplicación, verifica precios de criptomonedas en tiempo real, resúmenes de métricas de rendimiento clave e historial de transacciones recientes de un vistazo en el panel de control.',
      footer_usage3_strong: 'Crear Diario de Trading',
      footer_usage3_text: 'En la pestaña \'Diario de Trading\' en el menú superior, ingresa información en el formulario de creación de nuevo diario y guárdalo. También puedes usar la función de reconocimiento automático de acciones.',
      footer_usage4_strong: 'Gestionar Historial de Transacciones',
      footer_usage4_text: 'En la pestaña \'Historial de Transacciones\', puedes ver, modificar y eliminar todos los registros de trading.',
      footer_usage5_strong: 'Configurar Alertas',
      footer_usage5_text: 'En la pestaña \'Alertas de Criptomonedas\', configura alertas de precios para criptomonedas específicas para no perderte momentos importantes.',
      footer_usage6_strong: 'Copia de Seguridad y Restauración de Datos',
      footer_usage6_text: 'Gestiona de forma segura tus datos con los botones \'Exportar\' e \'Importar\' dentro del modal \'Diario de Trading\'.',
      footer_contact_title: 'Consultas y Soporte',
      footer_contact_desc1: 'Si tienes alguna pregunta o problemas técnicos mientras usas TradingDiaryPro, por favor contáctanos en la siguiente dirección de correo electrónico:',
      footer_contact_desc2: 'Nuestro equipo hará todo lo posible para apoyar tu inversión exitosa. Gracias.',
      footer_copyright: 'Todos los derechos reservados.',
      
      // Coin Prices
      popularCoins: 'Precios de Criptomonedas Populares',
      lastUpdated: 'Actualizado',
      refresh: 'Actualizar',
      priceLoadError: 'Error al cargar la información de precios',
      realTimePrices: 'Ver precios de criptomonedas en tiempo real',
      justNow: 'justo ahora',
      
      // Recent Trades
      recentTrades: 'Operaciones Recientes',
      recentTradesDesc: 'Consulta tu historial de operaciones recientes',
      noTrades: 'Aún no hay registros de operaciones',
      noTradesDesc: 'Agrega tu primera operación en la pestaña Historial de Operaciones',
      addFirstTrade: 'Agregar Operación',
      
      // Trades Page
      newTrade: 'Agregar Nueva Operación',
      noTradesData: 'No hay historial de operaciones',
      addFirstTradeDesc: 'Agrega tu primera operación',
      
      // Alerts Page
      newAlert: 'Agregar Nueva Alerta',
      firstAlert: 'Agregar Primera Alerta',
      triggeredAlerts: 'Alertas Activadas',
      clearAll: 'Borrar Todo',
      activeAlertsList: 'Alertas Activas',
      noAlertsSet: 'No hay alertas configuradas',
      noAlertsDesc: 'Configura alertas de precios de criptomonedas',
      alertTriggered: 'Alerta Activada',
      target: 'Objetivo',
      current: 'Actual',
      created: 'Creado',
      above: 'por encima',
      below: 'por debajo',
      triggered: 'Activada',
      active: 'Activa',
      inactive: 'Inactiva',
      
      // Add Alert Modal
      addNewAlert: 'Agregar Nueva Alerta',
      selectCoin: 'Seleccionar Criptomoneda',
      selectCoinPlaceholder: 'Por favor, selecciona una criptomoneda',
      currentPrice: 'Precio Actual',
      alertCondition: 'Condición de Alerta',
      priceAbove: 'Precio por Encima',
      priceBelow: 'Precio por Debajo',
      targetPrice: 'Precio Objetivo (USD)',
      targetPricePlaceholder: 'Ingresa el precio objetivo',
      cancel: 'Cancelar',
      addAlert: 'Agregar Alerta',
      
      // Validation
      selectCoinError: 'Por favor, selecciona una criptomoneda',
      validPriceError: 'Por favor, ingresa un precio válido',
      
      // Analysis Page
      noAnalysisData: 'No hay datos de análisis',
      noAnalysisDesc: 'Los resultados del análisis estarán disponibles una vez que se acumulen los datos de operaciones'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: true,
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language)
      document.documentElement.lang = i18n.language
    }
    i18n.on('languageChanged', handleLanguageChange)
    document.documentElement.lang = i18n.language // Initial set
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  const t = (key) => {
    return i18n.t(key)
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'ko', name: '한국어', flag: '🇰🇷', locale: 'ko-KR' },
      { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
      { code: 'zh', name: '中文', flag: '🇨🇳', locale: 'zh-CN' },
      { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja-JP' },
      { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' }
    ]
  }

  return {
    currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages
  }
}



