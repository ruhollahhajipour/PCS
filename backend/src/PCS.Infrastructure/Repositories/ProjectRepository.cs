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
        _context.Projects.Update(project);
    }

    public void Delete(Project project)
    {
        _context.Projects.Remove(project);
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