using PCS.Installer.Models;
using System.Diagnostics;

namespace PCS.Installer.Services;

public class ShortcutService
{
    public void CreateDesktopShortcut(
        InstallerContext context)
    {
        string desktop =
            Environment.GetFolderPath(
                Environment.SpecialFolder.Desktop);



        string shortcutPath =
            Path.Combine(
                desktop,
                "PCS.lnk");



        CreateShortcut(
            shortcutPath,
            context.ApiUrl);
    }





    public void CreateStartMenuShortcut(
        InstallerContext context)
    {
        string startMenu =
            Environment.GetFolderPath(
                Environment.SpecialFolder.StartMenu);



        string folder =
            Path.Combine(
                startMenu,
                context.ProductName);



        Directory.CreateDirectory(folder);



        string shortcutPath =
            Path.Combine(
                folder,
                "PCS.lnk");



        CreateShortcut(
            shortcutPath,
            context.ApiUrl);
    }





    private void CreateShortcut(
        string shortcutPath,
        string targetUrl)
    {
        string script =
$"""
Set WshShell = CreateObject("WScript.Shell")
Set shortcut = WshShell.CreateShortcut("{shortcutPath}")
shortcut.TargetPath = "{targetUrl}"
shortcut.Save
""";



        string temp =
            Path.Combine(
                Path.GetTempPath(),
                "create_pcs_shortcut.vbs");



        File.WriteAllText(
            temp,
            script);



        Process.Start(
            new ProcessStartInfo
            {
                FileName = "cscript.exe",
                Arguments = $"\"{temp}\"",
                CreateNoWindow = true,
                UseShellExecute = false
            })?
            .WaitForExit();



        File.Delete(temp);
    }
}