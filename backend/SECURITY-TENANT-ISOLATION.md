# Tenant isolation audit and implementation gate

## Status

**Release blocker — tenant isolation is not yet enforced end-to-end.**

This document records findings from the repository audit at the time of writing. It is not a claim that an exploit has been executed.

## Confirmed implementation findings

1. `AuthService.BuildLoginResponseAsync` loads active user roles, but derives permissions from all those roles without filtering `UserRole.CompanyId` or validating an active `CompanyUser` membership for the requested tenant.
2. `JwtService.GenerateToken` emits global role and permission claims. It does not emit an active company/tenant claim or scope-specific role claims.
3. Authorization policies in `PCS.API/Program.cs` require only a permission claim. They do not evaluate tenant membership or the tenant scope of the role that granted the permission.
4. `ProjectService.GetAllAsync` and `GetByIdAsync` use an unscoped generic repository. Project create/update operations accept `CompanyId` from the request without validating the caller's membership in that company.
5. `PlantService.GetAllAsync` returns all active plants; company filtering exists only in a separate method and is not the default controller route. Plant create/update does not verify the caller's company membership.
6. `CompaniesController`, `ProjectsController`, `PlantsController`, and PMS controllers rely on global permission claims. PMS routes with a `projectId` do not perform a shared project-to-company authorization check.
7. The schema contains `CompanyUser` active memberships and `UserRole.CompanyId`, but the audited authentication and resource authorization paths do not consistently use these fields.
8. The frontend HTTP client sends the selected workspace as `X-PCS-CompanyId` (from local storage), but the audited API pipeline does not validate or bind this header to an authenticated membership. Treating it as authoritative without server-side validation would allow tenant spoofing.

## Required design before implementation

- Introduce an explicit tenant-selection contract for users with multiple company memberships. A tenant identifier must never be trusted merely because it appears in a route, query string, or request DTO.
- Validate the selected company against an active `CompanyUser` membership, except for an explicitly defined Platform administrator policy.
- Resolve roles and permissions in the context of the selected tenant. Platform-scoped roles must be treated separately from Company-scoped roles.
- Define whether Project-scoped roles apply to a project or to every project in a company. The current `UserRole` model has `CompanyId` but no `ProjectId`; this must be resolved before enforcing Project scope.
- Add resource authorization for every project, WBS, activity, baseline, progress, EVM, Gantt, import and export operation. Resolve child resource IDs to their owning project before authorizing.
- Scope company, plant, project and user-management queries at the data-access boundary; do not rely solely on frontend filtering or controller route conventions.
- Validate that a Plant belongs to the same Company as the Project that references it.
- Keep platform administration as an explicit, audited bypass; do not infer it from a generic permission claim alone.

## Acceptance criteria

1. A user with no active membership in Company B cannot read, create, update or delete Company B resources even when they submit Company B's IDs.
2. A user active only in Company A cannot access Company B Projects, Plants, WBS nodes, Activities, Relationships, Baselines, Progress entries, EVM or exported PDF/Excel.
3. A user cannot use an ActivityId, WbsId or BaselineId from another Project to bypass project-level checks.
4. A Company Admin in Company A cannot administer Company B users or change Company B's primary administrator.
5. A Project-scoped role cannot access a project outside its explicitly assigned scope.
6. A Platform administrator can perform cross-tenant operations only through a separately defined platform policy, with audit attribution.
7. Automated integration tests cover positive and negative cases for both SQLite and SQL Server providers.

## Rollout and data safety

- Do not enable a tenant enforcement switch that silently denies existing legitimate users until membership and role assignments have been audited and reconciled.
- Do not backfill memberships or role scopes with guessed company IDs.
- Run a read-only data consistency report before any migration or backfill.
- Deploy tenant enforcement with a documented rollback plan and an audit trail for privileged cross-tenant actions.
