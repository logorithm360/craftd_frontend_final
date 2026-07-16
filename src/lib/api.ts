import type { ApiResponse } from '../types';

const NESTJS_URL = 'http://localhost:3001';
let accessToken: string | null = null;

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
    return { success: false, error: error instanceof Error ? error.message : 'Network connection failure' };
  }
}

async function attemptRefresh(): Promise<boolean> {
  const url = `${NESTJS_URL}/auth/refresh`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // sends refresh token cookie
    });

    if (response.ok) {
      const body = await response.json() as {
        accessToken?: string;
        refreshToken?: string;
        data?: { accessToken?: string; refreshToken?: string };
      };
      const resolvedData = body.data || body;
      if (resolvedData?.accessToken) {
        accessToken = resolvedData.accessToken;
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Silent session refresh failed:', error);
    return false;
  }
}
