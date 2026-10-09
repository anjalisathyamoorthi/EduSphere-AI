import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Map, Target, ShieldAlert, BookOpenCheck,
  FileText, Users, Image, Briefcase, Bot, GraduationCap,
  LineChart, Keyboard
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'level-map', label: 'Level Map', icon: Map },
  { id: 'missions', label: 'Daily Missions', icon: Target },
  { id: 'challenges', label: 'Boss Challenges', icon: ShieldAlert },
  { id: 'flashcards', label: 'Flashcards', icon: BookOpenCheck },
  { id: 'notes', label: 'AI Notes', icon: FileText },
  { id: 'squads', label: 'Squads & Pomodoro', icon: Users },
  { id: 'feed', label: 'Meme & Tech Feed', icon: Image },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'interview', label: 'AI Mock Interview', icon: Bot },
  { id: 'exams', label: 'Practice Exams', icon: GraduationCap },
  { id: 'analytics', label: 'Progress Analytics', icon: LineChart },
  { id: 'typing', label: 'Typing', icon: Keyboard, badge: 'NEW' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 overflow-y-auto">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-3">
        Learning Navigation
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800/80">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <p className="text-xs font-semibold text-indigo-300">EduSphere AI v1.0</p>
          <p className="text-[11px] text-slate-400 mt-0.5">B.Tech Placement & GATE Prep</p>
        </div>
      </div>
    </aside>
  );
};
