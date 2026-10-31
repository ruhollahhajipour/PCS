# PCS Full Audit — Phase One (read-only)

- Repository: `ruhollahhajipour/PCS`
- Audited branch: `feature/project-planning-architecture`
- Audited commit: `796ea20` ("test(pms): update CPM repository stub for relationship writes")
- Audit date: 2026-10-31
- Method: static inspection of the checked-out source (shallow clone, 300 commits). **No code was changed. No build, test, or runtime check was executed.**

## 0. Scope, limits and what was NOT verified

| Item | Status |
|---|---|
| Backend build (`dotnet build`) | **Not executed.** The .NET SDK is not available in the audit environment. |
| Backend tests (`dotnet test`) | **Not executed.** Same reason. |
| Frontend `tsc` / `vitest` | **Not executed** in this phase (dependencies not installed). |
| Runtime behaviour (login, Gantt save/reload, Excel/PDF output) | **Not verified.** All findings below are from reading code. Findings marked *(to confirm)* need a running system. |
| SQL Server behaviour | Not verifiable here; analysed from code and migration text only. |
| CI/CD | No `.github/workflows` on this branch (see ISS-P0-04). |

Every finding below is derived from files that were actually read. Where a claim rests on a grep rather than reading the full file, it says so.

## 1. Repository state

- Active audited branch has 178 commits visible in the shallow history. 18 remote branches exist (e.g. `develop`, `main`, several `fix/*`, `feature/*`, `preview/*`, `audit/platform-review`).
- **`main` is NOT the real product.** `main` holds an early frontend-only snapshot (no backend). The product described in the task (.NET backend + React frontend) lives on `feature/project-planning-architecture`.
- Solution layout: `backend/src/{PCS.API, PCS.Application, PCS.Domain, PCS.Infrastructure, PCS.Installer, PCS.Launcher}`, `backend/tests/PCS.Application.Tests`, `frontend/`, `installer/` (WiX), `database/`, `docs/`.
- Tests: 8 backend test files (~1,190 lines, all under `Planning/`). Frontend: one regression test file plus a `.disabled` copy.

## 2. Inventory

### A. Implemented (by code inspection)
- JWT authentication, permission policies, PBKDF2-SHA256 password hashing (`PasswordHasher.cs`, 100,000 iterations).
- Company / Plant / Project controllers with permission attributes.
- PMS: Excel import/export, template service, WBS calculation, progress entries, baselines (time-phased), EVM service, dashboard service, Gantt service.
- CPM engine (`CPMScheduler.cs`, 556 lines): topological sort with cycle detection, forward/backward pass, total and free float, FS/SS/FF/SF with lag.
- Network validation (`CpmNetworkValidator.cs`): rejects negative duration, self-links, unsupported types, cross-project links, links to non-schedulable activities.
- Gantt relationship replacement endpoint (`PUT api/pms/gantt/{projectId}/activities/{activityId}/relationships`) with cycle check (`ActivityRelationshipService.EnsureAcyclic`).
- Windows installer projects (WinForms `PCS.Installer`, WiX `installer/server`).

### B. Partially implemented
- Calendars: entities exist (`ProjectCalendar`, `ProjectCalendarDay`) and are used only by baseline calculation (`PmsBaselineService`, `PmsBaselineCalculator`). The CPM engine does not use them (ISS-P1-03).
- Constraints: a `Constraint` entity exists; the CPM engine does not apply constraints (ISS-P1-04).
- Multi-company access control: `CompanyUsers` entities exist; no enforcement found in PMS services (ISS-P0-01).
- Frontend warehouse (`frontend/src/features/warehouse`, 82 files), procurement, cost-control, plants: contain mock data files (`*.mock.ts`) and localStorage-backed services.

### C. Broken / suspected broken *(to confirm at runtime)*
- Frontend duplicate CPM implementation may disagree with backend results (ISS-P1-05).
- `scheduleEngine.regression.test.ts` is paired with a `.disabled` copy; the active test status is unknown.

