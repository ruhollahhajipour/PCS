using System.Text;
using System.Threading.RateLimiting;
using System.Text.Json;
using System.Text.Json.Nodes;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

using FluentValidation.AspNetCore;

using PCS.API.Health;
using PCS.API.Middleware;
using PCS.API.Security;
using PCS.Application;
using PCS.Application.Common.Security;
using PCS.Application.Common.Interfaces;
using PCS.Application.Identity;
using PCS.Application.Identity.Interfaces;
using PCS.Infrastructure;
using PCS.Infrastructure.Persistence;
using PCS.Infrastructure.Persistence.Seed;

using Serilog;


// ============================================================
// Logging
// ============================================================

var loggerConfiguration =
    new LoggerConfiguration()
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .WriteTo.Console();

if (OperatingSystem.IsWindows())
{
    string logDirectory =
        Path.Combine(
            Environment.GetFolderPath(
                Environment.SpecialFolder.LocalApplicationData),
            "PCS",
            "Logs");

    Directory.CreateDirectory(logDirectory);

    loggerConfiguration.WriteTo.File(
        Path.Combine(logDirectory, "log-.txt"),
        rollingInterval: RollingInterval.Day);
}

Log.Logger = loggerConfiguration.CreateLogger();


// ============================================================
// PCS Paths
// ============================================================
//
// Installed structure:
//
// %LOCALAPPDATA%\PCS\
// ├── Backend\
// │   ├── PCS.API.exe
// │   └── appsettings.json
// ├── Frontend\
// │   └── index.html
// ├── Launcher\
// ├── Database\
// │   └── PCS.db
// └── Config\
//     └── pcs.config.json
//
// IMPORTANT:
//
// AppContext.BaseDirectory points to the directory containing
// PCS.API.exe.
//
// This is intentionally used to detect the installed PCS root
// independently of the current working directory.
//
// This is important because the API may be started from:
//
// D:\Projects\PCS
//
// while the actual application is installed in:
//
// %LOCALAPPDATA%\PCS\Backend
//
// ============================================================

string baseDirectory =
    Path.GetFullPath(
        AppContext.BaseDirectory);

baseDirectory =
    baseDirectory.TrimEnd(
        Path.DirectorySeparatorChar,
        Path.AltDirectorySeparatorChar);


DirectoryInfo baseDirectoryInfo =
    new DirectoryInfo(
        baseDirectory);


string? installedRoot = null;


if (
    string.Equals(
        baseDirectoryInfo.Name,
        "Backend",
        StringComparison.OrdinalIgnoreCase) &&
    baseDirectoryInfo.Parent != null)
{
    installedRoot =
        baseDirectoryInfo.Parent.FullName;
}


// ============================================================
// Builder
// ============================================================
//
// IMPORTANT:
//
// For an installed PCS application, ContentRootPath MUST be
// the Backend directory.
//
// Otherwise ASP.NET Core can use the current PowerShell
// directory as its ContentRootPath and fail to load:
//
//     Backend\appsettings.json
//
// This was the root cause of the JWT configuration error.
//
// ============================================================

WebApplicationBuilder builder;


if (!string.IsNullOrWhiteSpace(installedRoot))
{
    builder =
        WebApplication.CreateBuilder(
            new WebApplicationOptions
            {
                Args =
                    args,

                ContentRootPath =
                    baseDirectory,

                ApplicationName =
                    typeof(Program)
                        .Assembly
                        .GetName()
                        .Name
            });
}
else
{
    // Development mode.
    //
    // dotnet run supplies the normal project directory as
    // ContentRootPath.

    builder =
        WebApplication.CreateBuilder(
            args);
}


if (
    OperatingSystem.IsWindows() &&
    !string.IsNullOrWhiteSpace(installedRoot))
{
    builder.Host.UseWindowsService();
}

builder.Host.UseSerilog();


// ============================================================
// Installed appsettings.json
// ============================================================
//
// In the installed application, explicitly load the
// appsettings.json located beside PCS.API.exe.
//
// This guarantees that the installed API does not depend on
// the current working directory or the PowerShell launch path.
// ============================================================

if (!string.IsNullOrWhiteSpace(installedRoot))
{
    string installedAppSettings =
        Path.Combine(
            baseDirectory,
            "appsettings.json");

    if (!File.Exists(installedAppSettings))
    {
        throw new InvalidOperationException(
            $"PCS installed appsettings.json was not found: {installedAppSettings}");
    }

    builder.Configuration.AddJsonFile(
        installedAppSettings,
        optional: false,
        reloadOnChange: false);

    Log.Information(
        "PCS installed appsettings loaded explicitly from {AppSettingsPath}.",
        installedAppSettings);
}


