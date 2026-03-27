import { create } from 'zustand';

export type Transaction = {
  id: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  category: string;
  date: string;
  description: string;
  imageUrl?: string;
};

export type Asset = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

export type UserProfile = 'student' | 'employee' | 'business';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  cost: number;
  category: string;
  isMandatory: boolean;
}

export type MarketAsset = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: 'stock' | 'mf' | 'commodity' | 'crypto' | 'fixed';
  history: number[];
};

interface UserState {
  // User Details
  name: string | null;
  region: string | null;
  isLoggedIn: boolean;
  fixedExpenses: {
    food: number;
    travel: number;
  };
  login: (details: { name: string; region: string; profile: UserProfile; income: number; expenses: { food: number; travel: number } }) => void;

  // Gamification
  xp: number;
  level: number;
  coins: number;
  streak: number;
  badges: string[];
  
  // Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  
  // Events
  pendingEvents: GameEvent[];
  lastEventTime: number | null;
  lastEntertainmentLogDate: string | null;
  addEvent: (event: GameEvent) => void;
  resolveEvent: (eventId: string, pay: boolean) => void;
  setLastEventTime: (time: number) => void;
  logEntertainmentExpense: (amount: number, description: string) => void;
  
  // Financial
  balance: number;
  monthlyIncome: number;
  transactions: Transaction[];
  portfolio: Asset[];
  market: MarketAsset[];
  
  // Actions
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  buyAsset: (symbol: string, name: string, quantity: number, price: number) => void;
  sellAsset: (symbol: string, quantity: number, price: number) => void;
  updateAssetPrices: (prices: Record<string, number>) => void;
  updateMarket: () => void;
}

const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

const generateHistory = (currentPrice: number, volatility: number, points: number = 30) => {
  const history = new Array(points);
  history[points - 1] = currentPrice;
  for (let i = points - 2; i >= 0; i--) {
    const change = (Math.random() * volatility * 2) - volatility;
    history[i] = history[i + 1] / (1 + change);
  }
  return history;
};

