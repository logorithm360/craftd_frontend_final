# NestJS Backend Integration — Phase 2 (Authentication Only)

## Overview

Connecting the Vite + React 19 frontend to the NestJS backend for authentication. The frontend currently uses localStorage-based mock auth. This phase replaces the mock with real HTTP calls to NestJS on port 3001.

All UI components, pages, hooks, and routing stay unchanged — only the API layer is upgraded.

## Repository URLs

Frontend (this repo): git@github.com:logorithm360/craftd.frontend.git
NestJS backend:       git@github.com:logorithm360/craftd.app.git
                      (local path: craftd.app/, port 3001)
FastAPI backend:      git@github.com:logorithm360/craftd-ai-engine.git
                      (local path: backend-server/, port 8000)

## CORS Configuration (NestJS side)

File: craftd.app/src/main.ts — add before any routes are registered:

    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });

## API Endpoint Mapping

| Frontend function   | NestJS endpoint            | Auth             | Request body                         | Response                               |
|---------------------|----------------------------|------------------|--------------------------------------|----------------------------------------|
| `loginUser`         | `POST /auth/login`         | Public           | `{ email, password }`               | `{ accessToken, refreshToken, user }` |
| `registerUser`      | `POST /auth/register`      | Public           | `{ email, password, username }`     | `{ accessToken, refreshToken, user }` |
| `logoutUser`        | `POST /auth/vscode/logout` | JWT Bearer       | (none)                               | `{ message }`                         |
| `refreshSession`    | `POST /auth/refresh`       | httpOnly cookie  | (none)                               | `{ accessToken, refreshToken, user }` |
| `identifyUser`      | `GET /auth/me`             | JWT Bearer       | (none)                               | User object                           |

## In-Memory Token Strategy

On login/register:
  -> NestJS sets httpOnly cookies (access_token, refresh_token)
  -> NestJS returns { accessToken, refreshToken, user } in response body
  -> Frontend stores accessToken in an in-memory variable (NOT localStorage)
  -> refreshToken is also stored in-memory (the httpOnly cookie is the durable source)

On any API call returning 401:
  -> POST /auth/refresh with credentials: "include" (sends httpOnly cookie)
  -> If cookie valid: new accessToken returned -> retry original request
  -> If cookie expired: clear in-memory tokens -> redirect to /login

On page reload:
  -> POST /auth/refresh with credentials: "include"
  -> Cookie still valid: session restored silently
  -> Cookie expired: user sees login page

Why in-memory storage? The accessToken must not be stored in localStorage because it's a Bearer token — exposing it to JavaScript XSS attacks. The refreshToken is stored ONLY as an httpOnly cookie by NestJS, never accessible to JavaScript.

## Files to Change (3 files, 2 repos)

| File | Repo | Change | Effort |
|------|------|--------|--------|
| `src/lib/api.ts` | Frontend | Rewrite — replace mock with real fetch(), in-memory tokens, 401 auto-refresh | ~80 lines |
| `src/lib/auth.ts` | Frontend | Map `name` to `username` in registerUser payload | 1 line |
| `src/main.ts` | NestJS | Add enableCors() for localhost:5173 with credentials | 3 lines |

## lib/api.ts — Required Changes

### Variables to add at the top

    const NESTJS_URL = 'http://localhost:3001';
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

### Core request function (replaces current mock)

The apiRequest function must:
1. Build the full URL from NESTJS_URL + endpoint
2. Attach Authorization: Bearer {accessToken} header if token exists
3. Set credentials: 'include' on every request (sends httpOnly cookies)
4. On 401: call attemptRefresh(), retry original request if refresh succeeds
5. On auth responses: store accessToken and refreshToken from response body
6. On non-200/201: return { success: false, error: message }

### Refresh helper

    async function attemptRefresh(): Promise<boolean> {
      fetch POST /auth/refresh with credentials: 'include'
      If 200: store new tokens, return true
      Otherwise: clear in-memory tokens, return false
    }

### Remove all mock code

The current ~160 lines of localStorage mock (mock_users, mock_projects, simulated delays, admin@craftd.sh fallback) are ALL deleted. The new implementation is pure fetch to localhost:3001.

## lib/auth.ts — Register Payload Fix

The NestJS register endpoint expects `username`, not `name`. The frontend form field is labeled "name" and the hook passes `name`. Fix: in registerUser, map the field:

    body: JSON.stringify({
      email: details.email,
      password: details.password,
      username: details.name,
    })

The frontend continues to use `name` everywhere in UI. Only the API call maps it.

## What Stays Unchanged (16 files)

| File | Reason |
|------|--------|
| App.tsx, hooks/use-auth.tsx | API-agnostic abstraction layer |
| All components (3 files) | Pure UI, no API calls |
| All pages (8 files) | Call useAuth() which calls lib/auth.ts |
| types/index.ts | ApiResponse shape already matches NestJS |
| index.css, main.tsx, vite.config.ts | Build/config, no API dependency |

## Verification Steps

1. Start NestJS: cd craftd.app && npm run start:dev (port 3001)
2. Start frontend: cd craftd.frontend && npm run dev (port 5173)
3. Open http://localhost:5173 > Login > enter NestJS credentials
4. After login: redirected to /dashboard/projects
5. DevTools Network tab should show:
   - POST /auth/login -> 201, Set-Cookie: access_token, refresh_token
   - GET /auth/me -> 200, user object
6. Refresh page: POST /auth/refresh -> 200, session restored silently
7. Click Logout: POST /auth/vscode/logout -> 200, redirected to /