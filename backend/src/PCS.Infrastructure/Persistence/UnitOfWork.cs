using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Persistence;

public sealed class UnitOfWork
    : IUnitOfWork
{
    private readonly PCSDbContext _context;

    public UnitOfWork(
        PCSDbContext context)
    {
        _context = context;
    }

    public Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(
            cancellationToken);
    }
}