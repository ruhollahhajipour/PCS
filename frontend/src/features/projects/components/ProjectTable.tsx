import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid";


import type {
  GridColDef,
} from "@mui/x-data-grid";


import VisibilityRoundedIcon
from "@mui/icons-material/VisibilityRounded";


import EditRoundedIcon
from "@mui/icons-material/EditRounded";


import DeleteRoundedIcon
from "@mui/icons-material/DeleteRounded";


import {
  Chip,
  LinearProgress,
  Box,
} from "@mui/material";


import type {
  Project,
} from "../../../models/project";





type Props = {

  rows: Project[];

  loading?: boolean;

  onView?: (
    row: Project
  ) => void;


  onEdit?: (
    row: Project
  ) => void;


  onDelete?: (
    row: Project
  ) => void;

};









export default function ProjectTable({

  rows,

  loading=false,

  onView,

  onEdit,

  onDelete,

}:Props){





const columns:GridColDef[]=[



{
  field:"code",

  headerName:"Code",

  width:120,
},




{
  field:"name",

  headerName:"Project Name",

  flex:1,

  minWidth:240,
},




{
  field:"client",

  headerName:"Client",

  width:170,
},




{
  field:"budget",

  headerName:"Budget",

  width:150,


  valueFormatter:(value)=>{

    return `$ ${Number(value ?? 0)
      .toLocaleString("en-US")}`;

  }

},





{
  field:"actualCost",

  headerName:"Actual Cost",

  width:150,


  valueFormatter:(value)=>{

    return `$ ${Number(value ?? 0)
      .toLocaleString("en-US")}`;

  }

},





{
  field:"progress",

  headerName:"Progress",

  width:180,


  renderCell:(params)=>{


    const value =
      Number(params.value ?? 0);



    return (

      <Box width="100%">


        <Box
          fontSize={12}
          mb={0.5}
        >

          {value}%

        </Box>



        <LinearProgress

          variant="determinate"

          value={value}

        />


      </Box>

    );


  }

},






{
  field:"spi",

  headerName:"SPI",

  width:100,


  renderCell:(params)=>{


    const value =
      Number(params.value ?? 0);



    return (

      <Chip

        size="small"

        label={
          value.toFixed(2)
        }

        color={
          value >=1
          ?
          "success"
          :
          value>=0.9
          ?
          "warning"
          :
          "error"
        }

      />

    );


  }

},






{
 field:"cpi",

 headerName:"CPI",

 width:100,


 renderCell:(params)=>{


  const value =
    Number(params.value ?? 0);



  return (

    <Chip

      size="small"

      label={
        value.toFixed(2)
      }

      color={
        value>=1
        ?
        "success"
        :
        value>=0.9
        ?
        "warning"
        :
        "error"
      }

    />

  );


 }

},







{
 field:"status",

 headerName:"Status",

 width:130,


 renderCell:(params)=>{


  const status =
    params.value;



  return (

    <Chip

      size="small"

      label={status}

      color={

        status==="Active"

        ?

        "success"

        :

        status==="Completed"

        ?

        "info"

        :

        status==="Delayed"

        ?

        "error"

        :

        "default"

      }

    />

  );


 }

},








{
 field:"actions",

 type:"actions",

 width:120,


 getActions:({row})=>[



  <GridActionsCellItem

    key="view"

    icon={
      <VisibilityRoundedIcon/>
    }

    label="View"

    onClick={()=>onView?.(row)}

  />,





  <GridActionsCellItem

    key="edit"

    icon={
      <EditRoundedIcon/>
    }

    label="Edit"

    onClick={()=>onEdit?.(row)}

  />,





  <GridActionsCellItem

    key="delete"

    icon={
      <DeleteRoundedIcon/>
    }

    label="Delete"

    onClick={()=>onDelete?.(row)}

  />,


 ]

}



];









return (


<DataGrid


rows={rows}


columns={columns}


loading={loading}



autoHeight




disableRowSelectionOnClick




slots={{

  toolbar:GridToolbar,

}}




pageSizeOptions={[

 10,

 25,

 50,

]}





initialState={{

 pagination:{

  paginationModel:{

    pageSize:10,

  }

 }

}}





sx={{

 border:0,


 "& .MuiDataGrid-columnHeaders":{

   fontWeight:700,

 },


 "& .MuiDataGrid-row:hover":{

   cursor:"pointer",

 },


}}



/>



);


}