### D. Missing
- CI/CD pipeline on the development branch.
- Authorization / tenant-isolation tests.
- Integration, API, repository and migration tests.
- Optimistic concurrency (no `RowVersion` / concurrency token found).
- Login throttling / lockout (no lockout code found by grep).
- Warehouse ↔ ICAPS integration contract.

## 3. Findings

Severity scale: Critical / High / Medium / Low. Priority: P0–P3 as defined in the task.

### P0 — Security, data loss, critical correctness

**ISS-P0-01 — No tenant (company/plant/project) isolation in PMS data access** · Critical
- Files: `backend/src/PCS.API/Controllers/Pms*Controller.cs`, `ProjectsController.cs`; `backend/src/PCS.Application/Planning/Services/*`; `backend/src/PCS.Application/Projects/Services/ProjectService.cs`.
- Evidence: authorization is a global `permission` claim check (`Program.cs`, policy per permission). Controllers take `projectId` from the URL/query and pass it straight to services. No `ICurrentUser` abstraction exists in `Application/Common/Interfaces`; no EF `HasQueryFilter` exists (grep: 0 matches). `ProjectService.GetAllAsync` returns `_repository.GetAllAsync()` without a company filter.
- Root cause: permissions are role-based and global; company/project membership is never checked on data access.
- Impact: any user holding `project.view` or `project.edit` can read or modify any project in any company by GUID. Violates the stated critical requirement.
- Fix: introduce `ICurrentUser` + a project/company access policy (resource-based authorization), apply in services/repositories, add negative tests.
- Tests: user A cannot read/edit/export/relationship-edit company B's project (each PMS endpoint).

**ISS-P0-02 — CORS allows any origin** · High
- File: `backend/src/PCS.API/Program.cs` (`AddCors` → `AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()`; applied via `app.UseCors`).
- Impact: any web origin may call the API with a bearer token. Token theft via XSS elsewhere is easier to exploit; also unnecessary exposure when the API listens locally.
- Fix: restrict to configured origins (installed frontend origin, dev origin).

**ISS-P0-03 — Swagger UI enabled unconditionally** · Medium
- File: `Program.cs` (`app.UseSwagger(); app.UseSwaggerUI();` not guarded by environment).
- Impact: full API surface disclosed in installed/production builds.
- Fix: enable only in Development or behind a setting.

**ISS-P0-04 — No CI/CD on the development branch** · High
- Evidence: no `.github/workflows` directory in the audited commit. A workflow exists only on `preview/*` branches and publishes a preview site.
- Impact: nothing builds or tests automatically; regressions can reach `main`.
- Fix: workflow running `dotnet build`, `dotnet test`, frontend `tsc -b`, `vitest run`, `eslint`.

**ISS-P0-05 — Preview branch with authentication bypass exists** · High (process risk)
- Branch: `preview/pcs-auth-bypass-2026-10-31`. Contains `__PCS_PREVIEW_AUTH_BYPASS__` checks in `frontend/src/routes/ProtectedRoute.tsx`, `frontend/src/pages/Login.tsx`, `frontend/src/context/WorkspaceProvider.tsx`.
- Impact: not present on the audited branch, but if merged or deployed against a real backend it disables the frontend login gate. This audit did not modify it (task rule: preview environment not to be touched).
- Fix: keep out of `main`/release; add a CI check that fails if the flag appears in a release build.

**ISS-P0-06 — Binary installer payloads and vendor DLLs tracked in Git** · Medium
- Files: `backend/src/PCS.Installer/Resources/Backend.zip`, `Frontend.zip`, `*.pdf`, `.wix/extensions/**/*.dll`.
- Impact: repository bloat, unreviewable binaries, supply-chain risk (a zip can contain anything).
- Fix: build installer payloads in CI; keep only source and a pinned toolchain.

