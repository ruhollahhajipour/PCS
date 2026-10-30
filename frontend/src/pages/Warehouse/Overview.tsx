import { Box, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useMemo } from "react";

import { DOC_TYPE_LABEL } from "../../constants/warehouse";
import { getStock } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import { formatInt, formatMoney, formatQty } from "../../utils/format";
import { showJalali } from "../../utils/jalali";
import { headCellSx, paperSx } from "./styles";
import { StatusChip } from "./ui";

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Paper elevation={0} sx={{ ...paperSx, p: 2.5, height: "100%" }}>
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography>
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#16355B", mt: 0.5 }}>{value}</Typography>
      {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
    </Paper>
  );
}

export default function Overview() {
  const snap = useWarehouse();
  const d = useMemo(() => {
    const stock = getStock(snap).filter((r) => r.qty > 1e-6);
    const perItem = new Map<number, number>();
    for (const r of stock) perItem.set(r.itemId, (perItem.get(r.itemId) ?? 0) + r.qty);
    const low = snap.items
      .filter((i) => i.status === "Active" && i.minStock > 0 && (perItem.get(i.id) ?? 0) <= i.minStock)
      .map((i) => ({ i, qty: perItem.get(i.id) ?? 0 }));
    return {
      value: stock.reduce((s, r) => s + r.amount, 0),
      stockedItems: perItem.size,
      drafts: snap.docs.filter((x) => x.status === "Draft").length,
      low,
      recent: [...snap.docs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 8),
    };
  }, [snap]);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><Kpi label="ارزش کل موجودی (ریال)" value={formatMoney(d.value)} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><Kpi label="تعداد اقلام دارای موجودی" value={formatInt(d.stockedItems)} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><Kpi label="اسناد پیش‌نویس" value={formatInt(d.drafts)} hint="در انتظار قطعی شدن" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><Kpi label="کالاهای زیر حداقل موجودی" value={formatInt(d.low.length)} hint="نیازمند سفارش" /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={paperSx}>
            <Typography sx={{ p: 2, fontWeight: 700 }}>آخرین اسناد انبار</Typography>
            <Table size="small">
              <TableHead><TableRow>{["نوع", "شماره", "تاریخ", "وضعیت"].map((h) => <TableCell key={h} sx={headCellSx}>{h}</TableCell>)}</TableRow></TableHead>
              <TableBody>
                {d.recent.map((x) => (
                  <TableRow key={x.id} hover>
                    <TableCell>{DOC_TYPE_LABEL[x.type]}</TableCell>
                    <TableCell>{showJalali(String(x.no))}</TableCell>
                    <TableCell>{showJalali(x.date)}</TableCell>
                    <TableCell><StatusChip status={x.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={paperSx}>
            <Typography sx={{ p: 2, fontWeight: 700 }}>کالاهای زیر حداقل موجودی</Typography>
            <Table size="small">
              <TableHead><TableRow>{["کالا", "موجودی", "حداقل"].map((h) => <TableCell key={h} sx={headCellSx}>{h}</TableCell>)}</TableRow></TableHead>
              <TableBody>
                {d.low.length === 0 && <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3, color: "text.secondary" }}>همه کالاها بالاتر از حداقل هستند.</TableCell></TableRow>}
                {d.low.map(({ i, qty }) => (
                  <TableRow key={i.id}><TableCell>{i.name}</TableCell><TableCell sx={{ color: "error.main", fontWeight: 700 }}>{formatQty(qty)}</TableCell><TableCell>{formatQty(i.minStock)}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
