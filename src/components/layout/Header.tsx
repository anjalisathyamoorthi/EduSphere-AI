import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Flame, Zap, User as UserIcon, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, setShowAIMentorModal, setShowOnboardingModal, activeTab, setActiveTab } = useApp();

  const nextLevelXP = user.level * 500;
  const xpProgress = Math.min(100, Math.round(((user.xp % 500) / 500) * 100));

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            EduSphere AI
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">B.Tech Gamified Platform</p>
        </div>
      </div>

      {/* Right Stats & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Streak Fire Pill */}
        <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
          <span>{user.streak_count} Day Streak</span>
        </div>

        {/* Level & XP Pill */}
        <div className="hidden sm:flex items-center space-x-2 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md font-mono text-[10px]">
            Lvl {user.level}
          </span>
          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <span className="text-indigo-300 font-mono">{user.xp} XP</span>
        </div>

        {/* AI Mentor Trigger Pill */}
        <button
          onClick={() => setShowAIMentorModal(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md shadow-indigo-600/30 transition-all transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300/30" />
          <span className="hidden md:inline">AI Mentor</span>
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={() => setShowOnboardingModal(true)}
          className="relative group p-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 focus:outline-none"
          title="Edit B.Tech Profile & Target Goals"
        >
          <img
            src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
            alt={user.full_name}
            className="w-8 h-8 rounded-full bg-slate-900 object-cover"
          />
        </button>
      </div>
    </header>
  );
};
