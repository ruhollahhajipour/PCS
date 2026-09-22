using System.Security.Claims;

namespace PCS.Application.Identity.Interfaces;

public interface IJwtService
{
    string GenerateToken(
        Guid userId,
        string username,
        IEnumerable<string> roles,
        IEnumerable<string> permissions);
}