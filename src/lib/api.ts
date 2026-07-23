import type { ApiResponse, ProjectTasksResponse } from '../types';

const NESTJS_URL = 'http://localhost:3001';
let accessToken: string | null = null;

export function getNestjsToken() { return accessToken; }

// Helper to determine if a path is public
function isPublicEndpoint(path: string): boolean {
  return path.startsWith('auth/login') || path.startsWith('auth/register');
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const path = endpoint.replace(/^\//, '');
  const url = `${NESTJS_URL}/${path}`;

  // Clone headers and prepare request
  const headers = new Headers(options.headers || {});

  if (accessToken && !isPublicEndpoint(path)) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  headers.set('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // sends httpOnly cookies for sessions
  };

  try {
    let response = await fetch(url, requestOptions);

    // Auto-refresh mechanism on 401 Unauthorized (unless trying to log in/register)
    if (response.status === 401 && !isPublicEndpoint(path)) {
      console.log('Access token expired, attempting silent session refresh...');
      const refreshSuccess = await attemptRefresh();

      if (refreshSuccess && accessToken) {
        // Retry the original request with the new access token
        headers.set('Authorization', `Bearer ${accessToken}`);
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      } else {
        // Refresh failed, clear token and let downstream handles handle it
        accessToken = null;
        return { success: false, error: 'Unauthorized: Session expired' };
      }
    }

    // Capture access token from response body if present in auth requests
    if (isPublicEndpoint(path) || path.startsWith('auth/refresh')) {
      const clonedResponse = response.clone();
      try {
        const body = await clonedResponse.json() as {
          accessToken?: string;
          refreshToken?: string;
          data?: { accessToken?: string; refreshToken?: string };
        };

        // Downward support for nested data objects
        const resolvedData = body.data || body;
        if (resolvedData?.accessToken) {
          accessToken = resolvedData.accessToken;
        }
      } catch (err) {
        console.error('Failed to parse auth token payload:', err);
      }
    }

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errJson = await response.json() as { message?: string; error?: string };
        errorMessage = errJson.message || errJson.error || errorMessage;
      } catch {
        // Fallback to text
        try {
          errorMessage = await response.text() || errorMessage;
        } catch {
          // ignore parsing error, stick with default errorMessage
        }
      }
      return { success: false, error: errorMessage };
    }

    // If request succeeded, parse and return JSON body
    try {
      const data = await response.json() as T;
      return { success: true, data };
    } catch {
      // Endpoint returned no content / succeeded (like 204 or void)
      return { success: true, data: {} as T };
    }
  } catch (error) {
    console.error(`Fetch API Error for ${url}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

async function attemptRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${NESTJS_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      const body = await response.json() as { accessToken?: string; refreshToken?: string; data?: { accessToken?: string; refreshToken?: string } };
      const resolved = body.data || body;
      if (resolved?.accessToken) {
        accessToken = resolved.accessToken;
        return true;
      }
    }
  } catch {
    // Network error -- silent fail
  }
  return false;
}

// ── Task / Project API ───────────────────────────────────────────────────────

export async function fetchProjects() {
  return apiRequest<Array<Record<string, unknown>>>('api/projects');
}

export async function fetchProjectTasks(projectId: string) {
  return apiRequest<ProjectTasksResponse>(`api/projects/${projectId}/tasks`);
}

export async function fetchTaskDetail(taskId: string) {
  return apiRequest<Record<string, unknown>>(`api/tasks/${taskId}`);
}

// ── FastAPI (port 8000) ──────────────────────────────────────────────────────

const FASTAPI_URL = 'http://localhost:8000';
let fastApiAccessToken: string | null = null;

export function setFastApiToken(token: string | null) {
  fastApiAccessToken = token;
}

export function getFastApiToken() {
  return fastApiAccessToken;
}

async function fastApiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${FASTAPI_URL}/${endpoint.replace(/^\//, '')}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (fastApiAccessToken) {
    headers['Authorization'] = `Bearer ${fastApiAccessToken}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || err.detail || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { success: true, data: data as T };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/** Exchange a NestJS JWT for a FastAPI JWT. */
export async function exchangeNestjsToken(nestjsToken: string) {
  return fastApiRequest<{ access_token: string; user_id: string; email: string }>(
    '/teaching/auth/nestjs-exchange',
    { method: 'POST', body: JSON.stringify({ nestjs_token: nestjsToken }) },
  );
}

/** Get or create the VS Code ID for the current user. Requires a FastAPI JWT. */
export async function fetchVscodeId() {
  return fastApiRequest<{ vscode_id: string }>('/teaching/auth/vscode-id');
}

/** Exchange a VS Code ID for a FastAPI JWT. Public endpoint. */
export async function exchangeVscodeId(vscodeId: string) {
  return fastApiRequest<{ access_token: string; user_id: string; email: string }>(
    '/teaching/auth/vscode-id',
    { method: 'POST', body: JSON.stringify({ vscode_id: vscodeId }) },
  );
}
