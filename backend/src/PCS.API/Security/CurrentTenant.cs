using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PCS.Application.Common.Interfaces;

namespace PCS.API.Security;

public sealed class CurrentTenant : ICurrentTenant
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentTenant(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private HttpContext? Context => _httpContextAccessor.HttpContext;

    public Guid? UserId =>
        Context?.Items["PCS.UserId"] is Guid userId
            ? userId
            : ParseGuid(Context?.User.FindFirstValue(ClaimTypes.NameIdentifier));

    public Guid? CompanyId =>
        Context?.Items["PCS.CompanyId"] is Guid companyId
            ? companyId
            : ParseGuid(Context?.User.FindFirstValue("company_id"));

    public bool IsPlatformAdmin =>
        Context?.Items["PCS.IsPlatformAdmin"] is bool value
            ? value
            : Context?.User.IsInRole("SUPER_ADMIN") == true;

    public bool IsGlobalScope =>
        IsPlatformAdmin && !CompanyId.HasValue;

    private static Guid? ParseGuid(string? value) =>
        Guid.TryParse(value, out Guid result) ? result : null;
}
