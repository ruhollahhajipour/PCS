import Chip from "@mui/material/Chip";


export type StatusChipProps = {
  value: string;
};


export default function StatusChip({
  value,
}: StatusChipProps) {

  const status =
    value?.toLowerCase();


  let color:
    | "success"
    | "error"
    | "warning"
    | "default" = "default";


  if (status === "active") {
    color = "success";
  }

  else if (
    status === "inactive" ||
    status === "disabled"
  ) {
    color = "error";
  }

  else if (
    status === "pending"
  ) {
    color = "warning";
  }


  return (

    <Chip

      label={value}

      color={color}

      size="small"

      sx={{
        minWidth: 90,
        fontWeight: 700,
        borderRadius: 2,
      }}

    />

  );

}