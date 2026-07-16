import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Task, Project } from '../types';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[9px] text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors cursor-pointer"
      title="Copy Code"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export function TasksPage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProj = localStorage.getItem('craftd_projects');
    if (savedProj) {
      return JSON.parse(savedProj) as Project[];
    }
    return [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('craftd_tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks) as Task[];
    }
    const defaultTasks: Task[] = [
      {
        id: 'task_1',
        projectId: 'proj_1',
        title: 'Implement FastAPI telemetry endpoints',
        description: 'Establish secure routers to parse task metadata and calculate completion.',
        status: 'in_progress',
        priority: 'high',
        concept: 'FastAPI Routing & Telemetry',
        explanation: 'Using FastAPI\'s APIRouter to define endpoints for collecting telemetry metrics and using Pydantic schemas for request validation.',
        codeExample: 'from fastapi import APIRouter, Depends\nfrom pydantic import BaseModel\n\nrouter = APIRouter()\n\nclass TelemetryData(BaseModel):\n    project_id: str\n    metric: float\n\n@router.post("/telemetry")\ndef record_telemetry(data: TelemetryData):\n    return {"status": "success", "received": data.project_id}',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_2',
        projectId: 'proj_1',
        title: 'Verify Redis message exchange',
        description: 'Establish pub/sub test harness validating command payloads from extension.',
        status: 'todo',
        priority: 'medium',
        concept: 'Redis Pub/Sub Message Brokers',
        explanation: 'Setting up a Redis client subscription loop to listen to message channels and process incoming JSON payloads asynchronously.',
        codeExample: 'import redis\nimport json\n\nr = redis.Redis(host=\'localhost\', port=6379, db=0)\npubsub = r.pubsub()\npubsub.subscribe(\'telemetry-channel\')\n\nfor message in pubsub.listen():\n    if message[\'type\'] == \'message\':\n        data = json.loads(message[\'data\'])\n        print(f"Received payload: {data}")',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_3',
        projectId: 'proj_2',
        title: 'Configure NestJS guards',
        description: 'Validate authorization and silent session refresh sequences via httpOnly nodes.',
        status: 'completed',
        priority: 'high',
        concept: 'NestJS Guards & httpOnly Cookies',
        explanation: 'Implementing custom AuthGuard in NestJS to read securely transmitted httpOnly passport cookies and authenticate requests.',
        codeExample: '@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean {\n    const request = context.switchToHttp().getRequest();\n    const token = request.cookies[\'passport_jwt\'];\n    return !!token && this.validateToken(token);\n  }\n}',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_4',
        projectId: 'proj_2',
        title: 'Register mock security log events',
        description: 'Generate list items detailing location and machine identification telemetry.',
        status: 'todo',
        priority: 'low',
        concept: 'Security Audit Telemetry Logging',
        explanation: 'Generating structured audit logs capturing client metadata (IP addresses, user agents, machine fingerprints) to detect malicious activities.',
        codeExample: 'import { Logger } from \'@nestjs/common\';\n\nconst logger = new Logger(\'SecurityAudit\');\n\nfunction logSecurityEvent(userId: string, action: string, ip: string) {\n  logger.log(JSON.stringify({\n    timestamp: new Date().toISOString(),\n    userId,\n    action,\n    ip,\n    status: \'AUDIT_LOGGED\'\n  }));\n}',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_5',
        projectId: 'proj_3',
        title: 'Upgrade to React 19 and useActionState',
        description: 'Refactor form components to leverage new React 19 hooks and reduce boilerplate.',
        status: 'completed',
        priority: 'medium',
        concept: 'React 19 useActionState Hook',
        explanation: 'React 19 introduces useActionState to automatically handle form submission pending state and result payloads without manual state triggers.',
        codeExample: 'import { useActionState } from \'react\';\n\nasync function updateProfile(prevState: any, formData: FormData) {\n  const name = formData.get("name");\n  return { success: true, name };\n}\n\nfunction ProfileForm() {\n  const [state, formAction, isPending] = useActionState(updateProfile, null);\n  return (\n    <form action={formAction}>\n      <input name="name" />\n      <button disabled={isPending}>Save</button>\n    </form>\n  );\n}',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_6',
        projectId: 'proj_3',
        title: 'Configure Tailwind v4 Theme Variables',
        description: 'Set up custom spacing, container rules, and CSS-first configuration properties.',
        status: 'completed',
        priority: 'low',
        concept: 'Tailwind CSS v4 CSS-first Configuration',
        explanation: 'In Tailwind v4, theme customization is done directly inside your main CSS file using @theme directive instead of a tailwind.config.js file.',
        codeExample: '@theme {\n  --color-brand-primary: #10b981;\n  --font-mono: \'Fira Code\', monospace;\n}',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem('craftd_tasks', JSON.stringify(defaultTasks));
    return defaultTasks;
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProjectId = searchParams.get('projectId') || 'all';

  const setSelectedProjectId = (val: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val === 'all') {
      nextParams.delete('projectId');
    } else {
      nextParams.set('projectId', val);
    }
    setSearchParams(nextParams);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(() => {
    if (projects.length > 0) {
      return projects[0].id;
    }
    return '';
  });
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [codeExample, setCodeExample] = useState('');

  const handleOpenModal = () => {
    if (selectedProjectId !== 'all') {
      setProjectId(selectedProjectId);
    } else if (projects.length > 0) {
      setProjectId(projects[0].id);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTitle('');
    setDescription('');
    setConcept('');
    setExplanation('');
    setCodeExample('');
    setIsModalOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;

    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      projectId,
      title,
      description,
      status: 'todo',
      priority,
      concept: concept.trim() || 'General Concept',
      explanation: explanation.trim() || undefined,
      codeExample: codeExample.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('craftd_tasks', JSON.stringify(updated));

    // Update corresponding project task statistics
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const count = p.taskCount + 1;
        const progress = Math.round((p.completedTaskCount / count) * 100);
        return { ...p, taskCount: count, progress };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('craftd_projects', JSON.stringify(updatedProjects));

    // Clear and exit
    handleCloseModal();
  };

  const handleToggleStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        // Handle Project updates
        const oldStatus = t.status;
        if (oldStatus !== newStatus) {
          const updatedProj = projects.map((p) => {
            if (p.id === t.projectId) {
              let completedCount = p.completedTaskCount;
              if (oldStatus === 'completed') completedCount--;
              if (newStatus === 'completed') completedCount++;
              const progress = p.taskCount > 0 ? Math.round((completedCount / p.taskCount) * 100) : 0;
              return { ...p, completedTaskCount: completedCount, progress };
            }
            return p;
          });
          setProjects(updatedProj);
          localStorage.setItem('craftd_projects', JSON.stringify(updatedProj));
        }
        return { ...t, status: newStatus };
      }
      return t;
    });

    setTasks(updatedTasks);
    localStorage.setItem('craftd_tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('craftd_tasks', JSON.stringify(updatedTasks));

    // Decrement from Project
    const updatedProj = projects.map((p) => {
      if (p.id === targetTask.projectId) {
        const completedCount = targetTask.status === 'completed' ? p.completedTaskCount - 1 : p.completedTaskCount;
        const count = Math.max(0, p.taskCount - 1);
        const progress = count > 0 ? Math.round((completedCount / count) * 100) : 0;
        return { ...p, completedTaskCount: completedCount, taskCount: count, progress };
      }
      return p;
    });
    setProjects(updatedProj);
    localStorage.setItem('craftd_projects', JSON.stringify(updatedProj));
  };

  const filteredTasks = selectedProjectId === 'all'
    ? tasks
    : tasks.filter((t) => t.projectId === selectedProjectId);

  // Group columns
  const columns = [
    { id: 'todo' as const, label: 'To Do', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
    { id: 'in_progress' as const, label: 'In Progress', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' },
    { id: 'completed' as const, label: 'Completed', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks Workspace</h1>
          <p className="text-slate-500 text-xs">Organize active backlogs and schedule workspace tasks.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Project Selector filter */}
      <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
        <label htmlFor="project-filter" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Filter by Container:
        </label>
        <select
          id="project-filter"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col bg-slate-900/10 border border-slate-900 rounded-2xl p-5 min-h-[500px]">
              <div className={`flex justify-between items-center px-3.5 py-1.5 border rounded-lg mb-6 ${col.color}`}>
                <span className="text-xs font-bold tracking-wider uppercase">{col.label}</span>
                <span className="text-xs font-mono font-bold bg-slate-950/40 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {colTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="bg-slate-900/30 border border-slate-900 hover:border-slate-800 p-5 rounded-xl transition-all space-y-3 relative group"
                    >
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Task"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 max-w-[120px] truncate">
                          {proj ? proj.name : 'Unknown Project'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            task.priority === 'high'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/10'
                              : task.priority === 'medium'
                              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/10'
                              : 'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                      {task.description && (
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                          {task.description}
                        </p>
                      )}

                      {/* Educational Concept Section */}
                      <div className="mt-4 pt-3 border-t border-slate-900/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>Concept: {task.concept || 'General Concept'}</span>
                        </div>

                        {task.status === 'completed' ? (
                          <div className="space-y-2.5 bg-slate-950/40 border border-slate-900/60 rounded-lg p-3 mt-2">
                            {task.explanation && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Explanation</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  {task.explanation}
                                </p>
                              </div>
                            )}
                            {task.codeExample && (
                              <div className="space-y-1 relative">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Code Example</span>
                                <div className="relative">
                                  <pre className="bg-slate-950 p-2.5 rounded-md border border-slate-900 text-[10px] text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 pr-12">
                                    <code>{task.codeExample}</code>
                                  </pre>
                                  <CopyButton text={task.codeExample} />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 italic flex items-center gap-1.5 pl-1 py-1">
                            <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Explanation & code unlocked on completion</span>
                          </div>
                        )}
                      </div>

                      {/* Moving Buttons Controls */}
                      <div className="border-t border-slate-900/60 pt-3 flex gap-1.5">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() =>
                              handleToggleStatus(task.id, col.id === 'completed' ? 'in_progress' : 'todo')
                            }
                            className="flex-1 py-1 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold transition-all cursor-pointer text-center"
                          >
                            ← Back
                          </button>
                        )}
                        {col.id !== 'completed' && (
                          <button
                            onClick={() =>
                              handleToggleStatus(task.id, col.id === 'todo' ? 'in_progress' : 'completed')
                            }
                            className="flex-1 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold transition-all cursor-pointer text-center"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-12 text-center border border-dashed border-slate-900 rounded-2xl">
                    <p className="text-slate-600 text-xs">No active tickets.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-base font-bold text-white mb-1">Add Task Ticket</h3>
            <p className="text-slate-500 text-xs mb-6">Create a backlog ticket tied to an active project container.</p>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label htmlFor="projectId" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Project Container
                </label>
                <select
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  required
                >
                  <option value="" disabled>-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Implement OIDC login loops"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Task Description
                </label>
                <textarea
                  id="description"
                  placeholder="Outline backlog guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label htmlFor="concept" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Concept to be Learned
                </label>
                <input
                  id="concept"
                  type="text"
                  placeholder="e.g. JWT Auth, WebSockets"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="explanation" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Concept Explanation (Unlocked on Completion)
                </label>
                <textarea
                  id="explanation"
                  placeholder="Detailed explanation of the concept..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label htmlFor="codeExample" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Code Example (Unlocked on Completion)
                </label>
                <textarea
                  id="codeExample"
                  placeholder="Provide a reference code snippet..."
                  value={codeExample}
                  onChange={(e) => setCodeExample(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono resize-none"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Task Priority Level
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3 font-semibold">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Publish Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
