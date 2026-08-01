namespace PCS.Installer.Models;

public static class InstallerPaths
{
    public static string BackendFolder(
        string root)
        => Path.Combine(root, "Backend");


    public static string FrontendFolder(
        string root)
        => Path.Combine(root, "Frontend");


    public static string ConfigFolder(
        string root)
        => Path.Combine(root, "Config");


    public static string LogsFolder(
        string root)
        => Path.Combine(root, "Logs");
}