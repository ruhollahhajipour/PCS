using PCS.Installer.Models;

namespace PCS.Installer.Services.Deployment;

public sealed class FrontendDeploymentService
{
    private const int CopyRetryCount = 15;

    private const int CopyRetryDelayMilliseconds = 500;


    public void Deploy(
        InstallerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }


        string source =
            Path.Combine(
                context.PublishPath,
                "Frontend");


        string destination =
            context.FrontendPath;


        if (!Directory.Exists(source))
        {
            throw new DirectoryNotFoundException(
                "Frontend publish folder not found."
                + Environment.NewLine
                + Environment.NewLine
                + "Expected path:"
                + Environment.NewLine
                + source
                + Environment.NewLine
                + Environment.NewLine
                + "Installer PublishPath:"
                + Environment.NewLine
                + context.PublishPath);
        }


        Directory.CreateDirectory(
            destination);


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
                Path.GetDirectoryName(
                    target);


            if (!string.IsNullOrEmpty(
                    targetDirectory))
            {
                Directory.CreateDirectory(
                    targetDirectory);
            }


            CopyFileWithRetry(
                file,
                target);
        }
    }


    private static void CopyFileWithRetry(
        string source,
        string destination)
    {
        Exception? lastException = null;


        for (int attempt = 1;
             attempt <= CopyRetryCount;
             attempt++)
        {
            try
            {
                File.Copy(
                    source,
                    destination,
                    overwrite: true);


                return;
            }
            catch (IOException ex)
            {
                lastException = ex;
            }
            catch (UnauthorizedAccessException ex)
            {
                lastException = ex;
            }


            if (attempt < CopyRetryCount)
            {
                Thread.Sleep(
                    CopyRetryDelayMilliseconds);
            }
        }


        throw new IOException(
            "Unable to deploy Frontend file because "
            + "the destination file is locked or inaccessible."
            + Environment.NewLine
            + Environment.NewLine
            + "Source:"
            + Environment.NewLine
            + source
            + Environment.NewLine
            + Environment.NewLine
            + "Destination:"
            + Environment.NewLine
            + destination
            + Environment.NewLine
            + Environment.NewLine
            + "Retry attempts:"
            + Environment.NewLine
            + CopyRetryCount,
            lastException);
    }
}