using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PCS.Application.Common.Interfaces;
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
        return await _dbSet.FindAsync(id);
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
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public void DeleteRange(
        IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}