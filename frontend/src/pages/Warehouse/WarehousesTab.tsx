import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMemo, useState } from "react";

import { WAREHOUSE_TYPE_LABEL } from "../../constants/warehouse";
import { projects } from "../../mock/warehouse";
import { WarehouseService, getStock } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import type { ActiveStatus, Warehouse, WarehouseType } from "../../types/warehouse";
import { formatInt, formatMoney } from "../../utils/format";
import { headCellSx, paperSx, POPUP_CLASS, primaryBtnSx } from "./styles";
import { SelectField } from "./ui";

interface Props {
  notify: (m: string, s?: "success" | "error" | "info") => void;
}

export default function WarehousesTab({ notify }: Props) {
  const snap = useWarehouse();
  const [edit, setEdit] = useState<{ wh?: Warehouse } | null>(null);

  const summary = useMemo(() => {
    const m = new Map<number, { items: number; amount: number }>();
    for (const r of getStock(snap)) {
      if (r.qty <= 1e-6) continue;
      const c = m.get(r.warehouseId) ?? { items: 0, amount: 0 };
      c.items += 1;
      c.amount += r.amount;
      m.set(r.warehouseId, c);
    }
    return m;
  }, [snap]);

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<AddRoundedIcon />} sx={primaryBtnSx} onClick={() => setEdit({})}>انبار جدید</Button>
      </Box>
      <Paper elevation={0} sx={paperSx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["کد", "نام انبار", "نوع", "محل", "انباردار", "پروژه", "تعداد اقلام موجود", "ارزش موجودی (ریال)", "وضعیت", "عملیات"].map((h) => (
                  <TableCell key={h} sx={headCellSx} align={h === "عملیات" ? "center" : undefined}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {snap.warehouses.map((w) => (
                <TableRow key={w.id} hover sx={{ opacity: w.status === "Inactive" ? 0.55 : 1 }}>
                  <TableCell sx={{ fontWeight: 700 }}>{w.code}</TableCell>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{WAREHOUSE_TYPE_LABEL[w.type]}</TableCell>
                  <TableCell>{w.location || "—"}</TableCell>
                  <TableCell>{w.keeper || "—"}</TableCell>
                  <TableCell>{projects.find((p) => p.id === w.projectId)?.name ?? "—"}</TableCell>
                  <TableCell>{formatInt(summary.get(w.id)?.items ?? 0)}</TableCell>
                  <TableCell>{formatMoney(summary.get(w.id)?.amount ?? 0)}</TableCell>
                  <TableCell><Chip size="small" variant="outlined" label={w.status === "Active" ? "فعال" : "غیرفعال"} color={w.status === "Active" ? "success" : "default"} /></TableCell>
                  <TableCell align="center"><Tooltip title="ویرایش"><IconButton size="small" onClick={() => setEdit({ wh: w })}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {edit && <WarehouseDialog key={edit.wh?.id ?? "new"} wh={edit.wh} onClose={() => setEdit(null)} notify={notify} />}
    </Box>
  );
}

function WarehouseDialog({ wh, onClose, notify }: { wh?: Warehouse; onClose: () => void; notify: Props["notify"] }) {
  const [f, setF] = useState({
    code: wh?.code ?? "", name: wh?.name ?? "", type: (wh?.type ?? "Central") as WarehouseType,
    location: wh?.location ?? "", keeper: wh?.keeper ?? "", projectId: wh?.projectId ? String(wh.projectId) : "",
    status: (wh?.status ?? "Active") as ActiveStatus,
  });
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    const r = WarehouseService.saveWarehouse(
      {
        code: f.code, name: f.name, type: f.type, location: f.location.trim() || undefined,
        keeper: f.keeper.trim() || undefined, projectId: f.projectId ? Number(f.projectId) : undefined, status: f.status,
      },
      wh?.id,
    );
    if (!r.ok) return setError(r.error);
    notify(wh ? "انبار ویرایش شد." : "انبار جدید ثبت شد.");
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth dir="rtl" className={POPUP_CLASS}>
      <DialogTitle>{wh ? "ویرایش انبار" : "انبار جدید"}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth required label="کد انبار" value={f.code} onChange={(e) => set("code", e.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 8 }}><TextField fullWidth required label="نام انبار" value={f.name} onChange={(e) => set("name", e.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField label="نوع انبار" value={f.type} onChange={(v) => set("type", v as WarehouseType)} options={Object.entries(WAREHOUSE_TYPE_LABEL).map(([value, label]) => ({ value, label }))} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField label="پروژه" value={f.projectId} onChange={(v) => set("projectId", v)} emptyLabel="بدون پروژه" options={projects.map((p) => ({ value: p.id, label: `${p.code} – ${p.name}` }))} /></Grid>
          <Grid size={12}><TextField fullWidth label="محل انبار" value={f.location} onChange={(e) => set("location", e.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="انباردار" value={f.keeper} onChange={(e) => set("keeper", e.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField label="وضعیت" value={f.status} onChange={(v) => set("status", v as ActiveStatus)} options={[{ value: "Active", label: "فعال" }, { value: "Inactive", label: "غیرفعال" }]} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-start" }}>
        <Button variant="contained" disableElevation onClick={save}>ذخیره</Button>
        <Button onClick={onClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}
