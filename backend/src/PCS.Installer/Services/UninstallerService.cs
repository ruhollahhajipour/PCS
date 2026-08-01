using System.Diagnostics;
using PCS.Installer.Models;

namespace PCS.Installer.Services;

public class UninstallerService
{
    public void Uninstall(
        InstallerContext context,
        bool removeDatabase)
    {
        StopWindowsService();

        RemoveWindowsService();

        DeleteFolder(
            Path.Combine(
                context.InstallPath,
                "Backend"));

        DeleteFolder(
            Path.Combine(
                context.InstallPath,
                "Frontend"));

        DeleteFolder(
            Path.Combine(
                context.InstallPath,
                "Config"));

        DeleteFolder(
            Path.Combine(
                context.InstallPath,
                "Logs"));

        if (removeDatabase)
        {
            DeleteFolder(
                Path.Combine(
                    context.InstallPath,
                    "Database"));
        }

        RemoveDesktopShortcut();

        RemoveStartMenuShortcut();
    }

    private void StopWindowsService()
    {
        ExecuteCommand(
            "sc",
            "stop PCS.API.Service");
    }

    private void RemoveWindowsService()
    {
        ExecuteCommand(
            "sc",
            "delete PCS.API.Service");
    }

    private static void DeleteFolder(
        string folder)
    {
        if (!Directory.Exists(folder))
            return;

        var directory =
            new DirectoryInfo(folder);

        foreach (var file in directory.GetFiles("*", SearchOption.AllDirectories))
        {
            file.IsReadOnly = false;
        }

        Directory.Delete(
            folder,
            true);
    }

    private static void RemoveDesktopShortcut()
    {
        string shortcut =
            Path.Combine(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.DesktopDirectory),
                "PCS.lnk");

        if (File.Exists(shortcut))
        {
            File.Delete(shortcut);
        }
    }

    private static void RemoveStartMenuShortcut()
    {
        string shortcut =
            Path.Combine(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.Programs),
                "PCS",
                "PCS.lnk");

        if (File.Exists(shortcut))
        {
            File.Delete(shortcut);
        }

        string folder =
            Path.GetDirectoryName(shortcut)!;

        if (Directory.Exists(folder) &&
            !Directory.EnumerateFileSystemEntries(folder).Any())
        {
            Directory.Delete(folder);
        }
    }

    private static void ExecuteCommand(
        string fileName,
        string arguments)
    {
        try
        {
            using Process process = new();

            process.StartInfo.FileName = fileName;
            process.StartInfo.Arguments = arguments;
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.UseShellExecute = false;

            process.Start();

            process.WaitForExit();
        }
        catch
        {
            // Ignore cleanup errors
        }
    }
}