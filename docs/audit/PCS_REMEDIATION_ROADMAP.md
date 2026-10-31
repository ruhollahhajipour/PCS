# PCS Remediation Roadmap

Based on `PCS_FULL_AUDIT.md` (commit `796ea20`). **Nothing below has been started. Approval is requested before each phase.** Execute one group at a time; run the listed tests; report real command output.

## Ordering principles
1. Fix anything that can leak or corrupt another company's data before features.
2. Build a safety net (CI + tests) before large refactors, so later phases are verifiable.
3. Fix the scheduling core in dependency order: relationship model → calendars → constraints → single engine.
4. Do not touch existing migrations without a documented strategy.

## Phase 0 — Prerequisites (no product change)
| Item | Action |
|---|---|
| Toolchain | Environment with .NET 10 SDK and Node to run builds/tests (not available in the audit environment). |
| Baseline | Run `dotnet build`, `dotnet test`, `tsc -b`, `vitest run`, `eslint`; record results as the starting baseline. |
| Owner decisions | (a) installer model (per-user vs Program Files); (b) was `backend/security_fix.sql` applied?; (c) meaning of "ICAPS"; (d) fate of earlier `main` warehouse/ICAPS pages. |

## Phase 1 — CI and safety net (P0-04, P0-06, P0-07, P3-04, P3-05)
- Files: `.github/workflows/ci.yml` (new), `.gitignore`.
- Risk: low. Migration: none.
- Tests: the pipeline itself; fail the build if `__PCS_PREVIEW_AUTH_BYPASS__` appears in a release build (P0-05).

## Phase 2 — Security hardening (P0-01, P0-02, P0-03, P2-05, P3-06)
- P0-01 first: `ICurrentUser`, project/company resource authorization, apply in PMS/Project/Plant/Company services; add authorization boundary tests for every PMS endpoint.
- Then: CORS allow-list, Swagger gating, safe error contract (`ProblemDetails`), login throttling.
- Files: `PCS.API/Program.cs`, `PCS.API/Controllers/*`, `PCS.Application/**/Services/*`, `PCS.Application/Common/Interfaces`.
- Risk: medium (behaviour change for users with global permissions). Migration: possibly a membership table if `CompanyUsers` is insufficient.
- Tests: cross-tenant read/write/export denied; same-tenant allowed; unauthenticated denied.

## Phase 3 — Database integrity (P2-01…P2-04, P1-09, P1-10)
- Document SQLite vs SQL Server strategy; verify migrations on both providers; decimal precision for all money/progress fields; global soft-delete filter; `RowVersion` on WBS/Activity/Relationship; pre-migration backup.
- Risk: high (schema). Requires verified backup and approval. Never edit existing migrations; add new ones.
- Tests: migration apply on SQLite and SQL Server; concurrency conflict returns 409.

## Phase 4 — Scheduling core (P1-01…P1-08)
Order matters:
1. Relationship type enum + DB constraint, normalization (P1-02).
2. Explicit rules and tests for negative lag, zero-bound, clamping (P1-06).
3. Calendar-aware date arithmetic in the backend engine (P1-01, P1-03).
4. Constraints (SNET, SNLT, FNET, FNLT, MSO, MFO, ALAP) with documented unsupported list (P1-04).
5. Critical path definition and longest-path tracing (P1-07).
6. Single authoritative engine: backend; frontend reduced to display/preview (P1-05).
7. Transaction + concurrency for relationship replace + recalculation (P1-08).
- Tests: known-answer CPM networks (all four types, lag/lead, calendars, holidays, constraints, cycles, cross-project, deleted activities); frontend/back-end parity vectors.

## Phase 5 — WBS/activity integrity and progress/EVM (P2-09 + audit §6.1, 6.2, 6.7, 6.8)
- Verify ID-based linkage, unique WBS codes, roll-up, EVM zero-denominator rules, no misleading KPIs when baseline is missing.

## Phase 6 — Excel/PDF reporting (P2-08)
- PCS branding, document number/revision/issue date, repeating headers, page numbers, Persian/English handling; data-consistency tests across DB/API/Excel/PDF/Gantt.

## Phase 7 — Frontend integrity (P3-01…P3-03)
- Replace mock-data dashboards with API data or remove them from production routes; move warehouse persistence to a backend; consider moving the token out of localStorage (httpOnly cookie) with CSRF handling.

## Phase 8 — Installer and deployment (INST-01…03)
- After the owner decides the model: per-user WiX scope or retire the Program Files package; log path; upgrade/uninstall data preservation test.

## Phase 9 — Warehouse and ICAPS integration (§5 of the audit)
- Design the domain contract (items, tags, systems/subsystems, receipts, inspection, reservations, issues, turnover) as backend entities + REST first; ICAPS adapter later, only against documented interfaces.

## Phase 10 — Workflow test suite
- Automate the 16 workflows from the task (login → dashboard) as API/integration tests plus component tests.

## Approval requested
Please approve, reorder or reject: **Phase 0 + Phase 1 first** (no product behaviour change), then **Phase 2** (security). Destructive or schema-changing work (Phase 3) will not start without a verified backup and explicit approval.
