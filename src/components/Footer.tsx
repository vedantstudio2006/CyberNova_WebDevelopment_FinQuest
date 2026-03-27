import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Heart, ArrowUpRight } from 'lucide-react';

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Simulator", href: "#" },
      { label: "AI Coach", href: "#" },
      { label: "Quizzes", href: "#" },
      { label: "Net Worth", href: "#" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
      { label: "FAQ", href: "#" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ]
  }
];

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#030712]/70 backdrop-blur-md font-sans overflow-hidden border-t border-white/5 z-[1]">
      {/* Animated glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8 relative z-10">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
              FinQuest
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Gamified financial education for the next generation. Learn, simulate, and grow your financial intelligence — risk-free.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Link columns */}
          {footerLinks.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (gi + 1) }}
            >
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.href}
                      className="text-slate-500 hover:text-indigo-400 transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} FinQuest. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 inline-block animate-pulse" /> by Team Hash It Out
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
