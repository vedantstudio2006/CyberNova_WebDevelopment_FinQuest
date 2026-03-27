import React, { useState } from 'react';
import { useStore, UserProfile } from '../store/useStore';
import { User, MapPin, Briefcase, Wallet, ArrowRight, Utensils, Train } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const login = useStore((state) => state.login);
  
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [income, setIncome] = useState('');
  
  // Fixed Expenses
  const [food, setFood] = useState('');
  const [travel, setTravel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !region || !profile || !income) return;
    
    login({
      name,
      region,
      profile,
      income: Number(income),
      expenses: {
        food: Number(food) || 0,
        travel: Number(travel) || 0
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-2 font-serif">Welcome to Academy</h1>
          <p className="text-slate-400">Set up your profile to begin your financial journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Region / City</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Mumbai, Maharashtra"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Profile</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProfile('student')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    profile === 'student' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfile('employee')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    profile === 'employee' 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Briefcase className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Employee</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfile('business')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    profile === 'business' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Wallet className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Business</span>
                </button>
              </div>
            </div>

            {profile && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    {profile === 'student' ? 'Monthly Pocket Money (₹)' : 
                     profile === 'employee' ? 'Monthly Salary (₹)' : 
                     'Expected Monthly Profit (₹)'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium">₹</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="block w-full pl-8 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder={profile === 'student' ? '5000' : '50000'}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-slate-300 mb-3">Estimated Monthly Expenses</h3>
                  <p className="text-xs text-slate-500 mb-4">Set your normal life expenses. (Students: Exclude school/college fees & dorm rent)</p>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Utensils className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                        placeholder="Food (e.g., 3 meals a day)"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Train className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={travel}
                        onChange={(e) => setTravel(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                        placeholder="Travel & Commute"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={!name || !region || !profile || !income}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enter Academy <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
