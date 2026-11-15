namespace PCS.Application.Identity.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = "";

    /// <summary>
    /// Set by login and refresh only. Other responses leave it null and the
    /// client keeps the refresh token it already has.
    /// </summary>
    public string? RefreshToken { get; set; }

    public string Username { get; set; } = "";

    public string FullName { get; set; } = "";

    public Guid UserId { get; set; }

    public Guid? ActiveCompanyId { get; set; }

    public List<string> Roles { get; set; } = [];

    public List<string> Permissions { get; set; } = [];

    /// <summary>
    /// مشخص می‌کند کاربر پس از ورود باید رمز عبور خود را تغییر دهد.
    /// </summary>
    public bool MustChangePassword { get; set; }
}