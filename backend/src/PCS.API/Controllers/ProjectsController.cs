using Microsoft.AspNetCore.Mvc;
using PCS.Application.Projects.DTOs;
using PCS.Application.Projects.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(
        IProjectService projectService)
    {
        _projectService = projectService;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAll()
    {
        var projects = await _projectService.GetAllAsync();

        return Ok(projects);
    }


    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProjectDto>> GetById(Guid id)
    {
        var project = await _projectService.GetByIdAsync(id);

        if (project is null)
            return NotFound();

        return Ok(project);
    }


    [HttpPost]
    public async Task<ActionResult<Guid>> Create(
        CreateProjectDto dto)
    {
        var id = await _projectService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            id);
    }

[HttpPut("{id:guid}")]
public async Task<IActionResult> Update(
    Guid id,
    CreateProjectDto dto)
{
    await _projectService.UpdateAsync(id, dto);

    return NoContent();

    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _projectService.DeleteAsync(id);

        return NoContent();
    }
}