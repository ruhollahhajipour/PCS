namespace PCS.Installer.Models;

public class InstallationSettings
{
    public InstallationType Type { get; set; }


    public string InstallPath { get; set; } = @"C:\PCS";


    public string ServerName { get; set; } = "localhost";


    public string DatabaseName { get; set; } = "PCS";


    public string ApiUrl { get; set; } = "http://localhost:5000";


    public string DatabasePath =>
        Path.Combine(
            InstallPath,
            "Database",
            $"{DatabaseName}.db");


    public string ConnectionString =>
        $"Data Source={DatabasePath};";


    public bool InstallDatabase { get; set; } = true;


    public bool CreateShortcut { get; set; } = true;
}


public enum InstallationType
{
    Server,
    Client
}