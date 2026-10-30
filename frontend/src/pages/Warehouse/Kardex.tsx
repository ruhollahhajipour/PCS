import {
  Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useMemo, useState } from "react";

import { DOC_TYPE_LABEL } from "../../constants/warehouse";
import { getKardex } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import { formatMoney, formatQty } from "../../utils/format";
import { normalizeJalali, showJalali } from "../../utils/jalali";
import { downloadCsv } from "./csv";
import { headCellSx, paperSx } from "./styles";
import { ItemPicker, JalaliField, SelectField } from "./ui";
import { units } from "../../mock/warehouse";

/** کاردکس کالا — in / out / balance with moving-average cost. */
export default function Kardex() {
  const snap = useWarehouse();
  const [wh, setWh] = useState("");
  const [itemId, setItemId] = useState<number | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const ready = wh !== "" && itemId !== null;
  const item = snap.items.find((i) => i.id === itemId);
  const unit = item ? (units.find((u) => u.code === item.unit)?.name ?? item.unit) : "";

  const k = useMemo(
    () =>
      ready
        ? getKardex(snap, {
            warehouseId: Number(wh), itemId: itemId!,
            from: normalizeJalali(from) ?? undefined, to: normalizeJalali(to) ?? undefined,
          })
        : null,
    [snap, ready, wh, itemId, from, to],
  );

  const exportCsv = () => {
    if (!k) return;
    downloadCsv(
      `kardex-${item?.code}.csv`,
      ["تاریخ", "نوع سند", "شماره", "شرح", "ورودی-تعداد", "ورودی-فی", "ورودی-مبلغ", "خروجی-تعداد", "خروجی-فی", "خروجی-مبلغ", "مانده-تعداد", "مانده-فی", "مانده-مبلغ"],
      k.rows.map((r) => [
        r.date, DOC_TYPE_LABEL[r.docType], r.docNo, r.label,
        r.direction === "in" ? r.qty : "", r.direction === "in" ? Math.round(r.inCost) : "", Math.round(r.inAmount) || "",
        r.direction === "out" ? r.qty : "", r.direction === "out" ? Math.round(r.outCost) : "", Math.round(r.outAmount) || "",
        r.balQty, Math.round(r.balCost), Math.round(r.balAmount),
      ]),
    );
  };

  const group = (label: string, span: number) => (
    <TableCell align="center" colSpan={span} sx={{ ...headCellSx, borderBottom: "1px solid #CBD5E1" }}>{label}</TableCell>
  );

  return (
    <Box>
      <Paper elevation={0} sx={{ ...paperSx, p: 2, mb: 2, overflow: "visible" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <SelectField size="small" label="انبار" required value={wh} onChange={setWh}
              options={snap.warehouses.map((w) => ({ value: w.id, label: w.name }))} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ItemPicker items={snap.items} value={itemId} onChange={setItemId} label="کالا" />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}><JalaliField size="small" label="از تاریخ" value={from} onChange={setFrom} /></Grid>
          <Grid size={{ xs: 6, md: 2 }}><JalaliField size="small" label="تا تاریخ" value={to} onChange={setTo} /></Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <Button onClick={exportCsv} disabled={!k} startIcon={<FileDownloadOutlinedIcon />}>CSV</Button>
          </Grid>
        </Grid>
      </Paper>

      {!k ? (
        <Paper elevation={0} sx={{ ...paperSx, p: 6, textAlign: "center", color: "text.secondary" }}>
          برای مشاهده کاردکس، انبار و کالا را انتخاب کنید.
        </Paper>
      ) : (
        <Paper elevation={0} sx={paperSx}>
          <Box sx={{ p: 2, display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "1px solid #E2E8F0" }}>
            <Typography sx={{ fontWeight: 700 }}>{item?.code} – {item?.name} ({unit})</Typography>
            <Typography color="text.secondary">مانده اول دوره: {formatQty(k.opening.qty)} | {formatMoney(k.opening.amount)} ریال</Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} sx={headCellSx}>تاریخ</TableCell>
                  <TableCell rowSpan={2} sx={headCellSx}>سند</TableCell>
                  <TableCell rowSpan={2} sx={headCellSx}>شرح</TableCell>
                  {group("ورودی", 3)}{group("خروجی", 3)}{group("مانده", 3)}
                </TableRow>
                <TableRow>
                  {["تعداد", "فی", "مبلغ", "تعداد", "فی", "مبلغ", "تعداد", "فی", "مبلغ"].map((h, i) => (
                    <TableCell key={i} sx={headCellSx} align="right">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {k.rows.length === 0 && (<TableRow><TableCell colSpan={12} align="center" sx={{ py: 5, color: "text.secondary" }}>گردشی در این بازه وجود ندارد.</TableCell></TableRow>)}
                {k.rows.map((r) => {
                  const inn = r.direction === "in";
                  return (
                    <TableRow key={r.seq} hover>
                      <TableCell>{showJalali(r.date)}</TableCell>
                      <TableCell>{DOC_TYPE_LABEL[r.docType]} {showJalali(String(r.docNo))}</TableCell>
                      <TableCell>{r.label}</TableCell>
                      <TableCell>{inn ? formatQty(r.qty) : ""}</TableCell>
                      <TableCell>{inn ? formatMoney(r.inCost) : ""}</TableCell>
                      <TableCell>{inn ? formatMoney(r.inAmount) : ""}</TableCell>
                      <TableCell>{!inn ? formatQty(r.qty) : ""}</TableCell>
                      <TableCell>{!inn ? formatMoney(r.outCost) : ""}</TableCell>
                      <TableCell>{!inn ? formatMoney(r.outAmount) : ""}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{formatQty(r.balQty)}</TableCell>
                      <TableCell>{formatMoney(r.balCost)}</TableCell>
                      <TableCell>{formatMoney(r.balAmount)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  <TableCell colSpan={3} sx={{ fontWeight: 700 }}>جمع گردش</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatQty(k.totals.inQty)}</TableCell><TableCell />
                  <TableCell sx={{ fontWeight: 700 }}>{formatMoney(k.totals.inAmount)}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatQty(k.totals.outQty)}</TableCell><TableCell />
                  <TableCell sx={{ fontWeight: 700 }}>{formatMoney(k.totals.outAmount)}</TableCell>
                  <TableCell colSpan={3} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
