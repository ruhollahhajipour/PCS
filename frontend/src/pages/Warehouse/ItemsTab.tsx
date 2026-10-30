import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Alert,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";

import { ITEM_TYPE_LABEL } from "../../constants/warehouse";
import { itemGroups, units } from "../../mock/warehouse";
import { WarehouseService } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import type { ActiveStatus, Item, ItemType } from "../../types/warehouse";
import { formatQty } from "../../utils/format";
import { headCellSx, paperSx, POPUP_CLASS, primaryBtnSx } from "./styles";
import { SelectField } from "./ui";

interface Props {
  notify: (m: string, s?: "success" | "error" | "info") => void;
}

interface Form {
  code: string; name: string; englishName: string; groupId: string; type: ItemType;
  unit: string; minStock: string; specification: string; status: ActiveStatus;
}

const empty: Form = {
  code: "", name: "", englishName: "", groupId: "", type: "RawMaterial",
  unit: "", minStock: "0", specification: "", status: "Active",
};

export default function ItemsTab({ notify }: Props) {
  const snap = useWarehouse();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [edit, setEdit] = useState<{ item?: Item } | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return snap.items.filter((i) => {
      if (group && String(i.groupId) !== group) return false;
      if (!q) return true;
      return `${i.code} ${i.name} ${i.englishName ?? ""} ${i.specification ?? ""}`.toLowerCase().includes(q);
    });
  }, [snap.items, search, group]);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small" placeholder="جستجوی کد یا نام کالا…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280, bgcolor: "white", borderRadius: 1 }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>) } }}
        />
        <Box sx={{ width: 220 }}>
          <SelectField size="small" label="گروه کالا" value={group} onChange={setGroup} emptyLabel="همه"
            options={itemGroups.map((g) => ({ value: g.id, label: g.name }))} />
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<AddRoundedIcon />} sx={primaryBtnSx} onClick={() => setEdit({})}>
          کالای جدید
        </Button>
      </Box>

      <Paper elevation={0} sx={paperSx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["کد کالا", "نام کالا", "گروه", "نوع", "واحد", "حداقل موجودی", "وضعیت", "عملیات"].map((h) => (
                  <TableCell key={h} sx={headCellSx} align={h === "عملیات" ? "center" : undefined}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>کالایی پیدا نشد.</TableCell></TableRow>
              )}
              {rows.map((i) => (
                <TableRow key={i.id} hover sx={{ opacity: i.status === "Inactive" ? 0.55 : 1 }}>
                  <TableCell sx={{ fontWeight: 700 }}>{i.code}</TableCell>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{itemGroups.find((g) => g.id === i.groupId)?.name}</TableCell>
                  <TableCell>{ITEM_TYPE_LABEL[i.type]}</TableCell>
                  <TableCell>{units.find((u) => u.code === i.unit)?.name ?? i.unit}</TableCell>
                  <TableCell>{formatQty(i.minStock)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={i.status === "Active" ? "فعال" : "غیرفعال"} color={i.status === "Active" ? "success" : "default"} variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="ویرایش"><IconButton size="small" onClick={() => setEdit({ item: i })}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {edit && <ItemDialog key={edit.item?.id ?? "new"} item={edit.item} onClose={() => setEdit(null)} notify={notify} />}
    </Box>
  );
}

function ItemDialog({ item, onClose, notify }: { item?: Item; onClose: () => void; notify: Props["notify"] }) {
  const [f, setF] = useState<Form>(
    item
      ? { code: item.code, name: item.name, englishName: item.englishName ?? "", groupId: String(item.groupId), type: item.type, unit: item.unit, minStock: String(item.minStock), specification: item.specification ?? "", status: item.status }
      : empty,
  );
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    const r = WarehouseService.saveItem(
      {
        code: f.code, name: f.name, englishName: f.englishName.trim() || undefined,
        groupId: Number(f.groupId), type: f.type, unit: f.unit, minStock: Number(f.minStock || 0),
        specification: f.specification.trim() || undefined, status: f.status,
      },
      item?.id,
    );
    if (!r.ok) return setError(r.error);
    notify(item ? "کالا ویرایش شد." : "کالای جدید ثبت شد.");
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth dir="rtl" className={POPUP_CLASS}>
      <DialogTitle>{item ? "ویرایش کالا" : "کالای جدید"}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth required label="کد کالا" value={f.code} onChange={(e) => set("code", e.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 8 }}><TextField fullWidth required label="نام کالا" value={f.name} onChange={(e) => set("name", e.target.value)} /></Grid>
          <Grid size={12}><TextField fullWidth label="نام لاتین" value={f.englishName} onChange={(e) => set("englishName", e.target.value)} className="pcs-ltr-num" /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField required label="گروه کالا" value={f.groupId} onChange={(v) => set("groupId", v)} options={itemGroups.map((g) => ({ value: g.id, label: g.name }))} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField label="نوع کالا" value={f.type} onChange={(v) => set("type", v as ItemType)} options={Object.entries(ITEM_TYPE_LABEL).map(([value, label]) => ({ value, label }))} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField required label="واحد اندازه‌گیری" value={f.unit} onChange={(v) => set("unit", v)} options={units.map((u) => ({ value: u.code, label: u.name }))} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="حداقل موجودی (نقطه سفارش)" value={f.minStock} onChange={(e) => set("minStock", e.target.value)} className="pcs-ltr-num" /></Grid>
          <Grid size={12}><TextField fullWidth multiline minRows={2} label="مشخصات فنی" value={f.specification} onChange={(e) => set("specification", e.target.value)} /></Grid>
          <Grid size={12}><SelectField label="وضعیت" value={f.status} onChange={(v) => set("status", v as ActiveStatus)} options={[{ value: "Active", label: "فعال" }, { value: "Inactive", label: "غیرفعال" }]} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-start" }}>
        <Button variant="contained" disableElevation onClick={save}>ذخیره</Button>
        <Button onClick={onClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}
