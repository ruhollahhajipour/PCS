# Database Design (as audited, 2026-11-04)

## Providers

| Provider | Use | Migrations | Verified |
|---|---|---|---|
| SQLite | Windows on-premise, single workstation | `PCS.Infrastructure/Migrations` (18 migration files, plus designers and snapshot) | Applied to a fresh DB in CI |
| SQL Server | Cloud / network multi-user | `PCS.Infrastructure.Migrations.SqlServer/Migrations`: `InitialSqlServer`, `TenantScopeAndEvmPrecision`, `CompanyUserSoftDeleteMembershipIndex` | Applied to SQL Server 2022 in CI |

Provider is chosen by `Database:Provider`. The installer applies migrations before first start; API startup never migrates (only security seeding runs).
SQLite on a shared network folder is not a supported multi-user setup; a network database (SQL Server or PostgreSQL) needs an owner decision.

## Entity groups

- **Tenancy/security:** Company, CompanyUser (membership, soft-delete aware unique index), User, Role, Permission, RolePermission, UserRole, PasswordResetToken (unused), CompanyAdminRequest, DigitalSignature.
- **Master/project:** Plant, Project, CompanyTheme.
- **Planning:** WbsNode, WbsDictionary, Activity, ActivityCode(+Value), ActivityRelationship, Constraint, Milestone, ProjectCalendar(+Day), ProjectPhase, ProgressEntry, ProjectBaseline, ProjectBaselineActivity.
- **Licensing:** License, LicenseModule.
- **Other:** Cost item, Document, DocumentFolder, DocumentVersion, Notification, AuditLog (never written, F-06).

## Mechanisms

- Tenant global query filters keyed by `ICurrentTenant`; platform admin scope is explicit. Tests in CI (`TenantIsolationTests`).
- Soft delete filters and audit columns in the repository layer. Tests in CI (`SoftDeleteRepositoryTests`).
- Filtered unique index for active primary admin per company, with a provider-specific filter expression (`[IsPrimaryAdmin] = 1 AND [IsActive] = 1` on SQL Server).
- Decimal precision for EVM and WBS metrics (`TenantScopeAndEvmPrecision`).

## Open issues

- **One authoritative DB path (F-12).** Installed: `<install>\Database\PCS.db`. Defaults elsewhere: relative `pcs.db`.
- Not audited in this pass: index coverage for large WBS/activity sets, cascade-delete cycles, concurrency tokens, UTC storage consistency, backup before migration. Required by directive §10.1 and §12.4.
- Backup/restore: an installer `Backup` path and `UpgradeService`/`RollbackService` exist; none are tested.

## Migration rules

1. Never edit an applied migration. Add a new one for each provider.
2. A backup must exist before any destructive migration (installer upgrade path).
3. CI must apply both provider chains on every migration change (already the case).
