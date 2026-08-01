import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  Workspace,
  WorkspaceCompany,
  WorkspaceContextType,
  WorkspacePlant,
  WorkspaceProject,
} from "../types/workspace";

const defaultCompany: WorkspaceCompany = {
  id: 1,
  code: "KNG",
  name: "Kousha Gaman Namavar",
};

const defaultPlant: WorkspacePlant = {
  id: 1,
  companyId: 1,
  code: "SAGR",
  name: "South Adish Gas Condensate Refinery",
};

const defaultProject: WorkspaceProject = {
  id: 1,
  plantId: 1,
  code: "PH1",
  name: "Phase 1 EPC",
};

const defaultWorkspace: Workspace = {
  company: defaultCompany,
  plant: defaultPlant,
  project: defaultProject,
};

const WorkspaceContext =
  createContext<WorkspaceContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function WorkspaceProvider({
  children,
}: Props) {
  const [workspace, setWorkspace] =
    useState<Workspace>(defaultWorkspace);

  function setCompany(
    company: WorkspaceCompany
  ) {
    setWorkspace((prev) => ({
      ...prev,
      company,
    }));
  }

  function setPlant(
    plant: WorkspacePlant
  ) {
    setWorkspace((prev) => ({
      ...prev,
      plant,
    }));
  }

  function setProject(
    project: WorkspaceProject
  ) {
    setWorkspace((prev) => ({
      ...prev,
      project,
    }));
  }

  const value = useMemo(
    () => ({
      workspace,
      setCompany,
      setPlant,
      setProject,
    }),
    [workspace]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
}