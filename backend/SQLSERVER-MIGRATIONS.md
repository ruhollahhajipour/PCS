# SQL Server migration strategy

PCS keeps the existing SQLite migrations in `PCS.Infrastructure` and uses a separate assembly, `PCS.Infrastructure.Migrations.SqlServer`, for SQL Server migrations.

The SQL Server initial migration is scaffolded from the current `PCSDbContext` model with the SQL Server provider selected explicitly. The migration scaffold workflow builds and tests the solution after generation.

## New SQL Server database

Use `Database:Provider=SqlServer` and the SQL Server connection string. Apply migrations from the SQL Server migration project:

```powershell
$env:Database__Provider = "SqlServer"
$env:ConnectionStrings__DefaultConnection = "Server=...;Database=PCS;..."
dotnet ef database update --project src/PCS.Infrastructure.Migrations.SqlServer --startup-project src/PCS.API --context PCSDbContext
```

## Existing SQL Server installations

Do not apply the new initial migration blindly to a database previously created with the SQLite migration assembly. Existing databases require a verified baseline/adoption and data-preserving upgrade plan. Back up the database and reconcile its `__EFMigrationsHistory` before any upgrade.

## Validation status

Scaffolding and compilation are automated. A real SQL Server migration execution, relational constraint validation, and data-transfer reconciliation are still required before SQL Server is approved for production.
