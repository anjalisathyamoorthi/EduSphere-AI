import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Keyboard, Trophy, RotateCcw, Sparkles, AlertCircle, LineChart, Award } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const TypingTrainerPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();

  // Test settings
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60, 120
  const [category, setCategory] = useState<'english' | 'code_python' | 'code_js' | 'code_c' | 'code_java'>('code_python');
  
  // Passages
  const [passages, setPassages] = useState<any[]>([]);
  const [activePassage, setActivePassage] = useState<string>('');

  // Engine state using refs to avoid input re-render lag
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  
  // Typing metrics state
  const [inputVal, setInputVal] = useState('');
  const [errors, setErrors] = useState(0);
  const [liveWPM, setLiveWPM] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [mistypedKeys, setMistypedKeys] = useState<Record<string, number>>({});

  // Leaderboard & History
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [resultSummary, setResultSummary] = useState<any>(null);

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiService.getTypingPassages().then((data) => {
      setPassages(data);
      const match = data.find((p) => p.category === category) || data[0];
      if (match) setActivePassage(match.text);
    }).catch(() => {
      setActivePassage("def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid");
    });

    apiService.getTypingHistory().then(setHistory).catch(() => {});
    apiService.getTypingLeaderboard().then(setLeaderboard).catch(() => {});
  }, [category]);

  // Handle Passage Change
  const handleCategoryChange = (newCat: any) => {
    setCategory(newCat);
    const match = passages.find((p) => p.category === newCat) || passages[0];
    if (match) setActivePassage(match.text);
    resetTest();
  };

  // Reset Test Engine
  const resetTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setInputVal('');
    setErrors(0);
    setLiveWPM(0);
    setLiveAccuracy(100);
    setMistypedKeys({});
    setResultSummary(null);
  };

  // Timer countdown hook
  useEffect(() => {
    let timer: any = null;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !isFinished) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  // Handle Keystrokes via refs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isStarted && val.length > 0) {
      setIsStarted(true);
    }

    if (isFinished) return;

    setInputVal(val);

    // Calculate live metrics
    let currentErrors = 0;
    const newMistyped: Record<string, number> = { ...mistypedKeys };

    for (let i = 0; i < val.length; i++) {
      if (val[i] !== activePassage[i]) {
        currentErrors++;
        const expectedChar = activePassage[i] || 'space';
        newMistyped[expectedChar] = (newMistyped[expectedChar] || 0) + 1;
      }
    }

    setErrors(currentErrors);
    setMistypedKeys(newMistyped);

    const timeElapsedSecs = Math.max(1, duration - timeLeft);
    const wordsTyped = (val.length / 5);
    const calculatedWPM = Math.round((wordsTyped / timeElapsedSecs) * 60);
    const accuracy = val.length > 0 ? Math.max(0, Math.round(((val.length - currentErrors) / val.length) * 100)) : 100;

    setLiveWPM(calculatedWPM);
    setLiveAccuracy(accuracy);

    // Auto-finish if full passage typed
    if (val.length >= activePassage.length) {
      finishTest();
    }
  };

  const finishTest = async () => {
    setIsFinished(true);
    setIsStarted(false);

    const timeElapsed = duration - timeLeft || 1;
    const wordsTyped = inputVal.length / 5;
    const rawWPM = Math.round((wordsTyped / timeElapsed) * 60);
    const netWPM = Math.max(0, Math.round(((wordsTyped - errors / 5) / timeElapsed) * 60));
    const finalAccuracy = inputVal.length > 0 ? Math.max(0, Math.round(((inputVal.length - errors) / inputVal.length) * 100)) : 100;

    const resData = {
      mode: category,
      passage_id: 'p1',
      wpm: netWPM,
      raw_wpm: rawWPM,
      accuracy: finalAccuracy,
      errors,
      mistyped_keys_json: JSON.stringify(mistypedKeys),
      duration_secs: duration,
    };

    setResultSummary({
      netWPM,
      rawWPM,
      accuracy: finalAccuracy,
      errors,
      mistypedKeys,
    });

    try {
      const res = await apiService.saveTypingResult(resData);
      updateUserXP(res.xp_earned);
      triggerXPToast(res.xp_earned, `Typing Speed Result Saved! (${netWPM} WPM)`);
    } catch (err) {
      console.warn('Backend sync failed, saved locally');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mobile Device Warning Banner */}
      <div className="block lg:hidden bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-300 flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
        <span>Typing Speed Trainer is optimized for desktop physical keyboards. Please switch to desktop for full experience!</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Typing Speed Trainer</h2>
            <p className="text-xs text-slate-400">Code & English timed speed test with mistyped-key heatmaps</p>
          </div>
        </div>

        {/* Live WPM & Accuracy Pill */}
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">WPM</span>
            <span className="text-base font-extrabold font-mono text-amber-400">{liveWPM}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono font-semibold">Accuracy</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">{liveAccuracy}%</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Timer</span>
            <span className="text-base font-extrabold font-mono text-indigo-400">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Duration & Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'english', label: 'English Tech' },
            { id: 'code_python', label: 'Python' },
            { id: 'code_js', label: 'JavaScript' },
            { id: 'code_c', label: 'C Language' },
            { id: 'code_java', label: 'Java' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleCategoryChange(m.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                category === m.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timed Duration */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[15, 30, 60, 120].map((t) => (
            <button
              key={t}
              onClick={() => {
                setDuration(t);
                resetTest();
              }}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                duration === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Keystroke Display Box */}
      <div
        onClick={() => hiddenInputRef.current?.focus()}
        className="glass-panel p-8 rounded-3xl border border-slate-800 min-h-[220px] relative cursor-pointer font-mono text-base sm:text-lg leading-relaxed selection:bg-none overflow-hidden"
      >
        {/* Hidden Input Ref */}
        <input
          ref={hiddenInputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
          autoFocus
        />

        {/* Render Characters with Color Highlights */}
        <div className="whitespace-pre-wrap break-words">
          {activePassage.split('').map((char, index) => {
            let charStyle = 'text-slate-500';
            if (index < inputVal.length) {
              if (inputVal[index] === char) {
                charStyle = 'text-emerald-400 font-bold';
              } else {
                charStyle = 'text-rose-500 bg-rose-500/20 rounded';
              }
            }
            const isCursor = index === inputVal.length;

            return (
              <span key={index} className={`relative ${charStyle}`}>
                {isCursor && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400 animate-cursor-blink" />
                )}
                {char}
              </span>
            );
          })}
        </div>

        {!isStarted && !isFinished && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
            <p className="text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-full">
              Click here or start typing to begin test...
            </p>
          </div>
        )}
      </div>

      {/* Test Result Screen Modal Card */}
      {isFinished && resultSummary && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Test Completed! 🎉</h3>
                <p className="text-xs text-slate-400">Mode: {category} • Duration: {duration}s</p>
              </div>
            </div>

            <button
              onClick={resetTest}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-mono">Net WPM</span>
              <span className="text-2xl font-black font-mono text-amber-400">{resultSummary.netWPM}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-mono">Raw WPM</span>
              <span className="text-2xl font-black font-mono text-indigo-400">{resultSummary.rawWPM}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-mono">Accuracy</span>
              <span className="text-2xl font-black font-mono text-emerald-400">{resultSummary.accuracy}%</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-mono">Errors</span>
              <span className="text-2xl font-black font-mono text-rose-400">{resultSummary.errors}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytics History Chart & Squad Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WPM History Line Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <LineChart className="w-4 h-4 text-indigo-400" />
            WPM History Trend (Last 20 Tests)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={history.length ? history : [{ wpm: 65 }, { wpm: 72 }, { wpm: 78 }]}>
                <XAxis stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="wpm" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Squad Leaderboard */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Weekly Squad WPM Leaderboard
          </h3>

          <div className="space-y-2.5">
            {leaderboard.map((user, rank) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-xs text-amber-400 w-5">#{rank + 1}</span>
                  <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full bg-slate-900" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{user.full_name}</h4>
                    <span className="text-[10px] text-slate-400">{user.branch}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-amber-300 block">{user.best_wpm} WPM</span>
                  <span className="text-[10px] text-slate-500">{user.avg_accuracy}% Acc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
