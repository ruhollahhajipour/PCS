import {
  Box, Button, Chip, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer,
  TableFooter, TableHead, TableRow, TextField,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";

import { getStock } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import { formatMoney, formatQty } from "../../utils/format";
import { downloadCsv } from "./csv";
import { headCellSx, paperSx } from "./styles";
import { SelectField } from "./ui";
import { itemGroups, units } from "../../mock/warehouse";

/** گزارش موجودی کالا — per warehouse / item, valued at moving average. */
export default function StockReport() {
  const snap = useWarehouse();
  const [wh, setWh] = useState("");
  const [search, setSearch] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return getStock(snap)
      .filter((r) => r.qty > 1e-6)
      .map((r) => {
        const item = snap.items.find((i) => i.id === r.itemId)!;
        const w = snap.warehouses.find((x) => x.id === r.warehouseId)!;
        return { ...r, item, w };
      })
      .filter((r) => r.item && r.w)
      .filter((r) => (!wh || String(r.warehouseId) === wh))
      .filter((r) => !onlyLow || r.qty <= r.item.minStock)
      .filter((r) => !q || `${r.item.code} ${r.item.name}`.toLowerCase().includes(q))
      .sort((a, b) => a.w.code.localeCompare(b.w.code) || a.item.code.localeCompare(b.item.code));
  }, [snap, wh, search, onlyLow]);

  const unitName = (c: string) => units.find((u) => u.code === c)?.name ?? c;
  const total = rows.reduce((s, r) => s + r.amount, 0);

  const exportCsv = () =>
    downloadCsv(
      "stock-report.csv",
      ["انبار", "کد کالا", "نام کالا", "گروه", "واحد", "موجودی", "حداقل", "میانگین بهای واحد", "ارزش (ریال)"],
      rows.map((r) => [
        r.w.name, r.item.code, r.item.name,
        itemGroups.find((g) => g.id === r.item.groupId)?.name ?? "", unitName(r.item.unit),
        r.qty, r.item.minStock, Math.round(r.avgCost), Math.round(r.amount),
      ]),
    );

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Box sx={{ width: 240 }}>
          <SelectField size="small" label="انبار" value={wh} onChange={setWh} emptyLabel="همه انبارها"
            options={snap.warehouses.map((w) => ({ value: w.id, label: w.name }))} />
        </Box>
        <TextField size="small" placeholder="جستجوی کالا…" value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240, bgcolor: "white", borderRadius: 1 }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>) } }} />
        <Chip label="فقط کالاهای کمتر از حداقل" color={onlyLow ? "warning" : "default"} variant={onlyLow ? "filled" : "outlined"} onClick={() => setOnlyLow((v) => !v)} />
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<FileDownloadOutlinedIcon />} onClick={exportCsv} disabled={rows.length === 0}>خروجی اکسل (CSV)</Button>
      </Box>
      <Paper elevation={0} sx={paperSx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["انبار", "کد کالا", "نام کالا", "واحد", "موجودی", "حداقل", "میانگین بهای واحد", "ارزش (ریال)"].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>موجودی‌ای پیدا نشد.</TableCell></TableRow>)}
              {rows.map((r) => {
                const low = r.qty <= r.item.minStock;
                return (
                  <TableRow key={`${r.warehouseId}:${r.itemId}`} hover>
                    <TableCell>{r.w.name}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{r.item.code}</TableCell>
                    <TableCell>{r.item.name}</TableCell>
                    <TableCell>{unitName(r.item.unit)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: low ? "error.main" : undefined }}>{formatQty(r.qty)}</TableCell>
                    <TableCell>{formatQty(r.item.minStock)}</TableCell>
                    <TableCell>{formatMoney(r.avgCost)}</TableCell>
                    <TableCell>{formatMoney(r.amount)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} sx={{ fontWeight: 700 }}>جمع کل ارزش موجودی</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{formatMoney(total)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
