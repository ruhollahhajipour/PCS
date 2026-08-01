using PCS.Installer.Services.Packaging;

namespace PCS.Installer.Services;

public class ReleaseBuilderService
{
    private readonly PackageBuilder packageBuilder;


    public ReleaseBuilderService()
    {
        packageBuilder =
            new PackageBuilder();
    }



    public async Task<string> BuildReleaseAsync(
        string solutionRoot,
        string frontendRoot)
    {

        string releaseRoot =
            Path.Combine(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.Desktop),
                "PCS-Releases");



        Directory.CreateDirectory(
            releaseRoot);



        string result =
            await packageBuilder.BuildAsync(
                solutionRoot,
                frontendRoot,
                releaseRoot);



        return result;
    }
}