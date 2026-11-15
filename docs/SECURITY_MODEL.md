# Security Model (as audited, 2026-11-04)

Labels: **CI** executed in CI · **READ** read from code · **GAP** required by the directive, not present.

## Authentication
- JWT HS256; issuer, audience, signing key and lifetime validated (READ). Secret comes from configuration; the installer generates a random 64-byte secret per install; Cloud mode refuses to start without an external secret (READ).
- Password hashing: PBKDF2 with strengthened parameters and transparent rehash of legacy hashes on login (CI).
- Login rate limit per IP (READ). Login identifier is a username, not email.
- **GAP:** refresh-token rotation, password reset by one-time emailed code, email verification, account lockout, session management, audit of login/logout.

## Authorization
- Policies are generated from `PermissionProvider.GetAll()`; actions use `[Permission(...)]` (READ). Every action except `/api/health` and login is protected (READ, per-action check).
- Frontend hiding is not a control; the backend decides.
- **GAP:** project-, module-, feature- and operation-level scopes beyond the current permission set; license gate (F-08).

## Multi-tenancy
- Company from `X-PCS-CompanyId`, validated per request against live, active, non-deleted membership and user (CI).
- Platform admin only through an explicit claim, revalidated per request; revoked claims are rejected; platform admins can recover inactive companies (CI).
- Query filters, tenant-aware repository lookups, detached-entity update rejection, activity relationship tenant scope (CI).
- Not yet present: HTTP-level tests that Tenant A cannot read/update/delete Tenant B through every endpoint (directive §4/§14). Existing tests are middleware, repository and service level.

## Transport and exposure
- CORS: explicit origins only; none configured means no cross-origin access; invalid origins stop startup (READ). Not needed for the same-origin on-premise install.
- Swagger: off unless Development or `Swagger:Enabled`; never in Cloud mode (READ).
- Exceptions: details are not returned to clients (CI, `ExceptionMiddlewareTests`).
- SQL Server TLS certificate validation is on by default (READ). Installer connection uses `Encrypt=True;TrustServerCertificate=False` (F-14).
- Dependencies were bumped for patched .NET/SQLite packages; no vulnerability scan was run in this pass.

## Secrets
- None committed in the files reviewed. Installer-generated secrets are written to `Backend\appsettings.json` and `Config\pcs.config.json` with inherited ACLs under the user's LocalAppData (HYP: sufficient isolation; confirm). The bootstrap admin password is blanked after first seeding (CI smoke).
- `appsettings.json` stores the database connection string, including the password for SQL Server authentication, in plain text.

## Audit
- **GAP (F-06):** the audit table and service exist but nothing calls them.

## Priorities
1. Wire audit logging. 2. Lockout, refresh rotation, reset flow with hashed single-use codes and attempt limits. 3. License enforcement filter. 4. HTTP-level tenant tests. 5. Dependency scan (`dotnet list package --vulnerable`, `npm audit`) once NuGet is reachable.
