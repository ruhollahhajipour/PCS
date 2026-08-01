using PCS.Installer.Models;
using PCS.Installer.Services.Deployment;

namespace PCS.Installer.Services.Pipeline;

public class WindowsServiceStep : IInstallationStep
{
    private readonly WindowsServiceInstaller service;


    public WindowsServiceStep()
    {
        service =
            new WindowsServiceInstaller();
    }



    public string Name =>
        "Installing Windows Service...";



    public int Progress =>
        95;



    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);

        service.Install(context);

        return Task.CompletedTask;
    }
}