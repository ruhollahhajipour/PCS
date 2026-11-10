# Decision Log

| Date | Decision | Reason | Owner approval |
|---|---|---|---|
| 2026-11-03 | Accept same-origin `/api` as a valid production API base; cloud still requires absolute HTTPS | On-premise API serves the SPA; installed app was unusable otherwise | Within directive scope |
| 2026-11-03 | Publish `PCS.API` self-contained win-x64 in the release script (not by changing the csproj) | Target machines must not need .NET; reversible by editing one script | Within directive scope (§12.3) |
| 2026-11-03 | Add missing optional platform packages to `package-lock.json` without changing any locked version; add `frontend/.npmrc` `legacy-peer-deps=true` | Windows build crashed; full regeneration would have moved 16 versions; plain `npm ci` failed on peer ranges that CI already bypassed with the same flag | User approved pushing and fixing |
| 2026-11-03 | Fast-forwarded the local branch onto the remote remediation branch; stash `pre-existing local designer edit` preserved | Remote was ahead and contained the same designer fix | User approved |
| 2026-11-04 | Treat the audit as documentation-first; no feature work before the baseline decision (F-16) | Overlapping PRs would make migrations conflict | Pending owner confirmation |
| 2026-11-05 | Relative SQLite paths resolve against `<root>\Database` when installed and the current directory otherwise; the shipped `appsettings.json` carries no connection string | A silent default created `Backend\pcs.db` when installer config was missing; failing fast is safer | Within directive scope (§10.2) |
| 2026-11-05 | "Trust server certificate" is an explicit, default-off wizard option | Keeps TLS validation secure by default while allowing self-signed servers knowingly | Within directive scope |
| 2026-11-05 | Stale artifacts are listed, not deleted | Directive and prompt require owner approval before deleting files | Pending approval |
| 2026-11-09 | Refresh token is returned in the JSON body and kept in `localStorage`, not an HttpOnly cookie | The SPA already keeps the access token there; a cookie would need credentialed CORS for dev and cloud origins. Revisit when moving to HttpOnly cookies for both tokens | Within directive scope |
| 2026-11-09 | Schema changes are scaffolded by CI (`$pending` list), one migration per commit | `dotnet ef` cannot run in the authoring sandbox | Within directive scope |
| Open | Network database for multi-user (SQL Server vs PostgreSQL) | Directive §10 requires an owner decision | Pending |
| Open | Email transport for password reset | Directive §13: no paid service without approval | Pending |
| Open | License activation model | Online/offline design | Pending |
