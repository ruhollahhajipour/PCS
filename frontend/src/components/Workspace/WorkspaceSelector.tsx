import { Stack } from "@mui/material";

import CompanySelect from "./CompanySelect";
import PlantSelect from "./PlantSelect";
import ProjectSelect from "./ProjectSelect";

export default function WorkspaceSelector() {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
    >
      <CompanySelect />
      <PlantSelect />
      <ProjectSelect />
    </Stack>
  );
}