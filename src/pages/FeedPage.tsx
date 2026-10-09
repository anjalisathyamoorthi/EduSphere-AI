import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image, Heart, MessageSquare, Share2, Plus, Sparkles } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { user, triggerXPToast, updateUserXP } = useApp();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author_name: 'Priya Verma',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma',
      content: 'When your C++ code compiles on the first attempt without segfaults: unexpected happiness! 🥳',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
      category: 'meme',
      likes_count: 18,
      comments_count: 4,
      is_liked: false,
    },
    {
      id: 2,
      author_name: 'Alex Sharma',
      author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma',
      content: 'Just built a 4-second timeout code sandbox in FastAPI + Python subprocess. Works seamlessly for JS & Py!',
      category: 'tech',
      likes_count: 24,
      comments_count: 6,
      is_liked: true,
    },
  ]);

  const [newContent, setNewContent] = useState('');

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newLiked = !p.is_liked;
          return {
            ...p,
            is_liked: newLiked,
            likes_count: newLiked ? p.likes_count + 1 : p.likes_count - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    const post = {
      id: Date.now(),
      author_name: user.full_name,
      author_avatar: user.avatar_url,
      content: newContent,
      category: 'tech',
      likes_count: 1,
      comments_count: 0,
      is_liked: true,
    };
    setPosts([post, ...posts]);
    setNewContent('');
    updateUserXP(20);
    triggerXPToast(20, 'Feed Post Published!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">B.Tech Meme & Tech Feed</h2>
            <p className="text-xs text-slate-400">Engineering humour, code flexes & study wins</p>
          </div>
        </div>
      </div>

      {/* New Post Creator Box */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={3}
          placeholder="Share a B.Tech meme or technical win with the community..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={!newContent.trim()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post to Feed (+20 XP)</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full bg-slate-900" />
              <div>
                <h4 className="text-xs font-bold text-white">{post.author_name}</h4>
                <span className="text-[10px] text-slate-400 font-mono uppercase">{post.category}</span>
              </div>
            </div>

            {/* Content */}
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.content}</p>

            {post.image_url && (
              <img src={post.image_url} alt="Meme" className="w-full h-64 object-cover rounded-2xl border border-slate-800" />
            )}

            {/* Like & Comment Bar */}
            <div className="flex items-center space-x-6 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1.5 font-bold transition-all ${
                  post.is_liked ? 'text-rose-500' : 'hover:text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count}</span>
              </button>

              <div className="flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments_count} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
