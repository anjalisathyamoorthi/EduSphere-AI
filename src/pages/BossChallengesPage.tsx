import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { ShieldAlert, Play, CheckCircle2, XCircle, Lightbulb, Code2, Sparkles, Terminal } from 'lucide-react';

export const BossChallengesPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState<string>(
    `def solve(data):\n    nums, target = data[0], data[1]\n    seen = {}\n    for idx, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], idx]\n        seen[num] = idx\n    return []\n`
  );
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);

  const CHALLENGE = {
    title: 'Boss Challenge: The Two Sum Titan',
    boss_name: 'Titan of Hash Tables',
    difficulty: 'Medium',
    xp_reward: 300,
    problem_statement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    test_cases: [
      { input: '([2, 7, 11, 15], 9)', expected: '[0, 1]' },
      { input: '([3, 2, 4], 6)', expected: '[1, 2]' },
      { input: '([3, 3], 6)', expected: '[0, 1]' },
    ],
    hints: [
      'Hint 1: Can you use a HashMap/Dictionary to store complements in O(1) lookup?',
      'Hint 2: Iterate once through the array checking if (target - num) exists in your map.',
    ],
  };

  const handleRunCode = async () => {
    setRunning(true);
    try {
      const res = await apiService.submitChallenge('two-sum-titan', code, language);
      setOutput(res);
      if (res.success) {
        updateUserXP(CHALLENGE.xp_reward);
        triggerXPToast(CHALLENGE.xp_reward, 'Boss Challenge Solved!');
      }
    } catch (err) {
      setOutput({
        success: false,
        stdout: '',
        stderr: 'Execution Error: Unable to reach sandbox server.',
        test_results: [],
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{CHALLENGE.title}</h2>
            <p className="text-xs text-slate-400">Boss: {CHALLENGE.boss_name} • {CHALLENGE.difficulty}</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
          +{CHALLENGE.xp_reward} XP Reward
        </span>
      </div>

      {/* Grid Layout: Problem Statement + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problem & Test Cases */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Problem Statement</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {CHALLENGE.problem_statement}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-400">Sample Test Cases:</h4>
              {CHALLENGE.test_cases.map((tc, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div className="text-slate-400">Input: <span className="text-indigo-300">{tc.input}</span></div>
                  <div className="text-slate-400">Expected: <span className="text-emerald-300">{tc.expected}</span></div>
                </div>
              ))}
            </div>

            {/* Hints Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Hide Hints' : 'Need a Hint?'}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 space-y-1">
                  {CHALLENGE.hints.map((h, i) => (
                    <p key={i}>{h}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Code Sandbox Editor & Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Editor Bar */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono text-slate-300">solve.{language === 'python' ? 'py' : 'js'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="python">Python 3.13</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{running ? 'Executing...' : 'Run Code (4s limit)'}</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 p-5 font-mono text-xs text-indigo-200 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Sandbox Output Window */}
          {output && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Execution Results ({output.execution_time_ms || 14}ms)
                </span>
                <span className={`font-bold ${output.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {output.success ? 'PASSED ALL TEST CASES' : 'SOME TESTS FAILED'}
                </span>
              </div>

              {output.stdout && (
                <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                  {output.stdout}
                </pre>
              )}

              {output.stderr && (
                <pre className="text-xs font-mono text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/20 overflow-x-auto">
                  {output.stderr}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
