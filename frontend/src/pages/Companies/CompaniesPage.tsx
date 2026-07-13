import { useState } from "react";
import { Box } from "@mui/material";

import CompanyToolbar from "./CompanyToolbar";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";

export default function CompaniesPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <CompanyToolbar
        onCreate={() => setOpen(true)}
      />

      <CompanyTable />

      <CompanyDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}