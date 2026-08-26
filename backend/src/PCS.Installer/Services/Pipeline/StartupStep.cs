using PCS.Installer.Models;
using PCS.Installer.Services;

namespace PCS.Installer.Services.Pipeline;

public sealed class StartupStep : IInstallationStep
{
    private readonly StartupService startupService;


    public StartupStep()
    {
        startupService =
            new StartupService();
    }


    public string Name =>
        "Configuring PCS startup...";


    public int Progress =>
        95;


    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(
            "Configuring PCS to start automatically...");


        try
        {
            startupService.Configure(
                context);


            progress?.Report(
                "PCS startup configured successfully.");
        }
        catch (Exception ex)
        {
            progress?.Report(
                $"PCS startup configuration failed: {ex.Message}");

            throw;
        }


        return Task.CompletedTask;
    }
}