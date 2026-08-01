using PCS.Installer.Models;
using PCS.Installer.Services.Deployment;

namespace PCS.Installer.Services.Pipeline;

public class ApiDeploymentStep : IInstallationStep
{
    private readonly ApiDeploymentService service =
        new();

    public string Name =>
        "Deploying API...";

    public int Progress =>
        45;

    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);

        service.Deploy(context);

        return Task.CompletedTask;
    }
}