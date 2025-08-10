import React, { useState, useEffect } from 'react';
import { X, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';

const AddTradeModalV2 = ({ isOpen, onClose, onAddTrade }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    market: 'crypto', // 'stock' | 'crypto'
    symbol: '',
    side: 'buy', // 'buy' | 'sell'
    inputType: 'quantity', // 'quantity' | 'amount'
    qtyOrAmount: '',
    price: '',
    fee: '',
    note: '',
    indicators: {
      ma: false,
      rsi: false,
      macd: false,
      bb: false,
      vol: false,
      other: ''
    },
    targetPrice: '',
    stopPrice: '',
    closed: false,
    exitQtyOrAmount: '',
    exitPrice: '',
    exitFee: ''
  });

  const [calculatedQty, setCalculatedQty] = useState('');
  const [targetPnl, setTargetPnl] = useState(null);
  const [stopPnl, setStopPnl] = useState(null);
  const [realizedPnl, setRealizedPnl] = useState(null);

  // 수량 환산 계산
  useEffect(() => {
    if (formData.inputType === 'amount' && formData.qtyOrAmount && formData.price) {
      const amount = parseFloat(formData.qtyOrAmount);
      const price = parseFloat(formData.price);
      if (!isNaN(amount) && !isNaN(price) && price > 0) {
        setCalculatedQty((amount / price).toFixed(8));
      } else {
        setCalculatedQty('');
      }
    } else {
      setCalculatedQty('');
    }
  }, [formData.inputType, formData.qtyOrAmount, formData.price]);

  // 목표/손절 PnL 미리보기 계산
  useEffect(() => {
    if (formData.price && (formData.targetPrice || formData.stopPrice)) {
      const entryPrice = parseFloat(formData.price);
      const entryQty = formData.inputType === 'quantity' 
        ? parseFloat(formData.qtyOrAmount) 
        : parseFloat(calculatedQty);
      const entryFee = parseFloat(formData.fee) || 0;

      if (!isNaN(entryPrice) && !isNaN(entryQty) && entryPrice > 0 && entryQty > 0) {
        // 목표가 PnL
        if (formData.targetPrice) {
          const targetPrice = parseFloat(formData.targetPrice);
          if (!isNaN(targetPrice) && targetPrice > 0) {
            let pnl;
            if (formData.side === 'buy') {
              pnl = (entryQty * targetPrice - 0) - (entryQty * entryPrice + entryFee);
            } else {
              pnl = (entryQty * entryPrice - entryFee) - (entryQty * targetPrice + 0);
            }
            setTargetPnl(pnl);
          }
        } else {
          setTargetPnl(null);
        }

        // 손절가 PnL
        if (formData.stopPrice) {
          const stopPrice = parseFloat(formData.stopPrice);
          if (!isNaN(stopPrice) && stopPrice > 0) {
            let pnl;
            if (formData.side === 'buy') {
              pnl = (entryQty * stopPrice - 0) - (entryQty * entryPrice + entryFee);
            } else {
              pnl = (entryQty * entryPrice - entryFee) - (entryQty * stopPrice + 0);
            }
            setStopPnl(pnl);
          }
        } else {
          setStopPnl(null);
        }
      }
    } else {
      setTargetPnl(null);
      setStopPnl(null);
    }
  }, [formData.price, formData.qtyOrAmount, formData.fee, formData.targetPrice, formData.stopPrice, formData.side, formData.inputType, calculatedQty]);

  // 실현손익 계산
  useEffect(() => {
    if (formData.closed && formData.price && formData.exitPrice && (formData.qtyOrAmount || calculatedQty) && formData.exitQtyOrAmount) {
      const entryPrice = parseFloat(formData.price);
      const exitPrice = parseFloat(formData.exitPrice);
      const entryQty = formData.inputType === 'quantity' 
        ? parseFloat(formData.qtyOrAmount) 
        : parseFloat(calculatedQty);
      const exitQty = parseFloat(formData.exitQtyOrAmount);
      const entryFee = parseFloat(formData.fee) || 0;
      const exitFee = parseFloat(formData.exitFee) || 0;

      if (!isNaN(entryPrice) && !isNaN(exitPrice) && !isNaN(entryQty) && !isNaN(exitQty)) {
        let pnl;
        if (formData.side === 'buy') {
          pnl = (exitQty * exitPrice - exitFee) - (entryQty * entryPrice + entryFee);
        } else {
          pnl = (entryQty * entryPrice - entryFee) - (exitQty * exitPrice + exitFee);
        }
        setRealizedPnl(pnl);
      }
    } else {
      setRealizedPnl(null);
    }
  }, [formData.closed, formData.price, formData.exitPrice, formData.qtyOrAmount, formData.exitQtyOrAmount, formData.fee, formData.exitFee, formData.side, formData.inputType, calculatedQty]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.symbol || !formData.qtyOrAmount || !formData.price) {
      alert('심볼, 수량/금액, 가격은 필수 입력 항목입니다.');
      return;
    }

    // 완결 거래 시 청산 정보 검증
    if (formData.closed && (!formData.exitQtyOrAmount || !formData.exitPrice)) {
      alert('완결 거래로 설정한 경우 청산 수량과 청산 가격을 입력해주세요.');
      return;
    }

    const trade = {
      id: Date.now().toString(),
      ...formData,
      realizedPnl: realizedPnl,
      isWin: realizedPnl !== null ? realizedPnl > 0 : null
    };

    onAddTrade(trade);
    onClose();
    
    // 폼 초기화
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      market: 'crypto',
      symbol: '',
      side: 'buy',
      inputType: 'quantity',
      qtyOrAmount: '',
      price: '',
      fee: '',
      note: '',
      indicators: {
        ma: false,
        rsi: false,
        macd: false,
        bb: false,
        vol: false,
        other: ''
      },
      targetPrice: '',
      stopPrice: '',
      closed: false,
      exitQtyOrAmount: '',
      exitPrice: '',
      exitFee: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">거래 추가 v2</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">날짜/시간</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">시장</label>
              <select
                value={formData.market}
                onChange={(e) => handleInputChange('market', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="crypto">코인</option>
                <option value="stock">주식</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">심볼</label>
              <input
                type="text"
                placeholder="BTC, AAPL, 005930"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">매매구분</label>
              <select
                value={formData.side}
                onChange={(e) => handleInputChange('side', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="buy">매수</option>
                <option value="sell">매도</option>
              </select>
            </div>
          </div>

          {/* 입력 유형 전환 */}
          <div>
            <label className="block text-sm font-medium mb-2">입력 유형</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="quantity"
                  checked={formData.inputType === 'quantity'}
                  onChange={(e) => handleInputChange('inputType', e.target.value)}
                  className="mr-2"
                />
                수량
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="amount"
                  checked={formData.inputType === 'amount'}
                  onChange={(e) => handleInputChange('inputType', e.target.value)}
                  className="mr-2"
                />
                금액
              </label>
            </div>
            <input
              type="number"
              step="any"
              placeholder={formData.inputType === 'quantity' ? '수량' : '금액'}
              value={formData.qtyOrAmount}
              onChange={(e) => handleInputChange('qtyOrAmount', e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            {formData.inputType === 'amount' && calculatedQty && (
              <p className="text-sm text-gray-600 mt-1">
                <Calculator className="w-4 h-4 inline mr-1" />
                환산 수량: {calculatedQty}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">가격</label>
              <input
                type="number"
                step="any"
                placeholder="진입 가격"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">수수료</label>
              <input
                type="number"
                step="any"
                placeholder="수수료 (선택)"
                value={formData.fee}
                onChange={(e) => handleInputChange('fee', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* 매매지표 */}
          <div>
            <label className="block text-sm font-medium mb-2">매매지표</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {Object.entries({
                ma: 'MA',
                rsi: 'RSI',
                macd: 'MACD',
                bb: 'Bollinger',
                vol: 'Volume'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.indicators[key]}
                    onChange={(e) => handleInputChange(`indicators.${key}`, e.target.checked)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="기타 지표"
              value={formData.indicators.other}
              onChange={(e) => handleInputChange('indicators.other', e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* 목표/손절 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">목표가</label>
              <input
                type="number"
                step="any"
                placeholder="목표 가격"
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {targetPnl !== null && (
                <p className={`text-sm mt-1 flex items-center ${targetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  예상 수익: {targetPnl.toFixed(2)} KRW
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">손절가</label>
              <input
                type="number"
                step="any"
                placeholder="손절 가격"
                value={formData.stopPrice}
                onChange={(e) => handleInputChange('stopPrice', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              {stopPnl !== null && (
                <p className={`text-sm mt-1 flex items-center ${stopPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingDown className="w-4 h-4 mr-1" />
                  예상 손실: {stopPnl.toFixed(2)} KRW
                </p>
              )}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-medium mb-2">메모 (전략·근거)</label>
            <textarea
              placeholder="거래 전략이나 근거를 입력하세요"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              className="w-full p-2 border rounded-lg h-20 resize-none"
            />
          </div>

          {/* 완결 거래 */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.closed}
                onChange={(e) => handleInputChange('closed', e.target.checked)}
                className="mr-2"
              />
              완결 거래
            </label>
          </div>

          {formData.closed && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">청산 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">청산 수량</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="청산 수량"
                    value={formData.exitQtyOrAmount}
                    onChange={(e) => handleInputChange('exitQtyOrAmount', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required={formData.closed}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">청산 가격</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="청산 가격"
                    value={formData.exitPrice}
                    onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required={formData.closed}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">청산 수수료</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="청산 수수료"
                    value={formData.exitFee}
                    onChange={(e) => handleInputChange('exitFee', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              {realizedPnl !== null && (
                <div className={`p-3 rounded-lg ${realizedPnl >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="font-medium flex items-center">
                    {realizedPnl >= 0 ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
                    실현손익: {realizedPnl.toFixed(2)} KRW ({realizedPnl >= 0 ? '이익' : '손실'})
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModalV2;

