using PCS.Installer.Models;

namespace PCS.Installer.Services.Deployment;


public class ApiDeploymentService
{

    public void Deploy(
        InstallerContext context)
    {

        string source =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish",
                "API");



        string destination =
            Path.Combine(
                context.InstallPath,
                "Backend");



        if(!Directory.Exists(source))
        {
            throw new DirectoryNotFoundException(
                $"API publish folder not found: {source}");
        }




        Directory.CreateDirectory(
            destination);





        foreach(string file in Directory.GetFiles(
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



            if(!string.IsNullOrEmpty(targetDirectory))
            {
                Directory.CreateDirectory(
                    targetDirectory);
            }




            File.Copy(
                file,
                target,
                true);

        }



    }

}