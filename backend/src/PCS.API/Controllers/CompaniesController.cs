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


    public CompaniesController(
        ICompanyService companyService)
    {
        _companyService = companyService;
    }


    [HttpGet]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAll()
    {
        var companies =
            await _companyService.GetAllAsync();

        return Ok(companies);
    }


    [HttpGet("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<CompanyDto>> GetById(
        Guid id)
    {
        var company =
            await _companyService.GetByIdAsync(id);

        if (company is null)
        {
            return NotFound();
        }

        return Ok(company);
    }


    [HttpPost]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<ActionResult<Guid>> Create(
        CreateCompanyDto dto)
    {
        var id =
            await _companyService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            id);
    }


    [HttpPut("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<IActionResult> Update(
        Guid id,
        CreateCompanyDto dto)
    {
        await _companyService.UpdateAsync(
            id,
            dto);

        return NoContent();
    }


    [HttpDelete("{id:guid}")]
    [Permission(Permissions.CompanyUsersManage)]
    public async Task<IActionResult> Delete(
        Guid id)
    {
        await _companyService.DeleteAsync(id);

        return NoContent();
    }
}