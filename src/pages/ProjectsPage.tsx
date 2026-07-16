import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('craftd_projects');
    if (saved) {
      return JSON.parse(saved) as Project[];
    }
    const defaultProjects: Project[] = [
      {
        id: 'proj_1',
        name: 'FastAPI Integration Node',
        description: 'High-speed project and task telemetry processing module.',
        status: 'active',
        progress: 75,
        taskCount: 8,
        completedTaskCount: 6,
        tags: ['Python', 'FastAPI', 'Redis'],
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      },
      {
        id: 'proj_2',
        name: 'NestJS Identity Gateway',
        description: 'Secure passport cookie state management identity hub.',
        status: 'active',
        progress: 90,
        taskCount: 12,
        completedTaskCount: 11,
        tags: ['TypeScript', 'NestJS', 'PostgreSQL'],
        createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      },
      {
        id: 'proj_3',
        name: 'React 19 Dashboard UI',
        description: 'Responsive customer portal running Vite, React 19, and Tailwind v4.',
        status: 'completed',
        progress: 100,
        taskCount: 15,
        completedTaskCount: 15,
        tags: ['React 19', 'Vite', 'Tailwind v4'],
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
    ];
    localStorage.setItem('craftd_projects', JSON.stringify(defaultProjects));
    return defaultProjects;
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal input states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newProject: Project = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name,
      description,
      status: 'active',
      progress: 0,
      taskCount: 0,
      completedTaskCount: 0,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem('craftd_projects', JSON.stringify(updated));

    // Reset fields
    setName('');
    setDescription('');
    setTags('');
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects Dashboard</h1>
          <p className="text-slate-500 text-xs">Manage workspace containers and track completion telemetry.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter === type
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/10'
                  : 'text-slate-400 hover:text-white border border-transparent hover:bg-slate-900/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/dashboard/tasks?projectId=${p.id}`)}
            className="bg-slate-900/30 border border-slate-900 hover:border-emerald-500/40 hover:bg-slate-900/50 cursor-pointer rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group/card shadow-lg hover:shadow-emerald-500/5"
          >
            <div>
              {/* Card Title Header */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
                    p.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {p.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{p.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                {p.description || 'No description provided.'}
              </p>
            </div>

            <div>
              {/* Progress Indicator */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Telemetry Progress</span>
                  <span className="text-emerald-400">{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Bottom Tags & Metrics */}
              <div className="border-t border-slate-900 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono text-[9px]"
                      >
                        {tag}
                      </span>
                    ))}
                    {p.tags && p.tags.length > 2 && (
                      <span className="text-[9px] text-slate-600 font-mono font-bold">
                        +{p.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H2" />
                    </svg>
                    {p.completedTaskCount}/{p.taskCount} Tasks
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-500 group-hover/card:text-emerald-400 transition-colors flex items-center gap-1 mt-1">
                  <span>View Associated Tasks</span>
                  <svg className="w-3.5 h-3.5 transform group-hover/card:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-900 rounded-2xl">
            <svg className="w-8 h-8 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-slate-400 text-xs font-semibold">No projects match criteria.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-base font-bold text-white mb-1">Create Project Container</h3>
            <p className="text-slate-500 text-xs mb-6">Initialize a mock FastAPI container for telemetry metrics.</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLI Sync Library"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Summarize project context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React 19, TypeScript, AWS"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
