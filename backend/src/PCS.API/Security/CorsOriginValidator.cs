namespace PCS.API.Security;

public static class CorsOriginValidator
{
    public static string[] Normalize(
        IEnumerable<string> configuredOrigins)
    {
        ArgumentNullException.ThrowIfNull(configuredOrigins);

        var allowedOrigins = new List<string>();

        foreach (var configuredOrigin in configuredOrigins)
        {
            if (string.IsNullOrWhiteSpace(configuredOrigin) ||
                !string.Equals(
                    configuredOrigin,
                    configuredOrigin.Trim(),
                    StringComparison.Ordinal) ||
                !Uri.TryCreate(
                    configuredOrigin,
                    UriKind.Absolute,
                    out var origin) ||
                (origin.Scheme != Uri.UriSchemeHttp &&
                 origin.Scheme != Uri.UriSchemeHttps) ||
                string.IsNullOrWhiteSpace(origin.Host) ||
                origin.Host.Contains('*') ||
                origin.UserInfo.Length > 0 ||
                origin.AbsolutePath != "/" ||
                origin.Query.Length > 0 ||
                origin.Fragment.Length > 0)
            {
                throw new InvalidOperationException(
                    "PCS CORS origins must be exact HTTP or HTTPS origins without wildcards, paths, credentials, query strings, or fragments.");
            }

            var normalizedOrigin =
                origin.GetLeftPart(UriPartial.Authority);

            if (!allowedOrigins.Contains(
                    normalizedOrigin,
                    StringComparer.OrdinalIgnoreCase))
            {
                allowedOrigins.Add(normalizedOrigin);
            }
        }

        return allowedOrigins.ToArray();
    }
}
