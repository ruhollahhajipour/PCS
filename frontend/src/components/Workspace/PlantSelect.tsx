import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useMemo } from "react";

import { useWorkspace } from "../../context/WorkspaceContext";
import { plants } from "../../data/workspace";

export default function PlantSelect() {
  const {
    workspace,
    setPlant,
  } = useWorkspace();

  const filteredPlants = useMemo(
    () =>
      plants.filter(
        (plant) =>
          plant.companyId === workspace.company.id
      ),
    [workspace.company.id]
  );

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 260,
      }}
    >
      <InputLabel>
        Plant
      </InputLabel>

      <Select
        label="Plant"
        value={workspace.plant.id}
        onChange={(e) => {
          const plant =
            filteredPlants.find(
              (p) =>
                p.id === Number(e.target.value)
            );

          if (plant) {
            setPlant(plant);
          }
        }}
      >
        {filteredPlants.map((plant) => (
          <MenuItem
            key={plant.id}
            value={plant.id}
          >
            {plant.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}