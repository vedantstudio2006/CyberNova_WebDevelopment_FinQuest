import React, { useState, useEffect, useRef } from 'react';
import { useStore, UserProfile } from '../store/useStore';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Zap, Coins, ArrowRight, Clock, AlertTriangle, User, Camera, X } from 'lucide-react';

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

type Scenario = {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    cost: number;
    impact: { health: number; happiness: number; xp: number };
    feedback: string;
  }[];
};

export default function Simulator() {
  const { balance, addTransaction, addXP, addCoins, profile, name, region, pendingEvents, resolveEvent, addEvent, lastEventTime, setLastEventTime, transactions } = useStore();
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [history, setHistory] = useState<{ text: string; isUser: boolean; isSystem?: boolean }[]>([]);
  const [stats, setStats] = useState({ health: 100, happiness: 100, day: 1 });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(3600000); // 1 hour in ms
  const [isCheckInDue, setIsCheckInDue] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulate' | 'history'>('simulate');
  const [memoryImage, setMemoryImage] = useState<string | null>(null);
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Classroom of Elite style theme
  const themeColors = {
    primary: 'red-600',
    secondary: 'slate-900',
    accent: 'amber-500',
    text: 'slate-50',
    muted: 'slate-400'
  };

  const generateScenario = async (isDaily: boolean = false, customInput?: string) => {
    if (!profile) return;
    setLoading(true);
    setFeedback(null);
    try {
      const ai = getAI();
      const prompt = customInput 
        ? `You are the AI director of an elite financial academy (similar to Classroom of the Elite). 
        The student (Name: ${name || 'Student'}, Region: ${region || 'India'}, Profile: ${profile}, Balance: ₹${balance}) is facing a REAL-LIFE financial decision or situation:
        "${customInput}"
        
        Generate 3 realistic choices for them to handle this specific situation.
        Provide the exact cost for each choice (use realistic numbers based on their input).
        Evaluate the impact on their Health (0-100), Happiness (0-100), and Academy XP.
        Return JSON strictly matching this schema.`
        : `You are the AI director of an elite financial academy (similar to Classroom of the Elite). 
        Generate a realistic, high-stakes financial scenario for day ${stats.day}.
        User Details: Name: ${name || 'Student'}, Region: ${region || 'India'}, Profile: ${profile} (Student with pocket money, Employee with salary, or Business owner with profit).
        Current balance: ₹${balance}. Health: ${stats.health}. Happiness: ${stats.happiness}.
        ${isDaily ? 'This is a daily mandatory expense or unexpected event.' : 'This is a strategic choice event.'}
        
        CRITICAL INSTRUCTIONS:
        - Focus on NORMAL DAILY LIFE expenses (e.g., 3 meals a day, travel costs, games, entertainment, minor emergencies).
        - EXCLUDE school fees, college fees, and dorm/hostel rent for students. Do not generate scenarios about paying tuition.
        - The scenario should be ruthless but fair, fitting the elite academy theme.
        
        Provide 3 choices. One should be financially responsible but difficult, one tempting but bad long-term, one neutral/risky.
        Return JSON strictly matching this schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    cost: { type: Type.NUMBER, description: "Positive for expense, negative for income" },
                    impact: {
                      type: Type.OBJECT,
                      properties: {
                        health: { type: Type.NUMBER },
                        happiness: { type: Type.NUMBER },
                        xp: { type: Type.NUMBER }
                      },
                      required: ["health", "happiness", "xp"]
                    },
                    feedback: { type: Type.STRING, description: "Why this was a good/bad choice in the academy" }
                  },
                  required: ["id", "text", "cost", "impact", "feedback"]
                }
              }
            },
            required: ["id", "title", "description", "options"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setScenario(data);
      setHistory(prev => [...prev, { text: `[SYSTEM NOTIFICATION]: ${data.description}`, isUser: false, isSystem: true }]);
    } catch (error) {
      console.error("Failed to generate scenario:", error);
      // Fallback
      setScenario({
        id: 'fallback',
        title: 'Academy Penalty',
        description: 'You violated a minor academy rule. Pay the fine or face deduction in class points (happiness).',
        options: [
          { id: '1', text: 'Pay Fine (₹500)', cost: 500, impact: { health: 0, happiness: 0, xp: 10 }, feedback: 'A wise choice to protect your standing.' },
          { id: '2', text: 'Argue (₹0)', cost: 0, impact: { health: -5, happiness: -20, xp: 0 }, feedback: 'Foolish. The academy does not tolerate insubordination.' },
          { id: '3', text: 'Bribe Prefect (₹1000)', cost: 1000, impact: { health: 0, happiness: 10, xp: -10 }, feedback: 'Risky, but effective this time.' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Event Timer Logic (Simulated 1 hour)
  useEffect(() => {
    if (!profile) return;

    const EVENT_INTERVAL = 3600000; // 1 hour in ms

    const checkEvents = () => {
      const now = Date.now();
      
      if (!lastEventTime || now - lastEventTime > EVENT_INTERVAL) {
        setIsCheckInDue(true);
      } else {
        setTimeLeft(EVENT_INTERVAL - (now - lastEventTime));
        setIsCheckInDue(false);
      }
    };

    // Initial check
    checkEvents();

    // Set interval to check periodically
    eventTimerRef.current = setInterval(checkEvents, 10000);

    // Countdown timer for UI
    countdownTimerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => {
      if (eventTimerRef.current) clearInterval(eventTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [profile, lastEventTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !memoryImage) return;
    
    setHistory(prev => [...prev, { text: userInput || 'Uploaded a memory', isUser: true }]);
    generateScenario(false, userInput);
    setUserInput('');
    
    // Reset check-in timer if it was due
    if (isCheckInDue) {
      setLastEventTime(Date.now());
      setIsCheckInDue(false);
    }
  };

  // Initial load if profile exists and no scenario
  useEffect(() => {
    if (profile && !scenario && !loading && history.length === 0) {
      setHistory([{ text: `Welcome to the Academy, ${name || 'Student'} from ${region || 'Unknown'}. Your profile: ${profile.toUpperCase()}. Survive and thrive.`, isUser: false, isSystem: true }]);
    }
  }, [profile, name, region]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemoryImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChoice = (option: Scenario['options'][0]) => {
    // Apply consequences
    if (option.cost > 0) {
      addTransaction({
        type: 'expense',
        amount: option.cost,
        category: 'Simulation',
        description: option.text,
        imageUrl: memoryImage || undefined
      });
    } else if (option.cost < 0) {
      addTransaction({
        type: 'income',
        amount: Math.abs(option.cost),
        category: 'Simulation',
        description: option.text,
        imageUrl: memoryImage || undefined
      });
    }

    addXP(option.impact.xp);
    if (option.impact.xp > 10) addCoins(50); // Reward good choices

    setStats(prev => ({
      health: Math.min(100, Math.max(0, prev.health + option.impact.health)),
      happiness: Math.min(100, Math.max(0, prev.happiness + option.impact.happiness)),
      day: prev.day + 1
    }));

    setHistory(prev => [...prev, { text: `Decision: ${option.text}`, isUser: true }]);
    setFeedback(option.feedback);
    setScenario(null);
    setMemoryImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col font-sans">
      <header className="mb-6 flex items-center justify-between bg-slate-900 p-4 rounded-2xl shadow-sm border border-red-900/30">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 font-serif tracking-wide">ACADEMY SIMULATOR</h1>
          <p className="text-sm text-slate-400">Day {stats.day} • Profile: <span className="uppercase text-red-400 font-bold">{profile}</span></p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-300">{stats.health}%</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-300">{stats.happiness}%</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Clock className={`w-4 h-4 ${isCheckInDue ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
            <span className={`font-bold font-mono ${isCheckInDue ? 'text-red-400' : 'text-slate-300'}`}>
              {isCheckInDue ? 'CHECK-IN DUE' : formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-red-900/50">
            <Coins className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-emerald-400">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col relative">
        <div className="flex border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setActiveTab('simulate')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
              activeTab === 'simulate' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Active Simulation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
              activeTab === 'history' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Spend History & Memories
          </button>
        </div>

        {activeTab === 'history' ? (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900">
            {transactions.filter(t => t.category === 'Simulation' || t.imageUrl).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No simulation history or memories yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactions.filter(t => t.category === 'Simulation' || t.imageUrl).map(t => (
                  <div key={t.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
                    {t.imageUrl && (
                      <img src={t.imageUrl} alt="Memory" className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-50">{t.description}</h4>
                          <span className={`font-bold whitespace-nowrap ml-2 ${t.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-4">{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Pending Events Overlay */}
        {pendingEvents.length > 0 && !scenario && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-red-900/90 backdrop-blur-sm border border-red-500 text-white p-4 rounded-xl shadow-lg max-w-sm animate-pulse">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                <h4 className="font-bold">Pending Academy Dues</h4>
              </div>
              <p className="text-sm text-red-200 mb-3">You have {pendingEvents.length} unresolved expense(s).</p>
              <button 
                onClick={() => {
                  // Load the first pending event as a scenario
                  const ev = pendingEvents[0];
                  setScenario({
                    id: ev.id,
                    title: ev.title,
                    description: ev.description,
                    options: [
                      { id: 'pay', text: `Pay ₹${ev.cost}`, cost: ev.cost, impact: { health: 0, happiness: 0, xp: 5 }, feedback: 'Obligation met.' },
                      { id: 'ignore', text: 'Ignore (Penalty)', cost: 0, impact: { health: -10, happiness: -20, xp: -10 }, feedback: 'The academy penalizes those who ignore their debts.' }
                    ]
                  });
                  resolveEvent(ev.id, false); // Remove from pending, we handle it here
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm transition-colors"
              >
                Resolve Now
              </button>
            </div>
          </div>
        )}

        {/* Chat/Story Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          {history.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.isUser 
                  ? 'bg-slate-700 text-white rounded-br-none border border-slate-600' 
                  : msg.isSystem 
                    ? 'bg-red-900/20 text-red-200 rounded-bl-none border border-red-900/50 font-mono text-sm'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 flex space-x-2 border border-slate-700">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {feedback && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-start space-x-3"
            >
              <Brain className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-slate-300">Academy Evaluation</h4>
                <p className="text-slate-400 mt-1">{feedback}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Real-life Input Area */}
        {!scenario && !loading && (
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            {isCheckInDue && (
              <div className="mb-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Mandatory Check-in</h4>
                  <p className="text-xs text-red-200 mt-1">It's been an hour. Log any recent expenses or financial decisions you are facing right now.</p>
                </div>
              </div>
            )}
            {memoryImage && (
              <div className="mb-3 relative inline-block">
                <img src={memoryImage} alt="Upload preview" className="h-20 w-20 object-cover rounded-lg border border-slate-700" />
                <button 
                  type="button"
                  onClick={() => setMemoryImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <form onSubmit={handleCustomSubmit} className="flex space-x-2 items-center">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-700 transition-colors"
                title="Add a picture for memory"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="E.g., I'm at a cafe and want to buy a ₹200 coffee..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <button
                type="submit"
                disabled={!userInput.trim() && !memoryImage}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center"
              >
                Evaluate
              </button>
            </form>
          </div>
        )}

        {/* Choices Area */}
        <AnimatePresence>
          {scenario && !loading && !feedback && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="p-6 bg-slate-950 border-t border-slate-800"
            >
              <h3 className="text-lg font-bold text-slate-50 mb-4 font-serif">{scenario.title}</h3>
              <div className="space-y-3">
                {scenario.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option)}
                    disabled={balance < option.cost && option.cost > 0}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group ${
                      balance < option.cost && option.cost > 0
                        ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900' 
                        : 'border-slate-700 bg-slate-800 hover:border-red-500 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium text-slate-300 group-hover:text-white">{option.text}</span>
                    {option.cost > 0 ? (
                      <span className="text-red-400 font-bold">-₹{option.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    ) : option.cost < 0 ? (
                      <span className="text-emerald-400 font-bold">+₹{Math.abs(option.cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    ) : (
                      <span className="text-slate-500 font-bold">Free</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
