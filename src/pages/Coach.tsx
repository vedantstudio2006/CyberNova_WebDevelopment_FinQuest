import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

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

export default function Coach() {
  const { balance, monthlyIncome, transactions, portfolio } = useStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I am your AI Financial Coach. Ask me anything about budgeting, saving, or investing.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const ai = getAI();
      const context = `
        User Context:
        Balance: ₹${balance}
        Monthly Income: ₹${monthlyIncome}
        Recent Transactions: ${JSON.stringify(transactions.slice(0, 5))}
        Portfolio: ${JSON.stringify(portfolio)}
        
        You are a friendly, knowledgeable financial coach for Indian youth.
        Provide practical, actionable advice based on the user's context.
        Keep responses concise, engaging, and use emojis.
        If they ask about "Future You", simulate what their finances will look like in 5-10 years based on their current habits.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: context }
      });

      // Replay history
      for (const msg of messages.slice(1)) {
        if (msg.role === 'user') {
          await chat.sendMessage({ message: msg.text });
        }
      }

      const response = await chat.sendMessage({ message: userMessage });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Oops! Something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
      <header className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900">
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-50">AI Financial Coach</h2>
          <p className="text-xs text-slate-400 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> Powered by Gemini
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-emerald-500" /> : <Bot className="w-4 h-4 text-blue-500" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-sm'
              }`}>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-500" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 shadow-sm flex space-x-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about budgeting, investing, or 'Future You'..."
            className="flex-1 bg-slate-800 border-transparent focus:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 outline-none transition-all text-slate-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["How can I save more?", "Simulate my Future You", "Explain Mutual Funds"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
