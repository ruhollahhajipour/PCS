# PCS Backend Deployment and Database Operations

## Hosting modes

The API supports explicit hosting modes:

- `Hosting:Mode=OnPremise`: Windows-installed deployment. Windows Service integration is enabled only for an installed PCS instance running on Windows.
- `Hosting:Mode=Cloud`: container/cloud deployment. Windows Service integration and bundled frontend discovery are disabled. Set `Hosting__Mode=Cloud`.

The checked-in configuration defaults to the local Windows installation. Cloud deployments must override environment-specific settings.

## Database provider

The provider is selected explicitly and is never inferred from connection-string text:

- `Database:Provider=Sqlite`
- `Database:Provider=SqlServer`

Environment variables override JSON configuration:

- `Database__Provider`
- `ConnectionStrings__DefaultConnection`

The SQLite default connection string is for local development only. Production connection strings and credentials must be supplied through the deployment environment or a secret manager.

## Schema migration policy

The API does not execute Entity Framework migrations during startup. Apply migrations as a controlled installation/deployment operation before starting the API.

The Windows installer currently applies migrations during its database installation step. For a manual SQLite development migration, run the EF Core CLI from the backend directory:

```powershell
$env:Database__Provider = "Sqlite"
$env:ConnectionStrings__DefaultConnection = "Data Source=pcs.db"
dotnet ef database update --project src/PCS.Infrastructure --startup-project src/PCS.API --context PCSDbContext
```

Do not point SQL Server deployments at the existing SQLite migration set. SQL Server migration generation, its dedicated migration assembly, and migration/data-transfer verification remain a separate readiness gate before SQL Server production use.

## Logging

The API writes structured logs to standard output. On Windows it additionally writes rolling files under the current user's Local AppData PCS Logs directory. Linux/container deployments do not write application log files into the container filesystem.

## CORS and API documentation

CORS uses the exact origins in `Cors:AllowedOrigins`; wildcard origins are not enabled. In Development, the API falls back to `http://localhost:5173` when no origins are configured. Cloud mode refuses to start without an explicit origin allow-list.

Configure cloud origins with environment variables such as `Cors__AllowedOrigins__0=https://your-frontend-domain`. Do not include URL paths in origin entries.

Swagger is enabled only outside Cloud mode and is enabled by default in Development. Cloud mode keeps Swagger disabled. Cloud JWT signing material must be supplied through the `Jwt__Secret` deployment secret environment variable; do not commit it to configuration files.

## Container build and health checks

Build the backend image without publishing it to a registry:

```bash
docker build -f backend/Dockerfile -t pcs-api:local backend
```

The image listens on port `8080` and defaults to `Hosting__Mode=Cloud`. Supply the database provider, connection string, JWT secret, CORS allow-list, and initial administrator bootstrap values through the runtime environment/secret store.

- `/health/live`: process liveness; does not query the database.
- `/health/ready`: readiness; checks that the configured database is reachable.

Apply the selected provider's migrations before starting the API. The container does not mutate the schema at startup. Cloud mode does not scrub or write the checked-in appsettings file.

## Vercel frontend connection

The frontend production build now requires an absolute HTTPS `VITE_API_URL` ending exactly in `/api`. Configure this value separately in the Vercel Preview and Production environments after the real API hostname is available. The checked-in CI value is a non-routable placeholder used only to validate the build; it is not a deployment endpoint.

The SPA rewrite is defined in both the frontend directory and repository root so it works whether the Vercel project's Root Directory is configured as `frontend` or the repository root. No Vercel project settings or environment variables are changed by this repository update.
