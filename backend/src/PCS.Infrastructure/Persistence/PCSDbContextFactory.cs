using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PCS.Infrastructure.Persistence;

public sealed class PCSDbContextFactory
    : IDesignTimeDbContextFactory<PCSDbContext>
{
    public PCSDbContext CreateDbContext(
        string[] args)
    {
        var configuration =
            new ConfigurationBuilder()
                .SetBasePath(
                    Directory.GetCurrentDirectory())
                .AddJsonFile(
                    "appsettings.json",
                    optional: true)
                .Build();


        string connectionString =
            configuration.GetConnectionString(
                "DefaultConnection")
            ??
            "Data Source=pcs.db";


        var optionsBuilder =
            new DbContextOptionsBuilder<PCSDbContext>();


        ConfigureDatabase(
            optionsBuilder,
            connectionString);


        return new PCSDbContext(
            optionsBuilder.Options);
    }


    // ========================================
    // Database Provider
    // ========================================

    private static void ConfigureDatabase(
        DbContextOptionsBuilder options,
        string connectionString)
    {
        if (IsSqlServerConnectionString(
                connectionString))
        {
            options.UseSqlServer(
                connectionString);

            return;
        }


        if (IsSqliteConnectionString(
                connectionString))
        {
            options.UseSqlite(
                connectionString);

            return;
        }


        throw new InvalidOperationException(
            "Unsupported PCS database connection string. " +
            "The connection string must represent either " +
            "SQL Server or SQLite.");
    }


    // ========================================
    // SQL Server Detection
    // ========================================

    private static bool IsSqlServerConnectionString(
        string connectionString)
    {
        return
            connectionString.Contains(
                "Server=",
                StringComparison.OrdinalIgnoreCase)
            ||
            (
                connectionString.Contains(
                    "Data Source=",
                    StringComparison.OrdinalIgnoreCase)
                &&
                (
                    connectionString.Contains(
                        "Initial Catalog=",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    connectionString.Contains(
                        "Database=",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    connectionString.Contains(
                        "Trusted_Connection=",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    connectionString.Contains(
                        "TrustServerCertificate=",
                        StringComparison.OrdinalIgnoreCase)
                    ||
                    connectionString.Contains(
                        "User Id=",
                        StringComparison.OrdinalIgnoreCase)
                )
            );
    }


    // ========================================
    // SQLite Detection
    // ========================================

    private static bool IsSqliteConnectionString(
        string connectionString)
    {
        return
            connectionString.Contains(
                "Data Source=",
                StringComparison.OrdinalIgnoreCase)
            &&
            !connectionString.Contains(
                "Server=",
                StringComparison.OrdinalIgnoreCase)
            &&
            !connectionString.Contains(
                "Initial Catalog=",
                StringComparison.OrdinalIgnoreCase)
            &&
            !connectionString.Contains(
                "Trusted_Connection=",
                StringComparison.OrdinalIgnoreCase)
            &&
            !connectionString.Contains(
                "TrustServerCertificate=",
                StringComparison.OrdinalIgnoreCase)
            &&
            !connectionString.Contains(
                "User Id=",
                StringComparison.OrdinalIgnoreCase);
    }
}