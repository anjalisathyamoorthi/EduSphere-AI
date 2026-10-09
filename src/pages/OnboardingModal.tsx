import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { GraduationCap, Target, Clock, CheckCircle2, Sparkles, X } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, user, setUser, triggerXPToast } = useApp();

  const [branch, setBranch] = useState(user.profile?.branch || 'Computer Science & Engineering');
  const [year, setYear] = useState(user.profile?.year || '3rd Year');
  const [targetGoals, setTargetGoals] = useState(user.profile?.target_goals || 'DSA, Web Dev, System Design');
  const [dailyTarget, setDailyTarget] = useState<number>(user.profile?.daily_time_target_mins || 45);

  if (!showOnboardingModal) return null;

  const BRANCHES = [
    'Computer Science & Engineering',
    'AI & Data Science',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year / Final Year'];
  const TARGET_TIMES = [15, 30, 45, 60];

  const handleSave = async () => {
    const updatedProfile = {
      branch,
      year,
      college: user.profile?.college || 'IIT / NIT / B.Tech College',
      target_goals: targetGoals,
      daily_time_target_mins: dailyTarget,
    };

    setUser((prev) => ({
      ...prev,
      profile: updatedProfile,
    }));

    try {
      await apiService.updateOnboarding(updatedProfile);
    } catch (err) {
      console.warn('Onboarding update failed on server, saved locally');
    }

    setShowOnboardingModal(false);
    triggerXPToast(100, 'B.Tech Profile & Goals Updated!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        <button
          onClick={() => setShowOnboardingModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">B.Tech Learning Setup</h2>
            <p className="text-xs text-slate-400">Personalize your EduSphere AI curriculum track</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Branch Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Engineering Branch</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BRANCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBranch(b)}
                  className={`px-3 py-2 text-xs rounded-xl border text-left font-medium transition-all ${
                    branch === b
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Current Academic Year</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`px-3 py-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    year === y
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Time Target */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>Daily Study Time Target</span>
              <span className="text-indigo-400 font-bold">{dailyTarget} Mins / Day</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TARGET_TIMES.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyTarget(mins)}
                  className={`py-2 text-xs rounded-xl border font-bold transition-all flex items-center justify-center gap-1 ${
                    dailyTarget === mins
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins} m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Goals Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Focus Goals</label>
            <input
              type="text"
              value={targetGoals}
              onChange={(e) => setTargetGoals(e.target.value)}
              placeholder="e.g. Data Structures, React, System Design, GATE CS"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Save Profile & Claim +100 XP Bonus</span>
        </button>
      </div>
    </div>
  );
};
