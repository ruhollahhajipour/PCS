import {

  Box,

  CircularProgress,

  Typography

} from "@mui/material";



import {

  useWarehouseDashboard

}

from "../hooks/useWarehouseDashboard";



import WarehouseKPIs

from "../components/WarehouseKPIs";



import PageHeader

from "../../../../components/Common/PageHeader";




export default function WarehouseDashboard(){



 const {

   summary,

   loading

 } = useWarehouseDashboard();






 if(loading){


   return (

     <Box>


       <CircularProgress/>


     </Box>

   );


 }






 if(!summary){


   return (

     <Typography>

       No warehouse data available

     </Typography>

   );


 }






 return (


   <Box>



     <PageHeader

       title="Warehouse Dashboard"

       subtitle="Inventory overview and stock performance"

     />




     <Box sx={{mt:3}}>


       <WarehouseKPIs

         summary={summary}

       />


     </Box>




   </Box>


 );


}