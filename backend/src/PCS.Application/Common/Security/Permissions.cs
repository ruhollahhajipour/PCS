namespace PCS.Application.Common.Security;

public static class Permissions
{
    // ==========================
    // Security
    // ==========================

    public const string UsersManage =
        "SECURITY_USERS_MANAGE";

    public const string RolesManage =
        "SECURITY_ROLES_MANAGE";


    // ==========================
    // Company
    // ==========================

    public const string CompanyAdminChange =
        "COMPANY_ADMIN_CHANGE";

    public const string CompanyUsersManage =
        "COMPANY_USERS_MANAGE";


    // ==========================
    // PMS
    // ==========================

    public const string ProjectView =
        "PMS_PROJECT_VIEW";

    public const string ProjectEdit =
        "PMS_PROJECT_EDIT";


    // ==========================
    // Cost Control
    // ==========================

    public const string CostControlView =
        "COST_CONTROL_VIEW";


    // ==========================
    // Document
    // ==========================

    public const string DocumentApprove =
        "DOCUMENT_APPROVE";
}