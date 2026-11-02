using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
using PCS.Domain.Common;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T>
    where T : class
{
    private readonly PCSDbContext _context;

    private readonly DbSet<T> _dbSet;

    public GenericRepository(
        PCSDbContext context)
    {
        _context = context;

        _dbSet = context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        // FindAsync may bypass global query filters. Use a normal LINQ
        // query so tenant filters are always applied to key lookups.
        return await _dbSet.SingleOrDefaultAsync(
            entity => EF.Property<Guid>(entity, "Id") == id);
    }

    public async Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate)
    {
        return await _dbSet
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate)
    {
        return await _dbSet
            .FirstOrDefaultAsync(predicate);
    }

    public async Task<bool> ExistsAsync(
        Expression<Func<T, bool>> predicate)
    {
        return await _dbSet
            .AnyAsync(predicate);
    }

    public async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> CountAsync(
        Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.CountAsync(predicate);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task AddRangeAsync(
        IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public void Update(T entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            throw new InvalidOperationException(
                "GenericRepository.Update requires an entity loaded or attached through the current DbContext. Detached updates are rejected to preserve tenant query-filter boundaries.");
        }

        if (entry.State == EntityState.Deleted)
        {
            throw new InvalidOperationException(
                "A deleted entity cannot be updated.");
        }

        // Tracked entities are detected by EF Core change tracking.
        // Do not call DbSet.Update(entity): it marks every property modified
        // and would allow a detached graph to bypass tenant-scoped loading.
    }

    public void Delete(T entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            throw new InvalidOperationException(
                "GenericRepository.Delete requires an entity loaded or attached through the current DbContext. Detached deletes are rejected to preserve tenant query-filter boundaries.");
        }

        if (entry.State == EntityState.Deleted)
        {
            return;
        }

        if (entity is AuditableEntity auditableEntity)
        {
            if (entry.State == EntityState.Added)
            {
                _dbSet.Remove(entity);
                return;
            }

            auditableEntity.IsDeleted = true;
            auditableEntity.DeletedAt = DateTime.UtcNow;
            auditableEntity.UpdatedAt = DateTime.UtcNow;

            entry.Property(nameof(AuditableEntity.IsDeleted)).IsModified = true;
            entry.Property(nameof(AuditableEntity.DeletedAt)).IsModified = true;
            entry.Property(nameof(AuditableEntity.UpdatedAt)).IsModified = true;
            return;
        }

        _dbSet.Remove(entity);
    }

    public void DeleteRange(
        IEnumerable<T> entities)
    {
        foreach (var entity in entities)
        {
            Delete(entity);
        }
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