export const useStore = create<UserState>((set) => ({
  xp: 150,
  level: 2,
  coins: 500,
  streak: 3,
  badges: ['First Login', 'Saver Novice'],
  
  // User Details
  name: null,
  region: null,
  isLoggedIn: false,
  fixedExpenses: { food: 0, travel: 0 },
  
  profile: null,
  pendingEvents: [],
  lastEventTime: null,
  lastEntertainmentLogDate: null,
  
  balance: 0,
  monthlyIncome: 0,
  transactions: [],
  portfolio: [],
  market: [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2600, change: 1.5, type: 'stock', history: generateHistory(2600, 0.015) },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3450, change: -0.8, type: 'stock', history: generateHistory(3450, 0.012) },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1500, change: 0.2, type: 'stock', history: generateHistory(1500, 0.01) },
    { symbol: 'INFY', name: 'Infosys', price: 1600, change: 1.1, type: 'stock', history: generateHistory(1600, 0.018) },
    { symbol: 'ITC', name: 'ITC Limited', price: 400, change: 0.5, type: 'stock', history: generateHistory(400, 0.008) },
    { symbol: 'SBIN', name: 'State Bank of India', price: 750, change: -0.3, type: 'stock', history: generateHistory(750, 0.014) },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 950, change: 2.1, type: 'stock', history: generateHistory(950, 0.02) },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1050, change: 0.7, type: 'stock', history: generateHistory(1050, 0.013) },
    { symbol: 'NIFTY50', name: 'Index Fund (Nifty 50)', price: 22000, change: 0.5, type: 'mf', history: generateHistory(22000, 0.005) },
    { symbol: 'GOLD', name: 'Digital Gold', price: 6500, change: 0.1, type: 'commodity', history: generateHistory(6500, 0.003) },
    { symbol: 'BTC', name: 'Bitcoin', price: 5500000, change: 2.5, type: 'crypto', history: generateHistory(5500000, 0.03) },
  ],
  
  login: (details) => set((state) => {
    const initialTransactions: Transaction[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'income',
        amount: details.income,
        category: 'Initial Income',
        date: new Date().toISOString(),
        description: details.profile === 'student' ? 'Pocket Money' : details.profile === 'employee' ? 'Salary' : 'Business Capital'
      }
    ];

    if (details.expenses.food > 0) {
      initialTransactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'expense',
        amount: details.expenses.food,
        category: 'Food',
        date: new Date().toISOString(),
        description: 'Monthly Food Budget'
      });
    }

    if (details.expenses.travel > 0) {
      initialTransactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'expense',
        amount: details.expenses.travel,
        category: 'Transport',
        date: new Date().toISOString(),
        description: 'Monthly Travel Budget'
      });
    }

    return {
      name: details.name,
      region: details.region,
      profile: details.profile,
      monthlyIncome: details.income,
      fixedExpenses: details.expenses,
      balance: details.income - (details.expenses.food + details.expenses.travel),
      isLoggedIn: true,
      transactions: initialTransactions
    };
  }),

  setProfile: (profile) => set({ profile }),
  
  addEvent: (event) => set((state) => ({
    pendingEvents: [event, ...state.pendingEvents]
  })),
  
  resolveEvent: (eventId, pay) => set((state) => {
    const event = state.pendingEvents.find(e => e.id === eventId);
    if (!event) return state;
    
    const newEvents = state.pendingEvents.filter(e => e.id !== eventId);
    
    if (pay) {
      if (state.balance < event.cost) return state; // Cannot afford
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'expense',
        amount: event.cost,
        category: event.category,
        date: new Date().toISOString(),
        description: event.title,
      };
      
      return {
        pendingEvents: newEvents,
        balance: state.balance - event.cost,
        transactions: [newTransaction, ...state.transactions]
      };
    } else {
      // If mandatory and not paid, maybe a penalty? For now just dismiss or deduct anyway.
      // Let's say if it's mandatory, you HAVE to pay it. The UI shouldn't allow ignoring mandatory.
      // If it's not mandatory, just dismiss.
      return {
        pendingEvents: newEvents
      };
    }
  }),
  
  setLastEventTime: (time) => set({ lastEventTime: time }),
  
  logEntertainmentExpense: (amount, description) => set((state) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'expense',
      amount: amount,
      category: 'Entertainment',
      date: new Date().toISOString(),
      description: description || 'Daily Entertainment/Games'
    };
    
    return {
      lastEntertainmentLogDate: new Date().toDateString(),
      transactions: [newTransaction, ...state.transactions],
      balance: state.balance - amount
    };
  }),
  
  addXP: (amount) => set((state) => {
    const newXp = state.xp + amount;
    return { xp: newXp, level: calculateLevel(newXp) };
  }),
  
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  
  addTransaction: (transaction) => set((state) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    
    let newBalance = state.balance;
    if (transaction.type === 'income') newBalance += transaction.amount;
    else if (transaction.type === 'expense' || transaction.type === 'investment') newBalance -= transaction.amount;
    
    return {
      transactions: [newTransaction, ...state.transactions],
      balance: newBalance,
    };
  }),
  
  buyAsset: (symbol, name, quantity, price) => set((state) => {
    const totalCost = quantity * price;
    if (state.balance < totalCost) return state; // Not enough balance
    
    const existingAsset = state.portfolio.find(a => a.symbol === symbol);
    let newPortfolio;
    
    if (existingAsset) {
      const newQuantity = existingAsset.quantity + quantity;
      const newAveragePrice = ((existingAsset.quantity * existingAsset.averagePrice) + totalCost) / newQuantity;
      newPortfolio = state.portfolio.map(a => 
        a.symbol === symbol 
          ? { ...a, quantity: newQuantity, averagePrice: newAveragePrice, currentPrice: price }
          : a
      );
    } else {
      newPortfolio = [...state.portfolio, { symbol, name, quantity, averagePrice: price, currentPrice: price }];
    }
    
    return {
      balance: state.balance - totalCost,
      portfolio: newPortfolio,
      transactions: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'investment',
        amount: totalCost,
        category: 'Investment',
        date: new Date().toISOString(),
        description: `Bought ${quantity} ${symbol}`
      }, ...state.transactions]
    };
  }),
  
  sellAsset: (symbol, quantity, price) => set((state) => {
    const existingAsset = state.portfolio.find(a => a.symbol === symbol);
    if (!existingAsset || existingAsset.quantity < quantity) return state;
    
    const totalRevenue = quantity * price;
    let newPortfolio;
    
    if (existingAsset.quantity === quantity) {
      newPortfolio = state.portfolio.filter(a => a.symbol !== symbol);
    } else {
      newPortfolio = state.portfolio.map(a => 
        a.symbol === symbol 
          ? { ...a, quantity: a.quantity - quantity, currentPrice: price }
          : a
      );
    }
    
    return {
      balance: state.balance + totalRevenue,
      portfolio: newPortfolio,
      transactions: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'income',
        amount: totalRevenue,
        category: 'Investment Return',
        date: new Date().toISOString(),
        description: `Sold ${quantity} ${symbol}`
      }, ...state.transactions]
    };
  }),
  
  updateAssetPrices: (prices) => set((state) => ({
    portfolio: state.portfolio.map(a => 
      prices[a.symbol] ? { ...a, currentPrice: prices[a.symbol] } : a
    )
  })),

  updateMarket: () => set((state) => {
    const newMarket = state.market.map(asset => {
      // Fixed deposits don't fluctuate randomly
      if (asset.type === 'fixed') return asset;

      // Calculate random fluctuation based on asset type volatility
      let volatility = 0.01; // 1% default
      if (asset.type === 'crypto') volatility = 0.05; // 5% for crypto
      if (asset.type === 'commodity') volatility = 0.005; // 0.5% for gold
      if (asset.type === 'mf') volatility = 0.008; // 0.8% for index funds

      const changePercent = (Math.random() * volatility * 2) - volatility;
      const newPrice = Math.max(1, asset.price * (1 + changePercent)); // Prevent negative prices
      const actualChange = ((newPrice - asset.price) / asset.price) * 100;

      const newHistory = [...asset.history, newPrice].slice(-20); // Keep last 20 data points

      return {
        ...asset,
        price: newPrice,
        change: actualChange,
        history: newHistory
      };
    });

    // Also update portfolio prices
    const pricesRecord = newMarket.reduce((acc, curr) => {
      acc[curr.symbol] = curr.price;
      return acc;
    }, {} as Record<string, number>);

    const newPortfolio = state.portfolio.map(a => 
      pricesRecord[a.symbol] ? { ...a, currentPrice: pricesRecord[a.symbol] } : a
    );

    return { market: newMarket, portfolio: newPortfolio };
  })
}));
