using Microsoft.AspNetCore.Mvc;
using PCS.API.Security;
using PCS.Application.Common.Security;
using PCS.Application.Companies.DTOs;
using PCS.Application.Companies.Interfaces;

namespace PCS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;
    private readonly IProjectAccessGuard _accessGuard;

    public CompaniesController(
        ICompanyService companyService,
        IProjectAccessGuard accessGuard)
    {
        _companyService = companyService;
        _accessGuard = accessGuard;
    }

    [HttpGet]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var companyIds = await _accessGuard.GetAccessibleCompanyIdsAsync(
            User, cancellationToken);

        return Ok(await _companyService.GetByIdsAsync(companyIds));
    }

    [HttpGet("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<CompanyDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessCompanyAsync(User, id, cancellationToken))
            return NotFound();

        var company = await _companyService.GetByIdAsync(id);
        return company is null ? NotFound() : Ok(company);
    }

    [HttpPost]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<Guid>> Create(CreateCompanyDto dto)
    {
        if (!await _accessGuard.IsSystemUserAsync(User))
            return Forbid();

        var id = await _companyService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<IActionResult> Update(
        Guid id,
        CreateCompanyDto dto,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.CanAccessCompanyAsync(User, id, cancellationToken))
            return NotFound();

        var current = await _companyService.GetByIdAsync(id);
        if (current is null)
            return NotFound();

        var isSystemUser = await _accessGuard.IsSystemUserAsync(User, cancellationToken);
        if (dto.IsActive != current.IsActive && !isSystemUser)
            return Forbid();

        await _companyService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!await _accessGuard.IsSystemUserAsync(User))
            return Forbid();

        if (!await _accessGuard.CanAccessCompanyAsync(User, id, cancellationToken))
            return NotFound();

        await _companyService.DeleteAsync(id);
        return NoContent();
    }
}
