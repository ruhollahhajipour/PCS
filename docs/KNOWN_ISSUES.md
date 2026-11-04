# Known Issues

Authoritative detail and evidence: [MASTER_AUDIT.md](MASTER_AUDIT.md). Dated 2026-11-04.

## Open

| ID | Sev | Summary | Workaround |
|---|---|---|---|
| F-05 | High | Hard-coded "Ruhollah" in headers and a mock user on the Users page. | None. |
| F-06 | High | Audit log is never written. | None. |
| F-07 | High | No refresh tokens, password reset, email verification, account lockout, session management. | Admin resets passwords out of band. |
| F-08 | High | License enforcement absent on the backend. | None. |
| F-09 | High | Warehouse, Procurement, Vendors, Materials, Documents, Reports have no backend; Warehouse data lives in browser `localStorage` and is lost with the browser profile. | Do not use for real data. |
| F-10 | Medium | A frontend CPM engine exists; Gantt data source not traced. | |
| F-11 | Medium | Two workspace storage keys. | Clear site data if the selection looks stale. |
| F-13 | Medium | Installed API listens on `localhost:5000` only; no supported multi-user LAN mode. | Single workstation. |
| F-15 | Medium | CPM calendar mapping unverified. | |
| F-16 | Medium | Overlapping open PRs, baseline undecided. | |
| F-17 | Low | Stale committed binaries and placeholder files (list in MASTER_AUDIT F-17; `PublishService.cs` is in use and must stay). Deletion awaits owner approval. | |
| F-18 | Low | Anonymous `/api/health` exposes version. | |
| F-19 | Low | Thin frontend tests. | |

## Fixed in this remediation

| ID | Fix | Commit |
|---|---|---|
| F-01 | Same-origin `/api` accepted in production builds. | `b7f7e26` |
| F-02 | Reproducible self-contained installer build and CI smoke test. | `c3a660f` |
| F-03 | Windows/macOS native bindings added to the frontend lockfile. | `aa13a22` |
| F-04 | SQL Server credential escaping; logging category. | `cd0f606` |
| F-12 | Relative SQLite paths resolved against `<root>\Database`; no default connection string in shipped settings; CI checks. Design-time factory and DbCheck tools still use a relative dev path. | `b43d651` |
| F-14 | Explicit "Trust server certificate" option, default off. | `084aa73` |
| F-20 | Release builder builds the frontend for same-origin `/api`. | `1c6d6e9` |

## Build-environment limits

- The audit sandbox cannot reach `api.nuget.org` (proxy returns 403), so the backend cannot be built or tested locally there. Backend validation relies on GitHub Actions. An approved NuGet mirror or allowlist entry is needed for local .NET work.
- `PCS.Installer` targets Windows; on Linux it needs `EnableWindowsTargeting=true`.
- `dotnet restore` of the whole solution on Linux fails for the same reason; restore the individual projects instead.
