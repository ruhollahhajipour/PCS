using PCS.Installer.Models;
using System.Text.Json;

namespace PCS.Installer.Services;

public class VersionService
{
    public VersionInfo Create(string publishFolder)
    {
        var version = new VersionInfo();

        string file =
            Path.Combine(
                publishFolder,
                "version.json");

        string json =
            JsonSerializer.Serialize(
                version,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });

        Directory.CreateDirectory(
            publishFolder);

        File.WriteAllText(
            file,
            json);

        return version;
    }
}