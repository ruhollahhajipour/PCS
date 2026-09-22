export interface WorkspaceCompany {
  id: string;
  code: string;
  name: string;
}

export interface WorkspacePlant {
  id: string;
  companyId: string;
  code: string;
  name: string;
}

export interface WorkspaceProject {
  id: string;
  plantId: string;
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

  setCompany: (
    company: WorkspaceCompany
  ) => void;

  setPlant: (
    plant: WorkspacePlant
  ) => void;

  setProject: (
    project: WorkspaceProject
  ) => void;
}