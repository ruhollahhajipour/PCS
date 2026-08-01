import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useWorkspace } from "../../context/WorkspaceContext";

import {
  companies,
  plants,
  projects,
} from "../../data/workspace";

export default function WorkspaceSelector() {
  const {
    workspace,
    setCompany,
    setPlant,
    setProject,
  } = useWorkspace();

  const filteredPlants = plants.filter(
    (p) => p.companyId === workspace.company.id
  );

  const filteredProjects = projects.filter(
    (p) => p.plantId === workspace.plant.id
  );

  return (
    <Stack
      direction="row"
      spacing={2}
    >
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Company</InputLabel>

        <Select
          value={workspace.company.id}
          label="Company"
          onChange={(e) => {
            const company = companies.find(
              (c) => c.id === Number(e.target.value)
            );

            if (!company) return;

            const plant = plants.find(
              (p) => p.companyId === company.id
            );

            const project = projects.find(
              (p) => p.plantId === plant?.id
            );

            setCompany(company);

            if (plant) setPlant(plant);

            if (project) setProject(project);
          }}
        >
          {companies.map((c) => (
            <MenuItem
              key={c.id}
              value={c.id}
            >
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel>Plant</InputLabel>

        <Select
          value={workspace.plant.id}
          label="Plant"
          onChange={(e) => {
            const plant = filteredPlants.find(
              (p) => p.id === Number(e.target.value)
            );

            if (!plant) return;

            const project = projects.find(
              (p) => p.plantId === plant.id
            );

            setPlant(plant);

            if (project) setProject(project);
          }}
        >
          {filteredPlants.map((p) => (
            <MenuItem
              key={p.id}
              value={p.id}
            >
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel>Project</InputLabel>

        <Select
          value={workspace.project.id}
          label="Project"
          onChange={(e) => {
            const project = filteredProjects.find(
              (p) => p.id === Number(e.target.value)
            );

            if (project) setProject(project);
          }}
        >
          {filteredProjects.map((p) => (
            <MenuItem
              key={p.id}
              value={p.id}
            >
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}