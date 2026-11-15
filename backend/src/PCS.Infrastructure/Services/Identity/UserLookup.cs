using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Services.Identity;

internal static class UserLookup
{
    private const int MaxIdentifierLength = 256;

    /// <summary>
    /// Narrows users to those matching a login identifier: a user name, or an
    /// email address (case-insensitive) when it contains '@'. Callers take
    /// two rows and accept the result only when exactly one matches, because
    /// email addresses are not unique.
    /// </summary>
    public static IQueryable<User> ByIdentifier(
        IQueryable<User> source,
        string identifier)
    {
        string value = identifier.Trim();

        if (value.Length == 0 || value.Length > MaxIdentifierLength)
        {
            return source.Where(_ => false);
        }

        if (value.Contains('@'))
        {
            string lowered = value.ToLowerInvariant();

            // A user name may itself contain '@', so it is matched as well.
            return source.Where(x =>
                x.UserName == value ||
                (x.Email != "" && x.Email.ToLower() == lowered));
        }

        return source.Where(x => x.UserName == value);
    }
}
