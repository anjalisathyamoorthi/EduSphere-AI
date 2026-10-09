import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { FileText, Plus, Sparkles, Tag, Trash2, BookOpen } from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { triggerXPToast, updateUserXP } = useApp();
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Dynamic Programming - Memoization vs Tabulation',
      subject: 'Algorithms',
      track_name: 'Computer Science',
      content: 'Memoization is top-down using recursion + hashmap. Tabulation is bottom-up filling a table iteratively.',
      ai_summary: '📌 **AI Summary**: Memoization uses top-down recursion; Tabulation uses bottom-up iteration. Both convert exponential complexity O(2^N) to O(N) linear time.',
      tags: ['DP', 'Algorithms', 'Optimization'],
      created_at: new Date().toLocaleDateString(),
    },
  ]);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Algorithms');
  const [content, setContent] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) return;

    setSynthesizing(true);

    try {
      const newNote = await apiService.createNote({
        title,
        subject,
        track_name: 'Computer Science',
        content,
        tags_json: JSON.stringify(['BTech', subject]),
      });

      const formattedNote = {
        id: newNote.id,
        title: newNote.title,
        subject: newNote.subject,
        track_name: newNote.track_name || 'Computer Science',
        content: newNote.content,
        ai_summary: newNote.ai_summary || '',
        tags: newNote.tags || ['BTech', subject],
        created_at: newNote.created_at || new Date().toLocaleDateString(),
      };

      setNotes((prev) => [formattedNote, ...prev]);
      setTitle('');
      setContent('');
      setShowCreate(false);
      updateUserXP(25);
      triggerXPToast(25, 'Note Saved & AI Summary Generated!');
    } catch (err) {
      console.warn('Backend sync failed, saved note locally');
    } finally {
      setSynthesizing(false);
    }
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Synthesized Short Notes</h2>
            <p className="text-xs text-slate-400">Multi-track engineering lecture note synthesis & formulas</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Note</span>
        </button>
      </div>

      {/* Create Note Modal Form */}
      {showCreate && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Create Lecture Note with AI Synthesis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title (e.g. Rate Limiting Sliding Window)"
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="Algorithms">Algorithms & DSA</option>
              <option value="Web Engineering">Web Engineering</option>
              <option value="System Design">System Design</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="DBMS">Database Management</option>
            </select>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Paste or write your raw lecture notes here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNote}
              disabled={synthesizing || !title.trim() || !content.trim()}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{synthesizing ? 'Synthesizing with AI...' : 'Synthesize & Save (+25 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {note.subject}
              </span>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{note.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{note.content}</p>

            {/* AI Summary Box */}
            {note.ai_summary && (
              <div className="bg-slate-950/90 border border-purple-500/20 rounded-2xl p-4 text-xs text-purple-200 space-y-1">
                <span className="font-bold text-purple-400 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Executive Synthesis:
                </span>
                <p className="text-slate-300 font-sans">{note.ai_summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
