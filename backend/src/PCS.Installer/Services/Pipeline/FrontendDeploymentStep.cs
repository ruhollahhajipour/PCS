using PCS.Installer.Models;
using PCS.Installer.Services.Deployment;

namespace PCS.Installer.Services.Pipeline;

public class FrontendDeploymentStep : IInstallationStep
{
    private readonly FrontendDeploymentService service;


    public FrontendDeploymentStep()
    {
        service =
            new FrontendDeploymentService();
    }



    public string Name =>
        "Deploying Frontend...";



    public int Progress =>
        65;



    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);

        service.Deploy(context);

        return Task.CompletedTask;
    }
}