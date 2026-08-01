using PCS.Installer.Models;
using PCS.Installer.Services.Pipeline;

namespace PCS.Installer.Services;

public class InstallerService
{
    private readonly InstallerContext context;

    private readonly InstallationPipeline installPipeline;


    private readonly UninstallerService uninstaller;



    public InstallerService(
        InstallerContext context)
    {
        this.context = context;


        installPipeline =
            new InstallationPipeline()

                .Add(new ValidationStep())

                .Add(new DirectoryStep())

                .Add(new ConfigurationStep())

                .Add(new ApiDeploymentStep())

                .Add(new FrontendDeploymentStep())

                .Add(new DatabaseStep())

// فعلاً غیرفعال تا Deployment کامل شود
// .Add(new WindowsServiceStep());

                .Add(new ShortcutStep());



        uninstaller =
            new UninstallerService();
    }







    public async Task InstallAsync(
        IProgress<string>? progress = null,
        IProgress<int>? percentage = null)
    {

        try
        {

            switch(context.Mode)
            {

                case InstallationMode.NewInstall:

                    await ExecuteInstallAsync(
                        progress,
                        percentage);

                    break;



                case InstallationMode.Repair:

                    await ExecuteRepairAsync(
                        progress,
                        percentage);

                    break;



                case InstallationMode.Upgrade:

                    await ExecuteUpgradeAsync(
                        progress,
                        percentage);

                    break;



                case InstallationMode.Uninstall:

                    ExecuteUninstall(
                        progress);

                    break;
            }



            context.InstallationCompleted =
                true;

        }
        catch(Exception ex)
        {

            context.InstallationCompleted =
                false;


            throw new Exception(
                $"PCS installation failed.{Environment.NewLine}{Environment.NewLine}{ex.Message}",
                ex);
        }
    }







    private async Task ExecuteInstallAsync(
        IProgress<string>? progress,
        IProgress<int>? percentage)
    {
        progress?.Report(
            "Starting new installation...");


        await installPipeline.ExecuteAsync(
            context,
            progress,
            percentage);
    }








    private async Task ExecuteRepairAsync(
        IProgress<string>? progress,
        IProgress<int>? percentage)
    {
        progress?.Report(
            "Starting repair...");


        await installPipeline.ExecuteAsync(
            context,
            progress,
            percentage);
    }








    private async Task ExecuteUpgradeAsync(
        IProgress<string>? progress,
        IProgress<int>? percentage)
    {
        progress?.Report(
            "Starting upgrade...");


        await installPipeline.ExecuteAsync(
            context,
            progress,
            percentage);
    }








    private void ExecuteUninstall(
        IProgress<string>? progress)
    {
        progress?.Report(
            "Removing PCS...");


        uninstaller.Uninstall(
            context,
            true);


        progress?.Report(
            "PCS removed successfully.");
    }
}