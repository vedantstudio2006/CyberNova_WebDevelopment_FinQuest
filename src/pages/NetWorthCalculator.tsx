import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, WalletCards, Briefcase, Landmark, CreditCard, Car, GraduationCap, Home as HomeIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
  value: number;
};

export default function NetWorthCalculator() {
  const { t } = useTranslation();
  
  const [assets, setAssets] = useState<Category[]>([
    { id: 'cash', label: 'Cash & Bank Accounts', icon: Landmark, value: 0 },
    { id: 'savings', label: 'Savings & Emergency Fund', icon: WalletCards, value: 0 },
    { id: 'investments', label: 'Investments (Stocks, Crypto, Mutual Funds)', icon: Briefcase, value: 0 },
    { id: 'property', label: 'Real Estate / Property', icon: HomeIcon, value: 0 },
    { id: 'vehicles', label: 'Vehicles', icon: Car, value: 0 },
    { id: 'otherAssets', label: 'Other Valuables (Jewelry, Art)', icon: DollarSign, value: 0 },
  ]);

  const [liabilities, setLiabilities] = useState<Category[]>([
    { id: 'creditCards', label: 'Credit Card Debt', icon: CreditCard, value: 0 },
    { id: 'studentLoans', label: 'Student / Educational Loans', icon: GraduationCap, value: 0 },
    { id: 'carLoans', label: 'Vehicle / Auto Loans', icon: Car, value: 0 },
    { id: 'mortgage', label: 'Mortgage / Home Loans', icon: HomeIcon, value: 0 },
    { id: 'otherDebt', label: 'Other Personal Debt', icon: DollarSign, value: 0 },
  ]);

  const totalAssets = useMemo(() => assets.reduce((acc, a) => acc + (a.value || 0), 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((acc, l) => acc + (l.value || 0), 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;
  
  // Calculate percentage for progress bar visualization
  const maxTotal = Math.max(totalAssets, totalLiabilities, 1); // prevent division by zero
  const assetsPct = (totalAssets / (totalAssets + totalLiabilities || 1)) * 100;
  const liabilitiesPct = (totalLiabilities / (totalAssets + totalLiabilities || 1)) * 100;

  const handleAssetChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setAssets(prev => prev.map(a => a.id === id ? { ...a, value: num } : a));
  };

  const handleLiabilityChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setLiabilities(prev => prev.map(l => l.id === id ? { ...l, value: num } : l));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50">Net Worth Calculator</h1>
        </div>
        <p className="text-slate-400">
          Get a clear snapshot of your financial health. Your net worth is simply what you own minus what you owe.
        </p>
      </header>

      {/* Summary Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-center md:text-left flex-1">
            <p className="text-slate-400 font-medium mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-emerald-500">₹{totalAssets.toLocaleString()}</p>
          </div>
          <div className="text-center flex-1 border-t border-b border-slate-800 md:border-t-0 md:border-b-0 md:border-l md:border-r py-4 md:py-0">
            <p className="text-slate-400 font-medium mb-1">Your Net Worth</p>
            <p className={`text-4xl md:text-5xl font-black ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
              ₹{netWorth.toLocaleString()}
            </p>
          </div>
          <div className="text-center md:text-right flex-1">
            <p className="text-slate-400 font-medium mb-1">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-500">₹{totalLiabilities.toLocaleString()}</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${assetsPct}%` }}
            transition={{ type: "spring", stiffness: 60 }}
            className="h-full bg-emerald-500"
          ></motion.div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${liabilitiesPct}%` }}
            transition={{ type: "spring", stiffness: 60 }}
            className="h-full bg-red-500"
          ></motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium">
          <span className="text-emerald-500">{assetsPct.toFixed(1)}% Assets</span>
          <span className="text-red-500">{liabilitiesPct.toFixed(1)}% Liabilities</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assets Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-50 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5" />
            </span>
            Assets (What You Own)
          </h2>
          
          <div className="space-y-4">
            {assets.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative">
                  <label className="text-sm font-medium text-slate-400 flex items-center mb-1.5 ml-1">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={item.value || ''}
                      onChange={(e) => handleAssetChange(item.id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-8 pr-4 text-slate-50 placeholder-slate-600 focus:bg-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Liabilities Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-50 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center mr-3">
              <CreditCard className="w-5 h-5" />
            </span>
            Liabilities (What You Owe)
          </h2>
          
          <div className="space-y-4">
            {liabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative">
                  <label className="text-sm font-medium text-slate-400 flex items-center mb-1.5 ml-1">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={item.value || ''}
                      onChange={(e) => handleLiabilityChange(item.id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-8 pr-4 text-slate-50 placeholder-slate-600 focus:bg-slate-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
