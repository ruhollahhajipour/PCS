# PCS Development Startup

Run from the repository root in PowerShell:

```powershell
npm install --prefix frontend
.\scripts\start-dev.ps1
```

The script starts the API on `http://localhost:5201` and Vite on
`http://localhost:5173`. Open the Vite URL. Vite proxies `/api` to port
5201.

## Frontend-only visual preview

For a no-backend preview, start only Vite:

```powershell
npm install --prefix frontend
npm run dev --prefix frontend
```

Then open `http://localhost:5173/preview`.

The public `/preview` route renders a separate read-only dashboard with
fictional sample data. It does not call the API, authenticate a user, or access
PCS database records. It does not unlock or bypass any protected application
route. Use the normal `/` or `/login` routes for the authenticated application.

## Database safety

API startup currently runs EF Core `MigrateAsync()` and `SecuritySeed.SeedAsync()`.
The startup script therefore requires typing `START` and uses a separate
SQLite file at:

`%LOCALAPPDATA%\PCS\Development\PCS-Development.db`

It asks for a development administrator username and password; the password
must contain at least 12 characters. These values are passed to the API process
through environment variables and are not written by this script into
`appsettings.json`.

If `backend\src\PCS.API\Config\pcs.config.json` exists, the script stops.
The current API startup code loads that installer configuration after normal
configuration providers and assigns its connection string explicitly, so it
would override the isolated development connection. Do not bypass this guard
unless that configuration has been reviewed and safely isolated.

The script also refuses to start if ports 5173 or 5201 are already occupied.
It checks that frontend dependencies (including Vite) are installed first.

## Logs and shutdown

Process IDs and logs are written under the ignored local folder `.pcs-dev\`.
Use:

```powershell
.\scripts\stop-dev.ps1
```

The stop script terminates the recorded process trees. If startup fails, inspect
`api.stderr.log`, `api.stdout.log`, `frontend.stderr.log`, and
`frontend.stdout.log` in `.pcs-dev\`.

## Current limitations

- This is a development launcher, not the Windows installer or production launcher.
- The API still performs migrations and security seeding, but only after the
  explicit confirmation and against the isolated development database.
- The `/preview` page is a static visual preview only; authenticated,
  data-backed workflows still require the API.
- The lockfile currently omits the declared `vitest` dependency. Regenerate
  `frontend/package-lock.json` with the repository's supported npm version
  before relying on clean `npm ci` test setup.
