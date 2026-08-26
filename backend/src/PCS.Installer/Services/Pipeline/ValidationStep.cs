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


        // ============================================================
        // Installation Path
        // ============================================================

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


        // ============================================================
        // Database Validation
        // ============================================================

        if (context.DatabaseType == DatabaseType.SqlServer)
        {
            if (string.IsNullOrWhiteSpace(
                    context.DatabaseServer))
            {
                throw new InvalidOperationException(
                    "SQL Server name is required.");
            }


            if (string.IsNullOrWhiteSpace(
                    context.DatabaseName))
            {
                throw new InvalidOperationException(
                    "Database name is required.");
            }


            /*
             * PCS default installation behavior:
             *
             * If the user did not provide SQL credentials,
             * use Windows Authentication.
             *
             * This is especially important for a normal local
             * SQL Server installation where a separate SQL Login
             * has not been created for PCS.
             */
            if (!context.WindowsAuthentication &&
                string.IsNullOrWhiteSpace(context.Username) &&
                string.IsNullOrWhiteSpace(context.Password))
            {
                context.WindowsAuthentication = true;
            }


            // ========================================================
            // Windows Authentication
            // ========================================================

            if (context.WindowsAuthentication)
            {
                /*
                 * Username and password are intentionally not
                 * required when Windows Authentication is enabled.
                 */

                progress?.Report(
                    "Using Windows Authentication.");
            }


            // ========================================================
            // SQL Server Authentication
            // ========================================================

            else
            {
                if (string.IsNullOrWhiteSpace(
                        context.Username))
                {
                    throw new InvalidOperationException(
                        "SQL username is required.");
                }


                if (string.IsNullOrWhiteSpace(
                        context.Password))
                {
                    throw new InvalidOperationException(
                        "SQL password is required.");
                }
            }
        }


        // ============================================================
        // SQLite
        // ============================================================

        else
        {
            if (string.IsNullOrWhiteSpace(
                    context.DatabaseName))
            {
                throw new InvalidOperationException(
                    "Database name is required.");
            }
        }


        // ============================================================
        // Final diagnostic information
        // ============================================================

        progress?.Report(
            $"Database: {context.DatabaseType}");

        if (context.DatabaseType == DatabaseType.SqlServer)
        {
            progress?.Report(
                $"SQL Server: {context.DatabaseServer}");

            progress?.Report(
                $"Database: {context.DatabaseName}");

            progress?.Report(
                $"Windows Authentication: {context.WindowsAuthentication}");
        }


        return Task.CompletedTask;
    }
}