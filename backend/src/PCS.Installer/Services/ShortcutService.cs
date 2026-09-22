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

        Directory.CreateDirectory(desktop);

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

        Directory.CreateDirectory(folder);

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
        // --------------------------------------------------------

        string iconDirectory =
            Path.Combine(
                context.InstallPath,
                "Resources");

        Directory.CreateDirectory(iconDirectory);

        string iconPath =
            Path.Combine(
                iconDirectory,
                ProductIconFileName);

        // Always refresh the installed icon so a new branding
        // icon is used after an update/reinstall.
        InstallIcon(
            context,
            iconPath);

        if (!File.Exists(iconPath))
        {
            throw new FileNotFoundException(
                "PCS application icon could not be installed.",
                iconPath);
        }


        // --------------------------------------------------------
        // Remove old shortcut
        // --------------------------------------------------------

        if (File.Exists(shortcutPath))
        {
            try
            {
                File.Delete(shortcutPath);
            }
            catch (Exception ex)
            {
                throw new IOException(
                    $"Unable to remove the existing PCS shortcut: {shortcutPath}",
                    ex);
            }
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

        object? shortcutObject = null;

        try
        {
            dynamic shell =
                shellObject;

            shortcutObject =
                shell.CreateShortcut(
                    shortcutPath);

            dynamic shortcut =
                shortcutObject;

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
            // Description
            // ----------------------------------------------------

            shortcut.Description =
                "Project Control Suite";

            // ----------------------------------------------------
            // Icon
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
            // Release shortcut COM object first.
            if (shortcutObject != null &&
                Marshal.IsComObject(shortcutObject))
            {
                try
                {
                    Marshal.FinalReleaseComObject(
                        shortcutObject);
                }
                catch
                {
                    // Ignore COM cleanup errors.
                }
            }

            // Release WScript.Shell COM object.
            if (Marshal.IsComObject(shellObject))
            {
                try
                {
                    Marshal.FinalReleaseComObject(
                        shellObject);
                }
                catch
                {
                    // Ignore COM cleanup errors.
                }
            }
        }


        // --------------------------------------------------------
        // Verify file exists
        // --------------------------------------------------------

        if (!File.Exists(shortcutPath))
        {
            throw new IOException(
                $"PCS shortcut could not be created: {shortcutPath}");
        }


        // --------------------------------------------------------
        // Verify actual shortcut contents
        // --------------------------------------------------------

        VerifyShortcut(
            shortcutPath,
            launcherPath,
            iconPath);
    }


    // ============================================================
    // INSTALL ICON
    // ============================================================

    private static void InstallIcon(
        InstallerContext context,
        string destinationPath)
    {
        string? sourceIcon =
            FindIconSource(context);

        if (string.IsNullOrWhiteSpace(sourceIcon))
        {
            throw new FileNotFoundException(
                "PCS.ico could not be found in the installer package.");
        }

        File.Copy(
            sourceIcon,
            destinationPath,
            overwrite: true);


        // --------------------------------------------------------
        // Validate copied icon
        // --------------------------------------------------------

        if (!File.Exists(destinationPath))
        {
            throw new FileNotFoundException(
                "PCS.ico could not be installed.",
                destinationPath);
        }

        FileInfo iconInfo =
            new(destinationPath);

        if (iconInfo.Length <= 0)
        {
            throw new IOException(
                "PCS.ico was copied but is empty.");
        }
    }


    // ============================================================
    // FIND ICON SOURCE
    // ============================================================

    private static string? FindIconSource(
        InstallerContext context)
    {
        // --------------------------------------------------------
        // Candidate 1
        // Resources\PCS.ico beside installer executable
        // --------------------------------------------------------

        string bundledIcon =
            Path.Combine(
                context.InstallerDirectory,
                "Resources",
                ProductIconFileName);

        if (File.Exists(bundledIcon) &&
            new FileInfo(bundledIcon).Length > 0)
        {
            return bundledIcon;
        }


        // --------------------------------------------------------
        // Candidate 2
        // Resources\Branding\PCS.ico
        // --------------------------------------------------------

        string brandingIcon =
            Path.Combine(
                context.InstallerDirectory,
                "Resources",
                "Branding",
                ProductIconFileName);

        if (File.Exists(brandingIcon) &&
            new FileInfo(brandingIcon).Length > 0)
        {
            return brandingIcon;
        }


        // --------------------------------------------------------
        // Candidate 3
        // Physical installer directory
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

                if (File.Exists(physicalIcon) &&
                    new FileInfo(physicalIcon).Length > 0)
                {
                    return physicalIcon;
                }


                // Also check physical Branding directory.
                string physicalBrandingIcon =
                    Path.Combine(
                        processDirectory,
                        "Resources",
                        "Branding",
                        ProductIconFileName);

                if (File.Exists(physicalBrandingIcon) &&
                    new FileInfo(physicalBrandingIcon).Length > 0)
                {
                    return physicalBrandingIcon;
                }
            }
        }

        return null;
    }


    // ============================================================
    // VERIFY SHORTCUT
    // ============================================================

    private static void VerifyShortcut(
        string shortcutPath,
        string expectedTarget,
        string expectedIcon)
    {
        Type? shellType =
            Type.GetTypeFromProgID(
                "WScript.Shell");

        if (shellType == null)
        {
            throw new InvalidOperationException(
                "Windows Script Host is not available for shortcut verification.");
        }

        object? shellObject =
            Activator.CreateInstance(
                shellType);

        if (shellObject == null)
        {
            throw new InvalidOperationException(
                "Unable to create Windows Script Host for shortcut verification.");
        }

        object? shortcutObject = null;

        try
        {
            dynamic shell =
                shellObject;

            shortcutObject =
                shell.CreateShortcut(
                    shortcutPath);

            dynamic shortcut =
                shortcutObject;

            string actualTarget =
                Convert.ToString(
                    shortcut.TargetPath)
                ?? string.Empty;

            string actualIcon =
                Convert.ToString(
                    shortcut.IconLocation)
                ?? string.Empty;

            string normalizedExpectedTarget =
                Path.GetFullPath(
                    expectedTarget);

            string normalizedActualTarget =
                string.IsNullOrWhiteSpace(actualTarget)
                    ? string.Empty
                    : Path.GetFullPath(actualTarget);

            string normalizedExpectedIcon =
                Path.GetFullPath(
                    expectedIcon);

            string normalizedActualIcon =
                actualIcon
                    .Split(',')[0]
                    .Trim();

            if (!string.Equals(
                    normalizedActualTarget,
                    normalizedExpectedTarget,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new IOException(
                    $"PCS shortcut target verification failed. " +
                    $"Expected: {normalizedExpectedTarget} " +
                    $"Actual: {actualTarget}");
            }

            if (!string.Equals(
                    normalizedActualIcon,
                    normalizedExpectedIcon,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new IOException(
                    $"PCS shortcut icon verification failed. " +
                    $"Expected: {normalizedExpectedIcon} " +
                    $"Actual: {actualIcon}");
            }
        }
        finally
        {
            if (shortcutObject != null &&
                Marshal.IsComObject(shortcutObject))
            {
                try
                {
                    Marshal.FinalReleaseComObject(
                        shortcutObject);
                }
                catch
                {
                    // Ignore COM cleanup errors.
                }
            }

            if (Marshal.IsComObject(shellObject))
            {
                try
                {
                    Marshal.FinalReleaseComObject(
                        shellObject);
                }
                catch
                {
                    // Ignore COM cleanup errors.
                }
            }
        }
    }
}