import { useState, useEffect } from 'react';
import { useStore, MarketAsset } from '../store/useStore';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function Wallet() {
  const { balance, portfolio, market, buyAsset, sellAsset, updateMarket } = useStore();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market'>('portfolio');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [amount, setAmount] = useState<number | ''>(100);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // Real-time market updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateMarket();
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [updateMarket]);

  // Keep selected asset updated with latest price
  useEffect(() => {
    if (selectedAsset) {
      const updated = market.find(a => a.symbol === selectedAsset.symbol);
      if (updated) setSelectedAsset(updated);
    }
  }, [market]);

  const totalInvested = portfolio.reduce((acc, curr) => acc + (curr.quantity * curr.averagePrice), 0);
  const currentValue = portfolio.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
  const totalReturn = currentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  const handleTrade = () => {
    if (!selectedAsset || typeof amount !== 'number' || amount < 10) return;
    
    const qty = amount / selectedAsset.price;
    
    if (tradeType === 'buy') {
      buyAsset(selectedAsset.symbol, selectedAsset.name, qty, selectedAsset.price);
    } else {
      sellAsset(selectedAsset.symbol, qty, selectedAsset.price);
    }
    
    setSelectedAsset(null);
    setAmount(100);
  };

  const selectedPortfolioAsset = selectedAsset ? portfolio.find(a => a.symbol === selectedAsset.symbol) : null;
  const maxSellAmount = selectedPortfolioAsset ? selectedPortfolioAsset.quantity * selectedAsset.price : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Mock Wallet & Investments</h1>
        <p className="text-slate-400 mt-2">Practice investing with virtual money. No real risk!</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
          <p className="text-sm font-medium text-slate-400 mb-1">Available Balance</p>
          <h3 className="text-3xl font-bold text-slate-50">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
          <p className="text-sm font-medium text-slate-400 mb-1">Total Invested</p>
          <h3 className="text-3xl font-bold text-slate-50">₹{totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
        <div className={`p-6 rounded-2xl shadow-sm border ${totalReturn >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
          <p className={`text-sm font-medium mb-1 ${totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>Total Returns</p>
          <div className="flex items-end space-x-2">
            <h3 className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {totalReturn >= 0 ? '+' : ''}₹{totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className={`text-sm font-bold mb-1 ${totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({returnPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
              activeTab === 'portfolio' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            My Portfolio
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
              activeTab === 'market' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Market (Trade)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'portfolio' ? (
            <div className="space-y-4">
              {portfolio.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Your portfolio is empty.</p>
                  <button 
                    onClick={() => setActiveTab('market')}
                    className="mt-4 text-emerald-500 font-bold hover:underline"
                  >
                    Start Investing
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-sm text-slate-400">
                        <th className="pb-3 font-medium">Asset</th>
                        <th className="pb-3 font-medium text-right">Qty</th>
                        <th className="pb-3 font-medium text-right">Avg Price</th>
                        <th className="pb-3 font-medium text-right">Current</th>
                        <th className="pb-3 font-medium text-right">Returns</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {portfolio.map((asset) => {
                        const invested = asset.quantity * asset.averagePrice;
                        const current = asset.quantity * asset.currentPrice;
                        const ret = current - invested;
                        const retPct = (ret / invested) * 100;
                        
                        return (
                          <tr key={asset.symbol} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4">
                              <p className="font-bold text-slate-50">{asset.symbol}</p>
                              <p className="text-xs text-slate-400">{asset.name}</p>
                            </td>
                            <td className="py-4 text-right font-medium text-slate-300">{asset.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                            <td className="py-4 text-right text-slate-400">₹{asset.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="py-4 text-right font-medium text-slate-50">₹{asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`py-4 text-right font-bold ${ret >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {ret >= 0 ? '+' : ''}₹{ret.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br/>
                              <span className="text-xs">({retPct.toFixed(2)}%)</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {market.map((asset) => (
                <div 
                  key={asset.symbol} 
                  className="border border-slate-700 rounded-xl p-4 hover:border-emerald-500 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden group"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={asset.history.map((val, i) => ({ val, i }))}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line type="monotone" dataKey="val" stroke={asset.change >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="font-bold text-slate-50 flex items-center">
                        {asset.symbol}
                        {asset.change !== 0 && (
                          <Activity className={`w-3 h-3 ml-2 ${asset.change > 0 ? 'text-emerald-500' : 'text-rose-500'} animate-pulse`} />
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{asset.name}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md uppercase">
                      {asset.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4 relative z-10">
                    <h3 className="text-xl font-bold text-slate-50">₹{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <div className={`flex items-center text-sm font-bold ${asset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {asset.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {Math.abs(asset.change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full overflow-hidden my-8"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-50 flex items-center">
                  {selectedAsset.symbol}
                  <span className="ml-3 text-xs font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md uppercase">
                    {selectedAsset.type}
                  </span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{selectedAsset.name}</p>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-200 bg-slate-800 rounded-full p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Price & Chart */}
              <div>
                <div className="flex items-end space-x-3 mb-4">
                  <h2 className="text-4xl font-bold text-slate-50">
                    ₹{selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className={`text-lg font-bold flex items-center mb-1 ${selectedAsset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedAsset.change >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                    {Math.abs(selectedAsset.change).toFixed(2)}%
                  </span>
                </div>
                
                <div className="h-48 w-full bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedAsset.history.map((val, i) => ({ val, i }))}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke={selectedAsset.change >= 0 ? '#10b981' : '#ef4444'} 
                        strokeWidth={3} 
                        dot={false} 
                        isAnimationActive={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trade Tabs */}
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${
                    tradeType === 'buy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${
                    tradeType === 'sell' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Order Entry */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Amount (₹)</span>
                  <span className="text-slate-400">
                    {tradeType === 'buy' 
                      ? `Available: ₹${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                      : `Max: ₹${maxSellAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    min="10"
                    step="10"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-3xl font-bold text-slate-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="flex space-x-2">
                  {[100, 500, 1000, 5000].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>

                {tradeType === 'sell' && selectedPortfolioAsset && (
                  <button
                    onClick={() => setAmount(Math.floor(maxSellAmount))}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                  >
                    Sell All (₹{maxSellAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </button>
                )}

                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <span className="text-sm text-slate-400">Estimated Quantity</span>
                  <span className="font-bold text-slate-50">
                    {typeof amount === 'number' && amount > 0 
                      ? (amount / selectedAsset.price).toLocaleString(undefined, { maximumFractionDigits: 6 }) 
                      : '0.000000'}
                  </span>
                </div>
                
                {typeof amount === 'number' && amount > 0 && amount < 10 && (
                  <p className="text-rose-500 text-xs font-medium text-center">Minimum investment is ₹10</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800">
              <button 
                onClick={handleTrade}
                disabled={
                  typeof amount !== 'number' || 
                  amount < 10 || 
                  (tradeType === 'buy' && balance < amount) || 
                  (tradeType === 'sell' && maxSellAmount < amount)
                }
                className={`w-full font-bold py-4 rounded-xl transition-colors text-lg ${
                  tradeType === 'buy' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white' 
                    : 'bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 disabled:text-slate-500 text-white'
                }`}
              >
                {tradeType === 'buy' ? 'BUY' : 'SELL'} {selectedAsset.symbol}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
