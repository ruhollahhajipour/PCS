import { useCallback } from "react";

import WorkspaceService from "../services/workspace.service";

import type {
  Workspace,
} from "../types/workspace";

export default function useWorkspace() {
  const loadWorkspace = useCallback(async () => {
    const data =
      await WorkspaceService.get();

    return data;
  }, []);

  const saveWorkspace = useCallback(
    async (
      data: Workspace
    ) => {
      await WorkspaceService.set(data);
    },
    []
  );

  const resetWorkspace = useCallback(
    async () => {
      await WorkspaceService.reset();
    },
    []
  );

  return {
    loadWorkspace,
    saveWorkspace,
    resetWorkspace,
  };
}