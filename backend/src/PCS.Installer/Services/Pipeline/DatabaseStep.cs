using Microsoft.EntityFrameworkCore;
using PCS.Infrastructure.Persistence;
using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class DatabaseStep : IInstallationStep
{
    public string Name =>
        "Configuring database";


    public int Progress =>
        80;



    public async Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(
            "Preparing database...");



        if (context.DatabaseType != DatabaseType.SqlServer)
        {
            await CreateSqliteDatabaseAsync(
                context,
                progress);
        }
        else
        {
            progress?.Report(
                "SQL Server database selected.");

            await Task.CompletedTask;
        }



        progress?.Report(
            "Database configured successfully.");
    }





    private async Task CreateSqliteDatabaseAsync(
        InstallerContext context,
        IProgress<string>? progress)
    {
        Directory.CreateDirectory(
            context.DatabasePath);



        string databaseFile =
            Path.Combine(
                context.DatabasePath,
                $"{context.DatabaseName}.db");



        string connectionString =
            $"Data Source={databaseFile}";



        context.ConnectionString =
            connectionString;



        progress?.Report(
            "Creating SQLite database...");



        var options =
            new DbContextOptionsBuilder<PCSDbContext>()
                .UseSqlite(connectionString)
                .Options;



        await using var db =
            new PCSDbContext(options);



        progress?.Report(
            "Applying database migrations...");



        await db.Database.MigrateAsync();



        progress?.Report(
            "SQLite database created successfully.");
    }
}