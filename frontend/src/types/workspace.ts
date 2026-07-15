export interface WorkspaceCompany {
  id: number;

  code: string;

  name: string;
}

export interface WorkspacePlant {
  id: number;

  code: string;

  name: string;
}

export interface WorkspaceProject {
  id: number;

  code: string;

  name: string;
}

export interface Workspace {
  company: WorkspaceCompany;

  plant: WorkspacePlant;

  project: WorkspaceProject;
}