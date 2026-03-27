import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Gamepad2, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NightlyLogModal() {
  const { lastEntertainmentLogDate, logEntertainmentExpense } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const isNight = now.getHours() >= 20; // 8 PM or later
      const todayString = now.toDateString();
      
      if (isNight && lastEntertainmentLogDate !== todayString) {
        setIsOpen(true);
      }
    };

    // Check immediately and then every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [lastEntertainmentLogDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      logEntertainmentExpense(Number(amount), description || 'Daily Entertainment/Games');
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    // Log 0 to mark it as done for today
    logEntertainmentExpense(0, 'No entertainment expenses today');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 max-w-md w-full overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <Moon className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-slate-50">Nightly Check-in</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-slate-300 mb-4">
              How much did you spend on games and entertainment today?
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount Spent</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">What did you do? (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Gamepad2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Movie ticket, Game top-up"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              Spent Nothing
            </button>
            <button
              type="submit"
              disabled={!amount}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Log Expense
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
