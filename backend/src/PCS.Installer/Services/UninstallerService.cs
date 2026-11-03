using System.Diagnostics;
using PCS.Installer.Models;

namespace PCS.Installer.Services;

public class UninstallerService
{
    public void Uninstall(
        InstallerContext context,
        bool removeUserData = false)
    {
        ArgumentNullException.ThrowIfNull(context);

        // Remove the current user's automatic startup entry before
        // deleting the launcher executable it points to.
        new StartupService().Remove(context);

        /*
         * Current PCS Free / Local installation does
         * not create a Windows Service.
         *
         * These calls are intentionally kept harmless
         * for compatibility with future editions.
         */
        StopWindowsService();
        RemoveWindowsService();

        // Remove application files and installation configuration.
        DeleteFolder(context.BackendPath);
        DeleteFolder(context.FrontendPath);
        DeleteFolder(Path.Combine(context.InstallPath, "Launcher"));
        DeleteFolder(context.ConfigPath);
        DeleteFolder(context.LogsPath);
        DeleteFolder(Path.Combine(context.InstallPath, "Resources"));

        // Project data is preserved by default. This includes the
        // SQLite database, backups, and user-managed import/export files.
        if (removeUserData)
        {
            DeleteFolder(context.DatabasePath);
            DeleteFolder(context.BackupPath);
            DeleteFolder(context.ImportPath);
            DeleteFolder(context.ExportPath);
        }

        RemoveDesktopShortcut(context.ProductName);
        RemoveStartMenuShortcut(context.ProductName);

        // The installation root is removed only when no user data remains.
        TryDeleteEmptyDirectory(context.InstallPath);
    }

    private static void StopWindowsService()
    {
        ExecuteCommand("sc", "stop PCS.API.Service");
    }

    private static void RemoveWindowsService()
    {
        ExecuteCommand("sc", "delete PCS.API.Service");
    }

    private static void DeleteFolder(string folder)
    {
        if (!Directory.Exists(folder))
        {
            return;
        }

        try
        {
            DirectoryInfo directory = new(folder);

            foreach (FileInfo file in directory.GetFiles("*", SearchOption.AllDirectories))
            {
                try
                {
                    file.IsReadOnly = false;
                }
                catch
                {
                    // Ignore individual file attribute errors.
                }
            }

            Directory.Delete(folder, recursive: true);
        }
        catch
        {
            // Cleanup errors must not crash the uninstaller.
        }
    }

    private static void RemoveDesktopShortcut(string productName)
    {
        string desktop = Environment.GetFolderPath(
            Environment.SpecialFolder.DesktopDirectory);

        if (string.IsNullOrWhiteSpace(desktop))
        {
            return;
        }

        TryDeleteFile(Path.Combine(desktop, "PCS.lnk"));
    }

    private static void RemoveStartMenuShortcut(string productName)
    {
        string programs = Environment.GetFolderPath(
            Environment.SpecialFolder.Programs);

        if (string.IsNullOrWhiteSpace(programs))
        {
            return;
        }

        string folder = Path.Combine(programs, productName);
        TryDeleteFile(Path.Combine(folder, "PCS.lnk"));
        TryDeleteEmptyDirectory(folder);
    }

    private static void TryDeleteFile(string file)
    {
        try
        {
            if (!File.Exists(file))
            {
                return;
            }

            File.SetAttributes(file, FileAttributes.Normal);
            File.Delete(file);
        }
        catch
        {
            // Ignore cleanup errors.
        }
    }

    private static void TryDeleteEmptyDirectory(string directory)
    {
        try
        {
            if (!Directory.Exists(directory))
            {
                return;
            }

            if (Directory.EnumerateFileSystemEntries(directory).Any())
            {
                return;
            }

            Directory.Delete(directory);
        }
        catch
        {
            // Ignore cleanup errors.
        }
    }

    private static void ExecuteCommand(string fileName, string arguments)
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
            // Current local installations do not require a Windows Service.
        }
    }
}
