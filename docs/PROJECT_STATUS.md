# Project Status

Updated 2026-11-04 · Branch `ai/pcs-independent-remediation` · Head `1c6d6e9` (+ docs commit) · Base line: PR #24 (`b3b548e`)

## Phase state

| Phase | State |
|---|---|
| 0 Audit | Done; owner baseline decision pending |
| 1–11 | See DEVELOPMENT_ROADMAP |

## Task board

| ID | Task | Priority | Depends | Files | Impl | Test | Acceptance |
|---|---|---|---|---|---|---|---|
| T-01 | Same-origin `/api` frontend build | P0 | — | `frontend/src/api/*`, `build-release.ps1` | Implemented | Tested (LOCAL+CI) | Installed SPA loads and logs in (CI smoke) |
| T-02 | Reproducible installer build + CI smoke | P0 | T-01 | `installer/scripts`, `.github/workflows/installer-build.yml` | Implemented | Tested (CI) | `PCSSetup.exe` artifact; smoke green |
| T-03 | Lockfile native bindings (Windows build) | P0 | — | `frontend/package-lock.json`, `.npmrc` | Implemented | Tested (CI) | `npm ci` works on Windows and Linux |
| T-04 | SQL Server credential escaping, log category | P1 | — | `PCS.Installer/Services/*` | Implemented | Compiled in CI | no `;`/`=` injection (no unit test yet) |
| T-05 | Audit documentation set | P0 | — | `docs/*` | Implemented | n/a | Owner review |
| T-06 | Single DB path resolver | P0 | T-05 | `SqliteConnectionPathResolver`, `Program.cs`, appsettings, workflow | Implemented | Tested (CI 41914268627, 77 backend tests) | No stray DB; fail fast without config |
| T-13 | SQL Server trust-certificate option | P1 | — | `DatabasePage.cs`, `InstallerContext.cs`, `DatabaseInstallerService.cs` | Implemented | Compiled in CI; UI not exercised | Default off; clear error |
| T-14 | Release builder same-origin `/api` | P0 | T-01 | `PublishService.cs` | Implemented | Compiled in CI | Same bundle as `build-release.ps1` |
| T-15 | Delete stale artifacts (F-17) | P2 | owner | see MASTER_AUDIT F-17 | Blocked (needs approval) | — | List approved, then deleted with CI green |
| T-07 | Remove hard-coded identity (F-05) | P1 | — | `Header.tsx` ×2, `Users.tsx` | Not Started | — | Header from profile; test |
| T-08 | Audit log wiring (F-06) | P0 | — | services, controllers | Implemented | `68b333f` | Rows for login, permission, project, license changes |
| T-09 | Auth completion (F-07) | P0 | T-08 | Identity services, entities, migrations | Not Started | — | See roadmap phase 2 |
| T-10 | License enforcement (F-08) | P1 | T-08 | API filter, services | Not Started | — | 403 on unlicensed module (test) |
| T-11 | Trace Gantt data source (F-10) | P1 | — | PMS frontend/backend | Not Started | — | Backend-only CPM |
| T-12 | Reconcile open PRs (F-16) | P0 | owner | GitHub | Blocked (owner decision) | — | One baseline |

## Blockers

- No NuGet access in the audit sandbox: backend validation is CI-only.
- Owner decisions listed in DEVELOPMENT_ROADMAP.
