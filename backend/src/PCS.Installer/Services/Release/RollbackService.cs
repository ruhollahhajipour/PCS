namespace PCS.Installer.Services.Release;

public class RollbackService
{
    private readonly ReleaseManager releaseManager;


    public RollbackService()
    {
        releaseManager =
            new ReleaseManager();
    }



    public async Task RollbackAsync(
        string installPath,
        string backupPath,
        IProgress<string>? progress = null)
    {
        if (!Directory.Exists(backupPath))
        {
            throw new DirectoryNotFoundException(
                $"Backup folder not found: {backupPath}");
        }


        progress?.Report(
            "Preparing rollback...");



        string currentVersion =
            releaseManager.GetInstalledVersion(
                installPath);



        progress?.Report(
            $"Current version: {currentVersion}");



        progress?.Report(
            "Removing current installation...");



        foreach (string item in Directory.GetFileSystemEntries(
                     installPath))
        {
            string name =
                Path.GetFileName(item);


            if (name.Equals(
                    "Backup",
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }


            if (Directory.Exists(item))
            {
                Directory.Delete(
                    item,
                    true);
            }
            else
            {
                File.Delete(item);
            }
        }



        progress?.Report(
            "Restoring backup...");



        CopyDirectory(
            backupPath,
            installPath);



        string versionFile =
            Path.Combine(
                installPath,
                "version.txt");



        if (File.Exists(versionFile))
        {
            string version =
                File.ReadAllText(
                    versionFile);


            releaseManager.SaveInstalledVersion(
                installPath,
                version);
        }



        progress?.Report(
            "Rollback completed successfully.");



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