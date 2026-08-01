using System.Text.Json;

namespace PCS.Installer.Services.Release;

public class ReleaseManager
{
    public string GetInstalledVersion(
        string installPath)
    {
        string file =
            Path.Combine(
                installPath,
                "Config",
                "version.json");


        if (!File.Exists(file))
        {
            return "0.0.0";
        }


        string json =
            File.ReadAllText(file);


        var info =
            JsonSerializer.Deserialize<ReleaseInfo>(
                json);


        return info?.Version
            ?? "0.0.0";
    }



    public void SaveInstalledVersion(
        string installPath,
        string version)
    {
        string folder =
            Path.Combine(
                installPath,
                "Config");


        Directory.CreateDirectory(
            folder);


        string file =
            Path.Combine(
                folder,
                "version.json");


        var info =
            new ReleaseInfo
            {
                Version = version,
                InstalledAt = DateTime.Now
            };


        string json =
            JsonSerializer.Serialize(
                info,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });


        File.WriteAllText(
            file,
            json);
    }



    private class ReleaseInfo
    {
        public string Version { get; set; }
            = "0.0.0";


        public DateTime InstalledAt { get; set; }
    }
}