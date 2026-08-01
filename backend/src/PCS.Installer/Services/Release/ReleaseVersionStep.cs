using PCS.Installer.Models;
using PCS.Installer.Services.Release;

namespace PCS.Installer.Services.Pipeline;

public class ReleaseVersionStep : IInstallationStep
{
    private readonly ReleaseManager releaseManager;


    public ReleaseVersionStep()
    {
        releaseManager =
            new ReleaseManager();
    }



    public string Name =>
        "Registering installed version...";



    public int Progress =>
        100;



    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);


        releaseManager.SaveInstalledVersion(
            context.InstallPath,
            "1.0.0");


        return Task.CompletedTask;
    }
}