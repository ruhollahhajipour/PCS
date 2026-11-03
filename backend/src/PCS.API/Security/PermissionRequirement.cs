using Microsoft.AspNetCore.Authorization;

namespace PCS.API.Security;

public sealed record PermissionRequirement(string Permission) : IAuthorizationRequirement;