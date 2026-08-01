using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class ValidationStep : IInstallationStep
{
    public string Name =>
        "Validating installation...";

    public int Progress =>
        5;

    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);

        if (string.IsNullOrWhiteSpace(context.InstallPath))
        {
            throw new InvalidOperationException(
                "Installation path is required.");
        }

        if (!Path.IsPathRooted(context.InstallPath))
        {
            throw new InvalidOperationException(
                "Installation path must be an absolute path.");
        }

        if (context.DatabaseType == DatabaseType.SqlServer)
        {
            if (string.IsNullOrWhiteSpace(context.DatabaseServer))
            {
                throw new InvalidOperationException(
                    "SQL Server name is required.");
            }

            if (string.IsNullOrWhiteSpace(context.DatabaseName))
            {
                throw new InvalidOperationException(
                    "Database name is required.");
            }

            if (!context.WindowsAuthentication)
            {
                if (string.IsNullOrWhiteSpace(context.Username))
                {
                    throw new InvalidOperationException(
                        "SQL username is required.");
                }

                if (string.IsNullOrWhiteSpace(context.Password))
                {
                    throw new InvalidOperationException(
                        "SQL password is required.");
                }
            }
        }
        else
        {
            if (string.IsNullOrWhiteSpace(context.DatabaseName))
            {
                throw new InvalidOperationException(
                    "Database name is required.");
            }
        }

        return Task.CompletedTask;
    }
}