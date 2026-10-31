import type {
  Permission,
} from "../models/permission";

const permissions: Permission[] = [
  // Dashboard
  {
    id: 1,
    code: "dashboard.view",
    module: "Dashboard",
    action: "View",
    title: "View Dashboard",
  },

  // Companies
  {
    id: 2,
    code: "company.view",
    module: "Company",
    action: "View",
    title: "View Companies",
  },
  {
    id: 3,
    code: "company.create",
    module: "Company",
    action: "Create",
    title: "Create Company",
  },
  {
    id: 4,
    code: "company.edit",
    module: "Company",
    action: "Edit",
    title: "Edit Company",
  },
  {
    id: 5,
    code: "company.delete",
    module: "Company",
    action: "Delete",
    title: "Delete Company",
  },

  // Plants
  {
    id: 10,
    code: "plant.view",
    module: "Plant",
    action: "View",
    title: "View Plants",
  },
  {
    id: 11,
    code: "plant.create",
    module: "Plant",
    action: "Create",
    title: "Create Plant",
  },
  {
    id: 12,
    code: "plant.edit",
    module: "Plant",
    action: "Edit",
    title: "Edit Plant",
  },
  {
    id: 13,
    code: "plant.delete",
    module: "Plant",
    action: "Delete",
    title: "Delete Plant",
  },

  // Projects
  {
    id: 20,
    code: "project.view",
    module: "Project",
    action: "View",
    title: "View Projects",
  },
  {
    id: 21,
    code: "project.create",
    module: "Project",
    action: "Create",
    title: "Create Project",
  },
  {
    id: 22,
    code: "project.edit",
    module: "Project",
    action: "Edit",
    title: "Edit Project",
  },
  {
    id: 23,
    code: "project.delete",
    module: "Project",
    action: "Delete",
    title: "Delete Project",
  },

  // Materials
  {
    id: 30,
    code: "material.view",
    module: "Material",
    action: "View",
    title: "View Materials",
  },
  {
    id: 31,
    code: "material.create",
    module: "Material",
    action: "Create",
    title: "Create Material",
  },
  {
    id: 32,
    code: "material.edit",
    module: "Material",
    action: "Edit",
    title: "Edit Material",
  },
  {
    id: 33,
    code: "material.delete",
    module: "Material",
    action: "Delete",
    title: "Delete Material",
  },
  {
    id: 34,
    code: "material.import",
    module: "Material",
    action: "Import",
    title: "Import Materials",
  },
  {
    id: 35,
    code: "material.export",
    module: "Material",
    action: "Export",
    title: "Export Materials",
  },

  // Procurement
  {
    id: 40,
    code: "procurement.view",
    module: "Procurement",
    action: "View",
    title: "View Procurement",
  },
  {
    id: 41,
    code: "procurement.create",
    module: "Procurement",
    action: "Create",
    title: "Create Procurement",
  },
  {
    id: 42,
    code: "procurement.edit",
    module: "Procurement",
    action: "Edit",
    title: "Edit Procurement",
  },
  {
    id: 43,
    code: "procurement.delete",
    module: "Procurement",
    action: "Delete",
    title: "Delete Procurement",
  },
  {
    id: 44,
    code: "procurement.approve",
    module: "Procurement",
    action: "Approve",
    title: "Approve Procurement",
  },

  // Warehouse
  {
    id: 50,
    code: "warehouse.view",
    module: "Warehouse",
    action: "View",
    title: "View Warehouse",
  },
  {
    id: 51,
    code: "warehouse.create",
    module: "Warehouse",
    action: "Create",
    title: "Create Warehouse Transaction",
  },
  {
    id: 52,
    code: "warehouse.edit",
    module: "Warehouse",
    action: "Edit",
    title: "Edit Warehouse Transaction",
  },
  {
    id: 53,
    code: "warehouse.delete",
    module: "Warehouse",
    action: "Delete",
    title: "Delete Warehouse Transaction",
  },

  // Cost Control
  {
    id: 60,
    code: "cost.view",
    module: "CostControl",
    action: "View",
    title: "View Cost Control",
  },
  {
    id: 61,
    code: "cost.edit",
    module: "CostControl",
    action: "Edit",
    title: "Edit Cost",
  },
  {
    id: 62,
    code: "cost.approve",
    module: "CostControl",
    action: "Approve",
    title: "Approve Cost",
  },
  {
    id: 63,
    code: "cost.export",
    module: "CostControl",
    action: "Export",
    title: "Export Cost Reports",
  },

  // Documents
  {
    id: 70,
    code: "document.view",
    module: "Document",
    action: "View",
    title: "View Documents",
  },
  {
    id: 71,
    code: "document.create",
    module: "Document",
    action: "Create",
    title: "Upload Document",
  },
  {
    id: 72,
    code: "document.delete",
    module: "Document",
    action: "Delete",
    title: "Delete Document",
  },

  // Reports
  {
    id: 80,
    code: "report.view",
    module: "Report",
    action: "View",
    title: "View Reports",
  },
  {
    id: 81,
    code: "report.export",
    module: "Report",
    action: "Export",
    title: "Export Reports",
  },
];

export default permissions;