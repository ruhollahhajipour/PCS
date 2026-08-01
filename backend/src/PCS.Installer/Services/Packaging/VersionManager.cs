using System.Reflection;

namespace PCS.Installer.Services;

public class VersionManager
{
    public string ProductName =>
        "PCS";


    public Version ProductVersion =>
        Assembly
            .GetExecutingAssembly()
            .GetName()
            .Version
        ?? new Version(1, 0, 0, 0);



    public string VersionText =>
        ProductVersion.ToString();



    public DateTime BuildDate
    {
        get
        {
            string location =
                Path.Combine(
                    AppContext.BaseDirectory,
                    "PCS.Installer.dll");


            if (File.Exists(location))
            {
                return File.GetLastWriteTime(location);
            }


            return DateTime.Now;
        }
    }



    public bool IsNewerThan(
        Version installedVersion)
    {
        return ProductVersion >
               installedVersion;
    }



    public bool IsSameVersion(
        Version installedVersion)
    {
        return ProductVersion ==
               installedVersion;
    }



    public bool IsOlderThan(
        Version installedVersion)
    {
        return ProductVersion <
               installedVersion;
    }



    public string GetDisplayText()
    {
        return
$"""
Product : {ProductName}
Version : {VersionText}
Build   : {BuildDate:yyyy-MM-dd HH:mm}
""";
    }
}