import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { GraduationCap, Clock, CheckCircle2, Award, ArrowRight } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const EXAM = {
    id: 1,
    title: 'GATE CS & Placement Core Benchmark',
    subject: 'Computer Science',
    duration_mins: 20,
    total_questions: 4,
    total_marks: 40,
    passing_marks: 25,
    questions: [
      {
        id: 1,
        topic: 'DSA',
        question_text: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
        option_a: 'O(1)',
        option_b: 'O(log N)',
        option_c: 'O(N)',
        option_d: 'O(N log N)',
        correct: 'B',
        marks: 10,
      },
      {
        id: 2,
        topic: 'DBMS',
        question_text: 'Which normal form eliminates partial key dependencies?',
        option_a: '1NF',
        option_b: '2NF',
        option_c: '3NF',
        option_d: 'BCNF',
        correct: 'B',
        marks: 10,
      },
      {
        id: 3,
        topic: 'OS',
        question_text: 'Which CPU scheduling algorithm can cause starvation for longer processes?',
        option_a: 'Round Robin',
        option_b: 'First-Come First-Served',
        option_c: 'Shortest Job First (SJF)',
        option_d: 'Priority Scheduling without Aging',
        correct: 'C',
        marks: 10,
      },
      {
        id: 4,
        topic: 'Networks',
        question_text: 'On which layer of the OSI model does the HTTP protocol operate?',
        option_a: 'Transport Layer',
        option_b: 'Network Layer',
        option_c: 'Application Layer',
        option_d: 'Data Link Layer',
        correct: 'C',
        marks: 10,
      },
    ],
  };

  useEffect(() => {
    let timer: any = null;
    if (examStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, submitted, timeLeft]);

  const handleSubmitExam = async () => {
    setSubmitted(true);
    let score = 0;
    EXAM.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        score += q.marks;
      }
    });

    const passed = score >= EXAM.passing_marks;
    const resObj = {
      score,
      total_marks: EXAM.total_marks,
      passed,
      percentage: (score / EXAM.total_marks) * 100,
    };

    setResult(resObj);
    const xp = score * 2;
    updateUserXP(xp);
    triggerXPToast(xp, 'Practice Exam Submitted!');

    try {
      await apiService.submitExam(EXAM.id, JSON.stringify(userAnswers), 20 * 60 - timeLeft);
    } catch (err) {
      console.warn('Backend sync failed, saved locally');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{EXAM.title}</h2>
            <p className="text-xs text-slate-400">4 Questions • 40 Marks • Passing: 25 Marks</p>
          </div>
        </div>

        {examStarted && !submitted && (
          <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-xl text-indigo-300 text-xs font-mono font-bold shrink-0">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {!examStarted ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
          <h3 className="text-xl font-bold text-white">GATE & Placement Benchmark Mock Test</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Test your fundamental knowledge across Data Structures, DBMS, Operating Systems, and Computer Networks under timed exam constraints.
          </p>

          <button
            onClick={() => setExamStarted(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
          >
            Start Timed Benchmark Exam
          </button>
        </div>
      ) : !submitted ? (
        <div className="space-y-6">
          {EXAM.questions.map((q, idx) => (
            <div key={q.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                  Question #{idx + 1} • {q.topic} ({q.marks} Marks)
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{q.question_text}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt.key })}
                    className={`p-3 text-xs rounded-xl border text-left font-medium transition-all ${
                      userAnswers[q.id] === opt.key
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold mr-2 text-indigo-400">{opt.key}.</span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitExam}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all"
            >
              Submit Exam & Compute Results
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Exam Results</span>
            <h3 className="text-3xl font-black font-mono text-white mt-1">{result?.score} / 40 Marks</h3>
            <p className="text-xs text-slate-400 mt-1">Percentage: {result?.percentage}% • Status: {result?.passed ? 'PASSED 🎉' : 'RETRY'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
