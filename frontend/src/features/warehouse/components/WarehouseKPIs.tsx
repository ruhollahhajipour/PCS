import Grid from "@mui/material/Grid";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PaidIcon from "@mui/icons-material/Paid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import KPICard from "../../../components/Dashboard/KPICard";

type Props = {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  lowStock: number;
};

export default function WarehouseKPIs({
  totalItems,
  totalQuantity,
  totalValue,
  lowStock,
}: Props) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Items"
          value={totalItems.toLocaleString()}
          change=""
          icon={<Inventory2Icon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Quantity"
          value={totalQuantity.toLocaleString()}
          change=""
          icon={<WarehouseIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          change=""
          icon={<PaidIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Low Stock"
          value={lowStock.toString()}
          change=""
          icon={<WarningAmberIcon />}
        />
      </Grid>
    </Grid>
  );
}