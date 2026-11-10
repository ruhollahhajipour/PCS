using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PCS.Infrastructure.Persistence;
using PCS.Installer.Models;

namespace PCS.Installer.Services.Database;

public class DatabaseInstallerService
{
    public void CreateDatabase(
        InstallerContext context)
    {
        if (context.DatabaseType ==
            DatabaseType.SqlServer)
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
        string connectionString =
            BuildSqlServerConnection(context);


        context.ConnectionString =
            connectionString;


        var options =
            new DbContextOptionsBuilder<PCSDbContext>();


        options.UseSqlServer(
            connectionString,
            sqlServer => sqlServer.MigrationsAssembly(
                "PCS.Infrastructure.Migrations.SqlServer"));


        using var db =
            new PCSDbContext(
                options.Options);


        try
        {
            db.Database.Migrate();
        }
        catch (SqlException ex) when (
            ex.Message.Contains(
                "certificate",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "The SQL Server TLS certificate is not trusted by this computer. " +
                "Install a trusted certificate on the server, or tick " +
                "\"Trust server certificate\" on the database page (less secure).",
                ex);
        }


        SeedData(db);
    }


    private void CreateSqliteDatabase(
        InstallerContext context)
    {
        string folder =
            context.DatabasePath;


        Directory.CreateDirectory(
            folder);


        string database =
            Path.Combine(
                folder,
                $"{context.DatabaseName}.db");


        string connectionString =
            $"Data Source={database}";


        context.ConnectionString =
            connectionString;


        var options =
            new DbContextOptionsBuilder<PCSDbContext>();


        options.UseSqlite(
            connectionString);


        using var db =
            new PCSDbContext(
                options.Options);


        db.Database.Migrate();


        SeedData(db);
    }


    private string BuildSqlServerConnection(
        InstallerContext context)
    {
        // The builder escapes values, so a password containing ';' or '='
        // cannot corrupt or inject additional connection-string options.
        var builder =
            new SqlConnectionStringBuilder
            {
                DataSource =
                    context.DatabaseServer,

                InitialCatalog =
                    context.DatabaseName,

                Encrypt =
                    SqlConnectionEncryptOption.Mandatory,

                TrustServerCertificate =
                    context.TrustServerCertificate
            };


        if (context.WindowsAuthentication)
        {
            builder.IntegratedSecurity = true;
        }
        else
        {
            builder.UserID = context.Username;
            builder.Password = context.Password;
        }


        return builder.ConnectionString;
    }


    private void SeedData(
        PCSDbContext db)
    {
        // Initial seed data
        // Admin user / roles / settings
        // در مرحله بعد تکمیل می‌شود.

        db.SaveChanges();
    }
}