namespace PCS.Application.Common.Security;

public static class PermissionProvider
{
    public static IReadOnlyList<string> GetAll()
    {
        return
        [
            Permissions.UsersManage,
            Permissions.RolesManage,

            Permissions.CompanyAdminChange,
            Permissions.CompanyUsersManage,

            Permissions.ProjectView,
            Permissions.ProjectEdit,

            Permissions.CostControlView,

            Permissions.DocumentApprove
        ];
    }
}