import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useWorkspace } from "../../context/WorkspaceContext";
import { companies } from "../../data/workspace";

export default function CompanySelect() {
  const {
    workspace,
    setCompany,
  } = useWorkspace();

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 230,
      }}
    >
      <InputLabel>
        Company
      </InputLabel>

      <Select
        label="Company"
        value={workspace.company.id}
        onChange={(e) => {
          const company =
            companies.find(
              (c) => c.id === Number(e.target.value)
            );

          if (company) {
            setCompany(company);
          }
        }}
      >
        {companies.map((company) => (
          <MenuItem
            key={company.id}
            value={company.id}
          >
            {company.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}