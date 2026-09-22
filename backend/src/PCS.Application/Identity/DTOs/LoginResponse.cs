namespace PCS.Application.Identity.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = "";

    public string Username { get; set; } = "";

    public string FullName { get; set; } = "";

    public Guid UserId { get; set; }

    public List<string> Roles { get; set; } = [];

    public List<string> Permissions { get; set; } = [];

    /// <summary>
    /// مشخص می‌کند کاربر پس از ورود باید رمز عبور خود را تغییر دهد.
    /// </summary>
    public bool MustChangePassword { get; set; }
}