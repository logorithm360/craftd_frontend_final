import { apiRequest } from './api';
import type { AuthUser } from '../types';

export async function loginUser(credentials: { email: string; password?: string }) {
  return apiRequest<{ accessToken: string; refreshToken: string; user: AuthUser }>('auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(details: { email: string; password?: string; name?: string }) {
  return apiRequest<{ accessToken: string; refreshToken: string; user: AuthUser }>('auth/register', {
    method: 'POST',
    body: JSON.stringify(details),
  });
}

export async function logoutUser() {
  return apiRequest<void>('auth/logout', {
    method: 'POST',
  });
}

export async function refreshSession() {
  return apiRequest<{ accessToken: string; refreshToken: string; user: AuthUser }>('auth/refresh', {
    method: 'POST',
  });
}

export async function identifyUser() {
  return apiRequest<AuthUser>('auth/identify', {
    method: 'GET',
  });
}
