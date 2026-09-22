import type {
  Workspace,
} from "../types/workspace";

const defaultWorkspace: Workspace = {
  company: {
    id: "1",
    code: "KGN",
    name: "Kousha Gaman Namavar",
  },

  plant: {
    id: "1",
    companyId: "1",
    code: "ADISH-01",
    name: "South Adish Gas Condensate Refinery",
  },

  project: {
    id: "1",
    plantId: "1",
    code: "PCS-001",
    name: "Project Cost System",
  },
};

let workspace: Workspace = defaultWorkspace;

class WorkspaceService {
  async get(): Promise<Workspace> {
    return Promise.resolve(workspace);
  }

  async set(data: Workspace): Promise<void> {
    workspace = data;
    return Promise.resolve();
  }

  async reset(): Promise<void> {
    workspace = {
      company: {
        ...defaultWorkspace.company,
      },

      plant: {
        ...defaultWorkspace.plant,
      },

      project: {
        ...defaultWorkspace.project,
      },
    };

    return Promise.resolve();
  }
}

export default new WorkspaceService();