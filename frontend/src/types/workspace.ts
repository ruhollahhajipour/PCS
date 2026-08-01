export interface WorkspaceCompany {
  id: number;

  code: string;

  name: string;
}

export interface WorkspacePlant {
  id: number;

  companyId: number;

  code: string;

  name: string;
}

export interface WorkspaceProject {
  id: number;

  plantId: number;

  code: string;

  name: string;
}

export interface Workspace {
  company: WorkspaceCompany;

  plant: WorkspacePlant;

  project: WorkspaceProject;
}

export interface WorkspaceContextType {
  workspace: Workspace;

  setCompany: (company: WorkspaceCompany) => void;

  setPlant: (plant: WorkspacePlant) => void;

  setProject: (project: WorkspaceProject) => void;
}