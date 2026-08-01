using PCS.Installer.Models;
using System.Security.Cryptography;
using System.Text.Json;

namespace PCS.Installer.Services.Packaging;

public class ManifestService
{
    public ReleaseManifest Generate(
        string publishFolder)
    {
        var manifest =
            new ReleaseManifest();

        foreach (string file in Directory.GetFiles(
                     publishFolder,
                     "*",
                     SearchOption.AllDirectories))
        {
            var info =
                new FileInfo(file);

            manifest.Files.Add(
                new FileManifest
                {
                    Path =
                        Path.GetRelativePath(
                            publishFolder,
                            file),

                    Size =
                        info.Length,

                    SHA256 =
                        ComputeHash(file)
                });
        }

        string json =
            JsonSerializer.Serialize(
                manifest,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });

        File.WriteAllText(
            Path.Combine(
                publishFolder,
                "manifest.json"),
            json);

        return manifest;
    }

    private static string ComputeHash(
        string file)
    {
        using var stream =
            File.OpenRead(file);

        using var sha =
            SHA256.Create();

        byte[] hash =
            sha.ComputeHash(stream);

        return Convert.ToHexString(hash);
    }
}