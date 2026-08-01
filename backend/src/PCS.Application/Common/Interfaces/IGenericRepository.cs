using System.Linq.Expressions;

namespace PCS.Application.Common.Interfaces;

public interface IGenericRepository<T>
    where T : class
{
    Task<IEnumerable<T>> GetAllAsync();

    Task<T?> GetByIdAsync(Guid id);

    Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate);

    Task<T?> FirstOrDefaultAsync(
        Expression<Func<T, bool>> predicate);

    Task<bool> ExistsAsync(
        Expression<Func<T, bool>> predicate);

    Task<int> CountAsync();

    Task<int> CountAsync(
        Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    Task AddRangeAsync(IEnumerable<T> entities);

    void Update(T entity);

    void Delete(T entity);

    void DeleteRange(IEnumerable<T> entities);

    Task SaveChangesAsync();
}