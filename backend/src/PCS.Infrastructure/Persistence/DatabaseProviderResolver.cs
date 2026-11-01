using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace PCS.Infrastructure.Persistence;

public static class DatabaseProviderResolver
{
    public const string ConfigurationKey = "Database:Provider";
    public const string Sqlite = "Sqlite";
    public const string SqlServer = "SqlServer";

    public static string GetProvider(IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        string? provider = configuration[ConfigurationKey];

        if (string.IsNullOrWhiteSpace(provider))
        {
            throw new InvalidOperationException(
                $"PCS database provider is not configured. Set '{ConfigurationKey}' to '{Sqlite}' or '{SqlServer}'.");
        }

        if (string.Equals(provider, Sqlite, StringComparison.OrdinalIgnoreCase))
            return Sqlite;

        if (string.Equals(provider, SqlServer, StringComparison.OrdinalIgnoreCase))
            return SqlServer;

        throw new InvalidOperationException(
            $"Unsupported PCS database provider '{provider}'. Supported values are '{Sqlite}' and '{SqlServer}'.");
    }

    public static void Configure(
        DbContextOptionsBuilder options,
        string provider,
        string connectionString)
    {
        ArgumentNullException.ThrowIfNull(options);

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "PCS database connection string was not configured.");
        }

        if (string.Equals(provider, Sqlite, StringComparison.OrdinalIgnoreCase))
        {
            options.UseSqlite(connectionString);
            return;
        }

        if (string.Equals(provider, SqlServer, StringComparison.OrdinalIgnoreCase))
        {
            options.UseSqlServer(connectionString);
            return;
        }

        throw new InvalidOperationException(
            $"Unsupported PCS database provider '{provider}'.");
    }
}
