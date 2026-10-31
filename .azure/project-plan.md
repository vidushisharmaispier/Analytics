# Project Plan

**Status**: Planning
**Created**: 2026-10-31
**Mode**: AUGMENT

---

## 1. Project Overview

**Goal**: Extend the existing React portfolio with a responsive, client-only project-management demo for workspaces, teams, projects, and tasks, including dashboard, kanban/table views, search, filters, sorting, comments, due dates, priorities, and shareable view URLs. The project is designed so that every module is independently testable.

**App Type**: SPA

**API Login**: No

**Mode**: AUGMENT

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | React + Vite |
| **Package Manager** | npm |
| **Test Runner** | Vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure Static Web Apps | Optional static hosting if Azure deployment is chosen; preserve the existing Vercel setup otherwise | None | `npm run dev` | Enhancement |

No backend, remote persistence, queues, cache, or Azure datastore is required. The demo uses seeded client-side state; browser-local persistence may be used for demo edits. Shareable URLs encode the selected workspace/project, view, and query filters, not cross-device data synchronization.

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | * | ✅ | 24.22.0 |
| npm | * | ✅ | 11.19.1 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Google Chrome | portfolio-web | ✅ | 156.0.8078.74 |

No emulator/container runtime is needed because the app has no Azure service dependencies. No service-specific VS Code debug extension applies to this frontend-only stack.

---

## 5. Project Structure

```text
src/
├── main.tsx                         # Existing portfolio entry and demo selection
├── demos.tsx                        # Existing portfolio demo previews
├── DemoPage.tsx                     # Add the project-management demo entry
├── features/
│   └── projects-demo/
│       ├── ProjectsDemoApp.tsx      # Demo shell, navigation, and URL state
│       ├── components/
│       │   ├── WorkspaceSidebar.tsx
│       │   ├── ProjectKanban.tsx
│       │   ├── ProjectTable.tsx
│       │   └── TaskDetailsPanel.tsx
│       ├── data/
│       │   └── seedData.ts          # Demo workspaces, teams, projects, tasks
│       ├── model/
│       │   └── types.ts             # Typed client-side domain models
│       ├── state/
│       │   └── projectState.ts      # Local state and browser-local persistence
│       ├── utils/
│       │   └── urlState.ts          # Parse/serialize shareable view parameters
│       └── tests/
│           ├── urlState.test.ts
│           └── projectState.test.ts
└── features/projects-demo/projects-demo.css
```

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: A calm, polished project workspace with a compact dark-navy navigation rail, airy off-white canvas, crisp data-dense cards, and restrained violet accents. Use consistent 8px corners, clear hierarchy, and subtle layered elevation so boards and tables stay scannable at desktop and mobile sizes.
**Typography**: Segoe UI, system-ui, sans-serif

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#5B4BDB` | Flow actions, selected navigation, active view and links |
| `accent` | `#159A9C` | Progress indicators, secondary emphasis, and focus details |
| `surface` | `#F6F7FB` | Workspace canvas and neutral page background |
| `text` | `#20243A` | Workspace titles, task names, and primary content |
| `muted` | `#697187` | Assignees, dates, helper text, and secondary labels |
| `border` | `#E1E4EE` | Card, table, column, and form-field separators |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Workspace Dashboard | `/?demo=projects` | Summarize the selected workspace, active projects, progress, and upcoming tasks. | `header + sidebar + hero + grid + card-list + footer` |
| Project Board | `/?demo=projects&workspace=clarity&project=website-refresh` | Show project tasks in a kanban board with a table-view option and URL-backed search, filters, and sorting. | `header + sidebar + action-bar + tabs + grid + table` |
| Task Details | `/?demo=projects&workspace=clarity&project=website-refresh&task=task-responsive-board` | Inspect and edit a task's status, priority, due date, assignee, and comments. | `header + sidebar + action-bar + two-column(main+list) + form` |

### Sample Content

Workspace Dashboard — workspace and project summary:
| Project | Team | Progress | Status |
|---|---|---:|---|
| Website Refresh | Clarity Studio | 68% | In progress |
| Mobile Launch | Product Crew | 42% | In progress |
| Q4 Campaign | Growth Team | 91% | In review |

Project Board — representative tasks across the workflow:
| Task | Assignee | Due date | Priority / Status |
|---|---|---|---|
| Finalize homepage wireframes | Maya Chen | 2026-11-04 | High / In progress |
| Review responsive board layout | Leo Martin | 2026-11-06 | Medium / Review |
| Prepare launch checklist | Amara Okafor | 2026-11-09 | Low / Backlog |
| Approve visual direction | Noah Patel | 2026-11-03 | High / Done |

Task Details — “Review responsive board layout”: assignee Leo Martin · due 2026-11-06 · priority Medium · status Review.
| Commenter | Comment |
|---|---|
| Maya Chen | The tablet breakpoint now keeps the status columns readable. |
| Leo Martin | I’ll check the narrow mobile layout before review. |
| Amara Okafor | Please keep the table view reachable from the project toolbar. |

State coverage across the pages: populated records on the dashboard and board; a skeleton loading treatment for dashboard metrics; an empty-state panel with a create-task action on the board; and an inline retry banner for a simulated local demo error on task details.

---

## 7. Route Definitions

These are browser-side SPA routes in the existing portfolio; they are not API endpoints. Query parameters preserve the chosen demo view and filter state, while task data remains local to the browser.

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/?demo=projects` | Open the project-management demo at the workspace dashboard | — | Dashboard with seeded workspace and project summaries | 200 |
| 2 | GET | `/?demo=projects&workspace=clarity&project=website-refresh&view=kanban` | Open a shareable project board; optional `view`, `q`, `status`, `priority`, and `sort` parameters restore the selected UI state | — | Kanban or table view with client-side filters applied | 200, 404 for an unknown demo project |
| 3 | GET | `/?demo=projects&workspace=clarity&project=website-refresh&task=task-responsive-board` | Open a shareable task-details view | — | Task details and local comments for the selected seeded task | 200, 404 for an unknown task |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to add the approved project-management demo to the existing portfolio without replacing its current demos.
2. Verify the client-only flows and tests locally; **azure-project-integrate** is not needed unless a backend is added later.
3. Run **azure-debug-plan** → **azure-debug-generate** if VS Code launch and task configuration is wanted.
4. Keep the existing Vercel deployment path, or use **azure-deploy** if Azure Static Web Apps hosting is explicitly selected later.
