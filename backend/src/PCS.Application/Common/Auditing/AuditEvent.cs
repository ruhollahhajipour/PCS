namespace PCS.Application.Common.Auditing;

/// <summary>
/// An explicit business event (login, password change, export, ...).
/// Data changes are recorded automatically by the persistence layer and do
/// not need an explicit event.
/// </summary>
/// <param name="Details">
/// Short, non-sensitive text. Never put passwords, tokens or reset codes here.
/// </param>
public sealed record AuditEvent(
    string Module,
    string Entity,
    string EntityId,
    string Action,
    Guid? UserId = null,
    string? Username = null,
    Guid? CompanyId = null,
    string? Details = null);

public static class AuditModules
{
    public const string Security = "Security";
    public const string Licensing = "Licensing";
    public const string Planning = "Planning";
    public const string Projects = "Projects";
    public const string Reports = "Reports";
}

public static class AuditActions
{
    public const string Login = "Login";
    public const string LoginFailed = "LoginFailed";
    public const string Logout = "Logout";
    public const string SelectCompany = "SelectCompany";
    public const string PasswordChanged = "PasswordChanged";
    public const string PasswordChangeFailed = "PasswordChangeFailed";
    public const string Export = "Export";
    public const string Import = "Import";
}
