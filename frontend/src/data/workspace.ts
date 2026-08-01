import type {
  Workspace,
  WorkspaceCompany,
  WorkspacePlant,
  WorkspaceProject,
} from "../types/workspace";

export const companies: WorkspaceCompany[] = [
  {
    id: 1,
    code: "KGN",
    name: "Kousha Gaman Namavar",
  },
  {
    id: 2,
    code: "PMC",
    name: "Petroleum Management Company",
  },
];

export const plants: WorkspacePlant[] = [
  {
    id: 1,
    companyId: 1,
    code: "ADISH-01",
    name: "South Adish Gas Condensate Refinery",
  },
  {
    id: 2,
    companyId: 2,
    code: "ADISH-02",
    name: "North Adish Refinery",
  },
];

export const projects: WorkspaceProject[] = [
  {
    id: 1,
    plantId: 1,
    code: "PCS-001",
    name: "Project Cost System",
  },
  {
    id: 2,
    plantId: 2,
    code: "EPC-002",
    name: "EPC Phase II",
  },
];

const workspace: Workspace = {
  company: companies[0],
  plant: plants[0],
  project: projects[0],
};

export default workspace;