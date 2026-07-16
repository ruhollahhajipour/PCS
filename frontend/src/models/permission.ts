export interface Permission {
  id: number;

  code: string;

  module: string;

  action:
    | "View"
    | "Create"
    | "Edit"
    | "Delete"
    | "Approve"
    | "Export"
    | "Import";

  title: string;

  description?: string;
}

export interface Role {
  id: number;

  code: string;

  name: string;

  description?: string;

  permissions: string[];
}

export interface UserRole {
  userId: number;

  roleId: number;
}