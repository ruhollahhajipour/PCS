using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Export.Pdf;

/// <summary>
/// Resolves the PCS and company logo assets used by branded PDF reports.
/// Relative paths are resolved beneath the deployed branding directory.
/// </summary>
public sealed class PdfBrandingService
{
    private static readonly string BrandingDirectory =
        Path.Combine(AppContext.BaseDirectory, "Resources", "Branding");

    public byte[]? GetPlatformLogo(ExportPmsDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        return ReadConfiguredLogo(dto.PlatformLogoPath)
            ?? ReadConfiguredLogo(dto.LogoPath)
            ?? ReadFile(Path.Combine(BrandingDirectory, "pcs-logo.png"));
    }

    public byte[]? GetCompanyLogo(ExportPmsDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (string.IsNullOrWhiteSpace(dto.CompanyLogoPath))
            return null;

        return ReadConfiguredLogo(dto.CompanyLogoPath);
    }

    private static byte[]? ReadConfiguredLogo(string? configuredPath)
    {
        if (string.IsNullOrWhiteSpace(configuredPath))
            return null;

        try
        {
            var path = Path.IsPathRooted(configuredPath)
                ? Path.GetFullPath(configuredPath)
                : Path.GetFullPath(Path.Combine(BrandingDirectory, configuredPath));

            if (!Path.IsPathRooted(configuredPath))
            {
                var root = Path.GetFullPath(BrandingDirectory)
                    .TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;

                if (!path.StartsWith(root, StringComparison.OrdinalIgnoreCase))
                    return null;
            }

            return ReadFile(path);
        }
        catch (Exception exception) when (
            exception is ArgumentException or
            IOException or
            UnauthorizedAccessException or
            NotSupportedException)
        {
            return null;
        }
    }

    private static byte[]? ReadFile(string path)
    {
        try
        {
            return File.Exists(path) ? File.ReadAllBytes(path) : null;
        }
        catch (Exception exception) when (
            exception is IOException or UnauthorizedAccessException)
        {
            return null;
        }
    }
}
