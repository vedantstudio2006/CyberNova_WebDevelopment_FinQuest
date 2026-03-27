import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, BrainCircuit, Trophy, TrendingUp } from 'lucide-react';

const features = [
  {
    title: "Interactive Simulator",
    description: "Trade virtual stocks and experience real market dynamics completely risk-free.",
    icon: Gamepad2,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "AI Financial Coach",
    description: "Receive personalized insights, adaptive learning paths, and smart recommendations.",
    icon: BrainCircuit,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Gamified Quizzes",
    description: "Test your financial IQ with bite-sized challenges and earn rewards.",
    icon: Trophy,
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "Net Worth Tracker",
    description: "Monitor your simulated assets, liabilities, and overall wealth growth.",
    icon: TrendingUp,
    color: "from-emerald-400 to-teal-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function Features() {
  return (
    <section className="py-24 px-4 bg-[#030712]/70 backdrop-blur-md relative overflow-hidden font-sans border-t border-white/5 z-[1]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
            Next-Gen Financial Learning
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience education that feels like play. Master the economy through interactive tools designed to build real-world confidence.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.2)",
                }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                  <Icon className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
                
                {/* Cyberpunk corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-indigo-500/50 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-indigo-500/50 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
