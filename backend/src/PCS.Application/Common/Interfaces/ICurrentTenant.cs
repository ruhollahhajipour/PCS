namespace PCS.Application.Common.Interfaces;

public interface ICurrentTenant
{
    Guid? UserId { get; }
    Guid? CompanyId { get; }
    bool IsPlatformAdmin { get; }
    bool IsGlobalScope { get; }
}
