using PCS.Installer.Models;
using System.Text.Json;

namespace PCS.Installer.Services.Configuration;

public class ConfigurationService
{
    public void Create(
        InstallerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }


        // ==================================================
        // Required directories
        // ==================================================

        Directory.CreateDirectory(
            context.ConfigPath);

        Directory.CreateDirectory(
            context.BackendPath);


        // ==================================================
        // Database configuration
        // ==================================================

        string connectionString =
            context.ConnectionString;

        if (string.IsNullOrWhiteSpace(
                connectionString))
        {
            throw new InvalidOperationException(
                "PCS database connection string was not configured.");
        }


        // ==================================================
        // PCS installer configuration
        // ==================================================

        string pcsConfigFile =
            Path.Combine(
                context.ConfigPath,
                "pcs.config.json");


        var pcsConfig =
            new
            {
                ConnectionString =
                    connectionString,

                Installation =
                    new
                    {
                        Product =
                            context.ProductName,

                        Version =
                            context.Version,

                        Type =
                            context.InstallationType.ToString(),

                        InstalledAt =
                            DateTime.Now,

                        ApiUrl =
                            context.ApiUrl
                    }
            };


        WriteJsonFile(
            pcsConfigFile,
            pcsConfig);


        // ==================================================
        // ASP.NET Core API configuration
        // ==================================================

        string appSettingsFile =
            Path.Combine(
                context.BackendPath,
                "appsettings.json");


        var appSettings =
            new
            {
                // --------------------------------------------------
                // Database
                // --------------------------------------------------

                ConnectionStrings =
                    new
                    {
                        DefaultConnection =
                            connectionString
                    },


                // --------------------------------------------------
                // JWT Authentication
                // --------------------------------------------------

                Jwt =
                    new
                    {
                        Secret =
                            "PCS-Development-Only-Secret-Change-Before-Release-2026",

                        Issuer =
                            "PCS",

                        Audience =
                            "PCS",

                        ExpirationMinutes =
                            480
                    },


                // --------------------------------------------------
                // Initial Administrator
                //
                // IMPORTANT:
                // This is intentionally the installer default.
                // SecuritySeed sets MustChangePassword = true
                // for a newly-created administrator.
                // Existing administrator passwords are NEVER
                // overwritten by SecuritySeed.
                // --------------------------------------------------

                InitialAdmin =
                    new
                    {
                        Username =
                            "admin",

                        Password =
                            "admin123",

                        FirstName =
                            "PCS",

                        LastName =
                            "Administrator",

                        Email =
                            "admin@pcs.local"
                    },


                // --------------------------------------------------
                // Logging
                // --------------------------------------------------

                Logging =
                    new
                    {
                        LogLevel =
                            new
                            {
                                Default =
                                    "Information",

                                MicrosoftAspNetCore =
                                    "Warning"
                            }
                    },


                // --------------------------------------------------
                // ASP.NET Core
                // --------------------------------------------------

                AllowedHosts =
                    "*"
            };


        WriteJsonFile(
            appSettingsFile,
            appSettings);
    }


    // ==========================================================
    // JSON helper
    // ==========================================================

    private static void WriteJsonFile<T>(
        string filePath,
        T value)
    {
        string json =
            JsonSerializer.Serialize(
                value,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });


        File.WriteAllText(
            filePath,
            json);
    }
}