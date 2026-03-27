import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import GradientBlinds from '../components/GradientBlinds';
import Features from '../components/Features';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';

export default function Home() {
  const textChars = "Welcome to CyberNova".split("");

  return (
    <div className="bg-[#030712] font-sans relative">

      {/* ===== GLOBAL GRADIENT BLINDS BACKGROUND ===== */}
      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
        <GradientBlinds
          gradientColors={['#2563eb', '#4f46e5', '#9333ea']}
          angle={30}
          noise={0.5}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.7}
          spotlightSoftness={1}
          spotlightOpacity={0.8}
          mouseDampening={0.15}
          distortAmount={2}
          shineDirection="left"
          mixBlendMode="screen"
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-500/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'linear',
            }}
          />
        ))}

        {/* Main Content */}
        <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          {/* Hypnotic Text Effect */}
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6 flex flex-wrap justify-center overflow-hidden">
            {textChars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.6,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed overflow-hidden">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-block"
            >
              Master your financial future with interactive, gamified learning.
            </motion.span>
          </p>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.5, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <motion.a
              href="https://finquesthastitout.netlify.app"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <Sparkles className="w-5 h-5 text-indigo-300 group-hover:animate-pulse" />
              <span className="relative z-10">Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {/* Hover Glare */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <Features />

      {/* ===== ABOUT US SECTION ===== */}
      <AboutUs />

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
