import { Chip } from "@mui/material";


type Priority =
  | "LOW"
  | "HIGH"
  | "CRITICAL";


interface Props {

  priority: Priority;

}



export default function ReorderPriorityChip({
  priority,
}: Props) {


  const config = {

    LOW: {
      label: "Low",
      color: "success" as const,
    },


    HIGH: {
      label: "High",
      color: "warning" as const,
    },


    CRITICAL: {
      label: "Critical",
      color: "error" as const,
    },

  };



  const item = config[priority];



  return (

    <Chip
      label={item.label}
      color={item.color}
      size="small"
      sx={{
        fontWeight: 700,
        minWidth: 90,
      }}
    />

  );

}