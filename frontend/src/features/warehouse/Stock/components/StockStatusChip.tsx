import { Chip } from "@mui/material";


interface Props {

  currentQty: number;

  reorderPoint: number;

  safetyStock: number;

}



export default function StockStatusChip({

  currentQty,

  reorderPoint,

  safetyStock

}: Props) {



  if (currentQty <= safetyStock) {


    return (

      <Chip

        label="Critical"

        color="error"

        size="small"

      />

    );

  }



  if (currentQty <= reorderPoint) {


    return (

      <Chip

        label="Low Stock"

        color="warning"

        size="small"

      />

    );

  }



  return (

    <Chip

      label="Normal"

      color="success"

      size="small"

    />

  );

}