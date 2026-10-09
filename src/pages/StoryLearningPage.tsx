import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { BookOpen, CheckCircle2, HelpCircle, Code2, Sparkles, ArrowRight, Award } from 'lucide-react';

export const StoryLearningPage: React.FC = () => {
  const { activeTopicId, triggerXPToast, updateUserXP, setActiveTab } = useApp();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedMCQs, setSubmittedMCQs] = useState<Record<number, boolean>>({});
  const [completedTopic, setCompletedTopic] = useState(false);

  const TOPIC_DATA = {
    id: activeTopicId || 1,
    title: 'The Two-Pointer Quest: Reversing Arrays in O(1) Space',
    module_title: 'Module 1: Pointer Magic & Arrays',
    xp_reward: 75,
    story_content: `Imagine you are navigating an ancient archive in your computer's memory subsystem. You are tasked with reversing a sequence of crypted runic integers without allocating extra parchment (O(1) auxiliary memory space).

The secret lies in setting two pointers: one at the beginning (\`left\`) and one at the tail (\`right\`). In each iteration, swap the items and step both pointers inward until they cross.

This algorithm eliminates the need for allocating a secondary array, making it ideal for high-throughput memory-constrained applications!`,
    code_snippet: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Swap in-place
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr

# Test run:
sample = [10, 20, 30, 40, 50]
print("Reversed:", reverse_array(sample))
# Output: Reversed: [50, 40, 30, 20, 10]`,
    mcqs: [
      {
        id: 1,
        question: 'What is the time complexity of the Two-Pointer array reversal algorithm?',
        options: ['O(N^2) Quadratic', 'O(N) Linear Time', 'O(log N) Logarithmic', 'O(1) Constant'],
        correct: 1,
        explanation: 'We perform roughly N/2 swaps in linear time, resulting in O(N).',
      },
      {
        id: 2,
        question: 'What is the auxiliary space complexity of reversing in-place?',
        options: ['O(N)', 'O(N log N)', 'O(1) Constant Space', 'O(2^N)'],
        correct: 2,
        explanation: 'No secondary array is allocated, yielding O(1) auxiliary space.',
      },
    ],
  };

  const handleSelectOption = (mcqId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
    setSubmittedMCQs((prev) => ({ ...prev, [mcqId]: true }));
  };

  const handleCompleteTopic = async () => {
    if (completedTopic) return;
    setCompletedTopic(true);
    updateUserXP(TOPIC_DATA.xp_reward);
    triggerXPToast(TOPIC_DATA.xp_reward, 'Story Lesson Completed!');

    try {
      await apiService.completeTopic(TOPIC_DATA.id);
    } catch (err) {
      console.warn('Backend sync failed, saved locally');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            {TOPIC_DATA.module_title}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">{TOPIC_DATA.title}</h2>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            +{TOPIC_DATA.xp_reward} XP Reward
          </span>
        </div>
      </div>

      {/* Story Content Narrative */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Story Narrative & Mechanics
        </h3>

        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
          {TOPIC_DATA.story_content}
        </div>

        {/* Code Snippet Box */}
        <div className="mt-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Code2 className="w-4 h-4 text-indigo-400" />
              two_pointer_reversal.py
            </span>
            <span>Python 3.13</span>
          </div>
          <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
            {TOPIC_DATA.code_snippet}
          </pre>
        </div>
      </div>

      {/* Embedded MCQs */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          Checkpoint Knowledge Check (MCQs)
        </h3>

        {TOPIC_DATA.mcqs.map((mcq, idx) => {
          const selected = selectedAnswers[mcq.id];
          const isSubmitted = submittedMCQs[mcq.id];
          const isCorrect = selected === mcq.correct;

          return (
            <div key={mcq.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">
                Q{idx + 1}: {mcq.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mcq.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800';
                  if (isSubmitted) {
                    if (optIdx === mcq.correct) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (selected === optIdx) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(mcq.id, optIdx)}
                      className={`p-3 text-xs rounded-xl border text-left transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  <p className="font-semibold mb-0.5">{isCorrect ? 'Correct! 🎉' : 'Review Explanation:'}</p>
                  <p className="text-slate-300">{mcq.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim XP & Complete Topic */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleCompleteTopic}
          disabled={completedTopic}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2"
        >
          <Award className="w-5 h-5 text-yellow-300" />
          <span>{completedTopic ? 'Lesson Completed (+75 XP Claimed)' : 'Complete Lesson & Claim +75 XP'}</span>
        </button>
      </div>
    </div>
  );
};
