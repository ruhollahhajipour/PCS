using PCS.Installer.Models;

namespace PCS.Installer.Services.Deployment;

public sealed class WindowsServiceInstaller
{
    /*
     * PCS no longer installs the API as a Windows Service.
     *
     * The installer is intentionally designed to run
     * without Administrator privileges or UAC elevation.
     *
     * These methods are retained as compatibility
     * no-op methods so existing installer/uninstaller
     * code does not break.
     */

    public void Install(
        InstallerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }

        /*
         * Intentionally no-op.
         *
         * Do NOT call:
         *
         *     sc.exe create
         *     sc.exe start
         *
         * because Windows Service management requires
         * Administrator privileges.
         */
    }


    public void Stop(
        InstallerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }

        /*
         * Intentionally no-op.
         */
    }


    public void Uninstall(
        InstallerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }

        /*
         * Intentionally no-op.
         *
         * No Windows Service is created by PCS.
         */
    }
}