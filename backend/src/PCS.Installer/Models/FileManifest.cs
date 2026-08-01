namespace PCS.Installer.Models;

public class FileManifest
{
    public string Path { get; set; } = "";

    public long Size { get; set; }

    public string SHA256 { get; set; } = "";
}