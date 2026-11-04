using Microsoft.Data.Sqlite;
using PCS.Infrastructure.Persistence;

namespace PCS.Application.Tests.Persistence;

public sealed class SqliteConnectionPathResolverTests
{
    private static readonly string BaseDirectory =
        Path.Combine(Path.GetTempPath(), "pcs-resolver-tests", "Database");

    [Fact]
    public void Relative_data_source_is_resolved_against_the_base_directory()
    {
        string result =
            SqliteConnectionPathResolver.MakeAbsolute("Data Source=PCS.db", BaseDirectory);

        string dataSource = new SqliteConnectionStringBuilder(result).DataSource;

        Assert.True(Path.IsPathRooted(dataSource));
        Assert.Equal(Path.Combine(BaseDirectory, "PCS.db"), dataSource);
    }

    [Fact]
    public void Absolute_data_source_is_left_unchanged()
    {
        string absolute = Path.Combine(Path.GetTempPath(), "elsewhere", "PCS.db");

        string result =
            SqliteConnectionPathResolver.MakeAbsolute($"Data Source={absolute}", BaseDirectory);

        Assert.Equal(absolute, new SqliteConnectionStringBuilder(result).DataSource);
    }

    [Fact]
    public void Resolution_does_not_depend_on_the_current_directory()
    {
        string original = Directory.GetCurrentDirectory();
        string other = Path.GetTempPath();

        try
        {
            string before =
                SqliteConnectionPathResolver.MakeAbsolute("Data Source=pcs.db", BaseDirectory);

            Directory.SetCurrentDirectory(other);

            string after =
                SqliteConnectionPathResolver.MakeAbsolute("Data Source=pcs.db", BaseDirectory);

            Assert.Equal(before, after);
        }
        finally
        {
            Directory.SetCurrentDirectory(original);
        }
    }

    [Theory]
    [InlineData("Data Source=:memory:")]
    [InlineData("Data Source=file:pcs?mode=memory&cache=shared")]
    [InlineData("Data Source=pcs;Mode=Memory;Cache=Shared")]
    public void In_memory_and_uri_sources_are_not_rewritten(string connectionString)
    {
        string expected =
            new SqliteConnectionStringBuilder(connectionString).DataSource;

        string result =
            SqliteConnectionPathResolver.MakeAbsolute(connectionString, BaseDirectory);

        Assert.Equal(expected, new SqliteConnectionStringBuilder(result).DataSource);
    }

    [Fact]
    public void Other_connection_string_options_are_preserved()
    {
        string result =
            SqliteConnectionPathResolver.MakeAbsolute(
                "Data Source=PCS.db;Cache=Shared;Foreign Keys=True",
                BaseDirectory);

        var parsed = new SqliteConnectionStringBuilder(result);

        Assert.Equal(SqliteCacheMode.Shared, parsed.Cache);
        Assert.True(parsed.ForeignKeys);
    }

    [Fact]
    public void Missing_data_source_is_rejected()
    {
        Assert.Throws<InvalidOperationException>(() =>
            SqliteConnectionPathResolver.MakeAbsolute("Cache=Shared", BaseDirectory));
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    public void Blank_inputs_are_rejected(string blank)
    {
        Assert.ThrowsAny<ArgumentException>(() =>
            SqliteConnectionPathResolver.MakeAbsolute(blank, BaseDirectory));

        Assert.ThrowsAny<ArgumentException>(() =>
            SqliteConnectionPathResolver.MakeAbsolute("Data Source=pcs.db", blank));
    }
}
