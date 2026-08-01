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

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();


// ========================================
// Load PCS Installer Configuration
// ========================================

var pcsConfigPath = Path.Combine(
    AppContext.BaseDirectory,
    "pcs.config.json");

if (File.Exists(pcsConfigPath))
{
    var json = File.ReadAllText(pcsConfigPath);

    var config =
        JsonSerializer.Deserialize<JsonElement>(json);

    if (config.TryGetProperty(
        "ConnectionString",
        out var connectionString))
    {
        builder.Configuration["ConnectionStrings:DefaultConnection"] =
            connectionString.GetString();
    }
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

builder.Services.AddAuthorization(options =>
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("PCS", policy =>
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

var app = builder.Build();


// ========================================
// Database Migration & Security Seed
// ========================================

using (var scope = app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<PCSDbContext>();

    await dbContext.Database.MigrateAsync();

    await SecuritySeed.SeedAsync(dbContext);
}


// ========================================
// Pipeline
// ========================================

app.UseMiddleware<ExceptionMiddleware>();

// app.UseHttpsRedirection();

app.UseCors("PCS");

// app.UseAuthentication();

app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();