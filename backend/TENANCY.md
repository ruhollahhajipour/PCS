# Tenant isolation and company-scoped authorization

## Request context

Authenticated requests are assigned a tenant context by `TenantContextMiddleware`. The middleware validates the signed `company_id` claim against an active company and, for non-platform users, verifies an active `CompanyUser` membership. If the optional `X-PCS-CompanyId` header is supplied, it must match the signed company claim. Platform administrators may use the header to establish a company context when their token has no selected company.

## Authorization scope

Login tokens contain only platform-level permissions and permissions granted by the selected company. The token carries `company_id`; changing the active company requires `POST /api/auth/select-company`, which validates membership and issues a replacement token.

Platform access is represented by an explicit `platform_admin=true` claim derived from a Platform-scoped `SUPER_ADMIN` assignment. A role name alone is not sufficient to bypass tenant checks.

## Data filters

EF Core query filters scope Plant, Project, PMS/WBS/scheduling/baseline/progress records, company administration requests, licenses, audit records, user roles, notifications, and digital signatures. Generic repository key lookups use LINQ queries so they do not bypass global query filters.

Company discovery returns only the current user's active memberships; platform administrators can discover all companies. Company profile updates require the primary company administrator or platform administration. Hard deletion of a company is platform-administrator-only.

## Operational limitation

Tenant isolation is covered by an SQLite integration test with two companies, including project, plant, WBS, activity, and repository key-lookup checks. A full endpoint-level authorization matrix and SQL Server tenant isolation run remain required before SaaS production release.
