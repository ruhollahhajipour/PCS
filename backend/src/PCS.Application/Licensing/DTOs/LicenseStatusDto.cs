namespace PCS.Application.Licensing.DTOs;

public class LicenseStatusDto
{
    public bool HasLicense { get; set; }

    public string? LicenseKey { get; set; }

    public string Status { get; set; } = "None";

    public DateTime? IssuedAt { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public List<LicenseModuleDto> Modules { get; set; } = new();
}

public class LicenseModuleDto
{
    public string ModuleId { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime? ExpiresAt { get; set; }
}
