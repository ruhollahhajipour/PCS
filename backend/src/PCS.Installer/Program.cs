using PCS.Installer.Forms;

namespace PCS.Installer;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        // =========================================================
        // HIGH DPI / DISPLAY SCALING
        // =========================================================

        global::System.Windows.Forms.Application.SetHighDpiMode(
            global::System.Windows.Forms.HighDpiMode.PerMonitorV2);


        global::System.Windows.Forms.Application.EnableVisualStyles();


        global::System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(
            false);


        // =========================================================
        // START INSTALLER
        // =========================================================

        global::System.Windows.Forms.Application.Run(
            new MainInstallerForm());
    }
}