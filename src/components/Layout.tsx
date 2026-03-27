import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, MessageSquare, Wallet, Trophy, User, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import NightlyLogModal from './NightlyLogModal';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { level, xp, coins, streak } = useStore();

  const navItems = [
    { name: t('nav.dashboard'), path: '/', icon: Home },
    { name: t('nav.simulator'), path: '/simulator', icon: Gamepad2 },
    { name: t('nav.coach'), path: '/coach', icon: MessageSquare },
    { name: t('nav.wallet'), path: '/wallet', icon: Wallet },
    { name: t('nav.quizzes'), path: '/quizzes', icon: Trophy },
    { name: t('nav.netWorth'), path: '/net-worth', icon: Calculator },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shadow-sm">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">₹</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            finQuest
          </h1>
        </div>

        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">{t('common.level')} {level}</span>
            <span className="text-sm font-bold text-amber-500">{xp} XP</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${(xp % 100)}%` }}></div>
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <div className="flex items-center text-amber-500">
              <span className="mr-1">🪙</span> {coins}
            </div>
            <div className="flex items-center text-orange-500">
              <span className="mr-1">🔥</span> {streak} {t('common.days')}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-slate-500")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <select 
            value={i18n.language} 
            onChange={handleLanguageChange}
            className="w-full bg-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 border-none outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>

          <button className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-slate-400 hover:bg-slate-800 transition-colors">
            <User className="w-5 h-5 text-slate-500" />
            <span>{t('nav.profile')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <h1 className="text-lg font-bold text-slate-50">finQuest</h1>
          </div>
          <div className="flex space-x-3 text-sm font-medium">
            <div className="flex items-center text-amber-500">
              <span className="mr-1">🪙</span> {coins}
            </div>
            <div className="flex items-center text-orange-500">
              <span className="mr-1">🔥</span> {streak}
            </div>
          </div>
          <select 
            value={i18n.language} 
            onChange={handleLanguageChange}
            className="ml-3 bg-slate-800 text-slate-300 text-xs rounded-md px-2 py-1 border-none outline-none focus:ring-1 focus:ring-emerald-500 max-w-[80px]"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MR</option>
          </select>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 pb-safe z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg min-w-[64px]",
                  isActive ? "text-emerald-400" : "text-slate-400"
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", isActive ? "fill-emerald-500/20" : "")} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </main>
      
      {/* Global Modals */}
      <NightlyLogModal />
    </div>
  );
}
