namespace PCS.Application.Common.Security;

public static class Permissions
{
    public static class Projects
    {
        public const string Read = "Projects.Read";

        public const string Create = "Projects.Create";

        public const string Update = "Projects.Update";

        public const string Delete = "Projects.Delete";

        public const string Import = "Projects.Import";

        public const string Export = "Projects.Export";
    }

    public static class Companies
    {
        public const string Read = "Companies.Read";

        public const string Create = "Companies.Create";

        public const string Update = "Companies.Update";

        public const string Delete = "Companies.Delete";
    }
}