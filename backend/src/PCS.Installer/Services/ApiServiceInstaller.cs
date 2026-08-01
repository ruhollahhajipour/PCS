using System.Diagnostics;
using PCS.Installer.Models;

namespace PCS.Installer.Services;


public class ApiServiceInstaller
{


    private const string ServiceName =
        "PCS.API";



    public void Install(
        InstallerContext context)
    {

        string apiExe =
            Path.Combine(
                context.InstallPath,
                "Backend",
                "PCS.API.exe");



        if(!File.Exists(apiExe))
        {
            throw new FileNotFoundException(
                "PCS.API.exe not found.",
                apiExe);
        }



        Execute(
            $"create {ServiceName} binPath= \"{apiExe}\" start= auto");



        Execute(
            $"description {ServiceName} \"Project Control Suite API Service\"");



        Execute(
            $"start {ServiceName}");

    }







    public void Uninstall()
    {

        Execute(
            $"stop {ServiceName}");



        Execute(
            $"delete {ServiceName}");

    }








    private void Execute(
        string arguments)
    {

        using Process process =
            new Process();



        process.StartInfo =
            new ProcessStartInfo
            {
                FileName = "sc.exe",

                Arguments = arguments,

                CreateNoWindow = true,

                UseShellExecute = false,

                RedirectStandardOutput = true,

                RedirectStandardError = true
            };



        process.Start();



        string error =
            process.StandardError.ReadToEnd();



        process.WaitForExit();



        if(process.ExitCode != 0)
        {

            throw new Exception(
                $"Windows Service installation failed: {error}");

        }

    }

}