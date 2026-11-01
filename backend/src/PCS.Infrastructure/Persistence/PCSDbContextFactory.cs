using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PCS.Infrastructure.Persistence;

public sealed class PCSDbContextFactory
    : IDesignTimeDbContextFactory<PCSDbContext>
{
    public PCSDbContext CreateDbContext(string[] args)
    {
        var configuration =
            new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .Build();

        string provider =
            Environment.GetEnvironmentVariable("Database__Provider")
            ?? configuration[DatabaseProviderResolver.ConfigurationKey]
            ?? DatabaseProviderResolver.Sqlite;

        string? configuredConnectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? configuration.GetConnectionString("DefaultConnection");

        string connectionString =
            configuredConnectionString
            ?? (string.Equals(provider, DatabaseProviderResolver.Sqlite, StringComparison.OrdinalIgnoreCase)
                ? "Data Source=pcs.db"
                : throw new InvalidOperationException(
                    "PCS SQL Server connection string was not configured."));

        var optionsBuilder =
            new DbContextOptionsBuilder<PCSDbContext>();

        DatabaseProviderResolver.Configure(
            optionsBuilder,
            provider,
            connectionString);

        return new PCSDbContext(optionsBuilder.Options);
    }
}
