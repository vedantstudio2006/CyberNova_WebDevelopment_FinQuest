import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap, Shield } from 'lucide-react';

const values = [
  { icon: Target, label: "Mission-Driven", description: "Empowering every learner to take control of their financial destiny." },
  { icon: Users, label: "Community First", description: "Built by students and educators who believe finance should be fun." },
  { icon: Zap, label: "Innovation", description: "Cutting-edge AI and gamification for an unmatched learning experience." },
  { icon: Shield, label: "Safe & Secure", description: "A risk-free sandbox where mistakes become powerful lessons." },
];

export default function AboutUs() {
  return (
    <section className="py-24 px-4 bg-[#030712]/70 backdrop-blur-md relative overflow-hidden font-sans border-t border-white/5 z-[1]">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-purple-700/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-700/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
          >
            About Us
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
            We're Building the Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Financial Literacy
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            FinQuest was born from a simple idea: financial education should be accessible, 
            engaging, and fun for everyone — from curious teens to ambitious adults. We combine 
            real-world market simulations, AI-powered coaching, and gamified challenges to make 
            mastering money feel like playing your favorite game.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { value: "10K+", label: "Active Learners" },
            { value: "50+", label: "Financial Quizzes" },
            { value: "₹5Cr+", label: "Virtual Traded" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 0.6, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-5 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm group transition-colors hover:border-indigo-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{item.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
