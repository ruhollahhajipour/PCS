using PCS.Installer.Models;

namespace PCS.Installer.Services;

public sealed class LauncherDeploymentService
{
    private const string LauncherFileName =
        "PCS.Launcher.exe";


    private const string IconFileName =
        "PCS.ico";



    public void Deploy(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);



        // ========================================
        // Source paths inside installer package
        // ========================================

        string sourceLauncherPath =
            Path.Combine(
                context.PublishPath,
                "Launcher",
                LauncherFileName);


        string sourceIconPath =
            Path.Combine(
                context.InstallerDirectory,
                "Resources",
                IconFileName);



        // ========================================
        // Destination paths
        // ========================================

        string launcherDirectory =
            Path.Combine(
                context.InstallPath,
                "Launcher");


        string destinationLauncherPath =
            Path.Combine(
                launcherDirectory,
                LauncherFileName);


        string resourcesDirectory =
            Path.Combine(
                context.InstallPath,
                "Resources");


        string destinationIconPath =
            Path.Combine(
                resourcesDirectory,
                IconFileName);



        // ========================================
        // Validate Launcher
        // ========================================

        if (!File.Exists(sourceLauncherPath))
        {
            throw new FileNotFoundException(
                "PCS Launcher executable was not found in the installer package.",
                sourceLauncherPath);
        }



        // ========================================
        // Prepare directories
        // ========================================

        Directory.CreateDirectory(
            launcherDirectory);


        Directory.CreateDirectory(
            resourcesDirectory);



        // ========================================
        // Deploy Launcher
        // ========================================

        File.Copy(
            sourceLauncherPath,
            destinationLauncherPath,
            overwrite: true);


        if (!File.Exists(destinationLauncherPath))
        {
            throw new IOException(
                "PCS Launcher executable could not be deployed.");
        }



        // ========================================
        // Deploy PCS icon
        // ========================================

        if (!File.Exists(sourceIconPath))
        {
            throw new FileNotFoundException(
                "PCS application icon was not found in the installer package.",
                sourceIconPath);
        }



        File.Copy(
            sourceIconPath,
            destinationIconPath,
            overwrite: true);


        if (!File.Exists(destinationIconPath))
        {
            throw new IOException(
                "PCS application icon could not be deployed.");
        }



        // ========================================
        // Validate icon
        // ========================================

        FileInfo iconInfo =
            new FileInfo(
                destinationIconPath);


        if (iconInfo.Length <= 0)
        {
            throw new IOException(
                "PCS application icon is empty.");
        }
    }
}