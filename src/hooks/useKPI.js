import { useMemo } from 'react';

export const useKPI = (trades) => {
  const kpi = useMemo(() => {
    // 완결 거래만 필터링
    const closedTrades = trades.filter(trade => trade.closed && trade.realizedPnl !== null);
    
    if (closedTrades.length === 0) {
      return {
        totalTrades: 0,
        totalPnl: 0,
        winRate: 0,
        avgPnl: 0,
        maxProfit: 0,
        maxLoss: 0,
        winTrades: 0,
        lossTrades: 0
      };
    }

    // 기본 통계
    const totalTrades = closedTrades.length;
    const totalPnl = closedTrades.reduce((sum, trade) => sum + trade.realizedPnl, 0);
    const avgPnl = totalPnl / totalTrades;

    // 승패 분석
    const winTrades = closedTrades.filter(trade => trade.realizedPnl > 0).length;
    const lossTrades = closedTrades.filter(trade => trade.realizedPnl < 0).length;
    const winRate = (winTrades / totalTrades) * 100;

    // 최고/최저 수익
    const profits = closedTrades.map(trade => trade.realizedPnl);
    const maxProfit = Math.max(...profits);
    const maxLoss = Math.min(...profits);

    return {
      totalTrades,
      totalPnl,
      winRate,
      avgPnl,
      maxProfit,
      maxLoss,
      winTrades,
      lossTrades
    };
  }, [trades]);

  return kpi;
};

