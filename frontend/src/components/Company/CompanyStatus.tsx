import { Chip } from "@mui/material";

interface Props {
  status: "Active" | "Inactive";
}

export default function CompanyStatus({ status }: Props) {
  return (
    <Chip
      label={status}
      color={status === "Active" ? "success" : "default"}
      size="small"
      sx={{
        fontWeight: 600,
      }}
    />
  );
}