import React, { useState } from 'react';
import { Briefcase, ExternalLink, MapPin, DollarSign, Calendar, Tag } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');

  const OPPORTUNITIES = [
    {
      id: 1,
      title: 'Frontend Engineering Intern (React/TS)',
      company: 'Google Cloud India',
      location: 'Bangalore / Hybrid',
      type: 'Internship',
      stipend_salary: '₹85,000 / month',
      description: 'Work with the core Cloud Console team to build modern React 19 micro-frontends.',
      apply_url: 'https://careers.google.com',
      tags: ['React', 'TypeScript', 'Tailwind', 'Vite'],
      deadline: '2026-11-15',
    },
    {
      id: 2,
      title: 'National AI & Web3 Hackathon 2026',
      company: 'Devfolio & EduSphere',
      location: 'Online',
      type: 'Hackathon',
      stipend_salary: '₹5,000,000 Prize Pool',
      description: 'Build next-gen AI applications using Gemini Flash models and modern web frameworks.',
      apply_url: 'https://devfolio.co',
      tags: ['AI', 'Gemini', 'FastAPI', 'React'],
      deadline: '2026-10-30',
    },
    {
      id: 3,
      title: 'Backend Software Engineer (SDE-1)',
      company: 'Atlassian',
      location: 'Remote',
      type: 'Full-time',
      stipend_salary: '₹28,000,000 / year',
      description: 'Build high throughput REST & GraphQL APIs using Java and Python.',
      apply_url: 'https://atlassian.com/careers',
      tags: ['Python', 'System Design', 'Microservices'],
      deadline: '2026-12-01',
    },
  ];

  const filtered = filterType === 'All' ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.type === filterType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">B.Tech Opportunities Portal</h2>
            <p className="text-xs text-slate-400">Internships, National Hackathons & SDE-1 Jobs</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {['All', 'Internship', 'Hackathon', 'Full-time'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === t ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div key={opp.id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {opp.type}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{opp.stipend_salary}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{opp.title}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{opp.company}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{opp.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {opp.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Deadline: {opp.deadline}
              </span>

              <a
                href={opp.apply_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
              >
                <span>Apply Direct</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
