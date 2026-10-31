using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Plants.DTOs;
using PCS.Application.Plants.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlantsController : ControllerBase
{
    private readonly IPlantService _plantService;
    private readonly IProjectAccessGuard _accessGuard;

    public PlantsController(
        IPlantService plantService,
        IProjectAccessGuard accessGuard)
    {
        _plantService = plantService;
        _accessGuard = accessGuard;
    }

    [HttpGet]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var companyIds = await _accessGuard.GetAccessibleCompanyIdsAsync(
            User, cancellationToken);

        return Ok(await _plantService.GetByCompanyIdsAsync(companyIds));
    }

    [HttpGet("company/{companyId:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetByCompany(
        Guid companyId,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessCompanyAsync(
                User, companyId, cancellationToken))
            return NotFound();

        return Ok(await _plantService.GetByCompanyIdAsync(companyId));
    }

    [HttpGet("{id:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<PlantDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessPlantAsync(User, id, null, cancellationToken))
            return NotFound();

        var plant = await _plantService.GetByIdAsync(id);
        return plant is null ? NotFound() : Ok(plant);
    }

    [HttpPost]
    [Permission(Permissions.ProjectEdit)]
    public async Task<ActionResult<Guid>> Create(
        CreatePlantDto dto,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessCompanyAsync(
                User, dto.CompanyId, cancellationToken))
            return Forbid();

        var id = await _plantService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Update(
        Guid id,
        CreatePlantDto dto,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessPlantAsync(User, id, null, cancellationToken))
            return NotFound();

        var current = await _plantService.GetByIdAsync(id);
        if (current is null)
            return NotFound();

        var isSystemUser = await _accessGuard.IsSystemUserAsync(User, cancellationToken);
        if (dto.CompanyId != current.CompanyId && !isSystemUser)
            return Forbid();

        if (!await _accessGuard.CanAccessCompanyAsync(
                User, dto.CompanyId, cancellationToken))
            return Forbid();

        await _plantService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessPlantAsync(User, id, null, cancellationToken))
            return NotFound();

        await _plantService.DeleteAsync(id);
        return NoContent();
    }
}
