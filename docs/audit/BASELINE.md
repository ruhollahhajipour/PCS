# PCS Baseline (Phase 0)

Commit audited: `d9a870b` (development branch `796ea20` + audit docs). Date: 2026-10-31.
Every result below is from a command that was actually run in the audit environment.

| Check | Command (in `frontend/`) | Result |
|---|---|---|
| Install | `npm ci` | **FAILS**: `package-lock.json` is out of sync with `package.json` (`vitest@4.1.12` and its dependencies missing from the lock). |
| Install (with fix) | `npm install` | **Crashes** (`Cannot read properties of null (reading 'edgesOut')`, npm 10.9.9) while resolving vitest's optional peers with vite 8. |
| Install (workaround) | `npm install --legacy-peer-deps` | Succeeds (313 packages). Lockfile regenerated in this branch. |
| Type check | `npx tsc -b` | exit 0 |
| Unit tests | `npx vitest run` | exit 1: **6 failed, 12 passed (18)**, all in `scheduleEngine.regression.test.ts` (FS basic network, FF, SF, positive FS lag, negative FS lag, float). |
| Lint | `npx eslint .` | exit 1: **21 problems (17 errors, 4 warnings)** |
| Backend build/test | `dotnet build` / `dotnet test` | **Not executed.** The .NET SDK cannot be downloaded in the audit environment (network proxy returns 403). Baseline will come from the first CI run. |

## Notes
- The 6 failing frontend tests compare the TypeScript scheduling engine against expected values (e.g. expected 8 got 9 working days; SF date off by 8 hours). They show the frontend engine disagrees with its own regression expectations. Related audit items: ISS-P1-05, ISS-P1-01.
- CI treats unit tests and lint as non-blocking until these baselines are fixed. Build, type check and backend build/test are blocking.
- The new CI workflow has not been run yet (no GitHub Actions run was triggered from here).
