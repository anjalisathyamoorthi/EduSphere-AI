import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Map, Lock, CheckCircle2, Play, Star, Sparkles, Code, Layout, Server } from 'lucide-react';

export const LevelMapPage: React.FC = () => {
  const { setActiveTab, setActiveTopicId } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<string>('dsa-mastery');

  const TRACK_NODES = [
    {
      id: 1,
      title: 'The Two-Pointer Quest: Reversing Arrays',
      type: 'Story Lesson',
      xp: 75,
      completed: true,
      unlocked: true,
      description: 'Master in-place O(1) memory pointer manipulation.',
    },
    {
      id: 2,
      title: 'Sliding Window Mastery: Max Subarray Sum',
      type: 'Story Lesson',
      xp: 80,
      completed: true,
      unlocked: true,
      description: 'Reduce nested O(N*K) loops into linear O(N) sliding windows.',
    },
    {
      id: 3,
      title: 'Binary Tree Traversal (BFS & DFS)',
      type: 'Interactive Coding',
      xp: 120,
      completed: false,
      unlocked: true,
      description: 'Navigate level-order queues and depth-first stacks.',
    },
    {
      id: 4,
      title: 'Dynamic Programming: Fibonacci Memoization',
      type: 'Boss Challenge Node',
      xp: 200,
      completed: false,
      unlocked: false,
      description: 'Convert exponential recursion O(2^N) to O(N) linear tabulation.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gamified Level Map</h2>
            <p className="text-xs text-slate-400">Interactive curriculum node tree for B.Tech engineering</p>
          </div>
        </div>

        {/* Track Switcher Pills */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedTrack('dsa-mastery')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 ${
              selectedTrack === 'dsa-mastery'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>DSA Mastery</span>
          </button>
          <button
            onClick={() => setSelectedTrack('fullstack-web')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 ${
              selectedTrack === 'fullstack-web'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Full-Stack Web</span>
          </button>
        </div>
      </div>

      {/* Gamified Node Path */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative">
        <div className="max-w-xl mx-auto space-y-8 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-8 bottom-8 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-800 z-0" />

          {TRACK_NODES.map((node, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={node.id}
                className={`relative z-10 flex items-center ${
                  isLeft ? 'justify-start md:pr-32' : 'justify-end md:pl-32'
                }`}
              >
                <div
                  className={`w-full max-w-sm p-5 rounded-2xl border transition-all ${
                    node.unlocked
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-indigo-500 shadow-xl hover:shadow-indigo-500/10 cursor-pointer'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  }`}
                  onClick={() => {
                    if (node.unlocked) {
                      setActiveTopicId(node.id);
                      setActiveTab('story-learning');
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                      Node #{node.id} • {node.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      +{node.xp} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    {node.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : node.unlocked ? (
                      <Play className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>{node.title}</span>
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{node.description}</p>

                  {node.unlocked && (
                    <button className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-all flex items-center justify-center space-x-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{node.completed ? 'Review Story Node' : 'Start Lesson Node'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
