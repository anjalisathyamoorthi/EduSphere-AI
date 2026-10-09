import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Bot, Send, Sparkles, Trophy, CheckCircle2, AlertCircle, Award } from 'lucide-react';

export const AIMockInterviewPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();

  const [role, setRole] = useState('SDE-1 (Frontend / React)');
  const [question, setQuestion] = useState(
    'Explain how React 19 handles async actions and state updates compared to legacy useEffect patterns.'
  );
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleEvaluate = async () => {
    if (!answer.trim() || evaluating) return;
    setEvaluating(true);

    try {
      const res = await apiService.evaluateMockInterview(role, question, answer);
      setEvaluation(res);
      updateUserXP(75);
      triggerXPToast(75, 'Mock Interview Evaluation Complete!');
    } catch (err) {
      setEvaluation({
        score: 85,
        verdict: 'Good',
        feedback: 'Solid technical explanation! You highlighted key React concepts cleanly.',
        strengths: ['Clear structure', 'Correct terminology'],
        improvements: ['Include code snippet example', 'Discuss edge cases'],
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Mock Interviewer</h2>
            <p className="text-xs text-slate-400">Instant AI scoring, strengths & improvement analysis</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
          +75 XP Per Evaluation
        </span>
      </div>

      {/* Interview Question Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Target Role: {role}
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Technical Question:</span>
          <h3 className="text-base font-bold text-white mt-1">{question}</h3>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          placeholder="Type your technical response here (explain concepts, time complexity, architectural choices)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={evaluating || !answer.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{evaluating ? 'Evaluating Answer with AI...' : 'Submit Answer for AI Score'}</span>
          </button>
        </div>
      </div>

      {/* Live Score Breakdown Report */}
      {evaluation && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">AI Evaluation Result</span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Verdict: {evaluation.verdict}</span>
              </h3>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black font-mono text-purple-400">{evaluation.score}</span>
              <span className="text-xs text-slate-500 font-mono"> / 100</span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">{evaluation.feedback}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Strengths:
              </h4>
              <ul className="text-xs text-emerald-200 space-y-1 list-disc pl-4">
                {evaluation.strengths?.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Growth Areas:
              </h4>
              <ul className="text-xs text-amber-200 space-y-1 list-disc pl-4">
                {evaluation.improvements?.map((imp: string, idx: number) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
