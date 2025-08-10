# TradingDiaryPro

핀다/토스 스타일의 모던한 디자인을 적용한 코인 거래소 가격 알람 기능을 갖춘 매매일지 프로그램입니다.

## 🚀 주요 기능

### 📊 실시간 코인 가격 모니터링
- CoinGecko API를 통한 실시간 가격 정보
- 인기 코인 8종 (BTC, ETH, XRP, DOGE, ADA, SOL, DOT, LINK) 지원
- 24시간 변동률 및 가격 변화 표시
- 자동 새로고침 및 수동 새로고침 기능

### 🔔 스마트 가격 알람 시스템
- 목표 가격 도달 시 브라우저 알림
- 가격 이상/이하 조건 설정 가능
- 알람 활성화/비활성화 토글
- 발생한 알람 히스토리 관리
- 로컬 스토리지를 통한 알람 데이터 영구 저장

### 🌍 다국어 지원
- 한국어 (기본)
- English
- 中文 (중국어)
- 日本語 (일본어)
- 언어별 완전한 UI 번역
- 로컬 스토리지를 통한 언어 설정 저장

### 🎨 모던한 UI/UX
- 핀다/토스 스타일의 깔끔한 디자인
- 반응형 웹 디자인 (모바일/태블릿/데스크톱)
- Tailwind CSS + shadcn/ui 컴포넌트
- 부드러운 애니메이션 및 트랜지션
- 직관적인 네비게이션 및 사용자 경험

## 🛠️ 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **API**: CoinGecko API (무료 버전)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm

### 설치
```bash
# 저장소 클론
git clone https://github.com/bummki/trading-diary-pro.git
cd trading-diary-pro

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev
```

### 빌드
```bash
# 프로덕션 빌드
pnpm run build

# 빌드 결과 미리보기
pnpm run preview
```

## 🎯 사용법

### 1. 대시보드
- 총 자산, 오늘 수익률, 활성 알람 수 확인
- 실시간 코인 가격 모니터링
- 최근 거래 내역 (향후 구현 예정)

### 2. 코인 알람 설정
1. **코인 알람** 탭 클릭
2. **새 알람 추가** 버튼 클릭
3. 코인 선택 (BTC, ETH, XRP 등)
4. 알람 조건 선택 (가격 이상/이하)
5. 목표 가격 입력
6. **알람 추가** 버튼 클릭

### 3. 언어 변경
1. 우상단 언어 선택기 클릭
2. 원하는 언어 선택 (한국어/English/中文/日本語)

## 🔧 주요 컴포넌트

### Hooks
- `useCoinPrices`: 코인 가격 데이터 관리
- `useAlerts`: 알람 시스템 관리
- `useLanguage`: 다국어 지원 관리

### Components
- `AddAlertModal`: 알람 추가 모달
- `LanguageSelector`: 언어 선택 드롭다운

## 🚀 배포

### Vercel 배포 (권장)
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 자동 배포 설정

### Netlify 배포
1. Netlify 계정 생성
2. GitHub 저장소 연결
3. 빌드 설정: `pnpm run build`
4. 배포 디렉토리: `dist`

## 🔮 향후 계획

- [ ] 거래 내역 관리 기능
- [ ] 포트폴리오 분석 도구
- [ ] 차트 및 기술적 분석
- [ ] 더 많은 코인 지원
- [ ] 사용자 계정 시스템
- [ ] 클라우드 데이터 동기화
- [ ] 모바일 앱 버전

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

**TradingDiaryPro** - 스마트한 코인 투자를 위한 완벽한 도구 🚀

