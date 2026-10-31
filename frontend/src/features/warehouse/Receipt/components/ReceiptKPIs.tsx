import Grid from "@mui/material/Grid";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import KPICard from "../../../../components/Dashboard/KPICard";

import type { Receipt } from "../types/receipt";

type Props = {
  items: Receipt[];
};

export default function ReceiptKPIs({
  items,
}: Props) {

  const totalReceipts = items.length;

  const totalQty = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const pending = items.filter(
    (x) => x.status === "Pending"
  ).length;

  const approved = items.filter(
    (x) => x.status === "Approved"
  ).length;

  return (

    <Grid
      container
      spacing={2}
      mb={3}
    >

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Receipts"
          value={String(totalReceipts)}
          change=""
          icon={<Inventory2OutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Quantity"
          value={String(totalQty)}
          change=""
          icon={<CategoryOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Pending"
          value={String(pending)}
          change=""
          icon={<PendingActionsOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Approved"
          value={String(approved)}
          change=""
          icon={<CheckCircleOutlineOutlinedIcon />}
        />
      </Grid>

    </Grid>

  );

}