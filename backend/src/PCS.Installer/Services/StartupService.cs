using Microsoft.Win32;
using PCS.Installer.Models;

namespace PCS.Installer.Services;

public sealed class StartupService
{
    private const string RunKeyPath =
        @"Software\Microsoft\Windows\CurrentVersion\Run";


    private const string LauncherFileName =
        "PCS.Launcher.exe";


    public void Configure(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        string launcherPath =
            Path.Combine(
                context.InstallPath,
                "Launcher",
                LauncherFileName);


        if (!File.Exists(launcherPath))
        {
            throw new FileNotFoundException(
                "PCS Launcher executable was not found.",
                launcherPath);
        }


        string command =
            $"\"{launcherPath}\"";


        using RegistryKey? key =
            Registry.CurrentUser.CreateSubKey(
                RunKeyPath);


        if (key == null)
        {
            throw new InvalidOperationException(
                "Unable to access the current user's Windows startup configuration.");
        }


        key.SetValue(
            context.ProductName,
            command,
            RegistryValueKind.String);
    }


    public void Remove(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        try
        {
            using RegistryKey? key =
                Registry.CurrentUser.OpenSubKey(
                    RunKeyPath,
                    writable: true);


            key?.DeleteValue(
                context.ProductName,
                throwOnMissingValue: false);
        }
        catch
        {
            /*
             * Uninstallation remains tolerant.
             */
        }
    }


    public bool IsConfigured(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        try
        {
            using RegistryKey? key =
                Registry.CurrentUser.OpenSubKey(
                    RunKeyPath,
                    writable: false);


            if (key == null)
            {
                return false;
            }


            string? value =
                key.GetValue(
                    context.ProductName)
                as string;


            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }


            string expected =
                Path.Combine(
                    context.InstallPath,
                    "Launcher",
                    LauncherFileName);


            return value.Contains(
                expected,
                StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }
}