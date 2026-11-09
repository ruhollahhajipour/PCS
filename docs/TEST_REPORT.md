# Test Report

Updated 2026-11-04. Only executed results are listed. "Local" means the audit sandbox, which has no NuGet access, so no backend test has been run locally.

## Stage A, head `1c6d6e9`

| Workflow | Run | Result |
|---|---|---|
| Backend Application Tests (77 passed, 0 failed) | 41914278945, 41914268273 | success |
| Frontend Validation | 41914278857 | success |
| Installer Build and Smoke Test, including `Database path safety (installed layout)` | 41914268627 | success |
| SQL Server Migration Scaffold | 41914268263 | success |

## CI results on head `aa13a22` (and `cd0f606` for migrations)

| Workflow | Run | Result |
|---|---|---|
| Backend Application Tests (solution build + application regression tests) | 41634841680 | success |
| Frontend Validation (UTC, Asia/Tehran: install, vitest, eslint, build) | 41634841690, 41634830614 | success |
| Installer Build and Smoke Test (Windows) | 41634830553 | success |
| SQL Server Migration Scaffold (scaffold, SQLite apply, SQL Server 2022 apply, build, tests) | 41634081589 (`cd0f606`) | success |

Installer smoke steps passed: build release, upload artifact, EF migration on SQLite, start `PCS.API.exe`, `/health/ready`, SPA at `/` and at a client route, admin login, bootstrap password scrubbed.

A first Installer run (41634081821, `cd0f606`) **failed**: missing Windows rolldown binding in the lockfile. Fixed in `aa13a22`.

## Stage B1 (commit `68b333f`)

| Workflow | Run | Result |
|---|---|---|
| Backend Application Tests | 42595322522, 42595313441 | success, 83 passed (77 + 6 new `AuditTrailTests`) |
| Frontend Validation | 42595322581 | success |
| SQL Server Migration Scaffold | 42595313213 | success |
| Installer Build and Smoke Test | 42595313357 | success |

## Stage B2 (commit `813b23b`)

| Workflow | Run | Result |
|---|---|---|
| Backend Application Tests | 42682459623, 42682472413 | success, 87 passed (83 + 4 `AccountLockoutTests`) |
| Frontend Validation | 42682472401 | success |
| SQL Server Migration Scaffold (dispatch; SQLite + SQL Server 2022 apply) | 42682773936 | success |
| Installer Build and Smoke Test (dispatch) | 42682779301 | success |

First attempt on `b34a7c6` failed to compile (missing `using` in the new test); fixed in `813b23b`.

## Local runs

| Command | Result |
|---|---|
| `npm ci` (plain, with `.npmrc`) | pass, 324 packages |
| `npm run test:run` | 36 passed, 2 files |
| `npm run lint` | pass |
| `VITE_API_URL=/api npm run build` | pass |
| `dotnet restore/build/test` | **not run** (api.nuget.org blocked, HTTP 403) |

## Backend test inventory (22 files, executed in CI only)

Planning: CPM scheduler, relationships, WBS calculation, progress, progress entries, baseline calculator/service, EVM service, Excel service, PDF exporter, sheet builders, PMS service. Security: auth soft-delete and password upgrade, password hasher, tenant isolation, tenant context middleware, company membership index, security seed, soft-delete repository, exception middleware. Per-test pass counts were not collected here.

## Not tested

Wizard-driven install on a clean Windows, upgrade, rollback, backup/restore, uninstall data retention, multi-user, performance (§14.5), HTTP-level cross-tenant tests, frontend component/route-guard/auth-flow tests, PDF/Excel visual quality and Persian rendering, dependency vulnerability scans.
