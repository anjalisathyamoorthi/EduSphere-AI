import React from 'react';
import { useApp } from '../context/AppContext';
import { User as UserIcon, Flame, Zap, Trophy, ShieldCheck, Github, Linkedin, Edit3, Award } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setShowOnboardingModal } = useApp();

  const BADGES = [
    { title: 'DSA Apprentice', category: 'Algorithms', icon: Zap, unlocked: true },
    { title: '7-Day Streak Master', category: 'Consistency', icon: Flame, unlocked: true },
    { title: 'Boss Slayer', category: 'Sandbox', icon: Trophy, unlocked: true },
    { title: 'Typing Speedster 70+ WPM', category: 'Typing', icon: Award, unlocked: true },
    { title: 'System Design Architect', category: 'Advanced', icon: ShieldCheck, unlocked: false },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
            alt={user.full_name}
            className="w-24 h-24 rounded-full border-2 border-indigo-500 bg-slate-900 object-cover shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
              <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                Level {user.level}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {user.profile?.branch || 'Computer Science & Engineering'} • {user.profile?.year || '3rd Year'}
            </p>
            <p className="text-xs text-slate-400">{user.profile?.college || 'IIT Delhi'}</p>
            <p className="text-xs text-indigo-300 italic pt-1">{user.profile?.bio || 'B.Tech undergrad building EduSphere AI.'}</p>
          </div>

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Achievements & Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {BADGES.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  b.unlocked
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-amber-500/50'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">{b.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{b.category}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
