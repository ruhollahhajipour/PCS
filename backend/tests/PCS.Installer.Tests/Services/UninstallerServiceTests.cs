using Microsoft.Win32;
using PCS.Installer.Models;
using PCS.Installer.Services;
using Xunit;

namespace PCS.Installer.Tests.Services;

public sealed class UninstallerServiceTests
{
    private const string RunKeyPath =
        @"Software\Microsoft\Windows\CurrentVersion\Run";

    [Fact]
    public void Uninstall_DefaultBehavior_PreservesUserDataAndRemovesStartupEntry()
    {
        var fixture = CreateFixture();
        CreateStartupEntry(fixture.Context);

        try
        {
            new UninstallerService().Uninstall(fixture.Context);

            AssertApplicationFilesRemoved(fixture.Context);
            Assert.True(File.Exists(fixture.DatabaseFile));
            Assert.True(File.Exists(fixture.BackupFile));
            Assert.True(File.Exists(fixture.ImportFile));
            Assert.True(File.Exists(fixture.ExportFile));
            Assert.False(StartupEntryExists(fixture.Context.ProductName));
            Assert.True(Directory.Exists(fixture.Context.InstallPath));
        }
        finally
        {
            RemoveStartupEntry(fixture.Context.ProductName);
            DeleteTestDirectory(fixture.Context.InstallPath);
        }
    }

    [Fact]
    public void Uninstall_WhenRemoveUserDataIsExplicitlyTrue_RemovesProjectData()
    {
        var fixture = CreateFixture();
        CreateStartupEntry(fixture.Context);

        try
        {
            new UninstallerService().Uninstall(
                fixture.Context,
                removeUserData: true);

            AssertApplicationFilesRemoved(fixture.Context);
            Assert.False(File.Exists(fixture.DatabaseFile));
            Assert.False(File.Exists(fixture.BackupFile));
            Assert.False(File.Exists(fixture.ImportFile));
            Assert.False(File.Exists(fixture.ExportFile));
            Assert.False(StartupEntryExists(fixture.Context.ProductName));
            Assert.False(Directory.Exists(fixture.Context.InstallPath));
        }
        finally
        {
            RemoveStartupEntry(fixture.Context.ProductName);
            DeleteTestDirectory(fixture.Context.InstallPath);
        }
    }

    private static (InstallerContext Context, string DatabaseFile, string BackupFile, string ImportFile, string ExportFile) CreateFixture()
    {
        var root = Path.Combine(
            Path.GetTempPath(),
            "PCS-Installer-Uninstall-Tests",
            Guid.NewGuid().ToString("N"));

        var context = new InstallerContext
        {
            InstallPath = root,
            ProductName = $"PCS.Uninstaller.Test.{Guid.NewGuid():N}"
        };

        CreateFile(context.BackendPath, "PCS.API.exe");
        CreateFile(context.FrontendPath, "index.html");
        CreateFile(Path.Combine(context.InstallPath, "Launcher"), "PCS.Launcher.exe");
        CreateFile(context.ConfigPath, "pcs.config.json");
        CreateFile(context.LogsPath, "installer.log");
        CreateFile(Path.Combine(context.InstallPath, "Resources"), "PCS.ico");

        var databaseFile = CreateFile(context.DatabasePath, "PCS.db");
        var backupFile = CreateFile(context.BackupPath, "PCS-backup.db");
        var importFile = CreateFile(context.ImportPath, "source.xlsx");
        var exportFile = CreateFile(context.ExportPath, "report.xlsx");

        return (context, databaseFile, backupFile, importFile, exportFile);
    }

    private static string CreateFile(string directory, string fileName)
    {
        Directory.CreateDirectory(directory);
        var path = Path.Combine(directory, fileName);
        File.WriteAllText(path, "installer-test-data");
        return path;
    }

    private static void CreateStartupEntry(InstallerContext context)
    {
        using var key = Registry.CurrentUser.CreateSubKey(RunKeyPath, writable: true);
        Assert.NotNull(key);
        key!.SetValue(
            context.ProductName,
            Path.Combine(context.InstallPath, "Launcher", "PCS.Launcher.exe"),
            RegistryValueKind.String);
    }

    private static bool StartupEntryExists(string productName)
    {
        using var key = Registry.CurrentUser.OpenSubKey(RunKeyPath, writable: false);
        return key?.GetValue(productName) is string;
    }

    private static void RemoveStartupEntry(string productName)
    {
        using var key = Registry.CurrentUser.OpenSubKey(RunKeyPath, writable: true);
        key?.DeleteValue(productName, throwOnMissingValue: false);
    }

    private static void AssertApplicationFilesRemoved(InstallerContext context)
    {
        Assert.False(Directory.Exists(context.BackendPath));
        Assert.False(Directory.Exists(context.FrontendPath));
        Assert.False(Directory.Exists(Path.Combine(context.InstallPath, "Launcher")));
        Assert.False(Directory.Exists(context.ConfigPath));
        Assert.False(Directory.Exists(context.LogsPath));
        Assert.False(Directory.Exists(Path.Combine(context.InstallPath, "Resources")));
    }

    private static void DeleteTestDirectory(string directory)
    {
        if (Directory.Exists(directory))
        {
            Directory.Delete(directory, recursive: true);
        }
    }
}
