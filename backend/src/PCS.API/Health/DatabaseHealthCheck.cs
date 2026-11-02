using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using PCS.Infrastructure.Persistence;

namespace PCS.API.Health;

public sealed class DatabaseHealthCheck : IHealthCheck
{
    private readonly PCSDbContext _dbContext;

    public DatabaseHealthCheck(PCSDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            bool canConnect =
                await _dbContext.Database.CanConnectAsync(
                    cancellationToken);

            return canConnect
                ? HealthCheckResult.Healthy("PCS database is reachable.")
                : HealthCheckResult.Unhealthy("PCS database is not reachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy(
                "PCS database health check failed.",
                exception);
        }
    }
}
