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
