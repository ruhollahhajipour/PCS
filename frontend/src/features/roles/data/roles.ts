import type { Role } from "../../../models/permission";

const roles: Role[] = [
  {
    id: 1,
    code: "SUPER_ADMIN",
    name: "Super Admin",
    description: "PCS System Administrator",
    permissions: ["*"],
  },

  {
    id: 2,
    code: "COMPANY_ADMIN",
    name: "Company Admin",
    description: "Company Administrator",
    permissions: [
      "dashboard.view",

      "company.view",
      "company.edit",

      "plant.view",
      "plant.create",
      "plant.edit",
      "plant.delete",

      "project.view",
      "project.create",
      "project.edit",
      "project.delete",

      "material.view",
      "material.create",
      "material.edit",
      "material.delete",
      "material.import",
      "material.export",

      "procurement.view",
      "procurement.create",
      "procurement.edit",
      "procurement.delete",
      "procurement.approve",

      "warehouse.view",
      "warehouse.create",
      "warehouse.edit",
      "warehouse.delete",

      "cost.view",
      "cost.edit",
      "cost.approve",
      "cost.export",

      "document.view",
      "document.create",
      "document.delete",

      "report.view",
      "report.export",
    ],
  },

  {
    id: 3,
    code: "PROJECT_MANAGER",
    name: "Project Manager",
    description: "Project Management",
    permissions: [
      "dashboard.view",

      "project.view",
      "project.edit",

      "material.view",

      "procurement.view",
      "procurement.approve",

      "warehouse.view",

      "cost.view",
      "cost.edit",
      "cost.export",

      "document.view",

      "report.view",
      "report.export",
    ],
  },

  {
    id: 4,
    code: "COST_CONTROLLER",
    name: "Cost Controller",
    description: "Cost Control Engineer",
    permissions: [
      "dashboard.view",

      "project.view",

      "cost.view",
      "cost.edit",
      "cost.export",

      "report.view",
      "report.export",
    ],
  },

  {
    id: 5,
    code: "PROCUREMENT",
    name: "Procurement",
    description: "Procurement Department",
    permissions: [
      "dashboard.view",

      "material.view",

      "procurement.view",
      "procurement.create",
      "procurement.edit",

      "vendor.view",

      "document.view",

      "report.view",
    ],
  },

  {
    id: 6,
    code: "WAREHOUSE",
    name: "Warehouse",
    description: "Warehouse Department",
    permissions: [
      "dashboard.view",

      "material.view",

      "warehouse.view",
      "warehouse.create",
      "warehouse.edit",

      "document.view",
    ],
  },

  {
    id: 7,
    code: "READ_ONLY",
    name: "Read Only",
    description: "Viewer",
    permissions: [
      "dashboard.view",

      "project.view",

      "material.view",

      "warehouse.view",

      "procurement.view",

      "cost.view",

      "document.view",

      "report.view",
    ],
  },
];

export default roles;