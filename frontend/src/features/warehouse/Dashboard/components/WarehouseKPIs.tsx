import Grid from "@mui/material/Grid";


import InventoryIcon from "@mui/icons-material/Inventory2";
import NumbersIcon from "@mui/icons-material/Numbers";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";


import KPICard
from "../../../../components/KPI/KPICard";


import type { WarehouseDashboardSummary }
from "../types/warehouseDashboard";



interface Props {

  summary: WarehouseDashboardSummary;

}



export default function WarehouseKPIs({

  summary

}: Props) {



return (

<Grid

container

spacing={3}

>



<Grid

size={{ xs:12, md:3 }}

>


<KPICard

title="Total Items"

value={String(summary.totalItems)}

icon={<InventoryIcon />}

/>


</Grid>





<Grid

size={{ xs:12, md:3 }}

>


<KPICard

title="Total Quantity"

value={String(summary.totalQuantity)}

icon={<NumbersIcon />}

/>


</Grid>





<Grid

size={{ xs:12, md:3 }}

>


<KPICard

title="Low Stock"

value={String(summary.lowStockCount)}

icon={<WarningIcon />}

/>


</Grid>





<Grid

size={{ xs:12, md:3 }}

>


<KPICard

title="Critical Stock"

value={String(summary.criticalStockCount)}

icon={<ErrorIcon />}

/>


</Grid>




</Grid>


);


}