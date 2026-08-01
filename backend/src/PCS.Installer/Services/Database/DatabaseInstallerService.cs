using Microsoft.EntityFrameworkCore;
using PCS.Infrastructure.Persistence;
using PCS.Installer.Models;

namespace PCS.Installer.Services.Database;

public class DatabaseInstallerService
{
    public void CreateDatabase(
        InstallerContext context)
    {

        if (context.DatabaseType == DatabaseType.SqlServer)
        {
            CreateSqlServerDatabase(context);
        }
        else
        {
            CreateSqliteDatabase(context);
        }

    }








    private void CreateSqlServerDatabase(
        InstallerContext context)
    {

        var options =
            new DbContextOptionsBuilder<PCSDbContext>();


        options.UseSqlServer(
            BuildSqlServerConnection(context));



        using var db =
            new PCSDbContext(
                options.Options);



        db.Database.Migrate();



        SeedData(db);
    }









    private void CreateSqliteDatabase(
        InstallerContext context)
    {

        string folder =
            Path.Combine(
                context.InstallPath,
                "Database");



        Directory.CreateDirectory(folder);



        string database =
            Path.Combine(
                folder,
                $"{context.DatabaseName}.db");



        var options =
            new DbContextOptionsBuilder<PCSDbContext>();



        options.UseSqlite(
            $"Data Source={database}");



        using var db =
            new PCSDbContext(
                options.Options);



        db.Database.Migrate();



        SeedData(db);
    }









    private string BuildSqlServerConnection(
        InstallerContext context)
    {

        if (context.WindowsAuthentication)
        {
            return
                $"Server={context.DatabaseServer};" +
                $"Database={context.DatabaseName};" +
                "Trusted_Connection=True;" +
                "TrustServerCertificate=True;";
        }



        return
            $"Server={context.DatabaseServer};" +
            $"Database={context.DatabaseName};" +
            $"User Id={context.Username};" +
            $"Password={context.Password};" +
            "TrustServerCertificate=True;";
    }









    private void SeedData(
        PCSDbContext db)
    {

        // Initial seed data
        // Admin user / roles / settings
        // در مرحله بعد تکمیل می‌شود


        db.SaveChanges();
    }
}