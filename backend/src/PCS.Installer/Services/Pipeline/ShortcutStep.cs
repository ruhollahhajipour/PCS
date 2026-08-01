using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class ShortcutStep : IInstallationStep
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
        progress?.Report(Name);


        shortcutService.CreateDesktopShortcut(
            context);


        shortcutService.CreateStartMenuShortcut(
            context);



        progress?.Report(
            "Shortcuts created successfully.");


        return Task.CompletedTask;
    }
}