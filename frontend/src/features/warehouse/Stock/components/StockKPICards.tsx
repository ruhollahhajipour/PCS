import Grid from "@mui/material/Grid";


import InventoryIcon from "@mui/icons-material/Inventory2";
import NumbersIcon from "@mui/icons-material/Numbers";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";


import KPICard from "../../../../components/KPI/KPICard";



interface Props {

 totalItems:number;

 totalQuantity:number;

 lowStock:number;

 critical:number;

}




export default function StockKPICards({

 totalItems,

 totalQuantity,

 lowStock,

 critical


}:Props){



return (

<Grid

container

spacing={3}

>




<Grid

size={{xs:12, md:3}}

>


<KPICard

title="Total Items"

value={String(totalItems)}

icon={<InventoryIcon />}

/>


</Grid>





<Grid

size={{xs:12, md:3}}

>


<KPICard

title="Total Quantity"

value={String(totalQuantity)}

icon={<NumbersIcon />}

/>


</Grid>





<Grid

size={{xs:12, md:3}}

>


<KPICard

title="Low Stock"

value={String(lowStock)}

icon={<WarningIcon />}

/>


</Grid>





<Grid

size={{xs:12, md:3}}

>


<KPICard

title="Critical"

value={String(critical)}

icon={<ErrorIcon />}

/>


</Grid>



</Grid>


);


}