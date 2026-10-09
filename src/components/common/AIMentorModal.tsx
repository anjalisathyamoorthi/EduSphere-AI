import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { Bot, X, Send, Sparkles, Code2, BookOpen, BrainCircuit } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AIMentorModal: React.FC = () => {
  const { showAIMentorModal, setShowAIMentorModal, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello ${user.full_name.split(' ')[0]}! 🤖 I am your **EduSphere AI Mentor** (${user.profile?.branch || 'CSE'}). Ask me anything about Data Structures, Web Dev, System Design, or Placement strategies!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAIMentorModal) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiService.chatWithAIMentor(query, user.profile?.branch);
      const aiMsg: ChatMessage = { sender: 'ai', text: res.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '🤖 **EduSphere AI Mentor**\n\nGreat question! Focus on breaking down the problem into smaller sub-problems and analyzing Time & Space complexity.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    'Explain Two-Pointer vs Sliding Window',
    'How to prepare for SDE-1 coding rounds?',
    'Explain CAP Theorem in System Design',
    'What are key React 19 features?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl shadow-indigo-500/10 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                EduSphere AI Mentor
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">24/7 B.Tech Engineering Tutor</p>
            </div>
          </div>
          <button
            onClick={() => setShowAIMentorModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0" />
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-xs whitespace-nowrap bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700/60 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-wrap font-sans'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-slate-700/60 text-indigo-300 rounded-2xl px-4 py-3 text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                <span>EduSphere AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Mentor about DSA, Web Dev, GATE, or Placements..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
