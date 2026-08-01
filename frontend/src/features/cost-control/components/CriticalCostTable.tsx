import {
  Box,
  Typography,
} from "@mui/material";

import type {
  GridColDef,
} from "@mui/x-data-grid";


import PCSDataGrid
from "../../../components/Common/PCSDataGrid/PCSDataGrid";


import StatusChip
from "../../../components/Common/StatusChip";


import EmptyState
from "../../../components/Common/EmptyState";


import type {
  CostItem,
} from "../types/costItem";



type Props = {

  rows: CostItem[];

};



export default function CriticalCostTable({

  rows,

}: Props) {



  const criticalRows = rows.filter(
    x =>
      x.status === "Critical" ||
      x.status === "Warning"
  );



  const columns: GridColDef[] = [



    {
      field:"wbs",

      headerName:"WBS",

      flex:1,

    },



    {
      field:"project",

      headerName:"Project",

      flex:2,

    },



    {
      field:"discipline",

      headerName:"Discipline",

      flex:1.5,

    },



    {
      field:"budget",

      headerName:"Budget",

      flex:1,

      renderCell:(params)=>
        `$${Number(params.value).toLocaleString("en-US")}`,

    },



    {
      field:"actual",

      headerName:"Actual",

      flex:1,

      renderCell:(params)=>
        `$${Number(params.value).toLocaleString("en-US")}`,

    },



    {
      field:"variance",

      headerName:"Variance",

      flex:1,

      renderCell:(params)=>
        `$${Number(params.value).toLocaleString("en-US")}`,

    },



    {
      field:"status",

      headerName:"Status",

      flex:1,

      renderCell:(params)=>(

        <StatusChip

          value={params.value}

        />

      ),

    },


  ];




  return (

    <Box>


      <Typography

        variant="h6"

        fontWeight={700}

        mb={2}

      >

        Critical Cost Items


      </Typography>




      {

        criticalRows.length === 0 ?


        <EmptyState

          title="No Critical Cost Items"

          description="All cost items are within acceptable limits."

        />


        :


        <PCSDataGrid

          rows={criticalRows}

          columns={columns}

        />

      }



    </Box>

  );

}