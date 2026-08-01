using Hangfire;
using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.BackgroundJobs;

public sealed class HangfireBackgroundJobService
    : IBackgroundJobService
{
    public string Enqueue(
        Expression<Action> job)
    {
        return BackgroundJob.Enqueue(job);
    }


    public string Schedule(
        Expression<Action> job,
        TimeSpan delay)
    {
        return BackgroundJob.Schedule(
            job,
            delay);
    }


    public void Recurring(
        string jobId,
        Expression<Action> job,
        string cron)
    {
        RecurringJob.AddOrUpdate(
            jobId,
            job,
            cron);
    }
}