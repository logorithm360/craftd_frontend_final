import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProjectTasks } from '../lib/api';

interface TaskItem {
  id: string; concept: string; instructions: string;
  explanation: string | null; codeExample: string | null;
  status: string; difficulty: number; orderIndex: number;
  isLocked: boolean; canWork: boolean; sectionName: string;
}

export function TasksPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');

  const [projectName, setProjectName] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tab, setTab] = useState<'todo' | 'progress' | 'done'>('progress');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    setLoading(true);
    fetchProjectTasks(projectId).then((res) => {
      if (res.success && res.data) {
        const data = res.data as { project?: { title?: string }; sections?: Array<{ tasks: TaskItem[] }> };
        setProjectName(data.project?.title || '');
        const all: TaskItem[] = [];
        for (const s of data.sections || []) {
          for (const t of s.tasks || []) {
            all.push({ ...t, sectionName: s.name || '' });
          }
        }
        setTasks(all);
      }
      setLoading(false);
    });
  }, [projectId]);

  const todo = tasks.filter((t) => t.isLocked);
  const progress = tasks.filter((t) => t.canWork);
  const done = tasks.filter((t) => t.status === 'passed');

  const activeTab = progress.length > 0 ? tab === 'todo' && todo.length === 0 ? 'progress' : tab : tab;
  const currentList = activeTab === 'todo' ? todo : activeTab === 'progress' ? progress : done;

  if (!projectId) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-slate-400 text-sm">Select a project from the Projects page to view its tasks.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{projectName || 'Tasks'}</h1>
        <p className="text-xs text-slate-500">{tasks.length} tasks total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/40 border border-slate-900 p-1 rounded-xl w-fit">
        {[
          { key: 'todo' as const, label: 'To-do', count: todo.length },
          { key: 'progress' as const, label: 'In Progress', count: progress.length },
          { key: 'done' as const, label: 'Completed', count: done.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === t.key
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {t.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === t.key ? 'bg-slate-700 text-slate-300' : 'bg-slate-800/60 text-slate-500'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-20 bg-slate-900/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 text-xs">No tasks in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
              className={`bg-slate-900/30 border rounded-xl p-5 transition-all duration-200 cursor-pointer hover:border-slate-700 ${
                task.status === 'passed' ? 'border-emerald-500/10' : task.canWork ? 'border-blue-500/10' : 'border-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold mb-1 ${
                    task.status === 'passed' ? 'text-emerald-400' : task.canWork ? 'text-white' : 'text-slate-500'
                  }`}>
                    {task.concept}
                  </h3>
                  {task.instructions && (
                    <p className="text-xs text-slate-500 line-clamp-1">{task.instructions}</p>
                  )}
                  {task.explanation && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{task.explanation}</p>
                  )}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                  task.status === 'passed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : task.canWork
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {task.status === 'passed' ? 'Done' : task.canWork ? 'Current' : 'Locked'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-slate-600">{task.sectionName}</span>
                <span className="text-[10px] text-slate-700">•</span>
                <span className="text-[10px] text-slate-600">Difficulty: {task.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
