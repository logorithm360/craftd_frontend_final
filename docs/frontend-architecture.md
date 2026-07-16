# Frontend Architecture — Craftd Web App

## Overview

The Craftd frontend is a Vite + React 19 + Tailwind CSS v4 single-page application. It provides the web interface for authentication (via NestJS), project management (via FastAPI), and serves as the browser-facing counterpart to the VS Code extension.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Vite 8 |
| Framework | React 19 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| State | React Context (useAuth) |
| HTTP | Fetch API (wrapper in lib/api.ts) |

## File Structure

```
craftd.frontend/src/
├── main.tsx                   # ReactDOM.createRoot
├── App.tsx                    # Router + AuthProvider
├── index.css                  # Tailwind v4 @import
│
├── lib/
│   ├── api.ts                 # Fetch wrapper — auto-attach Bearer, auto-refresh on 401
│   └── auth.ts                # Auth API functions (login, register, logout, refresh, identify)
│
├── hooks/
│   └── use-auth.tsx           # AuthProvider + useAuth() — user, tokens, login, register, logout
│
├── layouts/
│   └── DashboardLayout.tsx    # Sidebar + content area
│
├── pages/
│   ├── LandingPage.tsx        # Public landing page
│   ├── LoginPage.tsx          # Email/password form + vscode_state support
│   ├── RegisterPage.tsx       # Registration form + vscode_state support
│   ├── ProjectsPage.tsx       # Projects list from FastAPI
│   ├── TasksPage.tsx          # Tasks list per project
│   ├── SettingsPage.tsx       # Account settings, devices, logout
│   ├── ProfilePage.tsx        # User profile
│   └── NotFoundPage.tsx       # 404 page
│
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   └── ProtectedRoute.tsx     # Auth guard — redirects to /login
│
└── types/
    └── index.ts               # AuthUser, AuthTokens, ApiResponse
```

## Routing

| Route | Component | Auth |
|-------|----------|------|
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | Redirect → /dashboard/projects | Protected |
| `/dashboard/projects` | ProjectsPage | Protected |
| `/dashboard/tasks` | TasksPage | Protected |
| `/dashboard/settings` | SettingsPage | Protected |
| `/dashboard/profile` | ProfilePage | Protected |
| `*` | NotFoundPage | Public |

## Sidebar

```
┌──────────────────┐
│    CRAFTD        │  Logo
├──────────────────┤
│ 📁 Projects      │  Active: blue highlight
│ 📋 Tasks         │
├──────────────────┤
│ ⚙️ Settings      │
│ 👤 Profile       │
├──────────────────┤
│ 🚪 Logout        │  Danger zone
└──────────────────┘
```

## Auth Flow

```
Browser → Login → POST /auth/login (credentials: "include")
  → NestJS sets httpOnly cookies (access_token, refresh_token)
  → Response body: { accessToken, refreshToken, user }
  → React stores accessToken in memory for Bearer headers
  → On page reload: POST /auth/refresh (credentials: "include")
    → Cookie valid: session restored silently
    → Cookie expired: redirect to /login
```

## Backend Dependencies

| Phase | Backend | What the frontend needs |
|-------|---------|------------------------|
| **Phase 1 (build UI)** | None | Frontend UI only — mock auth state |
| **Phase 2 (connect NestJS)** | NestJS (port 3001) | Auth: login, register, logout, refresh, identify |
| **Phase 3 (connect FastAPI)** | FastAPI (port 8000) | Projects: GET /teaching/projects, GET /teaching/tasks (via exchanged JWT) |

## Build Order

### Phase 1 — UI Structure (mock auth, no backend)

| Step | Files | What |
|------|-------|------|
| 1 | `package.json` | Install `react-router-dom` |
| 2 | `lib/api.ts`, `lib/auth.ts`, `types/index.ts` | API placeholders (no real backend calls) |
| 3 | `hooks/use-auth.tsx` | AuthProvider with mock user state |
| 4 | `components/Sidebar.tsx`, `ProtectedRoute.tsx` | Sidebar nav + auth guard |
| 5 | `pages/LandingPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `NotFoundPage.tsx` | Public pages |
| 6 | `pages/ProjectsPage.tsx`, `TasksPage.tsx`, `SettingsPage.tsx`, `ProfilePage.tsx` | Protected pages |
| 7 | `layouts/DashboardLayout.tsx`, `App.tsx` | Wire router + layout |

### Phase 2 — NestJS Auth Connection (future)

- Connect login/register/logout to real NestJS endpoints
- Implement token management (accessToken in memory, refresh via cookies)
- Device identify + associate integration

### Phase 3 — FastAPI Integration (future)

- Exchange NestJS token → FastAPI token via POST /teaching/auth/nestjs-exchange
- Show project list on dashboard
- Show task details per project
