import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap, Flame, Target, Trophy, ArrowRight, Play, BookOpen,
  ShieldAlert, Keyboard, Clock, Sparkles, Bot, LineChart
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, setActiveTab, setActiveTopicId, triggerXPToast } = useApp();

  const xpProgress = Math.min(100, Math.round(((user.xp % 500) / 500) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{user.profile?.branch || 'Computer Science & Engineering'} • {user.profile?.year || '3rd Year'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user.full_name}! 👋
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Target Goal: <span className="text-indigo-300 font-semibold">{user.profile?.target_goals || 'Master DSA & System Design'}</span>. You are on track for placement readiness!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTopicId(1);
                setActiveTab('story-learning');
              }}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Story Quest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamified Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Stats */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400/20 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Daily Streak</p>
            <h3 className="text-xl font-bold text-white">{user.streak_count} Days Active</h3>
            <p className="text-[11px] text-amber-400/90 font-medium">Keep your momentum going!</p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400 font-medium">Level {user.level}</p>
              <span className="text-xs font-mono font-bold text-indigo-400">{user.xp} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{500 - (user.xp % 500)} XP to Level {user.level + 1}</p>
          </div>
        </div>

        {/* Daily Time Target */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Daily Target</p>
            <h3 className="text-xl font-bold text-white">35 / {user.profile?.daily_time_target_mins || 45} Mins</h3>
            <p className="text-[11px] text-emerald-400 font-medium">78% completed today</p>
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Placement Readiness</p>
            <h3 className="text-xl font-bold text-white">88% Ready</h3>
            <p className="text-[11px] text-purple-300 font-medium">Tier-1 SDE Benchmark</p>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Learning Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setActiveTopicId(1);
              setActiveTab('story-learning');
            }}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-2xl transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300">Story Learning</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Interactive MCQs & stories</p>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300">Boss Challenge</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Python & JS Code Sandbox</p>
          </button>

          <button
            onClick={() => setActiveTab('typing')}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Keyboard className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300">Typing Trainer</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Code & English speed tests</p>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">AI Mock Interview</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Live technical scoring</p>
          </button>
        </div>
      </div>

      {/* Recommended Daily Missions Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Daily Recommended Missions
            </h3>
            <p className="text-xs text-slate-400">Complete tasks to earn XP and extend your daily streak</p>
          </div>
          <button
            onClick={() => setActiveTab('missions')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                15 Mins Sprint
              </span>
              <h4 className="text-sm font-bold text-white">Review 5 Data Structure Flashcards</h4>
              <p className="text-xs text-slate-400">Leitner spaced repetition memory practice</p>
            </div>
            <button
              onClick={() => {
                triggerXPToast(100, 'Mission Claimed!');
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              +100 XP
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                30 Mins Focus
              </span>
              <h4 className="text-sm font-bold text-white">Complete Two-Pointer Quest Story</h4>
              <p className="text-xs text-slate-400">Interactive array manipulation lesson</p>
            </div>
            <button
              onClick={() => {
                setActiveTopicId(1);
                setActiveTab('story-learning');
              }}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
