export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  progress: number; // 0 to 100
  taskCount: number;
  completedTaskCount: number;
  tags?: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  concept?: string;
  explanation?: string;
  codeExample?: string;
  dueDate?: string;
  createdAt: string;
}

export interface BackendTask {
  id: string;
  sectionId: string;
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

export interface TaskSection {
  id: string;
  name: string;
  orderIndex: number;
  tasks: BackendTask[];
}

export interface ProjectTasksResponse {
  project: {
    id: string;
    title: string;
    description?: string;
  };
  currentTaskId: string | null;
  sections: TaskSection[];
}

