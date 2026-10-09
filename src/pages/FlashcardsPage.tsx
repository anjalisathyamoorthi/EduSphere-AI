import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { BookOpenCheck, RotateCw, CheckCircle2, AlertTriangle, Sparkles, Brain } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARDS = [
    {
      id: 1,
      topic: 'Data Structures',
      question: 'What is the average and worst-case time complexity of QuickSort?',
      answer: 'Average: O(N log N)\nWorst Case: O(N^2)',
      explanation: 'Worst case occurs when pivot selection consistently picks extreme min/max elements in an already sorted array.',
      box_level: 1,
    },
    {
      id: 2,
      topic: 'System Design',
      question: 'What is the CAP Theorem in distributed databases?',
      answer: 'A distributed system can deliver at most 2 out of 3 guarantees: Consistency, Availability, Partition Tolerance.',
      explanation: 'In the presence of a network partition (P), you must trade off between consistency (C) or availability (A).',
      box_level: 2,
    },
    {
      id: 3,
      topic: 'Web Engineering',
      question: 'What is the difference between SQL and NoSQL databases?',
      answer: 'SQL = Relational, rigid schema, ACID compliant.\nNoSQL = Non-relational, flexible schema, horizontally scalable.',
      explanation: 'Use SQL for transactional financial data; use NoSQL for high-throughput unstructured telemetry.',
      box_level: 3,
    },
  ];

  const currentCard = CARDS[currentIndex];

  const handleRateCard = async (rating: 'easy' | 'good' | 'hard') => {
    updateUserXP(15);
    triggerXPToast(15, `Flashcard Reviewed (${rating.toUpperCase()})`);

    try {
      await apiService.reviewFlashcard(currentCard.id, rating);
    } catch (err) {
      console.warn('Backend sync failed, saved locally');
    }

    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Leitner Spaced Repetition</h2>
            <p className="text-xs text-slate-400">Card {currentIndex + 1} of {CARDS.length} • Memory Box Lvl {currentCard.box_level}</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
          +15 XP Per Review
        </span>
      </div>

      {/* 3D Flip Flashcard */}
      <div className="perspective-1000 min-h-[320px]">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`w-full min-h-[320px] rounded-3xl glass-panel border border-slate-800 p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 transform hover:border-purple-500/50 shadow-2xl ${
            flipped ? 'bg-slate-900/95 border-purple-500/40' : 'bg-slate-950/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              {currentCard.topic}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              Click to Flip
            </span>
          </div>

          <div className="my-6 text-center">
            {!flipped ? (
              <div className="space-y-3">
                <span className="text-xs text-slate-400 uppercase font-mono font-semibold">Question</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">{currentCard.question}</h3>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs text-emerald-400 uppercase font-mono font-semibold">Answer</span>
                <p className="text-lg font-bold text-emerald-200 whitespace-pre-line">{currentCard.answer}</p>
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 text-left">
                  <span className="font-bold text-purple-300 block mb-1">Explanation & Context:</span>
                  {currentCard.explanation}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500">
            {!flipped ? 'Tap card to reveal answer' : 'Rate your memory confidence below'}
          </div>
        </div>
      </div>

      {/* Leitner Rating Controls */}
      {flipped && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <button
            onClick={() => handleRateCard('hard')}
            className="p-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-300 font-bold text-xs transition-all flex flex-col items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Hard (Box 1)</span>
          </button>

          <button
            onClick={() => handleRateCard('good')}
            className="p-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-300 font-bold text-xs transition-all flex flex-col items-center gap-1"
          >
            <Brain className="w-4 h-4" />
            <span>Good (+1 Box)</span>
          </button>

          <button
            onClick={() => handleRateCard('easy')}
            className="p-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 font-bold text-xs transition-all flex flex-col items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Easy (+2 Box)</span>
          </button>
        </div>
      )}
    </div>
  );
};
