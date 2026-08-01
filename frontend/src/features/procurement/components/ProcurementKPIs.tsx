import Grid from "@mui/material/Grid";

import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

import KPICard from "../../../components/Common/KPI/KPICard";

type Props = {
  totalPR: number;
  totalPO: number;
  totalValue: number;
  delivered: number;
};

export default function ProcurementKPIs({
  totalPR,
  totalPO,
  totalValue,
  delivered,
}: Props) {
  return (
    <Grid
      container
      spacing={3}
      mb={3}
    >
      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Purchase Requests"
          value={String(totalPR)}
          change="+4%"
          icon={<AssignmentRoundedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Purchase Orders"
          value={String(totalPO)}
          change="+2%"
          icon={<ShoppingCartRoundedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Procurement"
          value={`$${(
            totalValue / 1000000
          ).toFixed(2)}M`}
          change="+8%"
          icon={<PaidRoundedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Delivered"
          value={`${delivered}%`}
          change="+5%"
          icon={<LocalShippingRoundedIcon />}
        />
      </Grid>
    </Grid>
  );
}