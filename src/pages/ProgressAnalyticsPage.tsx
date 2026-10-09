import React from 'react';
import { useApp } from '../context/AppContext';
import { LineChart as LineChartIcon, Sparkles, Trophy, Calendar, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ProgressAnalyticsPage: React.FC = () => {
  const { user } = useApp();

  const WEEKLY_DATA = [
    { day: 'Mon', mins: 45, xp: 180 },
    { day: 'Tue', mins: 30, xp: 140 },
    { day: 'Wed', mins: 60, xp: 250 },
    { day: 'Thu', mins: 40, xp: 160 },
    { day: 'Fri', mins: 55, xp: 220 },
    { day: 'Sat', mins: 75, xp: 310 },
    { day: 'Sun', mins: 50, xp: 190 },
  ];

  const SKILLS = [
    { skill: 'Data Structures', mastery: 85, status: 'Mastered' },
    { skill: 'Algorithms', mastery: 78, status: 'Proficient' },
    { skill: 'Web Engineering', mastery: 90, status: 'Mastered' },
    { skill: 'Operating Systems', mastery: 68, status: 'Learning' },
    { skill: 'System Design', mastery: 62, status: 'Learning' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Progress & Performance Analytics</h2>
            <p className="text-xs text-slate-400">Weekly breakdown, 30-day activity heatmap & AI Coach review</p>
          </div>
        </div>
      </div>

      {/* AI Coach Review Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="text-base font-bold text-white">AI Executive Performance Review</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
            88% Placement Ready
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Outstanding effort this week, {user.full_name}! You logged 355 minutes of focused study and tackled 13 daily missions across DSA and Web Engineering.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-emerald-400 block flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Core Strengths:
            </span>
            <p className="text-xs text-slate-300">• Consistent daily study streaks and high array algorithm accuracy.</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-amber-400 block flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Focus Goal This Week:
            </span>
            <p className="text-xs text-slate-300">• Dynamic Programming & System Design Rate Limiters.</p>
          </div>
        </div>

        <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/20 text-xs text-indigo-200 italic flex items-center gap-2">
          <Quote className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>"Consistency outperforms intensity. Keep building your daily momentum!"</span>
        </div>
      </div>

      {/* Weekly Breakdown Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Focus Minutes</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_DATA}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px' }} />
              <Bar dataKey="mins" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Mastery Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skills Mastery Matrix</h3>
        <div className="space-y-3">
          {SKILLS.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">{item.skill}</span>
                <span className="text-indigo-400 font-mono">{item.mastery}% ({item.status})</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${item.mastery}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
