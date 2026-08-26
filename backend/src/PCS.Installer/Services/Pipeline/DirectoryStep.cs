using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class DirectoryStep : IInstallationStep
{
    public string Name =>
        "Preparing installation folders...";


    public int Progress =>
        10;



    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        ArgumentNullException.ThrowIfNull(context);


        progress?.Report(Name);



        CreateDirectory(
            context.InstallPath);


        CreateDirectory(
            context.BackendPath);


        CreateDirectory(
            context.FrontendPath);


        CreateDirectory(
            context.DatabasePath);


        CreateDirectory(
            context.ConfigPath);


        CreateDirectory(
            context.LogsPath);


        CreateDirectory(
            context.BackupPath);


        CreateDirectory(
            context.ImportPath);


        CreateDirectory(
            context.ExportPath);


        CreateDirectory(
            Path.Combine(
                context.InstallPath,
                "Resources"));



        progress?.Report(
            "Installation folders created successfully.");


        return Task.CompletedTask;
    }



    private static void CreateDirectory(
        string path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return;
        }


        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
    }
}