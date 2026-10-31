import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  AuthContext,
} from "./AuthContext";

import {
  WorkspaceContext,
} from "./WorkspaceContext";

import CompanyService
  from "../features/companies/services/company.service";

import PlantService
  from "../features/plants/services/plant.service";

import ProjectService
  from "../features/projects/services/project.service";

import type {
  Workspace,
  WorkspaceCompany,
  WorkspacePlant,
  WorkspaceProject,
} from "../types/workspace";

const STORAGE_KEY =
  "pcs.workspace";

type Props = {
  children: ReactNode;
};

function createEmptyWorkspace(): Workspace {
  return {
    company: {
      id: "",
      code: "",
      name: "",
    },
    plant: {
      id: "",
      companyId: "",
      code: "",
      name: "",
    },
    project: {
      id: "",
      plantId: "",
      code: "",
      name: "",
    },
  };
}

function loadStoredWorkspace():
  Workspace | null {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return null;
    }

    const parsed =
      JSON.parse(
        stored
      ) as Partial<Workspace>;

    if (
      !parsed.company ||
      !parsed.plant ||
      !parsed.project
    ) {
      return null;
    }

    return {
      company:
        parsed.company,
      plant:
        parsed.plant,
      project:
        parsed.project,
    };
  }
  catch (error) {
    console.warn(
      "Failed to restore PCS workspace",
      error
    );

    return null;
  }
}

function clearStoredWorkspace(): void {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );
  }
  catch (error) {
    console.warn(
      "Failed to clear PCS workspace",
      error
    );
  }
}

function toWorkspaceCompany(
  company: {
    id: string;
    code: string;
    name: string;
  }
): WorkspaceCompany {
  return {
    id:
      company.id,
    code:
      company.code,
    name:
      company.name,
  };
}

function toWorkspacePlant(
  plant: {
    id: string;
    companyId: string;
    code: string;
    name: string;
  }
): WorkspacePlant {
  return {
    id:
      plant.id,
    companyId:
      plant.companyId,
    code:
      plant.code,
    name:
      plant.name,
  };
}

function toWorkspaceProject(
  project: {
    id: string;
    plantId?: string;
    code: string;
    name: string;
  }
): WorkspaceProject {
  return {
    id:
      project.id,
    plantId:
      project.plantId ?? "",
    code:
      project.code,
    name:
      project.name,
  };
}

