using PCS.Installer.Models;
using System.Diagnostics;

namespace PCS.Installer.Services.Deployment;

public class WindowsServiceInstaller
{
    private const string ServiceName =
        "PCS.API.Service";


    private const string DisplayName =
        "PCS Project Control Suite API";



    public void Install(
        InstallerContext context)
    {
        string apiFolder =
            Path.Combine(
                context.InstallPath,
                "Backend");


        string exePath =
            Path.Combine(
                apiFolder,
                "PCS.API.exe");



        if (!File.Exists(exePath))
        {
            throw new FileNotFoundException(
                "PCS.API.exe not found.",
                exePath);
        }



        RemoveExistingService();



        ProcessStartInfo info =
            new ProcessStartInfo
            {
                FileName =
                    "sc.exe",

                Arguments =
                    $"create {ServiceName} " +
                    $"binPath= \"{exePath}\" " +
                    $"DisplayName= \"{DisplayName}\" " +
                    "start= auto",

                UseShellExecute =
                    false,

                CreateNoWindow =
                    true
            };



        using(Process process =
            Process.Start(info)!)
        {
            process.WaitForExit();
        }



        StartService();
    }



    private void StartService()
    {
        ProcessStartInfo info =
            new ProcessStartInfo
            {
                FileName =
                    "sc.exe",

                Arguments =
                    $"start {ServiceName}",

                UseShellExecute =
                    false,

                CreateNoWindow =
                    true
            };


        using(Process process =
            Process.Start(info)!)
        {
            process.WaitForExit();
        }
    }



    public void Stop()
    {
        Process.Start(
            "sc.exe",
            $"stop {ServiceName}");
    }



    public void Uninstall()
    {
        Stop();

        RemoveExistingService();
    }



    private void RemoveExistingService()
    {
        try
        {
            ProcessStartInfo info =
                new ProcessStartInfo
                {
                    FileName =
                        "sc.exe",

                    Arguments =
                        $"delete {ServiceName}",

                    UseShellExecute =
                        false,

                    CreateNoWindow =
                        true
                };


            using(Process process =
                Process.Start(info)!)
            {
                process.WaitForExit();
            }
        }
        catch
        {

        }
    }
}