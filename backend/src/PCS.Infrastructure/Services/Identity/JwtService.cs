using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

using PCS.Application.Identity;
using PCS.Application.Identity.Interfaces;

namespace PCS.Infrastructure.Services.Identity;

public sealed class JwtService : IJwtService
{
    private readonly JwtSettings _settings;


    public JwtService(
        IConfiguration configuration)
    {
        _settings =
            configuration
                .GetSection(JwtSettings.SectionName)
                .Get<JwtSettings>()
            ?? throw new InvalidOperationException(
                "PCS JWT configuration was not found.");


        if (string.IsNullOrWhiteSpace(
                _settings.Secret))
        {
            throw new InvalidOperationException(
                "PCS JWT secret is not configured.");
        }


        if (_settings.Secret.Length < 32)
        {
            throw new InvalidOperationException(
                "PCS JWT secret must contain at least 32 characters.");
        }


        if (_settings.ExpirationMinutes <= 0)
        {
            throw new InvalidOperationException(
                "PCS JWT expiration must be greater than zero.");
        }
    }


    public string GenerateToken(
        Guid userId,
        string username,
        IEnumerable<string> roles,
        IEnumerable<string> permissions)
    {
        var claims =
            new List<Claim>
            {
                new(
                    JwtRegisteredClaimNames.Sub,
                    userId.ToString()),

                new(
                    ClaimTypes.NameIdentifier,
                    userId.ToString()),

                new(
                    ClaimTypes.Name,
                    username)
            };


        foreach (string role in roles.Distinct(
                     StringComparer.OrdinalIgnoreCase))
        {
            if (!string.IsNullOrWhiteSpace(role))
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        role));
            }
        }


        foreach (string permission in permissions.Distinct(
                     StringComparer.OrdinalIgnoreCase))
        {
            if (!string.IsNullOrWhiteSpace(permission))
            {
                claims.Add(
                    new Claim(
                        "permission",
                        permission));
            }
        }


        byte[] key =
            Encoding.UTF8.GetBytes(
                _settings.Secret);


        var securityKey =
            new SymmetricSecurityKey(
                key);


        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);


        DateTime issuedAt =
            DateTime.UtcNow;


        DateTime expiresAt =
            issuedAt.AddMinutes(
                _settings.ExpirationMinutes);


        var token =
            new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: issuedAt,
                expires: expiresAt,
                signingCredentials: credentials);


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}