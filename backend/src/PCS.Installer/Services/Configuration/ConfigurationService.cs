using PCS.Installer.Models;
using System.Text.Json;

namespace PCS.Installer.Services.Configuration;

public class ConfigurationService
{
    public void Create(
        InstallerContext context)
    {
        Directory.CreateDirectory(
            context.ConfigPath);



        string file =
            Path.Combine(
                context.ConfigPath,
                "pcs.config.json");



        string connectionString;



        if (context.DatabaseType == DatabaseType.SqlServer)
        {
            if (context.WindowsAuthentication)
            {
                connectionString =
                    $"Server={context.DatabaseServer};" +
                    $"Database={context.DatabaseName};" +
                    $"Trusted_Connection=True;" +
                    $"TrustServerCertificate=True;";
            }
            else
            {
                connectionString =
                    $"Server={context.DatabaseServer};" +
                    $"Database={context.DatabaseName};" +
                    $"User Id={context.Username};" +
                    $"Password={context.Password};" +
                    $"TrustServerCertificate=True;";
            }
        }
        else
        {
            connectionString =
                $"Data Source={Path.Combine(
                    context.DatabasePath,
                    $"{context.DatabaseName}.db")}";
        }



        context.ConnectionString =
            connectionString;



        var config =
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



        string json =
            JsonSerializer.Serialize(
                config,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });



        File.WriteAllText(
            file,
            json);
    }
}