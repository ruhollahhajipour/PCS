# PCS Master Audit (Phase 0)

Date: 2026-11-04 · Branch: `ai/pcs-independent-remediation` · Head at audit: `aa13a22` (stacked on `b3b548e`, PR #24)
Reference baseline: **not yet decided.** Several PRs overlap (#19–#25); nothing was merged, reset or rebased.

## Evidence levels

| Tag | Meaning |
|---|---|
| **CI** | Executed successfully on GitHub Actions (run id given). |
| **LOCAL** | Executed in the audit sandbox (frontend only; NuGet is blocked there, so no local `dotnet` build/test). |
| **READ** | Established by reading code. Not executed. |
| **HYP** | Hypothesis. Needs runtime verification. |

## What is verified

| Check | Result | Evidence |
|---|---|---|
| Backend build + application tests (22 test files) | pass | CI, Backend Application Tests, run 41634841680 |
| SQLite migrations on a fresh DB; SQL Server migrations on SQL Server 2022 container | pass | CI, SQL Server Migration Scaffold, run 41634081589 (sha `cd0f606`) |
| Frontend tests (36), lint, production build, Linux + Windows install | pass | LOCAL + CI run 41634841690 |
| `PCSSetup.exe` built from a clean checkout on Windows | pass | CI, Installer Build and Smoke Test, run 41634830553 |
| Installed-layout smoke (SQLite): migrate, start `PCS.API.exe`, `/health/ready`, SPA at `/` and a client route, admin login, bootstrap password scrubbed | pass | same run |
| Clean-Windows install through the wizard UI, upgrade, backup/restore, uninstall | **not tested** | the wizard cannot run headless |

## Findings

Severity: Critical / High / Medium / Low. Status: Fixed (commit) / Open.

| ID | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| F-01 | Critical | Production frontend build threw at load unless `VITE_API_URL` was an absolute HTTPS URL. The on-premise API serves the SPA same-origin and the build script never set it, so the installed app would show a blank page. | READ, fix LOCAL+CI | Fixed `b7f7e26` |
| F-02 | High | `build-release.ps1` wrote to `installer/publish`, but `PCS.Installer.csproj` requires `backend/publish/PCS.API`, `frontend/dist` and the launcher publish. The API was framework-dependent (needs a .NET runtime on the target). | READ, fix CI | Fixed `c3a660f` |
| F-03 | High | `frontend/package-lock.json` held only the Linux rolldown binding. `npm ci` on Windows installed no native binding and `vite build` crashed, so the installer could not be built on Windows. Linux CI never noticed. | CI failure run 41634081821, fix CI | Fixed `aa13a22` |
| F-04 | Medium | Installer built the SQL Server connection string by concatenation (a `;` or `=` in the password breaks or injects options); logging key `MicrosoftAspNetCore` matched no category. | READ, compiled in CI | Fixed `cd0f606` |
| F-05 | High | Hard-coded user name "Ruhollah" in `components/Header/Header.tsx` (3 places), `layouts/Header.tsx` (2) and a mock user in `features/administration/pages/Users.tsx`. Forbidden by the directive (§6.2). | READ | Open |
| F-06 | High | Audit log is never written: `IAuditService` is registered but has **0 call sites**. Directive §9.4 requires login, permission, license and data changes to be logged. | READ | Open |
| F-07 | High | Auth gaps vs. §9.1: no refresh tokens, no password-reset flow (`PasswordResetToken` entity exists, unused), no email sender, no email verification, no per-account lockout (only a per-IP login rate limit), no session management. Login is by username, not email. | READ | Open |
| F-08 | High | License enforcement is not implemented on the backend. `ILicenseService.HasModuleAccessAsync` is only exposed by two read endpoints; no filter/attribute enforces it on any module endpoint, there is no license issue/activation path, and the "max 3 company admins" and "purchasing manager" rules do not exist. | READ | Open |
| F-09 | High | Commercial modules have no backend. Warehouse (82 frontend files) persists to `localStorage`; Procurement, Vendors, Materials, Documents, Reports make no API calls. No controllers exist for Documents or Cost although entities do. They are **Mock / Demo-level** and must not be presented as implemented. | READ | Open |
| F-10 | Medium | A frontend scheduling engine exists (`features/pms/scheduling/cpmScheduler.ts`, calendar/relationship engines). Directive §7.7 forbids critical CPM running only in the frontend. Unknown whether the Gantt uses backend or frontend results. | READ, HYP | Open, needs trace |
| F-11 | Medium | Workspace storage keys are inconsistent: `constants/storageKeys.ts` says `pcs_workspace`, `WorkspaceProvider.tsx` and `api/http.ts` use `pcs.workspace`; token and company id are raw string literals in several files. | READ | Open |
| F-12 | Medium | Database path: installed layout uses `Database\PCS.db` via an absolute connection string, but `appsettings.json`, `PCSDbContextFactory` and the DbCheck tools default to a relative `pcs.db` (resolved against the working directory). Starting the API outside the installed layout creates a stray database. | READ | Open |
| F-13 | Medium | Ports: dev API `5201` (launchSettings, Vite proxy), installed launcher `5000`, bound to `localhost` only. Multi-user LAN use is not supported by default and SQLite over a share is not advisable. | READ | Open, documented |
| F-14 | Medium | Installer SQL Server connection forces `Encrypt=True;TrustServerCertificate=False`. A server with a self-signed certificate will fail; the wizard has no explicit option. | READ, HYP | Open |
| F-15 | Medium | Calendar handling in CPM: the scheduler works in integer working-day offsets; mapping to holidays/exceptions (`ProjectCalendarDay`) was not verified. | READ, HYP | Open |
| F-16 | Medium | Open PRs overlap (#19 CPM cycles, #20/#21 security, #22 temp validation, #23 uninstall data safety, #24, #25). The reference baseline must be chosen before more feature work. | GitHub | Open, owner decision |
| F-17 | Low | Stale committed artifacts: `Resources/Backend.zip` (18.5 MB, July build), 0-byte `Manual_EN/FA.pdf`, placeholder `Frontend.zip`, empty `installer/server/*.wxs`, unused `PublishService.cs`. | READ | Open |
| F-18 | Low | `/api/health` is anonymous and returns version and timestamp. `/health/live` and `/health/ready` also exist. | READ | Open |
| F-19 | Low | Frontend tests cover only the schedule regression and the API-URL resolver. No component, route-guard, auth-flow or workspace-switching tests (§14.2). | READ | Open |

## Checked and found sound

- **Authorization coverage.** Every action in every controller except `HealthController` carries `[Permission(...)]` (an `AuthorizeAttribute` subclass) or class-level `[Authorize]`. An initial grep for `[Authorize]` suggested otherwise; the per-action check refuted it. READ.
- **Layering.** Reference graph: Domain → none; Application → Domain; Infrastructure → Domain, Application; API → Application, Infrastructure, SqlServer migrations. No EF Core reference in Domain or Application. READ.
- **CPM.** FS/SS/FF/SF with lag, backward pass, total and free float, cycle rejection, parallel critical branches, 10,000-activity network have tests. CI.
- **Tenant isolation, soft-delete, password hashing, exception middleware.** Covered by the Security tests. CI.
- **Installer policy.** `asInvoker` (no UAC), default install under `%LOCALAPPDATA%`, uninstall retains database and backups by default, upgrade and rollback services exist. READ.
- **Secrets.** Installer generates a random 64-byte JWT secret and a random initial admin password; the API scrubs the bootstrap password after seeding (CI-verified). The files are written with default ACLs. HYP: per-user LocalAppData limits exposure.

## Risk register and fix order

1. Choose the baseline: reconcile PRs #19–#25 into one line (owner decision, no code).
2. Installer/DB foundation: one database-path resolver (F-12), wizard SQL Server TLS option (F-14), remove stale artifacts (F-17). Blocks a trustworthy upgrade.
3. Security core: audit log wiring (F-06), refresh/reset/lockout (F-07), license enforcement (F-08). Blocks any commercial claim.
4. Honest module status in the UI and a `Mock / Demo` label for F-09 modules until backends exist.
5. PMS: trace Gantt data source (F-10), calendar mapping (F-15), baseline/EVM verification.
6. Frontend: remove hard-coded identity (F-05), one workspace contract (F-11), component and guard tests (F-19).
7. Clean-Windows install, upgrade, backup/restore tests (§14.4), then performance runs (§14.5).

Dependencies: 2 before any upgrade test; 3 before 8 (licensing UI); 1 before everything that touches migrations.

## Not covered by this pass

PDF/Excel output quality, Persian/RTL rendering, Gantt performance, per-endpoint IDOR review beyond the existing tests, dependency vulnerability scan (NuGet and npm audit), and a full line-by-line review of PMS calculations. These need a build environment with NuGet access or CI runs.
