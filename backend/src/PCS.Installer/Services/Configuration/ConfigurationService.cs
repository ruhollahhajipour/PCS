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


        Directory.CreateDirectory(
            context.ConfigPath);


        Directory.CreateDirectory(
            context.BackendPath);


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


        string pcsConfigJson =
            JsonSerializer.Serialize(
                pcsConfig,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });


        File.WriteAllText(
            pcsConfigFile,
            pcsConfigJson);


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
                ConnectionStrings =
                    new
                    {
                        DefaultConnection =
                            connectionString
                    },

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

                AllowedHosts =
                    "*"
            };


        string appSettingsJson =
            JsonSerializer.Serialize(
                appSettings,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });


        File.WriteAllText(
            appSettingsFile,
            appSettingsJson);
    }
}