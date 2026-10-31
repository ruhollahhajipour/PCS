using PCS.Installer.Models;
using PCS.Installer.Services.Database;

namespace PCS.Installer.Services.Pipeline;

public sealed class DatabaseStep : IInstallationStep
{
    private readonly DatabaseInstallerService databaseInstallerService;


    public DatabaseStep()
    {
        databaseInstallerService =
            new DatabaseInstallerService();
    }


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


        try
        {
            if (context.DatabaseType ==
                DatabaseType.SQLite)
            {
                progress?.Report(
                    "SQLite database selected.");
            }
            else
            {
                progress?.Report(
                    "SQL Server database selected.");
            }


            progress?.Report(
                "Creating database...");


            await Task.Run(
                () =>
                {
                    databaseInstallerService
                        .CreateDatabase(context);
                });


            progress?.Report(
                "Database configured successfully.");
        }
        catch (Exception ex)
        {
            progress?.Report(
                $"Database configuration failed: {ex.Message}");

            throw;
        }
    }
}