using PCS.Installer.Models;
using PCS.Installer.Services.Configuration;

namespace PCS.Installer.Services.Pipeline;

public class ConfigurationStep : IInstallationStep
{
    private readonly ConfigurationService service;


    public ConfigurationStep()
    {
        service =
            new ConfigurationService();
    }



    public string Name =>
        "Creating configuration...";



    public int Progress =>
        25;



    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        progress?.Report(Name);


        service.Create(context);


        return Task.CompletedTask;
    }
}