**ISS-P0-07 — Generated dumps and SQL scripts tracked in Git** · Low–Medium
- Files: `backend/security_fix.sql` (UTF-16 EF-generated script containing table rebuilds and `DROP INDEX`), `backend/swagger.json`, `backend/*Search.txt`, root `PCS-*.txt`, `project-tree.txt`.
- Impact: `security_fix.sql` is a manual, unversioned schema change outside the migration history; if it was run against a database, the migration snapshot may not match reality. Needs a documented decision *(to confirm with the owner whether it was applied)*.
- No secret values were found in tracked JSON/PS1/config files by grep (`Jwt.Secret` and `InitialAdmin.Password` are empty in `appsettings.json`, and startup fails if the secret is shorter than 32 characters or the initial admin password is shorter than 12).

### P1 — Core functionality / scheduling correctness

**ISS-P1-01 — CPM schedules in abstract day offsets, not calendar dates** · High
- File: `backend/src/PCS.Application/Planning/Services/CPMScheduler.cs` (EarlyStart/EarlyFinish are integers; lag and duration are plain integers).
- Impact: no weekends/holidays/shifts; Gantt dates and planned dates cannot match a real project calendar.
- Fix: calendar-aware date arithmetic in the backend engine, one authoritative implementation.

**ISS-P1-02 — Relationship type is a free-form string** · Medium
- File: `Domain/Entities/Planning/ActivityRelationship.cs` (`string Type = "FS"`); validation in `CpmNetworkValidator.cs` is case-insensitive but the scheduler `switch` uses exact `"FS"/"SS"/"FF"/"SF"` strings (CPMScheduler.cs lines ~262–393).
- Impact: a value such as `"fs"` passes validation (case-insensitive set) but may fall through the scheduler switch *(to confirm by reading the switch default branch)*.
- Fix: enum with database check constraint, normalized on write.

**ISS-P1-03 — Calendars are not used by the scheduling engine** · High
- Evidence: `ProjectCalendar` referenced only in `PmsBaselineService`/`PmsBaselineCalculator`. `PmsBaselineCalculator` header comment states holidays/exceptions are not modeled.
- Impact: baseline and CPM use different date logic; public holidays, project-specific holidays and activity calendars are unsupported.

**ISS-P1-04 — Scheduling constraints not applied** · High
- Evidence: `Constraint` entity exists; `CPMScheduler.cs` has no constraint handling (grep: no `Constraint` match).
- Impact: SNET/FNLT/MSO/MFO etc. are stored (if at all) but ignored. Must be documented as unsupported until implemented.

