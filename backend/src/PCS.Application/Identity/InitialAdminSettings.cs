namespace PCS.Application.Identity;

public sealed class InitialAdminSettings
{
    public const string SectionName = "InitialAdmin";

    public string Username { get; set; } = "admin";

    public string Password { get; set; } = "admin123";

    public string FirstName { get; set; } = "PCS";

    public string LastName { get; set; } = "Administrator";

    public string Email { get; set; } = "admin@pcs.local";
}