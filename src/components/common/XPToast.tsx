import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Sparkles } from 'lucide-react';

export const XPToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50 animate-bounce transition-all">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-0.5 rounded-2xl shadow-2xl shadow-indigo-500/40">
        <div className="bg-slate-950 px-5 py-3 rounded-[14px] flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-white">{toast.message}</span>
              {toast.xp && (
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  +{toast.xp} XP
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Keep building your daily streak!</p>
          </div>
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
        </div>
      </div>
    </div>
  );
};
