#!/usr/bin/env python3
"""
바이낸스 퍼블릭 API 테스트 (인증 없이 가격 정보만 조회)
"""

import requests
import json
import time

# 바이낸스 퍼블릭 API 엔드포인트
BINANCE_API_BASE = "https://api.binance.com/api/v3"

# 기존 코인 목록 (CoinGecko ID -> 바이낸스 심볼 매핑)
COIN_MAPPING = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT', 
    'ripple': 'XRPUSDT',
    'dogecoin': 'DOGEUSDT',
    'cardano': 'ADAUSDT',
    'solana': 'SOLUSDT',
    'polkadot': 'DOTUSDT',
    'chainlink': 'LINKUSDT'
}

COIN_SYMBOLS = {
    'BTCUSDT': 'BTC',
    'ETHUSDT': 'ETH',
    'XRPUSDT': 'XRP',
    'DOGEUSDT': 'DOGE',
    'ADAUSDT': 'ADA',
    'SOLUSDT': 'SOL',
    'DOTUSDT': 'DOT',
    'LINKUSDT': 'LINK'
}

COIN_NAMES = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'XRPUSDT': 'XRP',
    'DOGEUSDT': 'Dogecoin',
    'ADAUSDT': 'Cardano',
    'SOLUSDT': 'Solana',
    'DOTUSDT': 'Polkadot',
    'LINKUSDT': 'Chainlink'
}

def get_binance_coin_prices():
    """바이낸스 퍼블릭 API를 사용하여 코인 가격 조회"""
    try:
        # 24시간 가격 변동 정보 조회
        url = f"{BINANCE_API_BASE}/ticker/24hr"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            raise Exception(f"API 요청 실패: {response.status_code}")
        
        tickers = response.json()
        
        # 필요한 코인들만 필터링
        binance_symbols = list(COIN_MAPPING.values())
        filtered_tickers = [ticker for ticker in tickers if ticker['symbol'] in binance_symbols]
        
        formatted_prices = []
        
        for ticker in filtered_tickers:
            symbol = ticker['symbol']
            
            # CoinGecko ID 찾기
            coingecko_id = None
            for cg_id, binance_symbol in COIN_MAPPING.items():
                if binance_symbol == symbol:
                    coingecko_id = cg_id
                    break
            
            if not coingecko_id:
                continue
                
            price_data = {
                'id': coingecko_id,
                'symbol': COIN_SYMBOLS[symbol],
                'name': COIN_NAMES[symbol],
                'price': float(ticker['lastPrice']),
                'change': float(ticker['priceChange']),
                'changePercent': float(ticker['priceChangePercent']),
                'lastUpdated': int(time.time())
            }
            
            formatted_prices.append(price_data)
        
        return formatted_prices
        
    except Exception as e:
        print(f"바이낸스 API 오류: {e}")
        return []

def test_binance_public_api():
    """바이낸스 퍼블릭 API 연결 테스트"""
    try:
        # 서버 시간 확인
        time_url = f"{BINANCE_API_BASE}/time"
        time_response = requests.get(time_url, timeout=10)
        
        if time_response.status_code == 200:
            server_time = time_response.json()
            print(f"바이낸스 서버 시간: {server_time['serverTime']}")
        
        # 코인 가격 조회 테스트
        prices = get_binance_coin_prices()
        print(f"\n조회된 코인 수: {len(prices)}")
        
        for price in prices:
            print(f"{price['name']} ({price['symbol']}): ${price['price']:.4f} ({price['changePercent']:+.2f}%)")
        
        return True
        
    except Exception as e:
        print(f"바이낸스 퍼블릭 API 테스트 실패: {e}")
        return False

if __name__ == "__main__":
    print("바이낸스 퍼블릭 API 연결 테스트 시작...")
    success = test_binance_public_api()
    
    if success:
        print("\n✅ 바이낸스 퍼블릭 API 연결 성공!")
    else:
        print("\n❌ 바이낸스 퍼블릭 API 연결 실패!")

