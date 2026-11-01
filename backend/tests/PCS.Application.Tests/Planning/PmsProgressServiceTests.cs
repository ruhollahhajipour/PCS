using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsProgressServiceTests
{
    [Fact]
    public async Task CalculateWbsProgressAsync_UsesOnlyActiveActivitiesFromRequestedWbs()
    {
        var wbsId = Guid.NewGuid();
        var repository = new FakeRepository<Activity>(
        [
            new Activity
            {
                Id = Guid.NewGuid(),
                WbsNodeId = wbsId,
                Weight = 40m,
                Progress = 50m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                WbsNodeId = wbsId,
                Weight = 60m,
                Progress = 100m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                WbsNodeId = Guid.NewGuid(),
                Weight = 100m,
                Progress = 100m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                WbsNodeId = wbsId,
                Weight = 100m,
                Progress = 100m,
                IsDeleted = true
            }
        ]);
        var service = new PmsProgressService(
            new FakeRepository<WbsNode>(),
            repository);

        var result = await service.CalculateWbsProgressAsync(wbsId);

        Assert.Equal(80m, result);
        Assert.Equal(1, repository.FindCalls);
        Assert.Equal(0, repository.GetAllCalls);
    }

    [Fact]
    public async Task CalculateProjectProgressAsync_ExcludesOtherProjectsAndSoftDeletedActivities()
    {
        var projectId = Guid.NewGuid();
        var repository = new FakeRepository<Activity>(
        [
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Weight = 25m,
                Progress = 40m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Weight = 75m,
                Progress = 80m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = Guid.NewGuid(),
                Weight = 100m,
                Progress = 100m
            },
            new Activity
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Weight = 100m,
                Progress = 100m,
                IsDeleted = true
            }
        ]);
        var service = new PmsProgressService(
            new FakeRepository<WbsNode>(),
            repository);

        var result = await service.CalculateProjectProgressAsync(projectId);

        Assert.Equal(70m, result);
        Assert.Equal(1, repository.FindCalls);
        Assert.Equal(0, repository.GetAllCalls);
    }

    private sealed class FakeRepository<T>(IEnumerable<T>? seed = null)
        : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed?.ToList() ?? [];

        public int FindCalls { get; private set; }
        public int GetAllCalls { get; private set; }

        public Task<IEnumerable<T>> GetAllAsync()
        {
            GetAllCalls++;
            return Task.FromResult<IEnumerable<T>>(_items);
        }

        public Task<T?> GetByIdAsync(Guid id) => Task.FromResult<T?>(null);

        public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            FindCalls++;
            return Task.FromResult<IEnumerable<T>>(
                _items.Where(predicate.Compile()).ToList());
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