// ============================================================
// Development Paths
// ============================================================

string developmentProjectDirectory =
    builder.Environment.ContentRootPath;


// ============================================================
// Find Repository Root
// ============================================================
//
// Development structure:
//
// D:\Projects\PCS
// ├── backend
// │   └── src
// │       └── PCS.API
// └── frontend
//     └── dist
//
// ============================================================

string? repositoryRoot = null;


DirectoryInfo? currentDirectory =
    new DirectoryInfo(
        developmentProjectDirectory);


while (currentDirectory != null)
{
    string frontendCandidate =
        Path.Combine(
            currentDirectory.FullName,
            "frontend",
            "dist");

    string backendCandidate =
        Path.Combine(
            currentDirectory.FullName,
            "backend");


    if (
        Directory.Exists(
            frontendCandidate) &&
        Directory.Exists(
            backendCandidate))
    {
        repositoryRoot =
            currentDirectory.FullName;

        break;
    }


    currentDirectory =
        currentDirectory.Parent;
}


// ============================================================
// Startup Path Diagnostics
// ============================================================

Log.Information(
    "PCS startup base directory: {BaseDirectory}.",
    baseDirectory);

Log.Information(
    "PCS content root: {ContentRoot}.",
    builder.Environment.ContentRootPath);

Log.Information(
    "PCS installed root candidate: {InstalledRoot}.",
    installedRoot ??
    "(none)");

Log.Information(
    "PCS repository root candidate: {RepositoryRoot}.",
    repositoryRoot ??
    "(none)");


// ============================================================
// PCS Installer Configuration
// ============================================================
//
// Installed configuration:
//
// %LOCALAPPDATA%\PCS\Config\pcs.config.json
//
// ============================================================

string? pcsConfigPath = null;


// ------------------------------------------------------------
// 1. Installed configuration
// ------------------------------------------------------------

if (!string.IsNullOrWhiteSpace(installedRoot))
{
    string installedConfig =
        Path.Combine(
            installedRoot,
            "Config",
            "pcs.config.json");


    Log.Information(
        "Checking installed PCS configuration: {ConfigPath}.",
        installedConfig);


    if (File.Exists(installedConfig))
    {
        pcsConfigPath =
            installedConfig;


        Log.Information(
            "Installed PCS configuration found at {ConfigPath}.",
            pcsConfigPath);
    }
}


// ------------------------------------------------------------
// 2. Development configuration
// ------------------------------------------------------------

if (
    string.IsNullOrWhiteSpace(
        pcsConfigPath) &&
    !string.IsNullOrWhiteSpace(
        repositoryRoot))
{
    string developmentConfig =
        Path.Combine(
            repositoryRoot,
            "backend",
            "src",
            "PCS.API",
            "Config",
            "pcs.config.json");


    Log.Information(
        "Checking development PCS configuration: {ConfigPath}.",
        developmentConfig);


    if (File.Exists(developmentConfig))
    {
        pcsConfigPath =
            developmentConfig;


        Log.Information(
            "Development PCS configuration found at {ConfigPath}.",
            pcsConfigPath);
    }
}


// ============================================================
// Load PCS Installer Configuration
// ============================================================

if (
    !string.IsNullOrWhiteSpace(
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


        if (
            config.TryGetProperty(
                "ConnectionString",
                out JsonElement connectionStringElement))
        {
            string? connectionString =
                connectionStringElement.GetString();


            if (
                !string.IsNullOrWhiteSpace(
                    connectionString))
            {
                builder.Configuration[
                    "ConnectionStrings:DefaultConnection"] =
                    connectionString;


                Log.Information(
                    "PCS database connection string loaded from installer configuration.");
            }
            else
            {
                Log.Warning(
                    "PCS installer configuration contains an empty ConnectionString.");
            }
        }
        else
        {
            Log.Warning(
                "PCS installer configuration does not contain ConnectionString.");
        }

        if (
            config.TryGetProperty(
                "Provider",
                out JsonElement providerElement))
        {
            string? provider = providerElement.GetString();

            if (!string.IsNullOrWhiteSpace(provider))
            {
                builder.Configuration["Database:Provider"] =
                    provider;
            }
        }


        Log.Information(
            "PCS installer configuration loaded from {ConfigPath}.",
            pcsConfigPath);
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
        "PCS installer configuration was NOT found. " +
        "Expected path: {ConfigPath}.",
        Path.Combine(
            installedRoot ??
            "(unknown)",
            "Config",
            "pcs.config.json"));
}


