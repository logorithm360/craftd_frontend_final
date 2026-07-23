# Task Detail System — Full Implementation Plan

## Overview

When a student clicks a project → redirected to that project's tasks. Tasks are split into 3 tabs: To-do, In Progress, Completed. Clicking any task opens a detail page showing concept name, explanation, and code example — each in its own section.

If the task hasn't been taught yet (no explanation/code_example), a "Open in VS Code" button appears that deep-links into the VS Code extension to start the teaching session.

## Architecture

```
Projects Page → click project → /dashboard/tasks?projectId=xxx
                                      │
                                      ▼
                              3 Tabs: To-do / In Progress / Completed
                                      │
                                      │ click any task
                                      ▼
                              /dashboard/tasks/:taskId
                                      │
                              ┌───────┴────────┐
                              │ Has explanation? │
                              └───────┬────────┘
                                   YES     NO
                                    │       │
                                    ▼       ▼
                           Show concept   Show concept
                           + explanation  + "Open in VS Code"
                           + code example  button (deep link)
                                            │
                                            ▼
                                   vscode://craftd.craftd-extension/
                                   tutor?taskId=xxx&projectId=yyy
```

## NestJS endpoints

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/projects` | List of projects for this user |
| GET | `/api/projects/:id/tasks` | All tasks for a project, grouped by section, with lock state |
| GET | `/api/tasks/:id` | Single task with all content fields + project/section context |

## Lock state algorithm

```
Tasks ordered by (section.order_index, task.order_index):
  Section 0, Task 0: status="passed"    → isLocked=false (done)
  Section 0, Task 1: status="passed"    → isLocked=false (done)
  Section 0, Task 2: status="ready"     → isLocked=false, canWork=true ← current
  Section 0, Task 3: status="ready"     → isLocked=true ← blocked
  Section 1, Task 0: status="ready"     → isLocked=true ← entire section blocked
```

## Three task categories

| Category | Filter | Card look |
|----------|--------|-----------|
| To-do | `isLocked === true` | Gray, concept name, lock icon |
| In Progress | `canWork === true` | Blue, concept name, "Current" badge |
| Completed | `status === "passed"` | Green, concept + snippet, checkmark |

## Task detail page layout

```
/dashboard/tasks/:taskId

Breadcrumbs: Projects > Project Name > Section Name > Concept Name
──────────────────────────────────────────────────────────────
● Concept Name                                  status: PASSED

📖 Explanation (only if exists)
┌──────────────────────────────────────────────┐
│ AI-generated explanation of the concept       │
└──────────────────────────────────────────────┘

💻 Code Example (only if exists)
┌──────────────────────────────────────────────┐
│ AI-generated code example                     │
└──────────────────────────────────────────────┘

If not yet taught:
┌──────────────────────────────────────────────┐
│ This task hasn't been started yet. Open      │
│ in VS Code to begin learning.                │
│                                              │
│ [▶ Open in VS Code]                          │
└──────────────────────────────────────────────┘
```

## VS Code deep link format

```
vscode://craftd.craftd-extension/tutor?taskId=task-abc123&projectId=proj-xyz
```

## Files to change/create

### NestJS (craftd.app) — 3 new files + 1 modified

| File | Action |
|------|--------|
| `src/projects/projects.module.ts` | New |
| `src/projects/projects.controller.ts` | New — 3 endpoints |
| `src/projects/projects.service.ts` | New — raw SQL + lock algorithm |
| `src/app.module.ts` | Add ProjectsModule import |

### FastAPI (backend-server) — 1 migration + 1 change

| File | Change |
|------|--------|
| `app/services/teaching.py` | `_create_task` accepts `concept` param |
| `scripts/migrate_task_columns.sql` | Add concept, explanation, code_example |

### Frontend (craftd.frontend) — 3 changed + 1 new

| File | Action |
|------|--------|
| `pages/TasksPage.tsx` | Rewrite — fetch from NestJS, 3 tabs, click → detail |
| `pages/TaskDetailPage.tsx` | New — concept/explanation/code + VS Code deep link |
| `App.tsx` | Add route `/dashboard/tasks/:taskId` |
| `lib/api.ts` | Add fetchProjectTasks, fetchTaskById |

## Migration

```sql
ALTER TABLE ai_engine.tasks ADD COLUMN IF NOT EXISTS concept TEXT NOT NULL DEFAULT '';
ALTER TABLE ai_engine.tasks ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE ai_engine.tasks ADD COLUMN IF NOT EXISTS code_example TEXT;
```

## Build order

1. FastAPI `_create_task` — accept `concept` parameter
2. NestJS projects module (3 new files + app.module.ts)
3. Frontend lib/api.ts — add task fetch functions (if not exist)
4. Frontend TasksPage — 3 tabs + project filtering
5. Frontend TaskDetailPage — concept/explanation/code rendering
6. Frontend App.tsx — add route
7. Compile both sides, do NOT commit
