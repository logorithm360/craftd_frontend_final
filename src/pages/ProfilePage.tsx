import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import type { Project, Task } from '../types';

export function ProfilePage() {
  const { user } = useAuth();
  const [stats] = useState(() => {
    // Load local storage counters
    const savedProjects = JSON.parse(localStorage.getItem('craftd_projects') || '[]') as Project[];
    const savedTasks = JSON.parse(localStorage.getItem('craftd_tasks') || '[]') as Task[];

    const compTasks = savedTasks.filter((t) => t.status === 'completed').length;
    const productivity = savedTasks.length > 0 ? Math.round((compTasks / savedTasks.length) * 100) : 0;

    return {
      projectsCount: savedProjects.length,
      tasksCount: savedTasks.length,
      completedTasksCount: compTasks,
      productivityScore: productivity,
    };
  });

  const logs = [
    { event: 'Authorized CLI integration', ip: '127.0.0.1', device: 'VS Code Extension - Mac OS', date: 'Just now' },
    { event: 'Authenticated session creation', ip: '192.168.1.45', device: 'Chrome Browser', date: '2 hours ago' },
    { event: 'Initialized Project Container', ip: '127.0.0.1', device: 'FastAPI Service Engine', date: '1 day ago' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">User Profile Hub</h1>
        <p className="text-slate-500 text-xs">Examine telemetry stats, account history logs, and profile records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card Left */}
        <div className="lg:col-span-1 bg-slate-900/15 border border-slate-900 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt="Profile avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-800"
          />
          <div>
            <h2 className="text-base font-bold text-white">{user?.name || 'Developer'}</h2>
            <p className="text-slate-500 text-xs mt-1">{user?.email}</p>
          </div>

          <div className="w-full border-t border-slate-900/60 pt-4 flex justify-around text-center">
            <div>
              <p className="text-xs text-slate-500">Developer ID</p>
              <p className="font-mono text-[10px] text-emerald-400 font-semibold uppercase mt-0.5">{user?.id || 'sandbox_dev'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Tier Level</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase mt-0.5">Pro Developer</p>
            </div>
          </div>
        </div>

        {/* Profile Statistics Center/Right */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 text-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Containers</span>
              <span className="text-2xl font-extrabold text-white font-mono">{stats.projectsCount}</span>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 text-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Tickets</span>
              <span className="text-2xl font-extrabold text-white font-mono">{stats.tasksCount}</span>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 text-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Completed</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">{stats.completedTasksCount}</span>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 text-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Score %</span>
              <span className="text-2xl font-extrabold text-blue-400 font-mono">{stats.productivityScore}%</span>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Activity & Audit Logs</h3>
            <div className="border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900/60 bg-slate-950/20 text-xs">
              {logs.map((log, index) => (
                <div key={index} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{log.event}</p>
                    <p className="text-[10px] text-slate-500">{log.device} • IP: {log.ip}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 sm:text-right font-mono">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
