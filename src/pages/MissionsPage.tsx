import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, Clock, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const MissionsPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();
  const [filterMins, setFilterMins] = useState<number | 'all'>('all');
  const [claimedMissions, setClaimedMissions] = useState<Record<number, boolean>>({});

  const MISSIONS = [
    {
      id: 1,
      title: '15-Min Quick Array Sprint',
      description: 'Review 5 flashcards and solve 1 array puzzle.',
      duration_mins: 15,
      xp_reward: 100,
      category: 'Coding',
      tasks: [
        { text: 'Review 5 Data Structure Flashcards', done: true },
        { text: 'Solve Array Two-Pointer Puzzle', done: true },
      ],
    },
    {
      id: 2,
      title: '30-Min Story & Focus Pomodoro',
      description: 'Complete 1 story lesson and log a 25-min Pomodoro session in Squad Room.',
      duration_mins: 30,
      xp_reward: 200,
      category: 'Focus',
      tasks: [
        { text: "Complete 'Two-Pointer Quest' Story", done: true },
        { text: 'Log 25-Min Study Session in Delhi Coders Squad', done: false },
      ],
    },
    {
      id: 3,
      title: '45-Min Algorithm Titan Challenge',
      description: 'Solve 1 boss challenge and beat your typing speed personal best.',
      duration_mins: 45,
      xp_reward: 350,
      category: 'Boss Challenge',
      tasks: [
        { text: "Solve 'Two Sum Titan' Boss Sandbox", done: false },
        { text: 'Beat 70 WPM Personal Best in Typing Speed Trainer', done: true },
      ],
    },
    {
      id: 4,
      title: '60-Min Deep Placement Mock Exam',
      description: 'Attempt a 20-min GATE mock exam and evaluate 1 AI mock interview.',
      duration_mins: 60,
      xp_reward: 500,
      category: 'Exam & Interview',
      tasks: [
        { text: 'Complete GATE CS Core Practice Benchmark', done: false },
        { text: 'Practice AI Mock Technical Interview', done: false },
      ],
    },
  ];

  const filtered = filterMins === 'all' ? MISSIONS : MISSIONS.filter((m) => m.duration_mins === filterMins);

  const handleClaim = (missionId: number, xp: number) => {
    if (claimedMissions[missionId]) return;
    setClaimedMissions((prev) => ({ ...prev, [missionId]: true }));
    updateUserXP(xp);
    triggerXPToast(xp, 'Daily Mission XP Claimed!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daily Missions Hub</h2>
            <p className="text-xs text-slate-400">15 / 30 / 45 / 60 Min Gamified Quest Tracks</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {['all', 15, 30, 45, 60].map((val) => (
            <button
              key={val}
              onClick={() => setFilterMins(val as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMins === val
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {val === 'all' ? 'All Missions' : `${val} Mins`}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const isClaimed = claimedMissions[m.id];
          const completedTasks = m.tasks.filter((t) => t.done).length;
          const progressPct = Math.round((completedTasks / m.tasks.length) * 100);

          return (
            <div key={m.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {m.duration_mins} Mins Track • {m.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                    +{m.xp_reward} XP
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{m.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{m.description}</p>

                {/* Task Checkboxes */}
                <div className="mt-4 space-y-2">
                  {m.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={task.done ? 'line-through text-slate-400' : 'font-medium'}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress & Claim XP */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">Progress: </span>
                  <span className="font-bold text-indigo-300">{progressPct}%</span>
                </div>

                <button
                  onClick={() => handleClaim(m.id, m.xp_reward)}
                  disabled={isClaimed}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                    isClaimed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{isClaimed ? 'Claimed' : `Claim +${m.xp_reward} XP`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
