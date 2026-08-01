using PCS.Installer.Models;

namespace PCS.Installer.Services;

public class FrontendDeploymentService
{
    public void Deploy(
        InstallerContext context)
    {
        string source =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish",
                "Frontend");

        string destination =
            Path.Combine(
                context.InstallPath,
                "Frontend");

        if (!Directory.Exists(source))
        {
            throw new DirectoryNotFoundException(
                $"Frontend publish folder not found: {source}");
        }

        Directory.CreateDirectory(destination);

        foreach (string file in Directory.GetFiles(
                     source,
                     "*",
                     SearchOption.AllDirectories))
        {
            string relativePath =
                Path.GetRelativePath(
                    source,
                    file);

            string target =
                Path.Combine(
                    destination,
                    relativePath);

            string? targetDirectory =
                Path.GetDirectoryName(target);

            if (!string.IsNullOrEmpty(targetDirectory))
            {
                Directory.CreateDirectory(targetDirectory);
            }

            File.Copy(
                file,
                target,
                true);
        }
    }
}