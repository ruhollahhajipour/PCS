namespace PCS.Application.Common.Security;

public static class PermissionProvider
{
    public static IReadOnlyList<string> GetAll()
    {
        return
        [
            Permissions.Projects.Read,
            Permissions.Projects.Create,
            Permissions.Projects.Update,
            Permissions.Projects.Delete,
            Permissions.Projects.Import,
            Permissions.Projects.Export,

            Permissions.Companies.Read,
            Permissions.Companies.Create,
            Permissions.Companies.Update,
            Permissions.Companies.Delete
        ];
    }
}