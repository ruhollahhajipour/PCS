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
        this.context =
            context;


        /*
         * Main installation pipeline.
         *
         * PCS is installed completely inside
         * the current user's LocalAppData.
         *
         * No Administrator privileges are required.
         *
         * Pipeline order:
         *
         * Validation
         *      ↓
         * Directory
         *      ↓
         * Database
         *      ↓
         * API Deployment
         *      ↓
         * Configuration
         *      ↓
         * Frontend Deployment
         *      ↓
         * Launcher Deployment
         *      ↓
         * Startup Configuration
         *      ↓
         * Desktop / Start Menu Shortcuts
         *
         * IMPORTANT:
         *
         * API files are deployed before the final
         * appsettings.json is generated.
         *
         * This guarantees that the installer-generated
         * configuration cannot be overwritten by the
         * appsettings.json contained in the API publish
         * package.
         */

        installPipeline =
            new InstallationPipeline()
                .Add(new ValidationStep())
                .Add(new DirectoryStep())
                .Add(new DatabaseStep())
                .Add(new ApiDeploymentStep())
                .Add(new ConfigurationStep())
                .Add(new FrontendDeploymentStep())
                .Add(new LauncherDeploymentStep())
                .Add(new StartupStep())
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
            context.Status =
                InstallationStatus.Running;

            context.ErrorMessage =
                null;


            WriteLog(
                "==================================================");

            WriteLog(
                "PCS installation started.");

            WriteLog(
                $"Mode: {context.Mode}");

            WriteLog(
                $"InstallPath: {context.InstallPath}");

            WriteLog(
                $"DatabaseType: {context.DatabaseType}");

            WriteLog(
                $"DatabaseServer: {context.DatabaseServer}");

            WriteLog(
                $"DatabaseName: {context.DatabaseName}");

            WriteLog(
                $"WindowsAuthentication: {context.WindowsAuthentication}");

            WriteLog(
                $"ApplicationBaseDirectory: {AppContext.BaseDirectory}");

            WriteLog(
                $"InstallerDirectory: {context.InstallerDirectory}");

            WriteLog(
                $"PublishPath: {context.PublishPath}");

            WriteLog(
                $"BackendPath: {context.BackendPath}");

            WriteLog(
                $"FrontendPath: {context.FrontendPath}");

            WriteLog(
                $"LauncherPath: {context.LauncherPath}");

            WriteLog(
                $"IconPath: {context.IconPath}");

            WriteLog(
                $"ApiUrl: {context.ApiUrl}");

            WriteLog(
                $"ServiceName: {context.ServiceName}");



            switch (context.Mode)
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


                default:

                    throw new InvalidOperationException(
                        "Unknown installation mode.");
            }



            context.Status =
                InstallationStatus.Completed;

            context.ErrorMessage =
                null;



            WriteLog(
                "PCS installation completed successfully.");

            WriteLog(
                "==================================================");
        }
        catch (Exception ex)
        {
            context.Status =
                InstallationStatus.Failed;

            context.ErrorMessage =
                ex.ToString();



            WriteLog(
                "==================================================");

            WriteLog(
                "PCS installation FAILED.");

            WriteLog(
                $"Exception type: {ex.GetType().FullName}");

            WriteLog(
                $"Message: {ex.Message}");

            WriteLog(
                ex.ToString());

            WriteLog(
                "==================================================");



            throw new InvalidOperationException(
                "PCS installation failed."
                + Environment.NewLine
                + Environment.NewLine
                + ex.Message,
                ex);
        }
    }



    private async Task ExecuteInstallAsync(
        IProgress<string>? progress,
        IProgress<int>? percentage)
    {
        progress?.Report(
            "Starting new installation...");


        WriteLog(
            "Executing new installation pipeline.");


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


        WriteLog(
            "Executing repair pipeline.");


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


        WriteLog(
            "Executing upgrade pipeline.");


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


        WriteLog(
            "Starting uninstall.");


        uninstaller.Uninstall(
            context,
            true);


        progress?.Report(
            "PCS removed successfully.");


        WriteLog(
            "PCS uninstall completed.");
    }



    private static void WriteLog(
        string message)
    {
        try
        {
            string timestamp =
                DateTime.Now.ToString(
                    "yyyy-MM-dd HH:mm:ss.fff");


            string line =
                $"{timestamp} - {message}"
                + Environment.NewLine;



            // ========================================
            // CommonApplicationData log
            // ========================================

            string programDataDirectory =
                Path.Combine(
                    Environment.GetFolderPath(
                        Environment.SpecialFolder.CommonApplicationData),
                    "PCS",
                    "Logs");


            Directory.CreateDirectory(
                programDataDirectory);


            string programDataLog =
                Path.Combine(
                    programDataDirectory,
                    "installer.log");


            File.AppendAllText(
                programDataLog,
                line);



            // ========================================
            // Installer local log
            // ========================================

            string localDirectory =
                Path.Combine(
                    AppContext.BaseDirectory,
                    "Logs");


            Directory.CreateDirectory(
                localDirectory);


            string localLog =
                Path.Combine(
                    localDirectory,
                    "installer.log");


            File.AppendAllText(
                localLog,
                line);
        }
        catch
        {
            /*
             * Logging must never be allowed to break
             * the installation process.
             */
        }
    }
}