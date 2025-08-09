// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 전역 스타일 (레이아웃 전용)
import './App.css'

// 탭 카드형 디자인 전용 스타일
import './styles/nav-card-style.css'

// Tailwind나 다른 전역 스타일이 있다면 여기에 추가
// import './index.css'

// React 18 기준 렌더링
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
