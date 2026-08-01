using System.IO.Compression;

namespace PCS.Installer.Services.Packaging;


public class ZipService
{

    public void Create(
        string sourceFolder,
        string zipFile)
    {


        if(!Directory.Exists(sourceFolder))
        {
            throw new DirectoryNotFoundException(
                sourceFolder);
        }




        string? folder =
            Path.GetDirectoryName(
                zipFile);



        if(!string.IsNullOrWhiteSpace(folder))
        {
            Directory.CreateDirectory(
                folder);
        }





        if(File.Exists(zipFile))
        {
            File.Delete(
                zipFile);
        }





        ZipFile.CreateFromDirectory(
            sourceFolder,
            zipFile,
            CompressionLevel.Optimal,
            false);

    }

}