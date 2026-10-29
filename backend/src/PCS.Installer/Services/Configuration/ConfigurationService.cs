using PCS.Installer.Models;
using System.Text.Json;
using System.Security.Cryptography;

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

        // Required directories
        Directory.CreateDirectory(
            context.ConfigPath);

        Directory.CreateDirectory(
            context.BackendPath);

        string appSettingsFile =
            Path.Combine(context.BackendPath, "appsettings.json");

        bool isNewInstall =
            context.Mode == InstallationMode.NewInstall;

        // Repair and upgrade must preserve the existing API
        // configuration, including JWT signing material.
        if (!isNewInstall && !File.Exists(appSettingsFile))
        {
            throw new FileNotFoundException(
                "Existing PCS API configuration was not found; refusing to regenerate security settings.",
                appSettingsFile);
        }

        // Validate and persist installer/database configuration
        // for all installation modes.
        string connectionString =
            context.ConnectionString;

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "PCS database connection string was not configured.");
        }

        string pcsConfigFile =
            Path.Combine(
                context.ConfigPath,
                "pcs.config.json");

        var pcsConfig = new
        {
            ConnectionString = connectionString,
            Installation = new
            {
                Product = context.ProductName,
                Version = context.Version,
                Type = context.InstallationType.ToString(),
                InstalledAt = DateTime.Now,
                ApiUrl = context.ApiUrl
            }
        };

        WriteJsonFile(
            pcsConfigFile,
            pcsConfig);

        // Security credentials are generated only for a new install.
        // Never regenerate or overwrite them during repair/upgrade.
        if (!isNewInstall)
        {
            return;
        }

        context.JwtSecret =
            Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(64));

        context.InitialAdminPassword =
            Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(24))
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');

        var appSettings = new
        {
            ConnectionStrings = new
            {
                DefaultConnection = connectionString
            },
            Jwt = new
            {
                Secret = context.JwtSecret,
                Issuer = "PCS",
                Audience = "PCS",
                ExpirationMinutes = 480
            },
            InitialAdmin = new
            {
                Username = "admin",
                Password = context.InitialAdminPassword,
                FirstName = "PCS",
                LastName = "Administrator",
                Email = "admin@pcs.local"
            },
            Logging = new
            {
                LogLevel = new
                {
                    Default = "Information",
                    MicrosoftAspNetCore = "Warning"
                }
            },
            AllowedHosts = "*"
        };

        WriteJsonFile(
            appSettingsFile,
            appSettings);
    }

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