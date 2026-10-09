import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Sparkles, BookOpen, ShieldAlert, Bot, Keyboard, ArrowRight, Trophy, Flame } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setShowAuthModal } = useApp();

  return (
    <div className="space-y-16 py-8 pb-20 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Designed exclusively for B.Tech Undergrads</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Master B.Tech Core & Placements with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            EduSphere AI
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Gamified story lessons, 4-second execution code sandbox, spaced-repetition flashcards, AI mock interviews, and zero-lag typing trainer.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2 transform hover:scale-105"
          >
            <span>Launch Live App Demo</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Story Learning & MCQs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Learn DSA, Web Dev, and System Design through interactive story quests with embedded knowledge checks.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">4s Subprocess Sandbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Solve weekly boss challenges in Python & JavaScript with instant test case evaluation and timeout bounds.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Keyboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Typing Speed Trainer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero-lag ref keystrokes engine for C, Python, Java, JS and tech passages with mistyped-key heatmaps.
          </p>
        </div>
      </div>
    </div>
  );
};
