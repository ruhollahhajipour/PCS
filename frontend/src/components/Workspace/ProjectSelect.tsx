import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useMemo } from "react";

import { useWorkspace } from "../../context/WorkspaceContext";
import { projects } from "../../data/workspace";

export default function ProjectSelect() {
  const {
    workspace,
    setProject,
  } = useWorkspace();

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.plantId === workspace.plant.id
      ),
    [workspace.plant.id]
  );

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 260,
      }}
    >
      <InputLabel>
        Project
      </InputLabel>

      <Select
        label="Project"
        value={workspace.project.id}
        onChange={(e) => {
          const project =
            filteredProjects.find(
              (p) =>
                p.id === Number(e.target.value)
            );

          if (project) {
            setProject(project);
          }
        }}
      >
        {filteredProjects.map((project) => (
          <MenuItem
            key={project.id}
            value={project.id}
          >
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}