import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceSelector() {
  const {
    workspace,
    companies,
    plants,
    projects,
    setCompany,
    setPlant,
    setProject,
  } = useWorkspace();

  const filteredPlants =
    plants.filter(
      (plant) =>
        plant.companyId ===
        workspace.company.id
    );

  const filteredProjects =
    projects.filter(
      (project) =>
        project.plantId ===
        workspace.plant.id
    );

  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* =====================================================
          COMPANY
      ===================================================== */}

      <FormControl
        size="small"
        sx={{
          width: {
            md: 185,
            lg: 205,
            xl: 220,
          },
          flexShrink: 1,

          "& .MuiInputLabel-root": {
            fontSize: 10.5,
            fontWeight: 600,
            color: "#64748B",
            top: -1,
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2563EB",
          },

          "& .MuiOutlinedInput-root": {
            height: 42,
            borderRadius: 2,
            bgcolor: "rgba(248,250,252,.72)",
            fontSize: 12.5,
            fontWeight: 650,
            color: "#1E293B",
            transition: "all .2s ease",

            "& fieldset": {
              borderColor: "#DCE4EE",
              transition: "all .2s ease",
            },

            "&:hover fieldset": {
              borderColor: "#B8C6D8",
            },

            "&.Mui-focused": {
              bgcolor: "#FFFFFF",
              boxShadow:
                "0 4px 14px rgba(37,99,235,.08)",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#6B9AFD",
              borderWidth: 1,
            },
          },

          "& .MuiSelect-select": {
            py: 1.15,
          },
        }}
      >
        <InputLabel>
          Company
        </InputLabel>

        <Select
          value={workspace.company.id}
          label="Company"
          onChange={(event) => {
            const companyId =
              String(
                event.target.value
              );

            const company =
              companies.find(
                (item) =>
                  item.id ===
                  companyId
              );

            if (!company) {
              return;
            }

            setCompany(company);
          }}
        >
          {companies.map(
            (company) => (
              <MenuItem
                key={company.id}
                value={company.id}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 550,
                }}
              >
                {company.name}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* =====================================================
          PLANT
      ===================================================== */}

      <FormControl
        size="small"
        sx={{
          width: {
            md: 200,
            lg: 220,
            xl: 235,
          },
          flexShrink: 1,

          "& .MuiInputLabel-root": {
            fontSize: 10.5,
            fontWeight: 600,
            color: "#64748B",
            top: -1,
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2563EB",
          },

          "& .MuiOutlinedInput-root": {
            height: 42,
            borderRadius: 2,
            bgcolor: "rgba(248,250,252,.72)",
            fontSize: 12.5,
            fontWeight: 650,
            color: "#1E293B",
            transition: "all .2s ease",

            "& fieldset": {
              borderColor: "#DCE4EE",
              transition: "all .2s ease",
            },

            "&:hover fieldset": {
              borderColor: "#B8C6D8",
            },

            "&.Mui-focused": {
              bgcolor: "#FFFFFF",
              boxShadow:
                "0 4px 14px rgba(37,99,235,.08)",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#6B9AFD",
              borderWidth: 1,
            },
          },

          "& .MuiSelect-select": {
            py: 1.15,
          },
        }}
      >
        <InputLabel>
          Plant
        </InputLabel>

        <Select
          value={workspace.plant.id}
          label="Plant"
          onChange={(event) => {
            const plantId =
              String(
                event.target.value
              );

            const plant =
              filteredPlants.find(
                (item) =>
                  item.id ===
                  plantId
              );

            if (!plant) {
              return;
            }

            setPlant(plant);
          }}
        >
          {filteredPlants.map(
            (plant) => (
              <MenuItem
                key={plant.id}
                value={plant.id}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 550,
                }}
              >
                {plant.name}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* =====================================================
          PROJECT
      ===================================================== */}

      <FormControl
        size="small"
        sx={{
          width: {
            md: 205,
            lg: 225,
            xl: 245,
          },
          flexShrink: 1,

          "& .MuiInputLabel-root": {
            fontSize: 10.5,
            fontWeight: 600,
            color: "#64748B",
            top: -1,
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2563EB",
          },

          "& .MuiOutlinedInput-root": {
            height: 42,
            borderRadius: 2,
            bgcolor: "rgba(248,250,252,.72)",
            fontSize: 12.5,
            fontWeight: 650,
            color: "#1E293B",
            transition: "all .2s ease",

            "& fieldset": {
              borderColor: "#DCE4EE",
              transition: "all .2s ease",
            },

            "&:hover fieldset": {
              borderColor: "#B8C6D8",
            },

            "&.Mui-focused": {
              bgcolor: "#FFFFFF",
              boxShadow:
                "0 4px 14px rgba(37,99,235,.08)",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#6B9AFD",
              borderWidth: 1,
            },
          },

          "& .MuiSelect-select": {
            py: 1.15,
          },
        }}
      >
        <InputLabel>
          Project
        </InputLabel>

        <Select
          value={workspace.project.id}
          label="Project"
          onChange={(event) => {
            const projectId =
              String(
                event.target.value
              );

            const project =
              filteredProjects.find(
                (item) =>
                  item.id ===
                  projectId
              );

            if (project) {
              setProject(project);
            }
          }}
        >
          {filteredProjects.map(
            (project) => (
              <MenuItem
                key={project.id}
                value={project.id}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 550,
                }}
              >
                {project.name}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Stack>
  );
}