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

    public PlantsController(
        IPlantService plantService)
    {
        _plantService = plantService;
    }

    [HttpGet]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetAll()
    {
        var plants =
            await _plantService.GetAllAsync();

        return Ok(plants);
    }

    [HttpGet("company/{companyId:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetByCompany(
        Guid companyId)
    {
        var plants =
            await _plantService.GetByCompanyIdAsync(
                companyId);

        return Ok(plants);
    }

    [HttpGet("{id:guid}")]
    [Permission(Permissions.ProjectView)]
    public async Task<ActionResult<PlantDto>> GetById(
        Guid id)
    {
        var plant =
            await _plantService.GetByIdAsync(id);

        if (plant is null)
        {
            return NotFound();
        }

        return Ok(plant);
    }

    [HttpPost]
    [Permission(Permissions.ProjectEdit)]
    public async Task<ActionResult<Guid>> Create(
        CreatePlantDto dto)
    {
        var id =
            await _plantService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            id);
    }

    [HttpPut("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Update(
        Guid id,
        CreatePlantDto dto)
    {
        await _plantService.UpdateAsync(
            id,
            dto);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Permission(Permissions.ProjectEdit)]
    public async Task<IActionResult> Delete(
        Guid id)
    {
        await _plantService.DeleteAsync(id);

        return NoContent();
    }
}
