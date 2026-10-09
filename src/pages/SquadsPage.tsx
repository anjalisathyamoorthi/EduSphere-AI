import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Users, Play, Pause, RotateCcw, Clock, Shield, Sparkles, Send } from 'lucide-react';

export const SquadsPage: React.FC = () => {
  const { triggerXPToast, updateUserXP, user } = useApp();

  // Pomodoro Timer State (25 minutes = 1500 seconds)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Priya Verma', text: 'Hey Alex! Ready for today 25-min DSA focus sprint?' },
    { sender: 'Rohan Gupta', text: 'Joining room now! Let solve Two Sum Titan boss challenge.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'study') {
        updateUserXP(50);
        triggerXPToast(50, '25-Min Pomodoro Focus Session Completed!');
        apiService.logPomodoro(1, 25, 'Deep Focus Study');
        setMode('break');
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, { sender: user.full_name, text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Delhi Tech Coders Squad 🚀</h2>
            <p className="text-xs text-slate-400">Code: DELHI7 • 3 Active Members • 4,530 Weekly XP</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
          +50 XP Per Pomodoro Session
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pomodoro Room */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>{mode === 'study' ? '25-Min Deep Work Sprint' : '5-Min Recovery Break'}</span>
            </div>

            {/* Giant Timer Display */}
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-wider bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent my-4">
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause Timer' : 'Start Focus Sprint'}</span>
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
                }}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Squad Live Chat */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl h-[420px] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
              <span>Squad Focus Room Chat</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                3 Online
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-indigo-300">{msg.sender}</span>
                  <p className="text-slate-300 font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Message study room..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSendChat}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
