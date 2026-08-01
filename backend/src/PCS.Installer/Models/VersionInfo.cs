using System.Text.Json.Serialization;

namespace PCS.Installer.Models;

public class VersionInfo
{
    public string ProductName { get; set; } = "PCS";

    public string Version { get; set; } = "1.0.0";

    public DateTime BuildDate { get; set; }
        = DateTime.UtcNow;

    public string BuildNumber { get; set; }
        = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

    public string ApiVersion { get; set; } = "";

    public string FrontendVersion { get; set; } = "";

    public string InstallerVersion { get; set; } = "";

    public string Framework { get; set; } = "net10.0";

    public string Environment { get; set; } = "Release";
}