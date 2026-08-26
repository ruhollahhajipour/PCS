using System.Runtime.InteropServices;
using PCS.Installer.Models;

namespace PCS.Installer.Services;

public sealed class ShortcutService
{
    private const string ShortcutFileName =
        "PCS.lnk";

    private const string ProductIconFileName =
        "PCS.ico";

    private const string LauncherFileName =
        "PCS.Launcher.exe";


    // ============================================================
    // DESKTOP SHORTCUT
    // ============================================================

    public void CreateDesktopShortcut(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        string desktop =
            Environment.GetFolderPath(
                Environment.SpecialFolder.DesktopDirectory);


        if (string.IsNullOrWhiteSpace(desktop))
        {
            throw new InvalidOperationException(
                "Windows Desktop directory could not be determined.");
        }


        Directory.CreateDirectory(
            desktop);


        string shortcutPath =
            Path.Combine(
                desktop,
                ShortcutFileName);


        CreateLauncherShortcut(
            shortcutPath,
            context);
    }


    // ============================================================
    // START MENU SHORTCUT
    // ============================================================

    public void CreateStartMenuShortcut(
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        string startMenu =
            Environment.GetFolderPath(
                Environment.SpecialFolder.Programs);


        if (string.IsNullOrWhiteSpace(startMenu))
        {
            throw new InvalidOperationException(
                "Windows Start Menu directory could not be determined.");
        }


        string folder =
            Path.Combine(
                startMenu,
                context.ProductName);


        Directory.CreateDirectory(
            folder);


        string shortcutPath =
            Path.Combine(
                folder,
                ShortcutFileName);


        CreateLauncherShortcut(
            shortcutPath,
            context);
    }


    // ============================================================
    // CREATE SHORTCUT
    // ============================================================

    private static void CreateLauncherShortcut(
        string shortcutPath,
        InstallerContext context)
    {
        ArgumentNullException.ThrowIfNull(context);


        // --------------------------------------------------------
        // Installed launcher
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // Installed icon
        //
        // The icon is intentionally kept inside the user's
        // PCS installation directory so the shortcut does not
        // depend on PCSSetup.exe or its temporary extraction
        // directory.
        // --------------------------------------------------------

        string iconDirectory =
            Path.Combine(
                context.InstallPath,
                "Resources");


        Directory.CreateDirectory(
            iconDirectory);


        string iconPath =
            Path.Combine(
                iconDirectory,
                ProductIconFileName);


        EnsureInstalledIcon(
            context,
            iconPath);


        if (!File.Exists(iconPath))
        {
            throw new FileNotFoundException(
                "PCS application icon could not be installed.",
                iconPath);
        }


        // --------------------------------------------------------
        // Windows Script Host
        // --------------------------------------------------------

        Type? shellType =
            Type.GetTypeFromProgID(
                "WScript.Shell");


        if (shellType == null)
        {
            throw new InvalidOperationException(
                "Windows Script Host is not available.");
        }


        object? shellObject =
            Activator.CreateInstance(
                shellType);


        if (shellObject == null)
        {
            throw new InvalidOperationException(
                "Unable to create Windows Script Host.");
        }


        try
        {
            dynamic shell =
                shellObject;


            dynamic shortcut =
                shell.CreateShortcut(
                    shortcutPath);


            // ----------------------------------------------------
            // Target
            // ----------------------------------------------------

            shortcut.TargetPath =
                launcherPath;


            // ----------------------------------------------------
            // Working directory
            // ----------------------------------------------------

            shortcut.WorkingDirectory =
                Path.GetDirectoryName(
                    launcherPath)
                ?? context.InstallPath;


            // ----------------------------------------------------
            // Display name / description
            // ----------------------------------------------------

            shortcut.Description =
                "Project Control Suite";


            // ----------------------------------------------------
            // PCS application icon
            //
            // Explicitly use the installed PCS.ico.
            // ----------------------------------------------------

            shortcut.IconLocation =
                $"{iconPath},0";


            // ----------------------------------------------------
            // Save
            // ----------------------------------------------------

            shortcut.Save();
        }
        finally
        {
            if (shellObject is IDisposable disposable)
            {
                disposable.Dispose();
            }

            Marshal.FinalReleaseComObject(
                shellObject);
        }


        // --------------------------------------------------------
        // Verify shortcut
        // --------------------------------------------------------

        if (!File.Exists(shortcutPath))
        {
            throw new IOException(
                $"PCS shortcut could not be created: {shortcutPath}");
        }
    }


    // ============================================================
    // INSTALL ICON
    // ============================================================

    private static void EnsureInstalledIcon(
        InstallerContext context,
        string destinationPath)
    {
        if (File.Exists(destinationPath))
        {
            return;
        }


        // --------------------------------------------------------
        // Candidate 1
        //
        // Bundled resource extracted by the .NET single-file
        // application.
        // --------------------------------------------------------

        string bundledIcon =
            Path.Combine(
                context.InstallerDirectory,
                "Resources",
                ProductIconFileName);


        if (File.Exists(bundledIcon))
        {
            File.Copy(
                bundledIcon,
                destinationPath,
                overwrite: true);

            return;
        }


        // --------------------------------------------------------
        // Candidate 2
        //
        // Branding folder in the installer package.
        // This is useful when running the installer from a normal
        // publish/package directory.
        // --------------------------------------------------------

        string brandingIcon =
            Path.Combine(
                context.InstallerDirectory,
                "Resources",
                "Branding",
                ProductIconFileName);


        if (File.Exists(brandingIcon))
        {
            File.Copy(
                brandingIcon,
                destinationPath,
                overwrite: true);

            return;
        }


        // --------------------------------------------------------
        // Candidate 3
        //
        // The physical PCSSetup.exe directory.
        //
        // This is intentionally only a fallback. The normal
        // single-file bundled resource remains the preferred
        // source.
        // --------------------------------------------------------

        string? processPath =
            Environment.ProcessPath;


        if (!string.IsNullOrWhiteSpace(processPath))
        {
            string? processDirectory =
                Path.GetDirectoryName(
                    processPath);


            if (!string.IsNullOrWhiteSpace(processDirectory))
            {
                string physicalIcon =
                    Path.Combine(
                        processDirectory,
                        "Resources",
                        ProductIconFileName);


                if (File.Exists(physicalIcon))
                {
                    File.Copy(
                        physicalIcon,
                        destinationPath,
                        overwrite: true);

                    return;
                }
            }
        }


        // --------------------------------------------------------
        // No icon found
        // --------------------------------------------------------

        throw new FileNotFoundException(
            "PCS.ico could not be found in the installer package.",
            bundledIcon);
    }
}