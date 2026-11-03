namespace PCS.Application.Identity.Interfaces;

public interface IJwtService
{
    string CreateSecurityStamp(Guid userId, string passwordHash);

    string GenerateToken(
        Guid userId,
        string username,
        IEnumerable<string> roles,
        IEnumerable<string> permissions,
        Guid? companyId,
        bool isPlatformAdmin,
        string securityStamp);
}