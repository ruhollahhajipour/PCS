using System.Diagnostics;

namespace PCS.Installer.Services;

public class ServiceManager
{
    public void Install(
        string serviceName,
        string executablePath,
        string description)
    {
        Execute(
            $"create \"{serviceName}\" binPath= \"{executablePath}\" start= auto");

        Execute(
            $"description \"{serviceName}\" \"{description}\"");
    }

    public void Start(
        string serviceName)
    {
        Execute(
            $"start \"{serviceName}\"");
    }

    public void Stop(
        string serviceName)
    {
        Execute(
            $"stop \"{serviceName}\"");
    }

    public void Delete(
        string serviceName)
    {
        Execute(
            $"delete \"{serviceName}\"");
    }

    public bool Exists(
        string serviceName)
    {
        using Process process = new();

        process.StartInfo.FileName = "sc.exe";
        process.StartInfo.Arguments = $"query \"{serviceName}\"";
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;

        process.Start();

        process.WaitForExit();

        return process.ExitCode == 0;
    }

    private static void Execute(
        string arguments)
    {
        using Process process = new();

        process.StartInfo.FileName = "sc.exe";
        process.StartInfo.Arguments = arguments;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;

        process.Start();

        process.WaitForExit();

        if (process.ExitCode != 0)
        {
            throw new InvalidOperationException(
                $"sc.exe failed.\nArguments: {arguments}");
        }
    }
}