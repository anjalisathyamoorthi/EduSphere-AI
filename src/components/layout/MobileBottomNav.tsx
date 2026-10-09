import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Map, Target, ShieldAlert, Keyboard } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'level-map', label: 'Map', icon: Map },
  { id: 'missions', label: 'Missions', icon: Target },
  { id: 'challenges', label: 'Boss', icon: ShieldAlert },
  { id: 'typing', label: 'Typing', icon: Keyboard },
];

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex justify-around items-center">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
