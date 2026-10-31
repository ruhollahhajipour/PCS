using Microsoft.EntityFrameworkCore;
using PCS.Infrastructure.Persistence;
using Xunit;

namespace PCS.Application.Tests.Persistence;

public sealed class SqliteNativeSmokeTests
{
    [Fact]
    public void SqliteProvider_CanLoadNativeLibraryAndExecuteQuery()
    {
        var options = new DbContextOptionsBuilder<PCSDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        using var context = new PCSDbContext(options);
        context.Database.OpenConnection();

        using var command = context.Database.GetDbConnection().CreateCommand();
        command.CommandText = "SELECT sqlite_version();";

        var version = command.ExecuteScalar()?.ToString();

        Assert.False(string.IsNullOrWhiteSpace(version));
        Assert.Matches(@"^\d+\.\d+\.\d+", version!);
    }
}
