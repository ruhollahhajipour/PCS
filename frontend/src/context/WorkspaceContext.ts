import { createContext, useContext } from "react";

import type {
  Workspace,
  WorkspaceCompany,
  WorkspacePlant,
  WorkspaceProject,
} from "../types/workspace";

export interface WorkspaceContextType {
  workspace: Workspace;

  companies: WorkspaceCompany[];
  plants: WorkspacePlant[];
  projects: WorkspaceProject[];

  setCompany: (company: WorkspaceCompany) => void;
  setPlant: (plant: WorkspacePlant) => void;
  setProject: (project: WorkspaceProject) => void;
}

export const WorkspaceContext =
  createContext<WorkspaceContextType | undefined>(
    undefined
  );

export function useWorkspace(): WorkspaceContextType {
  const context =
    useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used within WorkspaceProvider"
    );
  }

  return context;
}