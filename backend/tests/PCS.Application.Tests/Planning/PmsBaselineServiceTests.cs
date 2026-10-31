using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsBaselineServiceTests
{
    [Fact]
    public async Task CreateDraftAsync_CreatesImmutableScheduleSnapshotUsingDefaultCalendar()
    {
        var projectId = Guid.NewGuid();
        var wbsId = Guid.NewGuid();
        var activityId = Guid.NewGuid();

        var projectRepository = new FakeRepository<Project>(
        [
            new Project { Id = projectId, Code = "PRJ-01", Name = "Test Project" }
        ]);
        var activityRepository = new FakeRepository<Activity>(
        [
            new Activity
            {
                Id = activityId,
                ProjectId = projectId,
                WbsNodeId = wbsId,
                Code = "ENG-001",
                Name = "Engineering package",
                Budget = 750m,
                Duration = 5,
                PlannedStart = new DateTime(2026, 10, 26),
                PlannedFinish = new DateTime(2026, 10, 30)
            }
        ]);
        var wbsRepository = new FakeRepository<WbsNode>(
        [
            new WbsNode
            {
                Id = wbsId,
                ProjectId = projectId,
                Code = "01",
                Name = "Engineering"
            }
        ]);
        var baselineRepository = new FakeRepository<ProjectBaseline>();
        var baselineActivityRepository = new FakeRepository<ProjectBaselineActivity>();

        var service = new PmsBaselineService(
            projectRepository,
            activityRepository,
            wbsRepository,
            new FakeRepository<ProjectCalendar>(),
            baselineRepository,
            baselineActivityRepository,
            new FakeUnitOfWork());

        var result = await service.CreateDraftAsync(
            projectId,
            new CreateProjectBaselineDto { Name = "  Baseline A  " },
            "test-user");

        var snapshotActivity = Assert.Single(result.Activities);
        Assert.Equal("Baseline A", result.Name);
        Assert.Equal(1, result.Version);
        Assert.Equal(750m, result.TotalBudget);
        Assert.Equal(5, result.PlannedDuration);
        Assert.False(result.IsApproved);
        Assert.False(result.IsActive);
        Assert.Equal("01", snapshotActivity.WbsCode);
        Assert.Equal(750m, snapshotActivity.Budget);
        Assert.Equal("Default (Monday-Friday)", snapshotActivity.CalendarName);
        Assert.Equal(WeekdaysMask(), snapshotActivity.WorkingDaysMask);
        Assert.Single(await baselineRepository.GetAllAsync());
        Assert.Single(await baselineActivityRepository.GetAllAsync());
    }

    private static int WeekdaysMask() =>
        (1 << (int)DayOfWeek.Monday) |
        (1 << (int)DayOfWeek.Tuesday) |
        (1 << (int)DayOfWeek.Wednesday) |
        (1 << (int)DayOfWeek.Thursday) |
        (1 << (int)DayOfWeek.Friday);

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(0);

        public Task BeginTransactionAsync() => Task.CompletedTask;

        public Task CommitTransactionAsync() => Task.CompletedTask;

        public Task RollbackTransactionAsync() => Task.CompletedTask;
    }

    private sealed class FakeRepository<T>(IEnumerable<T>? seed = null)
        : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed?.ToList() ?? [];

        public Task<IEnumerable<T>> GetAllAsync() => Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id)
        {
            var entity = _items.FirstOrDefault(item =>
                item.GetType().GetProperty("Id")?.GetValue(item) is Guid itemId &&
                itemId == id);
            return Task.FromResult(entity);
        }

        public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult<IEnumerable<T>>(_items.Where(predicate.Compile()).ToList());

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
