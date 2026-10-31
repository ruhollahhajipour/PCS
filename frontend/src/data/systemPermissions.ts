import type { Permission } from "../models/permission";

const systemPermissions: Permission[] = [
  // ===========================
  // Users
  // ===========================

  {
    id: 1000,
    code: "user.view",
    module: "Users",
    action: "View",
    title: "View Users",
  },

  {
    id: 1001,
    code: "user.create",
    module: "Users",
    action: "Create",
    title: "Create User",
  },

  {
    id: 1002,
    code: "user.edit",
    module: "Users",
    action: "Edit",
    title: "Edit User",
  },

  {
    id: 1003,
    code: "user.delete",
    module: "Users",
    action: "Delete",
    title: "Delete User",
  },

  // ===========================
  // Roles
  // ===========================

  {
    id: 1010,
    code: "role.view",
    module: "Roles",
    action: "View",
    title: "View Roles",
  },

  {
    id: 1011,
    code: "role.create",
    module: "Roles",
    action: "Create",
    title: "Create Role",
  },

  {
    id: 1012,
    code: "role.edit",
    module: "Roles",
    action: "Edit",
    title: "Edit Role",
  },

  {
    id: 1013,
    code: "role.delete",
    module: "Roles",
    action: "Delete",
    title: "Delete Role",
  },

  // ===========================
  // Permissions
  // ===========================

  {
    id: 1020,
    code: "permission.view",
    module: "Permissions",
    action: "View",
    title: "View Permissions",
  },

  {
    id: 1021,
    code: "permission.edit",
    module: "Permissions",
    action: "Edit",
    title: "Assign Permissions",
  },

  // ===========================
  // Vendors
  // ===========================

  {
    id: 1030,
    code: "vendor.view",
    module: "Vendor",
    action: "View",
    title: "View Vendors",
  },

  {
    id: 1031,
    code: "vendor.create",
    module: "Vendor",
    action: "Create",
    title: "Create Vendor",
  },

  {
    id: 1032,
    code: "vendor.edit",
    module: "Vendor",
    action: "Edit",
    title: "Edit Vendor",
  },

  {
    id: 1033,
    code: "vendor.delete",
    module: "Vendor",
    action: "Delete",
    title: "Delete Vendor",
  },

  // ===========================
  // Company Settings
  // ===========================

  {
    id: 1040,
    code: "settings.company",
    module: "Settings",
    action: "Edit",
    title: "Company Settings",
  },

  {
    id: 1041,
    code: "settings.logo",
    module: "Settings",
    action: "Edit",
    title: "Company Logo",
  },

  {
    id: 1042,
    code: "settings.theme",
    module: "Settings",
    action: "Edit",
    title: "Theme Settings",
  },

  {
    id: 1043,
    code: "settings.language",
    module: "Settings",
    action: "Edit",
    title: "Language Settings",
  },

  {
    id: 1044,
    code: "settings.currency",
    module: "Settings",
    action: "Edit",
    title: "Currency Settings",
  },

  {
    id: 1045,
    code: "settings.email",
    module: "Settings",
    action: "Edit",
    title: "Email Settings",
  },

  {
    id: 1046,
    code: "settings.numbering",
    module: "Settings",
    action: "Edit",
    title: "Document Numbering",
  },

  // ===========================
  // Audit
  // ===========================

  {
    id: 1050,
    code: "audit.view",
    module: "Audit",
    action: "View",
    title: "View Audit Logs",
  },

  // ===========================
  // Backup
  // ===========================

  {
    id: 1060,
    code: "backup.create",
    module: "Backup",
    action: "Create",
    title: "Create Backup",
  },

  {
    id: 1061,
    code: "backup.restore",
    module: "Backup",
    action: "Import",
    title: "Restore Backup",
  },
];

export default systemPermissions;