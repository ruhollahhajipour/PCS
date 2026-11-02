# PCS Audit — Status Update against `aa868c9`

The first audit (`PCS_FULL_AUDIT.md`) was written against `796ea20`. The development branch has since moved to `aa868c9` (about 50 commits). This update re-checks each original finding against the new head by reading code and CI run results. **No build or test was executed locally** (the .NET SDK cannot be downloaded in the audit environment); CI results quoted below come from the GitHub Actions run list.

Legend: **Resolved** = evidence found in code/CI. **Open** = still present. **Partial / Unverified** = needs more evidence.

| ID | Finding | Status at `aa868c9` | Evidence |
|---|---|---|---|
| P0-01 | No tenant isolation | **Largely resolved, verify depth** | 16 `HasQueryFilter` in `PCSDbContext.cs`; tenant context and token binding commits (`9c85086`, `d0e2bf0`, `6296c24`, `28f0014`); `Security/TenantIsolationTests.cs` exists (only 1 `[Fact]/[Theory]` counted — coverage is thin; the original ask was one negative test per PMS endpoint). Frontend tenant header is documented as unvalidated (`5e9bf0e`). |
| P0-02 | CORS any origin | **Resolved** | `Program.cs` uses `policy.WithOrigins(allowedOrigins)`. |
| P0-03 | Swagger always on | **Resolved** | Guarded by `swaggerEnabled`. |
| P0-04 | No CI | **Resolved** | Workflows: Backend Application Tests, Frontend Validation, SQL Server Migration Scaffold. |
| P0-05 | Preview auth-bypass branch | **Open (process)** | Flag not present in this branch source. Branch `preview/pcs-auth-bypass-*` still exists; add a guard against it reaching release. |
| P0-06 | Binary payloads tracked | **Open** | Not re-checked in detail. |
| P0-07 | Generated dumps / `security_fix.sql` | **Open** | Not re-checked; owner decision pending. |
| P1-01 / P1-03 / P1-04 | Backend CPM not calendar-aware; constraints not applied | **Open** | `CPMScheduler.cs` contains 0 mentions of `calendar` and 0 of `constraint`. (`1a8106d` bounded the backward pass by project completion.) |
| P1-05 | Two scheduling engines; failing frontend regression tests | **Partly resolved** | Frontend engine and its regression test were rewritten; the last Frontend Validation run (2026-11-02 00:21) is green. Two engines still exist (backend integers vs frontend calendar dates), so parity is still unproven. |
| P1-09 | No optimistic concurrency | **Open** | No `RowVersion` / concurrency token found outside migrations. |
| P1-10 | Migration on startup without backup | **Changed** | `Program.cs` no longer calls `MigrateAsync`; `PCS.Installer/.../DatabaseInstallerService.cs` calls `db.Database.Migrate()` (lines 50, 95). Backup-before-migrate not found. |
| P2-02 | SQLite-only migrations | **In progress** | Provider-specific SQL Server migration scaffold exists. **CI run `41413894498` of "SQL Server Migration Scaffold" failed** at "Apply SQLite migrations to an ephemeral database"; the log shows EF warnings that operations in several old migrations (`AddPMSCore`, `TempCheck`, `AddSecurityModule`, `FixSecurityRelationships`, `FinalizePlanningModel`, `AddPlantEntity`) cannot run in a transaction. Root cause of the failure was not determined here. |
| P2-03 | Decimal precision gaps | **Resolved (per commit, unverified)** | `d94fe56` "define decimal precision for project EVM and WBS metrics". |
| INST-01 | WiX server package in Program Files | **Open** | `installer/server/Product.wxs` still uses `ProgramFiles64Folder`. Owner decision on the install model still needed. |
| — | Backend tests | **Passing in CI** | "Backend Application Tests" succeeded on `aa868c9`'s predecessor runs (2026-11-02 08:32). Test count was not extracted. |

## Items not covered by earlier findings
- The SQLite migration step of the SQL Server scaffold workflow is red. This is the only failing CI signal found.

## Superseded work from this audit session
- Branch `chore/ci-baseline-2026-10-31` (my CI workflow + lockfile change) is **superseded** by the three workflows above and should be closed without merging. Its lockfile regeneration is also not needed (the repository workflow already runs `npm ci --legacy-peer-deps`).
- Warehouse and ICAPS pages on `main` / `feature/warehouse` / `feature/icaps` are unrelated to `frontend/src/features/warehouse` on this branch and are not integrated.

## Recommended next steps (reordered)
1. Diagnose the failing SQLite step in the SQL Server scaffold workflow (read the full failing log; confirm whether the transaction warnings are the cause).
2. Extend `TenantIsolationTests` to one negative test per PMS/Project/Plant/Company endpoint, plus tests for the frontend-supplied tenant header.
3. Backend calendar-aware CPM and constraints (P1-01/03/04), then retire or demote the frontend engine to preview, with shared parity vectors.
4. Concurrency tokens on WBS/Activity/Relationship (P1-09).
5. Owner decisions: installer model, `security_fix.sql`, binaries in Git, preview-branch policy.
