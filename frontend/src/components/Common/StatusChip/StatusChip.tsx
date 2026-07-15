import Chip from "@mui/material/Chip";

interface StatusChipProps {
  status: string;
}

export default function StatusChip({
  status,
}: StatusChipProps) {
  const color =
    status === "Active" ||
    status === "Approved" ||
    status === "Completed" ||
    status === "Available" ||
    status === "Published"
      ? "success"
      : status === "Pending" ||
        status === "Planning" ||
        status === "Review" ||
        status === "Low Stock" ||
        status === "Draft"
      ? "warning"
      : status === "Rejected" ||
        status === "Inactive" ||
        status === "Cancelled" ||
        status === "Out of Stock"
      ? "error"
      : "default";

  return (
    <Chip
      size="small"
      label={status}
      color={color}
      variant="outlined"
    />
  );
}