**ISS-P1-05 — Two scheduling engines (backend C# and frontend TypeScript)** · High
- Files: `frontend/src/features/pms/scheduling/{cpmScheduler.ts, calendarEngine.ts, relationshipEngine.ts, scheduleEngine.ts…}` (~8,190 lines in the folder) vs `CPMScheduler.cs`.
- Impact: violates the "single authoritative backend engine" rule; results can diverge between Gantt and exports.
- Fix: decide the authority (backend), reduce the frontend to display/optimistic preview, share test vectors.

**ISS-P1-06 — Negative lag/lead and `Math.Max(0, …)` clamping** · Medium
- File: `CPMScheduler.cs` lines ~88, 100, 231, 292, 342 clamp durations and early starts to zero.
- Impact: negative lag chains and zero-bound start can silently shift results. Needs explicit rules and tests.

**ISS-P1-07 — Critical activity = `TotalFloat <= 0` only** · Medium
- File: `CPMScheduler.cs` `DetectCriticalPathAsync` (~line 548). Acceptable by convention, but there is no longest-path tracing; with multiple calendars/constraints this is inaccurate. Document the rule.

**ISS-P1-08 — Relationship replacement and recalculation transaction boundary** · Medium *(to confirm)*
- Files: `ActivityRelationshipService.cs`, `ActivityRelationshipRepository.cs`, `PmsGanttController.cs`.
- Need to confirm that replacement + CPM recalculation run in one transaction and that concurrent edits are detected (no concurrency token exists, see ISS-P1-09).

**ISS-P1-09 — No optimistic concurrency** · High
- Evidence: no `RowVersion`/`[Timestamp]`/`IsConcurrencyToken` outside migrations.
- Impact: two users editing the same WBS/activity/relationships silently overwrite each other (task §6.4).

**ISS-P1-10 — Auto-migration on startup** · Medium
- File: `Program.cs` line ~750: `await dbContext.Database.MigrateAsync();`.
- Impact: upgrades modify the database without backup/rollback. Task rule: destructive DB changes require verified backup. Fix: pre-migration backup step in installer/launcher.

### P2 — Important functionality, contracts, reporting

**ISS-P2-01 — Migration history contains a throwaway migration** · Medium
- File: `Migrations/20260731041330_TempCheck.cs` renames `Projects.EndDate` → `Status` and adds `WbsNodes` columns with `type: "TEXT"` for `decimal`. Do not edit/remove (rule 5); document a strategy before any cleanup.

**ISS-P2-02 — SQLite-flavoured migrations; SQL Server compatibility unproven** · High
- Evidence: `DependencyInjection.cs` supports both providers, but migrations/snapshot use SQLite column types (`TEXT`, `INTEGER`; 386 matches in the snapshot). `decimal` columns mapped as `TEXT`.
- Impact: applying the same migrations to SQL Server likely fails or yields wrong types. Needs separate provider migration assemblies or a tested strategy.

**ISS-P2-03 — Decimal precision configured only for some entities** · Medium
- Evidence: `HasPrecision` appears in `WbsNodeConfiguration` and `ProjectCalendarConfiguration`; `Activity.cs` has `decimal Progress/Weight/Budget/ActualCost` — configuration for these was not found by grep *(to confirm)*.

**ISS-P2-04 — Soft delete not enforced globally** · Medium
- `AuditableEntity.IsDeleted` exists; no global query filter found (grep `HasQueryFilter`: 0). Deleted rows can reappear in queries that forget to filter.

**ISS-P2-05 — Exception middleware exposes exception messages** · Medium *(to confirm)*
- File: `PCS.API/Middleware/ExceptionMiddleware.cs` references `current.Message` (lines ~54–57). If these messages are returned to clients, internal details leak.

**ISS-P2-06 — Controllers return plain strings for errors** · Low–Medium
- Example: `PmsController.Import` → `BadRequest("ProjectId is required.")`. No consistent `ProblemDetails` contract.

**ISS-P2-07 — CancellationToken rarely propagated** · Low–Medium
- 16 occurrences of `ct|CancellationToken` across all controllers (grep).

**ISS-P2-08 — Excel/PDF correctness unverified** · Medium
- Files: `PmsExcelService`, `PmsSheetBuilder`, `PmsPdfExporter`. Only `PmsExcelServiceTests` and `PmsSheetBuilderTests` exist; no PDF tests. Branding/RTL/repeating header requirements (task §7) not confirmed.

**ISS-P2-09 — Activity ↔ WBS linkage** · Medium *(to confirm)*
- Branches `fix/wbs-activity-linkage` and `feature/pms-activity-wbs-id-linkage` exist, indicating this was an active defect. Confirm the audited branch links activities by WBS node ID and not by text.

### P3 — UI/UX, performance, maintainability

**ISS-P3-01 — Mock data in production-path modules** · Medium
- Files: `frontend/src/features/{warehouse/Stock/data/stock.mock.ts, cost-control/data/cost.mock.ts, procurement/data/procurement.mock.ts, plants/data/plant.mock.ts}` and pages that use them (`CostDetails.tsx`, `ProcurementDashboard.tsx`). Task rule 9 / §9: dashboards must show real API data.

**ISS-P3-02 — Warehouse stores data in browser localStorage** · Medium
- Files: `frontend/src/features/warehouse/*/services/*.service.ts`. Data is per-browser, not shared, not backed up, and not tenant-scoped.

**ISS-P3-03 — Bearer token in localStorage** · Medium
- File: `frontend/src/api/http.ts` (`localStorage.getItem("pcs-token")`). Exposed to any XSS. No `dangerouslySetInnerHTML` was found (grep), which lowers but does not remove the risk.

**ISS-P3-04 — Large non-source artifacts in repo root** · Low
- `project-tree.txt` (≈6 MB), several `*-architecture.txt`, `PCS-PMS-Audit.txt` (generated code dumps).

**ISS-P3-05 — Disabled test file kept in repo** · Low
- `frontend/src/features/pms/scheduling/scheduleEngine.regression.test.ts.disabled`.

**ISS-P3-06 — `AllowedHosts: "*"`** · Low
- `appsettings.json`.

## 4. Installer and deployment

**ISS-INST-01 — WiX server package installs to Program Files (per-machine)** · High vs. requirement
- File: `installer/server/Product.wxs` uses `StandardDirectory Id="ProgramFiles64Folder"` with no per-user scope.
- Task requirement: per-user, no Administrator, no UAC. This package contradicts it. The WinForms installer (`PCS.Installer`) and `Program.cs` assume `%LOCALAPPDATA%\PCS\{Backend,Frontend,Database,Config}` — the two installers disagree on the install model. Which one is shipped must be decided *(to confirm with the owner)*.

**ISS-INST-02 — Database upgrade safety** · Medium
- See ISS-P1-10: no backup before `MigrateAsync`.

**ISS-INST-03 — Logs** · Low
- `Serilog` writes to relative `Logs/log-.txt`. In an installed per-user layout the working directory may not be writable or may not be the intended log folder; use `%LOCALAPPDATA%\PCS\Logs` *(to confirm at runtime)*.

## 5. Warehouse and ICAPS — integration gap analysis

### Current state (important)
- The **real** warehouse code is `frontend/src/features/warehouse/` on the development branch (82 files: Dashboard, Receipt, ReceiveMaterial, IssueMaterial, Transfer, InventoryCount, Stock, Reorder).
- A separate warehouse module was built in an earlier session on `main` / `feature/warehouse` under `frontend/src/pages/Warehouse` (own types/service/mock). **It is unrelated to `features/warehouse` and was never merged into the development branch.** It must not be merged into `feature/project-planning-architecture` without reviewing against `features/warehouse` (task: do not overwrite the user's implementation).
- ICAPS exists in the development branch only as a sidebar entry (`ICAPS Overview` → `/commissioning`). A separate informational ICAPS page was added on `main` / `feature/icaps` in the earlier session; the same caution applies. The meaning of "ICAPS" used there (TotalEnergies' commissioning software) should be confirmed by the owner.

### Gaps (no ICAPS API endpoints are assumed or invented)
| Area | Gap |
|---|---|
| Material identification | Warehouse item model is frontend/localStorage; no backend entity, no tag/system mapping. |
| Requisitions, purchase orders | Procurement module uses mock data; no backend. |
| Receipts, inspection | Receipt flow is local; no inspection (QA/QC) state. |
| Inventory, reservations, issuance | Local only; no reservation concept. |
| Equipment / tag references | Absent in the data model. |
| System / subsystem mapping | Absent; required for ICAPS-style completions. |
| Construction progress link | PMS progress is backend; no link from material issue to activities/WBS. |
| Pre-commissioning / commissioning | No entities; ICAPS integration would need system/subsystem, test sheets, punch list, RFC/AOC certificates. |
| Turnover packages | Absent. |
| Contract | No integration contract has been defined. Recommendation: define an internal domain model first (backend entities + REST), then an adapter layer; do not claim compatibility with TotalEnergies ICAPS (its public documentation describes Excel import/export, not an API). |

## 6. Testing posture

- Backend: unit tests exist for CPM, relationships, baselines, EVM, progress entries, Excel and sheet builder. Missing: authorization boundary tests, calendar tests, migration tests, API/integration tests, PDF tests.
- Frontend: Vitest configured; one regression file for the scheduling engine; no component, API-contract or workflow tests. The 16 workflows listed in the task have no automated coverage found.
- **No test result is claimed in this report.**

## 7. Summary counts

| Priority | Count |
|---|---|
| P0 | 7 |
| P1 | 10 |
| P2 | 9 |
| P3 | 6 |
| Installer | 3 |

Items marked *(to confirm)* need runtime verification or owner input before they are treated as defects.
