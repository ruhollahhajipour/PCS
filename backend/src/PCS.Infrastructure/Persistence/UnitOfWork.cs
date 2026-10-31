using Microsoft.EntityFrameworkCore.Storage;

using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Persistence;

public sealed class UnitOfWork
    : IUnitOfWork
{
    private readonly PCSDbContext _context;

    private IDbContextTransaction? _transaction;


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




    public async Task BeginTransactionAsync()
    {
        _transaction =
            await _context.Database
                .BeginTransactionAsync();
    }



    public async Task CommitTransactionAsync()
    {
        if (_transaction == null)
            return;


        await _transaction.CommitAsync();

        await _transaction.DisposeAsync();

        _transaction = null;
    }




    public async Task RollbackTransactionAsync()
    {
        if (_transaction == null)
            return;


        await _transaction.RollbackAsync();

        await _transaction.DisposeAsync();

        _transaction = null;
    }
}