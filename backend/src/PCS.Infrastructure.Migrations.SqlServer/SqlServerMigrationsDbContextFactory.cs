using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Migrations.SqlServer;

public sealed class SqlServerMigrationsDbContextFactory
    : IDesignTimeDbContextFactory<PCSDbContext>
{
    public PCSDbContext CreateDbContext(string[] args)
    {
        string connectionString =
            Environment.GetEnvironmentVariable(
                "ConnectionStrings__DefaultConnection")
            ?? throw new InvalidOperationException(
                "SQL Server migration design-time connection string was not configured.");

        var options =
            new DbContextOptionsBuilder<PCSDbContext>();

        DatabaseProviderResolver.Configure(
            options,
            DatabaseProviderResolver.SqlServer,
            connectionString);

        return new PCSDbContext(options.Options);
    }
}
