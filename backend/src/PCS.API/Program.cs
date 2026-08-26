using System.Text.Json;

using Microsoft.EntityFrameworkCore;

using FluentValidation.AspNetCore;

using PCS.API.Middleware;
using PCS.Application;
using PCS.Application.Common.Security;
using PCS.Infrastructure;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Persistence.Seed;

using Serilog;

Log.Logger =
    new LoggerConfiguration()
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .WriteTo.Console()
        .WriteTo.File(
            "Logs/log-.txt",
            rollingInterval: RollingInterval.Day)
        .CreateLogger();


var builder =
    WebApplication.CreateBuilder(args);


builder.Host.UseWindowsService();

builder.Host.UseSerilog();


// ========================================
// Load PCS Installer Configuration
// ========================================

/*
 * PCS installation structure:
 *
 * <PCS>
 * â”œâ”€â”€ Backend
 * â”‚   â””â”€â”€ PCS.API.exe
 * â”‚
 * â”œâ”€â”€ Frontend
 * â”‚   â”œâ”€â”€ index.html
 * â”‚   â””â”€â”€ assets
 * â”‚
 * â”œâ”€â”€ Database
 * â”œâ”€â”€ Config
 * â”‚   â””â”€â”€ pcs.config.json
 * â”‚
 * â”œâ”€â”€ Logs
 * â”œâ”€â”€ Backup
 * â”œâ”€â”€ Import
 * â””â”€â”€ Export
 *
 *
 * AppContext.BaseDirectory points to:
 *
 * <PCS>\Backend\
 *
 * Therefore:
 *
 * BackendDirectory
 *      â†“
 * Parent
 *      â†“
 * <PCS>\
 *      â†“
 * Frontend
 */


string backendDirectory =
    AppContext.BaseDirectory.TrimEnd(
        Path.DirectorySeparatorChar,
        Path.AltDirectorySeparatorChar);


DirectoryInfo? installDirectory =
    Directory.GetParent(
        backendDirectory);


string? pcsConfigPath =
    installDirectory == null
        ? null
        : Path.Combine(
            installDirectory.FullName,
            "Config",
            "pcs.config.json");


if (!string.IsNullOrWhiteSpace(
        pcsConfigPath) &&
    File.Exists(
        pcsConfigPath))
{
    try
    {
        string json =
            File.ReadAllText(
                pcsConfigPath);


        JsonElement config =
            JsonSerializer.Deserialize<JsonElement>(
                json);


        if (config.TryGetProperty(
                "ConnectionString",
                out JsonElement connectionStringElement))
        {
            string? connectionString =
                connectionStringElement.GetString();


            if (!string.IsNullOrWhiteSpace(
                    connectionString))
            {
                builder.Configuration[
                    "ConnectionStrings:DefaultConnection"] =
                    connectionString;
            }
        }
    }
    catch (Exception ex)
    {
        Log.Error(
            ex,
            "Failed to load PCS installer configuration from {ConfigPath}.",
            pcsConfigPath);
    }
}
else
{
    Log.Warning(
        "PCS installer configuration was not found. Expected path: {ConfigPath}",
        pcsConfigPath);
}


// ========================================
// Services
// ========================================

builder.Services.AddApplication();


builder.Services.AddInfrastructure(
    builder.Configuration);


builder.Services.AddControllers();


builder.Services.AddFluentValidationAutoValidation();


builder.Services.AddFluentValidationClientsideAdapters();


builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen();


// ========================================
// Authentication / Authorization
// ========================================

// builder.Services.AddAuthentication(...);


builder.Services.AddAuthorization(
    options =>
    {
        options.AddPolicy(
            Permissions.Projects.Read,
            policy =>
                policy.RequireClaim(
                    "permission",
                    Permissions.Projects.Read));


        options.AddPolicy(
            Permissions.Projects.Create,
            policy =>
                policy.RequireClaim(
                    "permission",
                    Permissions.Projects.Create));
    });


// ========================================
// CORS
// ========================================

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            "PCS",
            policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });


// ========================================
// Build
// ========================================

var app =
    builder.Build();


// ========================================
// Determine Installed Frontend Path
// ========================================

/*
 * During installed execution:
 *
 * AppContext.BaseDirectory
 *      â†“
 * <PCS>\Backend\
 *
 * Frontend is:
 *
 * <PCS>\Frontend\
 */

string frontendPath =
    Path.Combine(
        installDirectory?.FullName
            ?? string.Empty,
        "Frontend");


bool frontendAvailable =
    Directory.Exists(
        frontendPath) &&
    File.Exists(
        Path.Combine(
            frontendPath,
            "index.html"));


if (frontendAvailable)
{
    Log.Information(
        "PCS frontend detected at {FrontendPath}.",
        frontendPath);
}
else
{
    Log.Warning(
        "PCS frontend was not found at {FrontendPath}.",
        frontendPath);
}


// ========================================
// Database Migration & Security Seed
// ========================================

using (var scope =
    app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<PCSDbContext>();


    await dbContext.Database.MigrateAsync();


    await SecuritySeed.SeedAsync(
        dbContext);
}


// ========================================
// Pipeline
// ========================================

app.UseMiddleware<ExceptionMiddleware>();


app.UseCors(
    "PCS");


// app.UseHttpsRedirection();

// app.UseAuthentication();

app.UseAuthorization();


// ========================================
// Swagger
// ========================================

app.UseSwagger();


app.UseSwaggerUI();


// ========================================
// API Controllers
// ========================================

app.MapControllers();


// ========================================
// Production Frontend
// ========================================

/*
 * PCS Production architecture:
 *
 * Browser
 *     â†“
 * http://localhost:5000
 *     â†“
 * PCS.API
 *     â”œâ”€â”€ /api/*
 *     â””â”€â”€ React Frontend
 *
 *
 * The API itself serves the installed
 * React/Vite build.
 *
 * This means the installed application
 * does NOT require:
 *
 * - Vite
 * - Node.js
 * - port 5173
 * - port 5201
 */

if (frontendAvailable)
{
    app.UseDefaultFiles(
        new DefaultFilesOptions
        {
            FileProvider =
                new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
                    frontendPath)
        });


    app.UseStaticFiles(
        new StaticFileOptions
        {
            FileProvider =
                new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
                    frontendPath)
        });


    app.MapFallback(
        async context =>
        {
            /*
             * Never replace API responses with
             * index.html.
             *
             * API routes are handled by controllers.
             *
             * This fallback is only for React
             * client-side routes.
             */

            if (context.Request.Path.StartsWithSegments(
                    "/api"))
            {
                context.Response.StatusCode =
                    StatusCodes.Status404NotFound;

                return;
            }


            string indexFile =
                Path.Combine(
                    frontendPath,
                    "index.html");


            if (!File.Exists(indexFile))
            {
                context.Response.StatusCode =
                    StatusCodes.Status404NotFound;

                return;
            }


            context.Response.ContentType =
                "text/html; charset=utf-8";


            await context.Response.SendFileAsync(
                indexFile);
        });
}


app.Run();
