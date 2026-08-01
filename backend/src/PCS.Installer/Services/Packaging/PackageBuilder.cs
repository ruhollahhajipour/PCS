using PCS.Installer.Services;

namespace PCS.Installer.Services.Packaging;

public class PackageBuilder
{
    private readonly PublishService publishService;
    private readonly ManifestService manifestService;
    private readonly VersionManager versionManager;
    private readonly ZipService zipService;


    public PackageBuilder()
    {
        publishService =
            new PublishService();

        manifestService =
            new ManifestService();

        versionManager =
            new VersionManager();

        zipService =
            new ZipService();
    }





    public async Task<string> BuildAsync(
        string solutionRoot,
        string frontendRoot,
        string releaseRoot)
    {

        string version =
            versionManager.VersionText;



        string packageFolder =
            Path.Combine(
                releaseRoot,
                $"PCS_{version}");



        if(Directory.Exists(packageFolder))
        {
            Directory.Delete(
                packageFolder,
                true);
        }



        Directory.CreateDirectory(
            packageFolder);




        string backendFolder =
            Path.Combine(
                packageFolder,
                "Backend");



        string frontendFolder =
            Path.Combine(
                packageFolder,
                "Frontend");



        string databaseFolder =
            Path.Combine(
                packageFolder,
                "Database");



        string configFolder =
            Path.Combine(
                packageFolder,
                "Config");



        string manualFolder =
            Path.Combine(
                packageFolder,
                "Manuals");




        Directory.CreateDirectory(
            backendFolder);


        Directory.CreateDirectory(
            frontendFolder);


        Directory.CreateDirectory(
            databaseFolder);


        Directory.CreateDirectory(
            configFolder);


        Directory.CreateDirectory(
            manualFolder);





        await publishService.PublishAllAsync(
            solutionRoot,
            frontendRoot);





        string publishSource =
            Path.Combine(
                AppContext.BaseDirectory,
                "Publish");





        CopyDirectory(
            Path.Combine(
                publishSource,
                "API"),
            backendFolder);




        CopyDirectory(
            Path.Combine(
                publishSource,
                "Frontend"),
            frontendFolder);






        manifestService.Generate(
            packageFolder);




        File.WriteAllText(
            Path.Combine(
                packageFolder,
                "version.txt"),
            version);






        string zipFile =
            Path.Combine(
                releaseRoot,
                $"PCS_{version}.zip");



        zipService.Create(
            packageFolder,
            zipFile);



        return zipFile;
    }






    private static void CopyDirectory(
        string source,
        string destination)
    {

        if(!Directory.Exists(source))
            return;



        Directory.CreateDirectory(
            destination);



        foreach(string file in Directory.GetFiles(
                    source,
                    "*",
                    SearchOption.AllDirectories))
        {

            string target =
                file.Replace(
                    source,
                    destination);



            Directory.CreateDirectory(
                Path.GetDirectoryName(target)!);



            File.Copy(
                file,
                target,
                true);
        }
    }
}