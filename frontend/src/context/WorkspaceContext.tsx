import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  Workspace,
} from "../types/workspace";


interface WorkspaceContextType {

  workspace: Workspace | null;

  setWorkspace: (
    workspace: Workspace
  ) => void;

  clearWorkspace: () => void;

}


const WorkspaceContext =
  createContext<WorkspaceContextType | null>(
    null
  );


interface WorkspaceProviderProps {
  children: ReactNode;
}


export function WorkspaceProvider({
  children,
}: WorkspaceProviderProps) {

  const [
    workspace,
    setWorkspaceState,
  ] = useState<Workspace | null>(
    null
  );


  const setWorkspace = (
    workspaceData: Workspace
  ) => {

    setWorkspaceState(
      workspaceData
    );

  };


  const clearWorkspace = () => {

    setWorkspaceState(
      null
    );

  };


  return (

    <WorkspaceContext.Provider

      value={{
        workspace,

        setWorkspace,

        clearWorkspace,
      }}

    >

      {children}

    </WorkspaceContext.Provider>

  );
}



export function useWorkspaceContext() {

  const context =
    useContext(
      WorkspaceContext
    );


  if (!context) {

    throw new Error(
      "useWorkspaceContext must be used inside WorkspaceProvider"
    );

  }


  return context;

}


// Alias برای سازگاری با فایل‌های قبلی
export const useWorkspace =
  useWorkspaceContext;