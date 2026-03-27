import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const QUIZZES = [
  {
    id: 1,
    title: "Budgeting Basics",
    difficulty: "Beginner",
    xpReward: 50,
    coinReward: 20,
    questions: [
      {
        q: "What is the 50/30/20 rule in budgeting?",
        options: [
          "50% Needs, 30% Wants, 20% Savings",
          "50% Savings, 30% Needs, 20% Wants",
          "50% Wants, 30% Savings, 20% Needs",
          "50% Investments, 30% Expenses, 20% Taxes"
        ],
        answer: 0,
        explanation: "The 50/30/20 rule suggests allocating 50% of your income to needs, 30% to wants, and 20% to savings or debt payoff."
      },
      {
        q: "An emergency fund should ideally cover how many months of living expenses?",
        options: ["1 month", "3-6 months", "12 months", "It's not necessary"],
        answer: 1,
        explanation: "Financial experts recommend keeping 3-6 months of essential living expenses in an easily accessible emergency fund."
      }
    ]
  },
  {
    id: 2,
    title: "Credit & Debt",
    difficulty: "Intermediate",
    xpReward: 100,
    coinReward: 50,
    questions: [
      {
        q: "What happens if you only pay the minimum due on your credit card?",
        options: [
          "Your credit score improves significantly",
          "You avoid paying any interest",
          "You pay high interest on the remaining balance",
          "The bank cancels your card"
        ],
        answer: 2,
        explanation: "Paying only the minimum amount means the remaining balance carries over to the next month, accumulating high interest charges."
      },
      {
        q: "Which of these is considered 'Good Debt'?",
        options: [
          "Credit card debt for a vacation",
          "A loan for a depreciating asset like a luxury car",
          "An education loan that increases earning potential",
          "A personal loan for a wedding"
        ],
        answer: 2,
        explanation: "Good debt is an investment that will grow in value or generate long-term income, like an education loan or a mortgage."
      }
    ]
  }
];

export default function Quizzes() {
  const { addXP, addCoins } = useStore();
  const [activeQuiz, setActiveQuiz] = useState<typeof QUIZZES[0] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = (quiz: typeof QUIZZES[0]) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(index);
    
    if (index === activeQuiz!.questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < activeQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      // Award rewards if passed (e.g., > 50%)
      if (score + (selectedAnswer === activeQuiz!.questions[currentQuestion].answer ? 1 : 0) > activeQuiz!.questions.length / 2) {
        addXP(activeQuiz!.xpReward);
        addCoins(activeQuiz!.coinReward);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Financial Quizzes</h1>
        <p className="text-slate-400 mt-2">Test your knowledge and earn rewards!</p>
      </header>

      {!activeQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUIZZES.map((quiz) => (
            <div key={quiz.id} className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-emerald-500 transition-colors group cursor-pointer" onClick={() => handleStartQuiz(quiz)}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <BrainCircuit className="w-6 h-6 text-emerald-500 group-hover:text-white" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  quiz.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">{quiz.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{quiz.questions.length} Questions • ~{quiz.questions.length * 2} mins</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex space-x-4 text-sm font-bold">
                  <span className="text-amber-500 flex items-center"><Trophy className="w-4 h-4 mr-1" /> {quiz.xpReward} XP</span>
                  <span className="text-amber-500 flex items-center">🪙 {quiz.coinReward}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
          {!showResult ? (
            <div>
              <div className="p-6 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-50">{activeQuiz.title}</h2>
                <span className="text-sm font-medium text-slate-400">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentQuestion) / activeQuiz.questions.length) * 100}%` }}></div>
                </div>

                <h3 className="text-2xl font-bold text-slate-50 mb-8 leading-tight">
                  {activeQuiz.questions[currentQuestion].q}
                </h3>

                <div className="space-y-4">
                  {activeQuiz.questions[currentQuestion].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeQuiz.questions[currentQuestion].answer;
                    const showStatus = selectedAnswer !== null;

                    let btnClass = "border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-slate-300";
                    if (showStatus) {
                      if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                      else if (isSelected) btnClass = "border-rose-500 bg-rose-500/10 text-rose-400";
                      else btnClass = "border-slate-700 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showStatus}
                        className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex justify-between items-center ${btnClass}`}
                      >
                        <span>{option}</span>
                        {showStatus && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {showStatus && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedAnswer !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-xl flex items-start space-x-3 ${
                        selectedAnswer === activeQuiz.questions[currentQuestion].answer ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'
                      }`}
                    >
                      {selectedAnswer === activeQuiz.questions[currentQuestion].answer ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-bold ${selectedAnswer === activeQuiz.questions[currentQuestion].answer ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {selectedAnswer === activeQuiz.questions[currentQuestion].answer ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <p className={`text-sm mt-1 ${selectedAnswer === activeQuiz.questions[currentQuestion].answer ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {activeQuiz.questions[currentQuestion].explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedAnswer !== null && (
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleNext}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center"
                    >
                      {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-50 mb-2">Quiz Completed!</h2>
              <p className="text-slate-400 mb-8">You scored {score} out of {activeQuiz.questions.length}</p>
              
              {score > activeQuiz.questions.length / 2 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 max-w-sm mx-auto mb-8">
                  <h3 className="font-bold text-emerald-400 mb-4">Rewards Earned</h3>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-amber-500">+{activeQuiz.xpReward}</span>
                      <span className="text-sm font-medium text-emerald-400">XP</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-amber-500">+{activeQuiz.coinReward}</span>
                      <span className="text-sm font-medium text-emerald-400">Coins</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 max-w-sm mx-auto mb-8">
                  <h3 className="font-bold text-rose-400 mb-2">Keep Learning!</h3>
                  <p className="text-sm text-rose-300">You need to score more than 50% to earn rewards. Try again!</p>
                </div>
              )}

              <button 
                onClick={() => setActiveQuiz(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
