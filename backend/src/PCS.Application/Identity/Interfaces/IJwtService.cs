namespace PCS.Application.Identity.Interfaces;

public interface IJwtService
{
    string GenerateToken(Guid userId);
}