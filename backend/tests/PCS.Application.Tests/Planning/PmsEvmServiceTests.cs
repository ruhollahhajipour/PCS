using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsEvmServiceTests
{
    [Fact]
    public async Task CalculateAsync_UsesHistoricalProgressAndTimePhasedBaseline()
    {
        var projectId = Guid.NewGuid();
        var activityId = Guid.NewGuid();
        var baseline = new ProjectBaselineSnapshotDto
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Name = "Approved Baseline",
            Version = 1,
            TotalBudget = 1000m,
            ActivityCount = 1,
            Activities =
            [
                new ProjectBaselineActivityDto
                {
                    ActivityId = activityId,
                    Budget = 1000m,
                    PlannedStart = new DateTime(2020, 1, 1),
                    PlannedFinish = new DateTime(2020, 1, 10),
                    WorkingDaysMask = WeekdaysMask()
                }
            ]
        };

        var progress = new FakeRepository<ProgressEntry>(
        [
            new ProgressEntry
            {
                ActivityId = activityId,
                ProgressDate = new DateTime(2020, 1, 3),
                Progress = 20m,
                ActualCost = 150m
            },
            new ProgressEntry
            {
                ActivityId = activityId,
                ProgressDate = new DateTime(2020, 1, 6),
                Progress = 40m,
                ActualCost = 250m
            },
            new ProgressEntry
            {
                ActivityId = activityId,
                ProgressDate = new DateTime(2020, 1, 7),
                Progress = 90m,
                ActualCost = 900m
            }
        ]);

        var service = new PmsEvmService(
            progress,
            new FakeRepository<Activity>(),
            new StubBaselineService(baseline));

        var result = await service.CalculateAsync(projectId, new DateTime(2020, 1, 6));

        Assert.Equal(500m, result.PlannedValue);
        Assert.Equal(400m, result.EarnedValue);
        Assert.Equal(400m, result.ActualCost);
        Assert.Equal(-100m, result.ScheduleVariance);
        Assert.Equal(0m, result.CostVariance);
        Assert.Equal(0.8m, result.SPI);
        Assert.Equal(1m, result.CPI);
        Assert.Contains("Opening costs", result.DataQualityNote);
    }

    [Fact]
    public async Task CalculateAsync_RejectsFutureReportDate()
    {
        var service = new PmsEvmService(
            new FakeRepository<ProgressEntry>(),
            new FakeRepository<Activity>(),
            new StubBaselineService(null));

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
            () => service.CalculateAsync(Guid.NewGuid(), DateTime.UtcNow.Date.AddDays(1)));
    }

    [Fact]
    public async Task CalculateAsync_RejectsWhenNoEffectiveBaselineExists()
    {
        var service = new PmsEvmService(
            new FakeRepository<ProgressEntry>(),
            new FakeRepository<Activity>(),
            new StubBaselineService(null));

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CalculateAsync(Guid.NewGuid(), new DateTime(2020, 1, 6)));
    }

    private static int WeekdaysMask() =>
        (1 << (int)DayOfWeek.Monday) |
        (1 << (int)DayOfWeek.Tuesday) |
        (1 << (int)DayOfWeek.Wednesday) |
        (1 << (int)DayOfWeek.Thursday) |
        (1 << (int)DayOfWeek.Friday);

    private sealed class StubBaselineService(ProjectBaselineSnapshotDto? snapshot)
        : IPmsBaselineService
    {
        public Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(
            Guid projectId,
            DateTime dataDate) => Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(Guid projectId) =>
            Task.FromResult(snapshot);

        public Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
            Guid projectId, CreateProjectBaselineDto request, string? createdBy) =>
            throw new NotSupportedException();

        public Task<ProjectBaselineDto> ApproveAsync(
            Guid projectId, Guid baselineId, string? approvedBy) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(Guid projectId) =>
            throw new NotSupportedException();
    }

    private sealed class FakeRepository<T>(IEnumerable<T>? seed = null)
        : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed?.ToList() ?? [];

        public Task<IEnumerable<T>> GetAllAsync() => Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id) => Task.FromResult<T?>(null);

        public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var compiled = predicate.Compile();
            return Task.FromResult<IEnumerable<T>>(_items.Where(compiled).ToList());
        }

        public Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.FirstOrDefault(predicate.Compile()));

        public Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.Any(predicate.Compile()));

        public Task<int> CountAsync() => Task.FromResult(_items.Count);

        public Task<int> CountAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.Count(predicate.Compile()));

        public Task AddAsync(T entity)
        {
            _items.Add(entity);
            return Task.CompletedTask;
        }

        public Task AddRangeAsync(IEnumerable<T> entities)
        {
            _items.AddRange(entities);
            return Task.CompletedTask;
        }

        public void Update(T entity) { }

        public void Delete(T entity) => _items.Remove(entity);

        public void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
                _items.Remove(entity);
        }

        public Task SaveChangesAsync() => Task.CompletedTask;
    }
}
