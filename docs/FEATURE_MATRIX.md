# Feature Matrix

Status vocabulary (directive §4.2): **IV** Implemented & Verified · **INV** Implemented but Not Verified · **PI** Partially Implemented · **BR** Broken · **MD** Mock / Demo Only · **NI** Not Implemented.
"Verified" means executed in CI (see MASTER_AUDIT evidence levels). Date: 2026-11-04.

| Area | Feature | Status | Notes |
|---|---|---|---|
| Auth | Login (JWT), password hashing, legacy hash upgrade | IV | Security tests in CI. Login uses username, not email. |
| Auth | Logout, session restoration | IV (API) / LOCAL (UI) | `POST auth/logout` revokes the session; UI restores via /me with silent refresh (vitest). Tokens still in `localStorage`. |
| Auth | Refresh token rotation | IV | Hashed storage, rotation, reuse detection with 10 s grace, audited; 8 tests in CI; frontend single-flight refresh (7 vitest). |
| Auth | Password reset by emailed one-time code | NI | `PasswordResetToken` entity exists, unused; no email sender. |
| Auth | Email verification | NI | |
| Auth | Account lockout | IV | Configurable (`Security:Lockout`), audited; 4 tests in CI, migration applied on SQLite and SQL Server 2022. Plus per-IP rate limit. |
| Auth | Session management | IV | `GET auth/sessions`, `DELETE auth/sessions/{id}`; password change ends all other sessions. No UI page yet. |
| Authorization | Permission policies on API actions | IV | `[Permission]` on all non-public actions (read); tenant/membership tests in CI. |
| Authorization | Platform admin scope, inactive membership handling | IV | Tests in CI. |
| Audit | Audit log table and service | IV | Automatic trail + security events (B1, CI 83 tests). No UI; license/export events pending. |
| Licensing | License entities, status/access query | PI | Read-only; not enforced on any endpoint. |
| Licensing | Module entitlements, issue/activate, upgrade from Free, admin cap (3) | NI | |
| Master data | Companies, Plants | INV | Controllers + frontend API use; no UI tests. |
| Master data | Company users and roles management | PI | `CompaniesController` user management exists; frontend Users page contains a mock user. |
| Workspace | Company/Project selectors, context | PI | Two storage keys in use (F-11). |
| Workspace | User name in header from profile | BR | Hard-coded "Ruhollah" (F-05). |
| Projects | Create/edit/list, project boundary | INV | |
| Projects | Team, settings, lifecycle, currency | PI | Verify per field. |
| WBS | Hierarchy, codes, parent/child, roll-up calculation | IV | `WbsCalculationServiceTests` in CI. |
| WBS | Move with relationships, circular-reference guard in UI | INV | |
| PMS | Activities, relationships FS/SS/FF/SF with lag | IV | CPM tests in CI. |
| PMS | Forward/backward pass, total/free float, critical path, cycle rejection | IV | CPM tests incl. 10k-activity network. |
| PMS | Working calendar and holiday/exception handling | PI | Calendar entities exist; CPM mapping unverified (F-15). |
| PMS | Constraints, forecast dates | INV | Entities exist (`Constraint`). |
| PMS | Import (WBS/Activities) | INV | DTOs exist. |
| Gantt | Backend gantt endpoint, permission | INV | `api/pms/gantt/{projectId}` exists in code. |
| Gantt | Rendering, zoom, dependencies, baseline bars | INV | A frontend CPM engine also exists (F-10). |
| Progress | Progress entries with history, weighted progress | IV | Service tests in CI. |
| Baseline | Time-phased baselines and comparison | IV | Calculator/service tests in CI. |
| EVM | PV, EV, AC, SPI, CPI | IV | `PmsEvmServiceTests` in CI. |
| EVM | BAC, CV, SV, EAC, ETC, VAC, forecasting | INV | Confirm each metric and zero-division behavior. |
| Reports | PMS PDF and Excel export | IV (build) / INV (quality) | Exporter tests in CI; Persian/RTL output not inspected. |
| Dashboard | PMS dashboard endpoint | INV | General executive dashboard uses no API (MD). |
| Engineering | Deliverables, document register | MD / NI | No backend. |
| Procurement | Vendors, requisitions, RFQ, PO | MD | Frontend only. |
| Warehouse | Receipt, issue, transfer, stock, count, reorder | MD | 82 files, `localStorage` persistence. |
| Construction, Commissioning, Maintenance | all | NI | |
| Cost & Commercial | Cost control screens | MD / PI | `CostItem` entity exists; no controller. |
| Information | Documents, versions, folders | PI | Entities only; no API, no file storage. |
| Information | Reports hub, notifications | PI | `Notification` entity; no API verified. |
| Database | SQLite provider + migrations | IV | CI apply on fresh DB. |
| Database | SQL Server provider + migrations | IV | CI apply on SQL Server 2022 container. |
| Database | Single authoritative DB path | IV | Installed layout verified in CI (`<root>\Database\PCS.db`; relative paths resolved; fail-fast). Dev tools still use a relative dev path. |
| Installer | Build `PCSSetup.exe` from clean checkout (Windows) | IV | CI run 41634830553. |
| Installer | Installed-layout run, login, SPA | IV (headless reproduction) | The wizard UI itself is not exercised. |
| Installer | New install via wizard, shortcuts, startup | INV | |
| Installer | Upgrade, rollback, backup | INV | Services exist; untested. |
| Installer | Uninstall retaining user data | INV | Default retains data (read). PR #23 pending. |
| Installer | Self-contained API | IV | Published win-x64 self-contained in CI. |
| Observability | Serilog, exception middleware, `/health/live`, `/health/ready` | IV (smoke) | Ready check passed in CI smoke. |
| Observability | Correlation ID | NI | Not found in code. |
| Frontend | RTL, Vazirmatn | INV | |
| Frontend | Route protection, permission-aware UI | INV | No tests (F-19). |
