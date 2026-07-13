import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

import { CompanyService } from "../../services/company.service";
import type { Company } from "../../types/company";

export default function CompanyTable() {
  const data = CompanyService.getAll();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>English Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((company: Company) => (
            <TableRow key={company.id} hover>
              <TableCell>{company.code}</TableCell>

              <TableCell>{company.name}</TableCell>

              <TableCell>{company.englishName}</TableCell>

              <TableCell>
                <Chip
                  label={company.status}
                  color={
                    company.status === "Active"
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}