// ============================================================
// Validate Database Configuration
// ============================================================

string? configuredConnectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection");


if (
    string.IsNullOrWhiteSpace(
        configuredConnectionString))
{
    throw new InvalidOperationException(
        "PCS database connection string was not configured.");
}


// A relative SQLite path must never depend on the process working
// directory. Installed: <root>\Database. Otherwise: the current directory
// (development only; installed deployments always receive an absolute path).
if (string.Equals(
        DatabaseProviderResolver.GetProvider(builder.Configuration),
        DatabaseProviderResolver.Sqlite,
        StringComparison.OrdinalIgnoreCase))
{
    string sqliteBaseDirectory =
        !string.IsNullOrWhiteSpace(installedRoot)
            ? Path.Combine(installedRoot, "Database")
            : Directory.GetCurrentDirectory();

    string resolvedConnectionString =
        SqliteConnectionPathResolver.MakeAbsolute(
            configuredConnectionString,
            sqliteBaseDirectory);

    builder.Configuration["ConnectionStrings:DefaultConnection"] =
        resolvedConnectionString;

    string? sqliteDirectory =
        Path.GetDirectoryName(
            new Microsoft.Data.Sqlite.SqliteConnectionStringBuilder(
                resolvedConnectionString).DataSource);

    if (!string.IsNullOrEmpty(sqliteDirectory))
    {
        Directory.CreateDirectory(sqliteDirectory);
    }
}

Log.Information(
    "PCS database connection string is configured.");


// ============================================================
// Hosting and security configuration
// ============================================================

string hostingMode =
    builder.Configuration["Hosting:Mode"] ??
    (!string.IsNullOrWhiteSpace(installedRoot)
        ? "OnPremise"
        : "Development");

if (!new[] { "OnPremise", "Cloud", "Development" }
    .Contains(hostingMode, StringComparer.OrdinalIgnoreCase))
{
    throw new InvalidOperationException(
        $"Unsupported PCS hosting mode '{hostingMode}'. Supported values are OnPremise, Cloud, and Development.");
}

bool isCloudHosting =
    string.Equals(
        hostingMode,
        "Cloud",
        StringComparison.OrdinalIgnoreCase);

bool swaggerEnabled =
    !isCloudHosting &&
    (builder.Environment.IsDevelopment() ||
     builder.Configuration.GetValue<bool>("Swagger:Enabled"));

string[] allowedOrigins =
    builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
    ?? [];

allowedOrigins =
    allowedOrigins
        .Where(origin => !string.IsNullOrWhiteSpace(origin))
        .Select(origin => origin.Trim().TrimEnd('/'))
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();

if (builder.Environment.IsDevelopment() && allowedOrigins.Length == 0)
{
    allowedOrigins = ["http://localhost:5173"];
}

foreach (string origin in allowedOrigins)
{
    if (
        !Uri.TryCreate(origin, UriKind.Absolute, out Uri? parsedOrigin) ||
        (parsedOrigin.Scheme != Uri.UriSchemeHttp &&
         parsedOrigin.Scheme != Uri.UriSchemeHttps) ||
        parsedOrigin.AbsolutePath != "/" ||
        !string.IsNullOrEmpty(parsedOrigin.Query) ||
        !string.IsNullOrEmpty(parsedOrigin.Fragment))
    {
        throw new InvalidOperationException(
            $"Invalid PCS CORS origin '{origin}'. Configure only an absolute HTTP or HTTPS origin without a path.");
    }
}

if (isCloudHosting && allowedOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "Cloud hosting requires at least one explicit Cors:AllowedOrigins entry.");
}

if (
    isCloudHosting &&
    string.IsNullOrWhiteSpace(
        builder.Configuration["Jwt:Secret"]))
{
    throw new InvalidOperationException(
        "Cloud hosting requires Jwt:Secret to be supplied by a deployment secret provider.");
}

Log.Information(
    "PCS hosting mode: {HostingMode}; Swagger enabled: {SwaggerEnabled}; CORS origins: {CorsOriginCount}.",
    hostingMode,
    swaggerEnabled,
    allowedOrigins.Length);


