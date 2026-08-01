using PCS.Installer.Models;

namespace PCS.Installer.Services;

public class BuildInstallerService
{
    public void PreparePublish(
        InstallerContext context)
    {
        string publishRoot =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish");


        if (Directory.Exists(publishRoot))
        {
            Directory.Delete(
                publishRoot,
                true);
        }


        Directory.CreateDirectory(
            publishRoot);


        CreateFolder(
            publishRoot,
            "API");

        CreateFolder(
            publishRoot,
            "Frontend");

        CreateFolder(
            publishRoot,
            "Database");

        CreateFolder(
            publishRoot,
            "Config");

        CreateFolder(
            publishRoot,
            "Logs");
    }



    public void ValidatePublish()
    {
        string publishRoot =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish");


        string api =
            Path.Combine(
                publishRoot,
                "API");


        string frontend =
            Path.Combine(
                publishRoot,
                "Frontend");



        if (!Directory.Exists(api))
        {
            throw new DirectoryNotFoundException(
                "API publish folder not found.");
        }



        if (!Directory.Exists(frontend))
        {
            throw new DirectoryNotFoundException(
                "Frontend publish folder not found.");
        }
    }




    private static void CreateFolder(
        string root,
        string name)
    {
        string path =
            Path.Combine(
                root,
                name);


        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
    }
}