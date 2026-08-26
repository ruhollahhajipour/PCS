using System.IO;

namespace PCS.Installer.Models;

public class InstallerContext
{
    // ========================================
    // Installation State
    // ========================================

    public InstallationStatus Status { get; set; }
        = InstallationStatus.Pending;


    public bool InstallationCompleted =>
        Status == InstallationStatus.Completed;


    public bool InstallationFailed =>
        Status == InstallationStatus.Failed;


    public bool LicenseAccepted { get; set; }


    public string? ErrorMessage { get; set; }


    // ========================================
    // License / Edition
    // ========================================

    public ProductEdition Edition { get; set; }
        = ProductEdition.Free;


    public string LicenseKey { get; set; }
        = string.Empty;


    public string CompanyName { get; set; }
        = string.Empty;


    public string LicenseId { get; set; }
        = string.Empty;


    public int MaxUsers { get; set; }
        = 20;


    public bool IsProfessional =>
        Edition == ProductEdition.Professional;


    public bool IsFree =>
        Edition == ProductEdition.Free;


    public bool HasValidLicense =>
        IsProfessional &&
        !string.IsNullOrWhiteSpace(LicenseKey);


    // ========================================
    // Installation Configuration
    // ========================================

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


    /*
     * PCS is installed completely inside the
     * current user's LocalAppData.
     *
     * No Administrator privileges are required.
     */

    public string InstallPath { get; set; } =
        Path.Combine(
            Environment.GetFolderPath(
                Environment.SpecialFolder.LocalApplicationData),
            "PCS");


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
    // Launcher
    // ========================================

    public string LauncherPath =>
        Path.Combine(
            InstallPath,
            "Launcher",
            "PCS.Launcher.exe");


    // ========================================
    // Application Icon
    // ========================================

    /*
     * The icon is installed beside PCS itself.
     *
     * This is intentionally NOT taken from the
     * installer's physical PCSSetup.exe location.
     *
     * Desktop and Start Menu shortcuts use this
     * installed ICO file.
     */

    public string IconPath =>
        Path.Combine(
            InstallPath,
            "Resources",
            "PCS.ico");


    // ========================================
    // Database Configuration
    // ========================================

    /*
     * Free / Local edition uses SQLite by default.
     */

    public DatabaseType DatabaseType { get; set; }
        = DatabaseType.SQLite;


    /*
     * Retained for SQL Server / Professional edition.
     */

    public string DatabaseServer { get; set; }
        = "localhost";


    public string DatabaseName { get; set; }
        = "PCS";


    public string Username { get; set; }
        = string.Empty;


    public string Password { get; set; }
        = string.Empty;


    public bool WindowsAuthentication { get; set; }
        = true;


    public string ConnectionString { get; set; }
        = string.Empty;


    // ========================================
    // Application Configuration
    // ========================================

    public string ApiUrl { get; set; }
        = "http://localhost:5000";


    // ========================================
    // Windows Service
    // ========================================

    /*
     * Retained for future Professional / Server
     * deployment.
     *
     * Current Free / Local installation does NOT
     * create a Windows Service.
     */

    public string ServiceName { get; set; }
        = "PCS.API.Service";


    // ========================================
    // Installer Package
    // ========================================

    /*
     * AppContext.BaseDirectory points to the runtime
     * extraction directory of the single-file installer.
     */

    public string InstallerDirectory =>
        Path.GetFullPath(
            AppContext.BaseDirectory);


    public string PublishPath =>
        Path.Combine(
            InstallerDirectory,
            "Resources",
            "Publish");
}