export function WorkspaceProvider({
  children,
}: Props) {
  const auth =
    useContext(AuthContext);

  const isAuthenticated =
    auth?.isAuthenticated ?? false;

  const authLoading =
    auth?.loading ?? false;

  const [
    workspace,
    setWorkspaceState,
  ] = useState<Workspace>(
    createEmptyWorkspace()
  );

  const [
    companies,
    setCompanies,
  ] = useState<WorkspaceCompany[]>([]);

  const [
    plants,
    setPlants,
  ] = useState<WorkspacePlant[]>([]);

  const [
    projects,
    setProjects,
  ] = useState<WorkspaceProject[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (authLoading) {
        return;
      }

      if (!isAuthenticated) {
        if (cancelled) {
          return;
        }

        setWorkspaceState(
          createEmptyWorkspace()
        );

        setCompanies([]);
        setPlants([]);
        setProjects([]);

        clearStoredWorkspace();

        return;
      }

      try {
        const [
          companyData,
          plantData,
          projectData,
        ] = await Promise.all([
          CompanyService.getAll(),
          PlantService.getAll(),
          ProjectService.getAll(),
        ]);

        if (cancelled) {
          return;
        }

        const realCompanies =
          companyData.map(
            toWorkspaceCompany
          );

        const realPlants =
          plantData.map(
            toWorkspacePlant
          );

        const realProjects =
          projectData.map(
            toWorkspaceProject
          );

        setCompanies(
          realCompanies
        );

        setPlants(
          realPlants
        );

        setProjects(
          realProjects
        );

        if (
          realCompanies.length === 0
        ) {
          setWorkspaceState(
            createEmptyWorkspace()
          );

          clearStoredWorkspace();

          return;
        }

        const stored =
          loadStoredWorkspace();

        const selectedCompany =
          realCompanies.find(
            company =>
              company.id ===
              stored?.company.id
          ) ??
          realCompanies[0];

        const companyPlants =
          realPlants.filter(
            plant =>
              plant.companyId ===
              selectedCompany.id
          );

        const selectedPlant =
          companyPlants.find(
            plant =>
              plant.id ===
              stored?.plant.id
          ) ??
          companyPlants[0];

        const plantProjects =
          selectedPlant
            ? realProjects.filter(
                project =>
                  project.plantId ===
                  selectedPlant.id
              )
            : [];

        const selectedProject =
          plantProjects.find(
            project =>
              project.id ===
              stored?.project.id
          ) ??
          plantProjects[0];

        const nextWorkspace:
          Workspace = {
          company:
            selectedCompany,

          plant:
            selectedPlant ?? {
              id: "",
              companyId:
                selectedCompany.id,
              code: "",
              name: "",
            },

          project:
            selectedProject ?? {
              id: "",
              plantId:
                selectedPlant?.id ?? "",
              code: "",
              name: "",
            },
        };

        setWorkspaceState(
          nextWorkspace
        );

        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              nextWorkspace
            )
          );
        }
        catch (error) {
          console.warn(
            "Failed to persist PCS workspace",
            error
          );
        }
      }
      catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load PCS workspace",
          error
        );

        const stored =
          loadStoredWorkspace();

        if (stored) {
          setWorkspaceState(
            stored
          );
        }
        else {
          setWorkspaceState(
            createEmptyWorkspace()
          );
        }
      }
    }

    loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    authLoading,
  ]);

  const persistWorkspace = useCallback(
    (nextWorkspace: Workspace): void => {
      setWorkspaceState(
        nextWorkspace
      );

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            nextWorkspace
          )
        );
      }
      catch (error) {
        console.warn(
          "Failed to persist PCS workspace",
          error
        );
      }
    },
    []
  );

  const setCompany = useCallback(
    (company: WorkspaceCompany): void => {
      const companyPlants =
        plants.filter(
          plant =>
            plant.companyId ===
            company.id
        );

      const nextPlant =
        companyPlants[0] ?? {
          id: "",
          companyId:
            company.id,
          code: "",
          name: "",
        };

      const plantProjects =
        projects.filter(
          project =>
            project.plantId ===
            nextPlant.id
        );

      const nextProject =
        plantProjects[0] ?? {
          id: "",
          plantId:
            nextPlant.id,
          code: "",
          name: "",
        };

      persistWorkspace({
        company,
        plant:
          nextPlant,
        project:
          nextProject,
      });
    },
    [
      plants,
      projects,
      persistWorkspace
    ]
  );

  const setPlant = useCallback(
    (plant: WorkspacePlant): void => {
      const plantProjects =
        projects.filter(
          project =>
            project.plantId ===
            plant.id
        );

      const nextProject =
        plantProjects[0] ?? {
          id: "",
          plantId:
            plant.id,
          code: "",
          name: "",
        };

      persistWorkspace({
        ...workspace,
        plant,
        project:
          nextProject,
      });
    },
    [
      projects,
      workspace,
      persistWorkspace
    ]
  );

  const setProject = useCallback(
    (project: WorkspaceProject): void => {
      persistWorkspace({
        ...workspace,
        project,
      });
    },
    [
      workspace,
      persistWorkspace
    ]
  );

  const value =
    useMemo(
      () => ({
        workspace,
        companies,
        plants,
        projects,
        setCompany,
        setPlant,
        setProject,
      }),
      [
        workspace,
        companies,
        plants,
        projects,
        setCompany,
        setPlant,
        setProject,
      ]
    );

  return (
    <WorkspaceContext.Provider
      value={value}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}