// ============================================================
// Services
// ============================================================

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentTenant, CurrentTenant>();
builder.Services.AddScoped<IAuditContext, HttpAuditContext>();

builder.Services.AddApplication();


builder.Services.AddInfrastructure(
    builder.Configuration);


builder.Services.AddControllers();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 20,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            }));
});

builder.Services
    .AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database");


builder.Services.AddFluentValidationAutoValidation();


builder.Services.AddFluentValidationClientsideAdapters();


builder.Services.AddEndpointsApiExplorer();


if (swaggerEnabled)
{
    builder.Services.AddSwaggerGen();
}


// ============================================================
// Authentication / Authorization
// ============================================================

var jwtSettings =
    builder.Configuration
        .GetSection(
            JwtSettings.SectionName)
        .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "PCS JWT configuration was not found.");


if (
    string.IsNullOrWhiteSpace(
        jwtSettings.Secret) ||
    jwtSettings.Secret.Length < 32)
{
    throw new InvalidOperationException(
        "PCS JWT secret must contain at least 32 characters.");
}


if (
    string.IsNullOrWhiteSpace(
        jwtSettings.Issuer))
{
    throw new InvalidOperationException(
        "PCS JWT issuer was not configured.");
}


if (
    string.IsNullOrWhiteSpace(
        jwtSettings.Audience))
{
    throw new InvalidOperationException(
        "PCS JWT audience was not configured.");
}


builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(
        options =>
        {
            options.TokenValidationParameters =
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey =
                        true,

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                jwtSettings.Secret)),

                    ValidateIssuer =
                        true,

                    ValidIssuer =
                        jwtSettings.Issuer,

                    ValidateAudience =
                        true,

                    ValidAudience =
                        jwtSettings.Audience,

                    ValidateLifetime =
                        true,

                    ClockSkew =
                        TimeSpan.FromMinutes(1)
                };
        });


builder.Services.AddAuthorization(
    options =>
    {
        foreach (
            string permission
            in PermissionProvider.GetAll())
        {
            options.AddPolicy(
                permission,
                policy =>
                {
                    policy.RequireAuthenticatedUser();

                    policy.RequireClaim(
                        "permission",
                        permission);
                });
        }
    });


// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            "PCS",
            policy =>
            {
                if (allowedOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedOrigins);
                }
                else
                {
                    policy.SetIsOriginAllowed(_ => false);
                }

                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders(CorrelationIdMiddleware.HeaderName);
            });
    });


// ============================================================
// Build
// ============================================================

var app =
    builder.Build();


// ============================================================
// Determine Frontend Path
// ============================================================

string? frontendPath = null;


// ------------------------------------------------------------
// 1. Installed application
// ------------------------------------------------------------

if (
    !isCloudHosting &&
    !string.IsNullOrWhiteSpace(installedRoot))
{
    string installedFrontend =
        Path.Combine(
            installedRoot,
            "Frontend");


    string installedIndex =
        Path.Combine(
            installedFrontend,
            "index.html");


    Log.Information(
        "Checking installed PCS frontend: {FrontendPath}.",
        installedFrontend);


    if (
        Directory.Exists(
            installedFrontend) &&
        File.Exists(
            installedIndex))
    {
        frontendPath =
            installedFrontend;


        Log.Information(
            "Installed PCS frontend detected at {FrontendPath}.",
            frontendPath);
    }
}


// ------------------------------------------------------------
// 2. Development environment
// ------------------------------------------------------------

if (
    !isCloudHosting &&
    string.IsNullOrWhiteSpace(
        frontendPath) &&
    !string.IsNullOrWhiteSpace(
        repositoryRoot))
{
    string developmentFrontend =
        Path.Combine(
            repositoryRoot,
            "frontend",
            "dist");


    string developmentIndex =
        Path.Combine(
            developmentFrontend,
            "index.html");


    Log.Information(
        "Checking development PCS frontend: {FrontendPath}.",
        developmentFrontend);


    if (
        Directory.Exists(
            developmentFrontend) &&
        File.Exists(
            developmentIndex))
    {
        frontendPath =
            developmentFrontend;


        Log.Information(
            "Development PCS frontend detected at {FrontendPath}.",
            frontendPath);
    }
}


// ============================================================
// Frontend Availability
// ============================================================

bool frontendAvailable =
    !string.IsNullOrWhiteSpace(
        frontendPath) &&
    Directory.Exists(
        frontendPath) &&
    File.Exists(
        Path.Combine(
            frontendPath,
            "index.html"));


