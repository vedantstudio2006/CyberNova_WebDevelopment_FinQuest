import { useStore } from '../store/useStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Target, TrendingUp, ShieldCheck, User } from 'lucide-react';

export default function Dashboard() {
  const { balance, monthlyIncome, transactions, xp, level, profile } = useStore();

  // Calculate stats
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
  const healthScore = Math.min(100, Math.max(0, Math.round(savingsRate * 1.5 + (totalInvestments > 0 ? 20 : 0))));

  // Prepare chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  // Mock trend data
  const trendData = [
    { name: 'Week 1', balance: 80000 },
    { name: 'Week 2', balance: 85000 },
    { name: 'Week 3', balance: 82000 },
    { name: 'Week 4', balance: balance },
  ];

  // Calculate monthly spending data from real transactions
  const monthlyDataMap = transactions.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, expenses: 0, income: 0, investment: 0, timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime() };
    }
    if (curr.type === 'expense') acc[monthYear].expenses += curr.amount;
    if (curr.type === 'income') acc[monthYear].income += curr.amount;
    if (curr.type === 'investment') acc[monthYear].investment += curr.amount;
    return acc;
  }, {} as Record<string, { name: string; expenses: number; income: number; investment: number; timestamp: number }>);

  const monthlySpendingData = Object.values(monthlyDataMap).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 font-serif">Welcome back! 👋</h1>
          <p className="text-slate-400 mt-2">Here's your financial overview for this month.</p>
        </div>
        {profile && (
          <div className="hidden md:flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center">
              <User className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Academy Profile</p>
              <p className="text-sm font-bold text-slate-200 capitalize">{profile}</p>
            </div>
          </div>
        )}
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold text-slate-50">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+2.5% this month</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Monthly Expenses</p>
              <h3 className="text-2xl font-bold text-slate-50">₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-rose-400 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Savings Rate</p>
              <h3 className="text-2xl font-bold text-slate-50">{savingsRate.toFixed(1)}%</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, savingsRate)}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-400 opacity-20 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Financial Health</p>
              <h3 className="text-3xl font-bold">{healthScore}/100</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-sm text-emerald-50">
              {healthScore > 80 ? 'Excellent! Keep it up.' : healthScore > 50 ? 'Good, but room to improve.' : 'Needs attention.'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-50">Monthly Spending Overview</h3>
            <button className="text-sm text-red-500 font-medium hover:text-red-400">Detailed Report</button>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
                  formatter={(value: number) => `₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
          <h3 className="text-lg font-bold text-slate-50 mb-6">Spending by Category</h3>
          {pieData.length > 0 ? (
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f8fafc' }}
                    formatter={(value: number) => `₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">Total</span>
                <span className="text-lg font-bold text-slate-50">₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              No expenses yet
            </div>
          )}
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-300">{entry.name}</span>
                </div>
                <span className="font-medium text-slate-50">₹{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-50">Recent Transactions</h3>
          <button className="text-sm text-emerald-400 font-medium hover:text-emerald-300">View All</button>
        </div>
        <div className="divide-y divide-slate-800">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.type === 'income' ? 'bg-emerald-500/20 text-emerald-500' : 
                  t.type === 'investment' ? 'bg-blue-500/20 text-blue-500' : 
                  'bg-rose-500/20 text-rose-500'
                }`}>
                  {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : 
                   t.type === 'investment' ? <Target className="w-5 h-5" /> : 
                   <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-slate-50">{t.description}</p>
                  <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                </div>
              </div>
              <div className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-50'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No transactions yet. Start playing to earn!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
