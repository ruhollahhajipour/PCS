using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public sealed class LauncherDeploymentStep : IInstallationStep
{
    private readonly LauncherDeploymentService launcherDeploymentService;


    public LauncherDeploymentStep()
    {
        launcherDeploymentService =
            new LauncherDeploymentService();
    }


    public string Name =>
        "Installing PCS launcher...";


    public int Progress =>
        94;


    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        ArgumentNullException.ThrowIfNull(context);

        progress?.Report(
            "Installing PCS launcher...");


        try
        {
            launcherDeploymentService.Deploy(
                context);


            progress?.Report(
                "PCS launcher installed successfully.");
        }
        catch (Exception ex)
        {
            progress?.Report(
                $"PCS launcher installation failed: {ex.Message}");

            throw;
        }


        return Task.CompletedTask;
    }
}