if (!frontendAvailable)
{
    Log.Warning(
        "PCS frontend was NOT found.");
}


// ============================================================
// Database Migration & Security Seed
// ============================================================

using (
    var scope =
        app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<PCSDbContext>();


    // Schema migrations are applied by the Windows installer
    // or a controlled deployment operation, never by API startup.
    // Security seeding runs only after the schema is available.


    var passwordHasher =
        scope.ServiceProvider
            .GetRequiredService<IPasswordHasher>();


    await SecuritySeed.SeedAsync(
        dbContext,
        builder.Configuration,
        passwordHasher);

    // Remove the one-time bootstrap password only after the seed
    // completed successfully. The in-memory configuration remains
    // available for this process; the persisted file is scrubbed.
    string bootstrapSettingsPath =
        Path.Combine(baseDirectory, "appsettings.json");

    if (
        !isCloudHosting &&
        File.Exists(bootstrapSettingsPath))
    {
        var settingsJson =
            JsonNode.Parse(await File.ReadAllTextAsync(bootstrapSettingsPath));

        if (settingsJson is JsonObject settingsObject &&
            settingsObject["InitialAdmin"] is JsonObject initialAdminObject &&
            initialAdminObject.ContainsKey("Password"))
        {
            initialAdminObject["Password"] = string.Empty;

            await File.WriteAllTextAsync(
                bootstrapSettingsPath,
                settingsJson.ToJsonString(
                    new JsonSerializerOptions { WriteIndented = true }));
        }
    }
}


// ============================================================
// HTTP Pipeline
// ============================================================

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

app.UseCors(
    "PCS");

app.UseRateLimiter();


// HTTPS redirection intentionally disabled
// for the current local PCS architecture.
//
// app.UseHttpsRedirection();


app.UseAuthentication();

app.UseMiddleware<TenantContextMiddleware>();

app.UseAuthorization();


// ============================================================
// Swagger
// ============================================================

if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ============================================================
// Health endpoints
// ============================================================

// Liveness does not depend on external resources.
app.MapHealthChecks(
    "/health/live",
    new HealthCheckOptions
    {
        Predicate = _ => false
    });

// Readiness verifies the configured database connection.
app.MapHealthChecks("/health/ready");


// ============================================================
// API Controllers
// ============================================================

app.MapControllers();


// ============================================================
// Frontend
// ============================================================

if (
    frontendAvailable &&
    !string.IsNullOrWhiteSpace(
        frontendPath))
{
    var physicalFrontendProvider =
        new PhysicalFileProvider(
            frontendPath);


    // --------------------------------------------------------
    // Default document
    // --------------------------------------------------------

    app.UseDefaultFiles(
        new DefaultFilesOptions
        {
            FileProvider =
                physicalFrontendProvider
        });


    // --------------------------------------------------------
    // Static files
    // --------------------------------------------------------

    app.UseStaticFiles(
        new StaticFileOptions
        {
            FileProvider =
                physicalFrontendProvider
        });


    // --------------------------------------------------------
    // React SPA fallback
    // --------------------------------------------------------

    app.MapFallback(
        async context =>
        {
            // Never return index.html for API routes.

            if (
                context.Request.Path
                    .StartsWithSegments(
                        "/api"))
            {
                context.Response.StatusCode =
                    StatusCodes.Status404NotFound;

                return;
            }


            // Never interfere with Swagger.

            if (
                context.Request.Path
                    .StartsWithSegments(
                        "/swagger"))
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


// ============================================================
// Startup Diagnostics
// ============================================================

Log.Information(
    "PCS API starting.");


Log.Information(
    "PCS mode: {Mode}.",
    app.Environment.IsDevelopment()
        ? "Development"
        : "Production");


Log.Information(
    "PCS root: {Root}.",
    installedRoot ??
    repositoryRoot ??
    developmentProjectDirectory);


Log.Information(
    "API base directory: {BaseDirectory}.",
    baseDirectory);


Log.Information(
    "API content root: {ContentRoot}.",
    builder.Environment.ContentRootPath);


Log.Information(
    "API frontend: {FrontendPath}.",
    frontendPath ??
    "(none)");


// ============================================================
// Run
// ============================================================

try
{
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(
        ex,
        "PCS API terminated unexpectedly.");
}
finally
{
    await Log.CloseAndFlushAsync();
}