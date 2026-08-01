using Microsoft.AspNetCore.Authorization;

namespace PCS.API.Security;

public sealed class PermissionAttribute
    : AuthorizeAttribute
{
    public PermissionAttribute(
        string permission)
    {
        Policy = permission;
    }
}