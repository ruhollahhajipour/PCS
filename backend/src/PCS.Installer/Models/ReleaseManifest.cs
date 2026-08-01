namespace PCS.Installer.Models;

public class ReleaseManifest
{
    public string ProductName { get; set; } = "PCS";

    public string Version { get; set; } = "1.0.0";

    public DateTime BuildDate { get; set; }
        = DateTime.UtcNow;

    public List<FileManifest> Files { get; set; }
        = new();
}