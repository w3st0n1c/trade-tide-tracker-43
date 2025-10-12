import { useState, useEffect } from 'react';

export interface TradeRecord {
  id: string;
  date: string;
  yourOffer: {
    items: string[];
    totalValue: number;
  };
  theirOffer: {
    items: string[];
    totalValue: number;
  };
  notes?: string;
}

export function useTradeHistory() {
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>(() => {
    const saved = localStorage.getItem('trade-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('trade-history', JSON.stringify(tradeHistory));
  }, [tradeHistory]);

  const addTrade = (trade: Omit<TradeRecord, 'id' | 'date'>) => {
    const newTrade: TradeRecord = {
      ...trade,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setTradeHistory(prev => [newTrade, ...prev]);
    return newTrade.id;
  };

  const removeTrade = (id: string) => {
    setTradeHistory(prev => prev.filter(trade => trade.id !== id));
  };

  const clearHistory = () => {
    setTradeHistory([]);
  };

  return { 
    tradeHistory, 
    addTrade, 
    removeTrade, 
    clearHistory 
  };
}