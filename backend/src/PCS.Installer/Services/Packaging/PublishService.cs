using System.Diagnostics;

namespace PCS.Installer.Services.Packaging;

public class PublishService
{
    public async Task PublishApiAsync(
        string solutionRoot)
    {
        string apiProject =
            Path.Combine(
                solutionRoot,
                "src",
                "PCS.API",
                "PCS.API.csproj");

        string output =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish",
                "API");

        await ExecuteAsync(
            "dotnet",
            $"publish \"{apiProject}\" -c Release -o \"{output}\"");
    }

    public async Task PublishFrontendAsync(
        string frontendRoot)
    {
        await ExecuteAsync(
            "npm",
            "install",
            frontendRoot);

        await ExecuteAsync(
            "npm",
            "run build",
            frontendRoot);

        string source =
            Path.Combine(
                frontendRoot,
                "dist");

        string destination =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish",
                "Frontend");

        CopyDirectory(
            source,
            destination);
    }

    public async Task PublishAllAsync(
        string solutionRoot,
        string frontendRoot)
    {
        await PublishApiAsync(
            solutionRoot);

        await PublishFrontendAsync(
            frontendRoot);
    }

    private static async Task ExecuteAsync(
        string fileName,
        string arguments,
        string? workingDirectory = null)
    {
        var process =
            new Process();

        process.StartInfo =
            new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                WorkingDirectory =
                    workingDirectory ??
                    Environment.CurrentDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

        process.Start();

        await process.WaitForExitAsync();

        if (process.ExitCode != 0)
        {
            string error =
                await process.StandardError.ReadToEndAsync();

            throw new Exception(error);
        }
    }

    private static void CopyDirectory(
        string source,
        string destination)
    {
        if (Directory.Exists(destination))
        {
            Directory.Delete(
                destination,
                true);
        }

        Directory.CreateDirectory(
            destination);

        foreach (string directory in Directory.GetDirectories(
                     source,
                     "*",
                     SearchOption.AllDirectories))
        {
            Directory.CreateDirectory(
                directory.Replace(
                    source,
                    destination));
        }

        foreach (string file in Directory.GetFiles(
                     source,
                     "*.*",
                     SearchOption.AllDirectories))
        {
            File.Copy(
                file,
                file.Replace(
                    source,
                    destination),
                true);
        }
    }
}