using System.Linq.Expressions;
using PCS.Application.Common.Interfaces;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Services;
using PCS.Domain.Entities;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Tests.Planning;

public sealed class PmsServiceTests
{
    [Fact]
    public async Task ImportPmsAsync_RollsBackWhenWbsParentReferenceIsInvalid()
    {
        var projectId = Guid.NewGuid();
        var unitOfWork = new RecordingUnitOfWork();

        var service = new PmsService(
            new FakeRepository<Project>([new Project { Id = projectId }]),
            new FakeRepository<Company>(),
            new FakeRepository<WbsNode>(),
            new FakeRepository<Activity>(),
            unitOfWork,
            new StubWbsCalculationService(),
            new StubPmsBaselineService());

        var request = new ImportPmsDto
        {
            ProjectId = projectId,
            WbsNodes =
            [
                new ImportWbsDto
                {
                    Code = "WBS-001",
                    Name = "Root",
                    Level = 1,
                    ParentCode = "WBS-MISSING"
                }
            ]
        };

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.ImportPmsAsync(request));

        Assert.True(unitOfWork.TransactionStarted);
        Assert.True(unitOfWork.RolledBack);
        Assert.False(unitOfWork.Committed);
    }

    private sealed class RecordingUnitOfWork : IUnitOfWork
    {
        public bool TransactionStarted { get; private set; }
        public bool Committed { get; private set; }
        public bool RolledBack { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(0);

        public Task BeginTransactionAsync()
        {
            TransactionStarted = true;
            return Task.CompletedTask;
        }

        public Task CommitTransactionAsync()
        {
            Committed = true;
            return Task.CompletedTask;
        }

        public Task RollbackTransactionAsync()
        {
            RolledBack = true;
            return Task.CompletedTask;
        }
    }

    private sealed class StubWbsCalculationService : IWbsCalculationService
    {
        public List<WbsNodeDto> Calculate(
            List<WbsNodeDto> nodes,
            List<ActivityDto> activities) => nodes;
    }

    private sealed class StubPmsBaselineService : IPmsBaselineService
    {
        public Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
            Guid projectId,
            CreateProjectBaselineDto request,
            string? createdBy) => throw new NotSupportedException();

        public Task<ProjectBaselineDto> ApproveAsync(
            Guid projectId,
            Guid baselineId,
            string? approvedBy) => throw new NotSupportedException();

        public Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(
            Guid projectId) => throw new NotSupportedException();

        public Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(
            Guid projectId) => Task.FromResult<ProjectBaselineSnapshotDto?>(null);

        public Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(
            Guid projectId,
            DateTime dataDate) => Task.FromResult<ProjectBaselineSnapshotDto?>(null);
    }

    private sealed class FakeRepository<T>(IEnumerable<T>? seed = null)
        : IGenericRepository<T>
        where T : class
    {
        private readonly List<T> _items = seed?.ToList() ?? [];

        public Task<IEnumerable<T>> GetAllAsync() =>
            Task.FromResult<IEnumerable<T>>(_items);

        public Task<T?> GetByIdAsync(Guid id)
        {
            var item = _items.FirstOrDefault(candidate =>
                candidate.GetType().GetProperty("Id")?.GetValue(candidate) is Guid value &&
                value == id);
            return Task.FromResult(item);
        }

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
