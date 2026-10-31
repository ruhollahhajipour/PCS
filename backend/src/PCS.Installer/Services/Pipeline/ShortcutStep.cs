using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public sealed class ShortcutStep : IInstallationStep
{
    private readonly ShortcutService shortcutService;


    public ShortcutStep()
    {
        shortcutService =
            new ShortcutService();
    }


    public string Name =>
        "Creating shortcuts...";


    public int Progress =>
        98;


    public Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? progress = null)
    {
        ArgumentNullException.ThrowIfNull(context);


        // ========================================================
        // DESKTOP SHORTCUT
        // ========================================================

        progress?.Report(
            "Creating desktop shortcut...");


        shortcutService.CreateDesktopShortcut(
            context);


        progress?.Report(
            "Desktop shortcut created successfully.");


        // ========================================================
        // START MENU SHORTCUT
        // ========================================================

        progress?.Report(
            "Creating Start Menu shortcut...");


        shortcutService.CreateStartMenuShortcut(
            context);


        progress?.Report(
            "Start Menu shortcut created successfully.");


        // ========================================================
        // COMPLETED
        // ========================================================

        progress?.Report(
            "Shortcut step completed.");


        return Task.CompletedTask;
    }
}