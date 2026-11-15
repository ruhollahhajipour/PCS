# Development Roadmap

Follows directive §16. Each phase lists dependencies and acceptance criteria. Dates are not committed; order is. Updated 2026-11-04.

| Phase | Scope | Depends on | Acceptance criteria | State |
|---|---|---|---|---|
| 0 Audit | Repository audit, feature matrix, risk register | none | Docs in this folder reviewed by the owner; baseline chosen | Done (docs), baseline decision pending |
| 1 Foundation | Single DB path resolver (F-12); SQL Server TLS option in wizard (F-14); remove stale artifacts (F-17); reconcile PRs #19–#25 | 0 | One configuration source for the DB; migration tests green on SQLite and SQL Server; no stray `pcs.db` after a start outside the install | Not started |
| 2 Auth & authorization | Audit-log wiring (F-06); refresh-token rotation, password reset by emailed one-time code, lockout, session list (F-07) | 1 | Tests for expiry, single use, brute-force limits, lockout, rotation reuse detection; every sensitive operation produces an audit row; no secret in logs | Not started |
| 3 Master data & workspace | Remove hard-coded identity (F-05); one workspace storage contract (F-11); users admin, company selector, route guards; component tests | 2 | Header shows the authenticated profile; switching company/project clears stale page data (test); guard tests | Not started |
| 4 Project management | Team, settings, calendar, lifecycle | 3 | CRUD with validation and tenant tests; project data never visible across projects/companies | Partial |
| 5 WBS & PMS | Trace Gantt data source (F-10); calendar mapping (F-15); sample projects A–D with FS/SS/FF/SF, lag, calendar, milestones | 4 | Backend is the only CPM source; golden-file tests for A–D; Gantt renders backend output | Partial (CPM verified) |
| 6 Project controls | Baseline comparison, variance, EAC/ETC/VAC, KPI | 5 | Formulas documented; zero-division and incomplete-data tests | Partial (PV/EV/AC/SPI/CPI verified) |
| 7 Commercial modules | Backend for Engineering, Procurement, Warehouse, Construction, Commissioning, Cost, Maintenance, Documents (F-09) | 2, 8 | Each module has API, DB, permissions, license gate, tests; remove `localStorage` persistence | Not started |
| 8 Licensing | Entitlements, issue/activate (offline-capable design), admin cap, purchasing manager, enforcement filter, audit | 2 | Backend rejects calls to unlicensed modules (tests); UI hiding is not relied on; upgrade from Free without reinstall | Not started |
| 9 Dashboard & reporting | Executive/project/operational dashboards on real data | 5, 6 | No mock numbers; role- and project-filtered | Not started |
| 10 Installer & release | Backup before migration, tested upgrade/rollback/uninstall, clean-Windows test, documentation | 1 | Scripted clean-Windows run: install, login, create data, restart, upgrade keeps data, uninstall keeps data | Build and smoke done |
| 11 Final QA | Regression, security audit, performance, data integrity, golden master | all | Critical/High findings closed; reproducible tagged build | Not started |

## Decisions needed from the owner

1. Which branch/PR line is the reference baseline (F-16).
2. Network database for multi-user: SQL Server or PostgreSQL (directive §10).
3. Email transport for password reset (SMTP relay choice; no paid service is added without approval).
4. License activation model (online, offline file, or both).
5. NuGet mirror or allowlist for local backend builds.
