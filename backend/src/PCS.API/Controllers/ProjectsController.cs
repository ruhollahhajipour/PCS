using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly IProjectAccessGuard _accessGuard;

    public ProjectsController(
        IProjectService projectService,
        IProjectAccessGuard accessGuard)
    {
        _projectService = projectService;
        _accessGuard = accessGuard;
    }

    [HttpGet]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var companyIds = await _accessGuard.GetAccessibleCompanyIdsAsync(
            User, cancellationToken);

        var projects = await _projectService.GetByCompanyIdsAsync(companyIds);
        return Ok(projects);
    }

    [HttpGet("{id:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<ProjectDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, id, cancellationToken))
            return NotFound();

        var project = await _projectService.GetByIdAsync(id);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpPost]
    [Permission(Permissions.ProjectEdit)]
    public async Task<ActionResult<Guid>> Create(
        CreateProjectDto dto,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessCompanyAsync(
                User, dto.CompanyId, cancellationToken))
            return Forbid();

        if (dto.PlantId.HasValue &&
            !await _accessGuard.CanAccessPlantAsync(
                User, dto.PlantId.Value, dto.CompanyId, cancellationToken))
            return BadRequest("The selected plant does not belong to the selected company.");

        var id = await _projectService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Update(
        Guid id,
        CreateProjectDto dto,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, id, cancellationToken))
            return NotFound();

        var current = await _projectService.GetByIdAsync(id);
        if (current is null)
            return NotFound();

        var isSystemUser = await _accessGuard.IsSystemUserAsync(User, cancellationToken);
        if (dto.CompanyId != current.CompanyId && !isSystemUser)
            return Forbid();

        if (!await _accessGuard.CanAccessCompanyAsync(
                User, dto.CompanyId, cancellationToken))
            return Forbid();

        if (dto.PlantId.HasValue &&
            !await _accessGuard.CanAccessPlantAsync(
                User, dto.PlantId.Value, dto.CompanyId, cancellationToken))
            return BadRequest("The selected plant does not belong to the selected company.");

        await _projectService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessProjectAsync(User, id, cancellationToken))
            return NotFound();

        await _projectService.DeleteAsync(id);
        return NoContent();
    }
}
