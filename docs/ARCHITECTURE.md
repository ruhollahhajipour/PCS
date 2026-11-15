# Architecture (as audited, 2026-11-04)

## Backend (`backend/PCS.Backend.slnx`, .NET 10)

| Project | References | Role |
|---|---|---|
| `PCS.Domain` | none | Entities (Planning, Security, Licensing, Cost, documents), base entity |
| `PCS.Application` | Domain | DTOs, interfaces, services (Planning/PMS, Identity, Companies, Projects, Plants, Licensing, Documents, Notifications) |
| `PCS.Infrastructure` | Domain, Application | EF Core `PCSDbContext`, configurations, SQLite migrations, repositories, identity/JWT, license, audit services |
| `PCS.Infrastructure.Migrations.SqlServer` | Infrastructure | SQL Server migration assembly |
| `PCS.API` | Application, Infrastructure, SqlServer migrations | Controllers, middleware (exception, tenant context), auth, CORS, rate limiting, health, static SPA hosting |
| `PCS.Launcher` | none | Windows launcher that starts `PCS.API.exe --urls http://localhost:5000` and opens the UI |
| `PCS.Installer` | Application, Infrastructure, SqlServer migrations | WinForms wizard that bundles API, frontend and launcher into `PCSSetup.exe` |

The static reference graph follows Clean Architecture: no EF Core in Domain or Application, and no controller uses `DbContext` directly.

## Request path

Browser → `PCS.API` (same origin when installed) → `ExceptionMiddleware` → routing → JWT auth → `TenantContextMiddleware` (company from `X-PCS-CompanyId`, validated against live membership; platform admin only via explicit claim) → `[Permission]` policy → application service → repository → `PCSDbContext` (tenant and soft-delete query filters).

## Frontend (`frontend/`, React 19, Vite, TypeScript, MUI)

- `src/api/http.ts` is the single axios client. Base URL comes from `resolveApiBaseUrl`: `/api` for the on-premise build, an absolute HTTPS URL for cloud.
- Feature folders under `src/features/*`; routes in `src/routes/AppRoutes.tsx`; navigation in `components/Sidebar` and `data/menu.ts`.
- Real API clients exist for auth, companies, plants, projects, PMS, setup. Other feature folders have no API client (see FEATURE_MATRIX).

## Deployment models

| Model | Database | Hosting | Status |
|---|---|---|---|
| Windows on-premise | SQLite in `%LOCALAPPDATA%\PCS\Database\PCS.db` | `PCS.API.exe` (self-contained) serving the SPA, started by the launcher; no Windows service | Built and smoke-tested in CI |
| Cloud | SQL Server | API container; SPA on Vercel with `VITE_API_URL=https://…/api`; `Hosting:Mode=Cloud` requires explicit CORS origins and an externally supplied `Jwt:Secret` | Migrations verified in CI; deployment not performed |

## Known architectural concerns

See MASTER_AUDIT: frontend CPM engine alongside backend CPM (F-10); relative default DB path (F-12); commercial modules without backend (F-09).
