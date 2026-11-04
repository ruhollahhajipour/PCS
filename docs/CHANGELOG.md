# Changelog

Historic entries are in `docs/03-Roadmap/CHANGELOG.md` (empty at audit time). This file starts at the remediation branch.

## Unreleased (`ai/pcs-independent-remediation`)

### Fixed
- Frontend: production builds accept the same-origin `/api` base so the installed app loads (`b7f7e26`).
- Installer: release script builds exactly the inputs `PCS.Installer.csproj` requires; API published self-contained win-x64; native command failures stop the script (`c3a660f`).
- Frontend: lockfile now includes the Windows/macOS native bindings for rolldown and lightningcss; `.npmrc` sets `legacy-peer-deps=true` (`aa13a22`).
- Installer: SQL Server connection string built with `SqlConnectionStringBuilder`; `Microsoft.AspNetCore` log category written correctly (`cd0f606`).

### Fixed (stage A)
- Relative SQLite paths no longer depend on the working directory; installed layouts resolve to `<root>\Database`; the shipped `appsettings.json` has no default connection string, so a missing configuration fails fast (`b43d651`).
- Installer: explicit "Trust server certificate" option for SQL Server, default off, with an actionable certificate error (`084aa73`).
- Installer release builder builds the frontend for same-origin `/api` (`1c6d6e9`).

### Added
- CI workflow `Installer Build and Smoke Test` (Windows): builds `PCSSetup.exe`, uploads it, and smoke-tests an installed layout with SQLite (`c3a660f`).
- Audit and control documentation under `docs/`.

### Earlier on this branch (before this audit, from PR #24)
Tenant and membership hardening, soft-delete filters, password hash strengthening, login rate limiting, exception detail suppression, patched dependencies, and related tests.
