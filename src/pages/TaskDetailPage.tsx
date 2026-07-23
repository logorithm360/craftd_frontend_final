import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchTaskDetail } from '../lib/api';

interface TaskDetail {
  id: string;
  sectionId: string;
  sectionName: string;
  projectId: string;
  projectTitle: string;
  instructions: string;
  concept: string;
  explanation: string | null;
  codeExample: string | null;
  difficulty: number;
  orderIndex: number;
  status: string;
  isLocked: boolean;
  canWork: boolean;
}

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    fetchTaskDetail(taskId).then((res) => {
      if (res.success && res.data) {
        setTask(res.data as unknown as TaskDetail);
      }
      setLoading(false);
    });
  }, [taskId]);

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-slate-800 rounded" />
          <div className="h-8 w-64 bg-slate-800 rounded" />
          <div className="h-32 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!task) {
    return <div className="p-8 max-w-3xl mx-auto text-slate-400">Task not found.</div>;
  }

  const hasContent = task.explanation || task.codeExample;
  const vscodeDeepLink = `vscode://craftd.craftd-extension/tutor?taskId=${task.id}&projectId=${task.projectId}`;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard/projects" className="hover:text-emerald-400 transition-colors">Projects</Link>
        <span>/</span>
        <Link to={`/dashboard/tasks?projectId=${task.projectId}`} className="hover:text-emerald-400 transition-colors">
          {task.projectTitle}
        </Link>
        <span>/</span>
        <span className="text-slate-400">{task.sectionName}</span>
        <span>/</span>
        <span className="text-white">{task.concept}</span>
      </nav>

      {/* Concept + status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{task.concept}</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
          task.status === 'passed'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : task.canWork
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-slate-800 text-slate-500 border-slate-700'
        }`}>
          {task.status === 'passed' ? 'Completed' : task.canWork ? 'In Progress' : 'Locked'}
        </span>
      </div>

      {/* Instructions */}
      <p className="text-slate-400 text-sm leading-relaxed">{task.instructions}</p>

      {/* Explanation Section */}
      {task.explanation ? (
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Explanation
          </h2>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {task.explanation}
          </div>
        </section>
      ) : null}

      {/* Code Example Section */}
      {task.codeExample ? (
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            Code Example
          </h2>
          <pre className="text-sm text-slate-200 bg-slate-950 rounded-lg p-4 overflow-x-auto font-mono">
            <code>{task.codeExample}</code>
          </pre>
        </section>
      ) : null}

      {/* Not yet taught */}
      {!hasContent && (
        <section className="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-6 text-center space-y-4">
          <p className="text-slate-400 text-sm">
            This task hasn't been started yet. Open it in the VS Code extension to begin learning about {task.concept}.
          </p>
          <a
            href={vscodeDeepLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Open in VS Code
          </a>
        </section>
      )}
    </div>
  );
}
