namespace PCS.Installer.Models;

public class InstallationManifest
{
    public string ProductName { get; set; }
        = "PCS";

    public string ProductVersion { get; set; }
        = "1.0.0";

    public DateTime InstallDate { get; set; }
        = DateTime.Now;

    public string InstallPath { get; set; }
        = string.Empty;

    public string BackendPath { get; set; }
        = string.Empty;

    public string FrontendPath { get; set; }
        = string.Empty;

    public string DatabasePath { get; set; }
        = string.Empty;

    public DatabaseType DatabaseType { get; set; }

    public InstallationType InstallationType { get; set; }

    public string DatabaseServer { get; set; }
        = string.Empty;

    public string DatabaseName { get; set; }
        = string.Empty;

    public string ApiUrl { get; set; }
        = string.Empty;

    public bool WindowsAuthentication { get; set; }

    public bool InstallationCompleted { get; set; }

    public string MachineName { get; set; }
        = Environment.MachineName;

    public string UserName { get; set; }
        = Environment.UserName;

    public string OperatingSystem { get; set; }
        = Environment.OSVersion.ToString();
}