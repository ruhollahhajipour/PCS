using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public interface IInstallationStep
{
    string Name { get; }

    int Progress { get; }


    Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null);
}