using System.Diagnostics;
using PCS.Installer.Models;

namespace PCS.Installer.Services;

public class UninstallerService
{
    public void Uninstall(
        InstallerContext context,
        bool removeDatabase)
    {
        ArgumentNullException.ThrowIfNull(context);


        /*
         * Current PCS Free / Local installation does
         * not create a Windows Service.
         *
         * These calls are intentionally kept harmless
         * for compatibility with future editions.
         */
        StopWindowsService();

        RemoveWindowsService();



        /*
         * ======================================================
         * REMOVE APPLICATION DIRECTORIES
         * ======================================================
         */

        DeleteFolder(
            context.BackendPath);


        DeleteFolder(
            context.FrontendPath);


        DeleteFolder(
            Path.Combine(
                context.InstallPath,
                "Launcher"));


        DeleteFolder(
            context.ConfigPath);


        DeleteFolder(
            context.LogsPath);


        DeleteFolder(
            context.BackupPath);


        DeleteFolder(
            context.ImportPath);


        DeleteFolder(
            context.ExportPath);



        if (removeDatabase)
        {
            DeleteFolder(
                context.DatabasePath);
        }



        /*
         * ======================================================
         * REMOVE SHORTCUTS
         * ======================================================
         */

        RemoveDesktopShortcut(
            context.ProductName);


        RemoveStartMenuShortcut(
            context.ProductName);



        /*
         * ======================================================
         * REMOVE EMPTY INSTALL DIRECTORY
         * ======================================================
         */

        TryDeleteEmptyDirectory(
            context.InstallPath);
    }



    private static void StopWindowsService()
    {
        ExecuteCommand(
            "sc",
            "stop PCS.API.Service");
    }



    private static void RemoveWindowsService()
    {
        ExecuteCommand(
            "sc",
            "delete PCS.API.Service");
    }



    private static void DeleteFolder(
        string folder)
    {
        if (!Directory.Exists(folder))
        {
            return;
        }


        try
        {
            DirectoryInfo directory =
                new DirectoryInfo(folder);


            foreach (
                FileInfo file
                in directory.GetFiles(
                    "*",
                    SearchOption.AllDirectories))
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


            Directory.Delete(
                folder,
                recursive: true);
        }
        catch
        {
            /*
             * Cleanup errors must not crash the
             * uninstaller.
             */
        }
    }



    private static void RemoveDesktopShortcut(
        string productName)
    {
        string desktop =
            Environment.GetFolderPath(
                Environment.SpecialFolder.DesktopDirectory);


        if (string.IsNullOrWhiteSpace(desktop))
        {
            return;
        }


        string shortcut =
            Path.Combine(
                desktop,
                "PCS.lnk");


        TryDeleteFile(
            shortcut);
    }



    private static void RemoveStartMenuShortcut(
        string productName)
    {
        string programs =
            Environment.GetFolderPath(
                Environment.SpecialFolder.Programs);


        if (string.IsNullOrWhiteSpace(programs))
        {
            return;
        }


        string folder =
            Path.Combine(
                programs,
                productName);


        string shortcut =
            Path.Combine(
                folder,
                "PCS.lnk");


        TryDeleteFile(
            shortcut);


        TryDeleteEmptyDirectory(
            folder);
    }



    private static void TryDeleteFile(
        string file)
    {
        try
        {
            if (!File.Exists(file))
            {
                return;
            }


            File.SetAttributes(
                file,
                FileAttributes.Normal);


            File.Delete(
                file);
        }
        catch
        {
            // Ignore cleanup errors.
        }
    }



    private static void TryDeleteEmptyDirectory(
        string directory)
    {
        try
        {
            if (!Directory.Exists(directory))
            {
                return;
            }


            if (
                Directory
                    .EnumerateFileSystemEntries(
                        directory)
                    .Any())
            {
                return;
            }


            Directory.Delete(
                directory);
        }
        catch
        {
            // Ignore cleanup errors.
        }
    }



    private static void ExecuteCommand(
        string fileName,
        string arguments)
    {
        try
        {
            using Process process =
                new();


            process.StartInfo.FileName =
                fileName;


            process.StartInfo.Arguments =
                arguments;


            process.StartInfo.CreateNoWindow =
                true;


            process.StartInfo.UseShellExecute =
                false;


            process.Start();


            process.WaitForExit();
        }
        catch
        {
            /*
             * Current Free / Local installation does
             * not require a Windows Service.
             *
             * Therefore service cleanup failures are
             * intentionally ignored.
             */
        }
    }
}