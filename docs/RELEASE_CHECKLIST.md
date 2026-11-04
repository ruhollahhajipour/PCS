# Release Checklist

Mark an item only with evidence (CI run id, or a recorded manual result). State at 2026-11-04.

## Build
- [x] `build-release.ps1` produces `PCSSetup.exe` from a clean checkout (CI 41634830553)
- [x] API self-contained win-x64
- [ ] Reproducible: two builds from the same commit give a documented SHA-256 comparison
- [ ] Version number bumped and tagged (currently `1.0.0` in `installer/build.props` and csproj)
- [ ] Code signing decision (no certificate purchase without approval)

## Clean Windows (manual or VM; not yet run)
- [ ] New install by wizard without admin rights; shortcut works
- [ ] First start, admin login with the generated password, forced password change
- [ ] Create company, plant, project, WBS, activities, relationships; Gantt and reports show data
- [ ] Close and reopen; data and session behavior as designed
- [ ] Backup created; restore tested
- [ ] Upgrade from the previous build keeps database, users, roles, licenses, config, documents, audit
- [ ] Failed-upgrade rollback works
- [ ] Uninstall keeps user data; reinstall reattaches to it
- [ ] SQL Server mode against a trusted-certificate server

## Quality gates
- [x] CI green: backend tests, frontend, migrations (SQLite + SQL Server)
- [ ] No open Critical/High findings (open: F-05, F-06, F-07, F-08, F-09)
- [ ] HTTP-level tenant isolation tests
- [ ] Performance run on a large WBS (record results in TEST_REPORT)
- [ ] Dependency vulnerability scan (NuGet, npm)
- [ ] Audit log demonstrates login, permission, project and license events

## Documentation
- [x] MASTER_AUDIT, ARCHITECTURE, FEATURE_MATRIX, KNOWN_ISSUES, DEVELOPMENT_ROADMAP, DATABASE_DESIGN, SECURITY_MODEL, INSTALLATION
- [ ] User guide and administrator guide (the `Manual_*.pdf` files in the installer are 0 bytes)
- [ ] Golden Master commit and artifact hash recorded here
