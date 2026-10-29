using System.Diagnostics;
using System.Security.Cryptography;

using PCS.Installer.Models;

namespace PCS.Installer.Services.Deployment;

public sealed class ApiDeploymentService
{
    private const int CopyRetryCount = 30;

    private const int CopyRetryDelayMilliseconds = 1000;


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
                "API");


        string destination =
            context.BackendPath;


        if (!Directory.Exists(source))
        {
            throw new DirectoryNotFoundException(
                "API publish folder not found."
                + Environment.NewLine
                + Environment.NewLine
                + "Expected path:"
                + Environment.NewLine
                + source
                + Environment.NewLine
                + Environment.NewLine
                + "Installer base directory:"
                + Environment.NewLine
                + AppContext.BaseDirectory);
        }


        Directory.CreateDirectory(
            destination);


        /*
         * PCS does not use a Windows Service.
         *
         * The API runs as a normal user-level process.
         * Therefore the installer must never use sc.exe
         * and must not require Administrator privileges.
         */

        StopExistingApiProcesses(
            destination);


        WaitForApiProcessesToExit(
            destination);


        Thread.Sleep(500);


        foreach (string file in Directory.GetFiles(
                     source,
                     "*",
                     SearchOption.AllDirectories))
        {
            string relativePath =
                Path.GetRelativePath(
                    source,
                    file);

            // Preserve the installed API configuration during repair
            // and upgrade. It contains the existing JWT signing key.
            if (context.Mode != InstallationMode.NewInstall &&
                string.Equals(
                    relativePath,
                    "appsettings.json",
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }


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


            /*
             * Do not overwrite an identical file.
             */

            if (File.Exists(target))
            {
                if (FilesAreIdentical(
                        file,
                        target))
                {
                    continue;
                }
            }


            CopyFileWithRetry(
                file,
                target);
        }
    }


    private static void StopExistingApiProcesses(
        string backendPath)
    {
        string normalizedBackendPath =
            NormalizePath(
                backendPath);


        Process[] processes =
            Process.GetProcessesByName(
                "PCS.API");


        foreach (Process process in processes)
        {
            try
            {
                string? processPath =
                    TryGetProcessPath(
                        process);


                if (string.IsNullOrWhiteSpace(
                        processPath))
                {
                    continue;
                }


                string normalizedProcessPath =
                    NormalizePath(
                        processPath);


                if (!IsPathInsideDirectory(
                        normalizedProcessPath,
                        normalizedBackendPath))
                {
                    continue;
                }


                if (!process.HasExited)
                {
                    process.Kill(
                        entireProcessTree: true);
                }
            }
            catch
            {
                /*
                 * The process may terminate between
                 * discovery and Kill().
                 *
                 * Deployment will verify that files
                 * can actually be replaced.
                 */
            }
            finally
            {
                process.Dispose();
            }
        }
    }


    private static void WaitForApiProcessesToExit(
        string backendPath)
    {
        string normalizedBackendPath =
            NormalizePath(
                backendPath);


        DateTime timeout =
            DateTime.UtcNow.AddSeconds(15);


        while (DateTime.UtcNow < timeout)
        {
            bool running = false;


            Process[] processes =
                Process.GetProcessesByName(
                    "PCS.API");


            foreach (Process process in processes)
            {
                try
                {
                    string? processPath =
                        TryGetProcessPath(
                            process);


                    if (string.IsNullOrWhiteSpace(
                            processPath))
                    {
                        continue;
                    }


                    string normalizedProcessPath =
                        NormalizePath(
                            processPath);


                    if (IsPathInsideDirectory(
                            normalizedProcessPath,
                            normalizedBackendPath))
                    {
                        running = true;
                        break;
                    }
                }
                catch
                {
                    /*
                     * Ignore processes that disappear
                     * while checking them.
                     */
                }
                finally
                {
                    process.Dispose();
                }
            }


            if (!running)
            {
                return;
            }


            Thread.Sleep(250);
        }
    }


    private static string? TryGetProcessPath(
        Process process)
    {
        try
        {
            return process.MainModule?.FileName;
        }
        catch
        {
            return null;
        }
    }


    private static bool IsPathInsideDirectory(
        string filePath,
        string directoryPath)
    {
        string directoryWithSeparator =
            directoryPath.EndsWith(
                Path.DirectorySeparatorChar.ToString(),
                StringComparison.Ordinal)
                    ? directoryPath
                    : directoryPath
                        + Path.DirectorySeparatorChar;


        return filePath.StartsWith(
            directoryWithSeparator,
            StringComparison.OrdinalIgnoreCase);
    }


    private static string NormalizePath(
        string path)
    {
        return Path.GetFullPath(
            path)
            .TrimEnd(
                Path.DirectorySeparatorChar,
                Path.AltDirectorySeparatorChar);
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
                    true);


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
            "Unable to deploy API file because "
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


    private static bool FilesAreIdentical(
        string firstFile,
        string secondFile)
    {
        try
        {
            FileInfo firstInfo =
                new FileInfo(
                    firstFile);


            FileInfo secondInfo =
                new FileInfo(
                    secondFile);


            if (firstInfo.Length !=
                secondInfo.Length)
            {
                return false;
            }


            using FileStream firstStream =
                new FileStream(
                    firstFile,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite |
                    FileShare.Delete);


            using FileStream secondStream =
                new FileStream(
                    secondFile,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite |
                    FileShare.Delete);


            using SHA256 sha256 =
                SHA256.Create();


            byte[] firstHash =
                sha256.ComputeHash(
                    firstStream);


            byte[] secondHash =
                sha256.ComputeHash(
                    secondStream);


            return CryptographicOperations.FixedTimeEquals(
                firstHash,
                secondHash);
        }
        catch
        {
            /*
             * If the destination cannot be opened
             * for comparison, let the normal copy/retry
             * mechanism handle it.
             */

            return false;
        }
    }
}