import type { ApiResponse, AuthUser } from '../types';

// In Phase 1 (frontend only), we'll mock the Fetch API behavior using localStorage
// and simulated delays, so that UI loading transitions function beautifully and
// the application can be fully run and checked as a standalone.
// We also implement token headers & refresh mechanism so it's ready for Phase 2/3.

const DELAY_MS = 400;

export const sleep = (ms: number = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

interface MockStoredUser {
  id: string;
  email: string;
  password?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  await sleep();

  // For future NestJS/FastAPI integration, headers are prepared:
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  // Simulated Mock responses for Local Storage persistence in Phase 1
  const path = endpoint.replace(/^\//, '');

  if (path.startsWith('auth/login')) {
    const body = JSON.parse((options.body as string) || '{}') as { email?: string; password?: string };
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]') as MockStoredUser[];
    const user = users.find((u) => u.email === body.email && u.password === body.password);

    // Create a default admin user if none exists
    if (!user && body.email === 'admin@craftd.sh' && body.password === 'password') {
      const defaultUser: AuthUser = {
        id: 'user_admin',
        email: 'admin@craftd.sh',
        name: 'Alex Craftd',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('access_token', 'mock_access_token');
      localStorage.setItem('refresh_token', 'mock_refresh_token');
      localStorage.setItem('current_user', JSON.stringify(defaultUser));
      return {
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          user: defaultUser
        } as unknown as T
      };
    }

    if (user) {
      const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, createdAt: user.createdAt };
      localStorage.setItem('access_token', 'mock_access_token_' + user.id);
      localStorage.setItem('refresh_token', 'mock_refresh_token_' + user.id);
      localStorage.setItem('current_user', JSON.stringify(authUser));
      return {
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken: 'mock_access_token_' + user.id,
          refreshToken: 'mock_refresh_token_' + user.id,
          user: authUser
        } as unknown as T
      };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  if (path.startsWith('auth/register')) {
    const body = JSON.parse((options.body as string) || '{}') as { email?: string; password?: string; name?: string };
    if (!body.email || !body.password) {
      return { success: false, error: 'Email and password are required' };
    }
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]') as MockStoredUser[];
    if (users.some((u) => u.email === body.email)) {
      return { success: false, error: 'User already exists with this email' };
    }

    const newUser: MockStoredUser = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      email: body.email,
      password: body.password,
      name: body.name || body.email.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));

    const authUser: AuthUser = { id: newUser.id, email: newUser.email, name: newUser.name, avatarUrl: newUser.avatarUrl, createdAt: newUser.createdAt };
    localStorage.setItem('access_token', 'mock_access_token_' + newUser.id);
    localStorage.setItem('refresh_token', 'mock_refresh_token_' + newUser.id);
    localStorage.setItem('current_user', JSON.stringify(authUser));

    return {
      success: true,
      message: 'Registered successfully',
      data: {
        accessToken: 'mock_access_token_' + newUser.id,
        refreshToken: 'mock_refresh_token_' + newUser.id,
        user: authUser
      } as unknown as T
    };
  }

  if (path.startsWith('auth/logout')) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    return { success: true, message: 'Logged out successfully' };
  }

  if (path.startsWith('auth/refresh')) {
    const rToken = localStorage.getItem('refresh_token');
    if (!rToken) {
      return { success: false, error: 'No refresh token' };
    }
    const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null') as AuthUser | null;
    if (!currentUser) {
      return { success: false, error: 'User session expired' };
    }
    return {
      success: true,
      data: {
        accessToken: rToken.replace('refresh', 'access'),
        refreshToken: rToken,
        user: currentUser
      } as unknown as T
    };
  }

  if (path.startsWith('auth/identify')) {
    const userJson = localStorage.getItem('current_user');
    if (!userJson) {
      return { success: false, error: 'Not authenticated' };
    }
    return {
      success: true,
      data: JSON.parse(userJson) as T
    };
  }

  // Fallback / Real fetch if integration phase was reached (simulated here)
  return { success: false, error: 'Endpoint not simulated' };
}
