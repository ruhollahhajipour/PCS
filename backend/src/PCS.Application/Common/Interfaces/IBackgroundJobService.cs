using System.Linq.Expressions;

namespace PCS.Application.Common.Interfaces;

public interface IBackgroundJobService
{
    string Enqueue(Expression<Action> job);

    string Schedule(
        Expression<Action> job,
        TimeSpan delay);

    void Recurring(
        string jobId,
        Expression<Action> job,
        string cron);
}