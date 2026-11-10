using Microsoft.Data.Sqlite;

namespace PCS.Infrastructure.Persistence;

/// <summary>
/// Makes a SQLite connection string independent of the process working directory.
/// A relative "Data Source" would otherwise create a database next to whatever
/// directory the process happened to start in (for example Backend\pcs.db instead
/// of Database\PCS.db in an installed layout).
/// </summary>
public static class SqliteConnectionPathResolver
{
    public static string MakeAbsolute(
        string connectionString,
        string baseDirectory)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
        ArgumentException.ThrowIfNullOrWhiteSpace(baseDirectory);

        var builder =
            new SqliteConnectionStringBuilder(connectionString);

        string dataSource = builder.DataSource;

        if (string.IsNullOrWhiteSpace(dataSource))
        {
            throw new InvalidOperationException(
                "The PCS SQLite connection string does not specify a Data Source.");
        }

        if (IsInMemoryOrUri(builder, dataSource) ||
            Path.IsPathRooted(dataSource))
        {
            return builder.ConnectionString;
        }

        builder.DataSource =
            Path.GetFullPath(
                Path.Combine(baseDirectory, dataSource));

        return builder.ConnectionString;
    }

    private static bool IsInMemoryOrUri(
        SqliteConnectionStringBuilder builder,
        string dataSource)
    {
        return builder.Mode == SqliteOpenMode.Memory ||
               dataSource.Equals(":memory:", StringComparison.OrdinalIgnoreCase) ||
               dataSource.StartsWith("file:", StringComparison.OrdinalIgnoreCase);
    }
}
