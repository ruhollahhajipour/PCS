using Microsoft.EntityFrameworkCore;

using PCS.Application.Projects.Interfaces;
using PCS.Domain.Entities;
using PCS.Infrastructure.Persistence;

namespace PCS.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly PCSDbContext _context;

    public ProjectRepository(
        PCSDbContext context)
    {
        _context = context;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        return await _context.Projects
            .ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(Guid id)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task AddAsync(Project project)
    {
        await _context.Projects.AddAsync(project);
    }

    public void Update(Project project)
    {
        ArgumentNullException.ThrowIfNull(project);

        var entry = _context.Entry(project);
        if (entry.State == EntityState.Detached)
        {
            throw new InvalidOperationException(
                "ProjectRepository.Update requires a project loaded through the current DbContext.");
        }

        if (entry.State == EntityState.Deleted)
        {
            throw new InvalidOperationException("A deleted project cannot be updated.");
        }
    }

    public void Delete(Project project)
    {
        ArgumentNullException.ThrowIfNull(project);

        var entry = _context.Entry(project);
        if (entry.State == EntityState.Detached)
        {
            throw new InvalidOperationException(
                "ProjectRepository.Delete requires a project loaded through the current DbContext.");
        }

        if (entry.State == EntityState.Deleted)
        {
            return;
        }

        if (entry.State == EntityState.Added)
        {
            _context.Projects.Remove(project);
            return;
        }

        project.IsDeleted = true;
        project.DeletedAt = DateTime.UtcNow;
        project.UpdatedAt = DateTime.UtcNow;

        entry.Property(nameof(Project.IsDeleted)).IsModified = true;
        entry.Property(nameof(Project.DeletedAt)).IsModified = true;
        entry.Property(nameof(Project.UpdatedAt)).IsModified = true;
    }

    public async Task<bool> ExistsAsync(string code)
    {
        return await _context.Projects
            .AnyAsync(x => x.Code == code);
    }

    public async Task<List<Project>> GetActiveAsync()
    {
        return await _context.Projects
            .Where(x => x.IsActive)
            .ToListAsync();
    }

    public async Task<List<Project>> GetByCompanyAsync(Guid companyId)
    {
        return await _context.Projects
            .Where(x => x.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
