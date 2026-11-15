namespace PCS.Application.Identity;

/// <summary>
/// Bound from the "Email" section. Provider is "None" (default, nothing is
/// sent), "Smtp", or "Log" (development only: writes the message to the log).
/// </summary>
public sealed class EmailOptions
{
    public const string SectionName = "Email";

    public string Provider { get; set; } = "None";

    public string? From { get; set; }

    public string? Host { get; set; }

    public int Port { get; set; } = 587;

    public bool EnableSsl { get; set; } = true;

    public string? UserName { get; set; }

    public string? Password { get; set; }
}
