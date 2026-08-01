namespace PCS.Installer.Models;

public class InstallerContext
{
    // ========================================
    // Installation State
    // ========================================

    public bool InstallationCompleted { get; set; }

    public bool LicenseAccepted { get; set; }


    public InstallationType InstallationType { get; set; }
        = InstallationType.Server;


    public InstallationMode Mode { get; set; }
        = InstallationMode.NewInstall;



    // ========================================
    // Installation Information
    // ========================================

    public string ProductName { get; set; }
        = "PCS";


    public string Version { get; set; }
        = "1.0.0";


    public string InstallPath { get; set; }
        = @"C:\Program Files\PCS";



    // ========================================
    // Deployment Paths
    // ========================================

    public string BackendPath =>
        Path.Combine(
            InstallPath,
            "Backend");


    public string FrontendPath =>
        Path.Combine(
            InstallPath,
            "Frontend");


    public string DatabasePath =>
        Path.Combine(
            InstallPath,
            "Database");


    public string ConfigPath =>
        Path.Combine(
            InstallPath,
            "Config");


    public string LogsPath =>
        Path.Combine(
            InstallPath,
            "Logs");


    public string BackupPath =>
        Path.Combine(
            InstallPath,
            "Backup");


    public string ImportPath =>
        Path.Combine(
            InstallPath,
            "Import");


    public string ExportPath =>
        Path.Combine(
            InstallPath,
            "Export");



    // ========================================
    // Database Configuration
    // ========================================

    public DatabaseType DatabaseType { get; set; }
        = DatabaseType.SqlServer;


    public string DatabaseServer { get; set; }
        = "localhost";


    public string DatabaseName { get; set; }
        = "PCS";


    public string Username { get; set; }
        = "";


    public string Password { get; set; }
        = "";


    public bool WindowsAuthentication { get; set; }



    public string ConnectionString { get; set; }
        = "";



    // ========================================
    // Application Configuration
    // ========================================

    public string ApiUrl { get; set; }
        = "http://localhost:5000";



    // ========================================
    // Windows Service
    // ========================================

    public string ServiceName { get; set; }
        = "PCS.API";



    // ========================================
    // Installer Package
    // ========================================

    public string PublishPath =>
        Path.Combine(
            AppContext.BaseDirectory,
            "Publish");

}