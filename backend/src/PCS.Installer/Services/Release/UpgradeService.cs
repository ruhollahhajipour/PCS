using System.IO.Compression;

namespace PCS.Installer.Services.Release;

public class UpgradeService
{
    private readonly ReleaseManager releaseManager;


    public UpgradeService()
    {
        releaseManager =
            new ReleaseManager();
    }



    public async Task UpgradeAsync(
        string packageZip,
        string installPath,
        IProgress<string>? progress = null)
    {
        if (!File.Exists(packageZip))
        {
            throw new FileNotFoundException(
                "Upgrade package not found.",
                packageZip);
        }


        progress?.Report(
            "Preparing upgrade...");


        string tempFolder =
            Path.Combine(
                Path.GetTempPath(),
                "PCS_Upgrade");


        if (Directory.Exists(tempFolder))
        {
            Directory.Delete(
                tempFolder,
                true);
        }


        Directory.CreateDirectory(
            tempFolder);



        progress?.Report(
            "Extracting package...");


        ZipFile.ExtractToDirectory(
            packageZip,
            tempFolder);



        string currentVersion =
            releaseManager.GetInstalledVersion(
                installPath);



        progress?.Report(
            $"Current version: {currentVersion}");



        string backupFolder =
            Path.Combine(
                installPath,
                "Backup",
                DateTime.Now.ToString(
                    "yyyyMMdd_HHmmss"));



        progress?.Report(
            "Creating backup...");


        CopyDirectory(
            installPath,
            backupFolder);



        progress?.Report(
            "Installing new version...");


        CopyDirectory(
            tempFolder,
            installPath);



        string newVersion =
            File.ReadAllText(
                Path.Combine(
                    installPath,
                    "version.txt"));



        releaseManager.SaveInstalledVersion(
            installPath,
            newVersion);



        progress?.Report(
            $"Upgrade completed. Version {newVersion}");



        await Task.CompletedTask;
    }





    private static void CopyDirectory(
        string source,
        string destination)
    {
        Directory.CreateDirectory(
            destination);



        foreach (string directory in Directory.GetDirectories(
                     source,
                     "*",
                     SearchOption.AllDirectories))
        {
            string target =
                directory.Replace(
                    source,
                    destination);


            Directory.CreateDirectory(
                target);
        }



        foreach (string file in Directory.GetFiles(
                     source,
                     "*",
                     SearchOption.AllDirectories))
        {
            string target =
                file.Replace(
                    source,
                    destination);



            string? folder =
                Path.GetDirectoryName(
                    target);


            if (!string.IsNullOrEmpty(folder))
            {
                Directory.CreateDirectory(folder);
            }


            File.Copy(
                file,
                target,
                true);
        }
    }
}