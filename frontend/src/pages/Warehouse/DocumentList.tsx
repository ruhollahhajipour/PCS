import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMemo, useState } from "react";

import {
  DOC_STATUS_LABEL,
  DOC_TYPE_LABEL,
  ISSUE_KIND_LABEL,
  RECEIPT_KIND_LABEL,
} from "../../constants/warehouse";
import { parties } from "../../mock/warehouse";
import { WarehouseService, getLineCost, listDocs } from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import type { DocType, WarehouseDoc } from "../../types/warehouse";
import { formatMoney, formatInt } from "../../utils/format";
import { showJalali } from "../../utils/jalali";
import DocumentDialog from "./DocumentDialog";
import { headCellSx, paperSx, primaryBtnSx } from "./styles";
import { ConfirmDialog, SelectField, StatusChip, useConfirm } from "./ui";

type Action = { kind: "finalize" | "reopen" | "cancel"; doc: WarehouseDoc };

const CONFIRM_TEXT = {
  finalize: {
    title: "قطعی کردن سند",
    message: "با قطعی شدن، موجودی و کاردکس به‌روز می‌شود و سند دیگر قابل ویرایش نیست. ادامه می‌دهید؟",
    label: "قطعی کن",
    danger: false,
  },
  reopen: {
    title: "بازگشت به پیش‌نویس",
    message: "اثر این سند از موجودی و کاردکس برداشته می‌شود تا بتوان آن را ویرایش کرد. ادامه می‌دهید؟",
    label: "بازگردان",
    danger: false,
  },
  cancel: {
    title: "ابطال سند",
    message: "سند باطل می‌شود (حذف فیزیکی انجام نمی‌شود) و اثر آن از موجودی برداشته می‌شود. ادامه می‌دهید؟",
    label: "ابطال سند",
    danger: true,
  },
} as const;

interface Props {
  type: DocType;
  notify: (m: string, s?: "success" | "error" | "info") => void;
}

export default function DocumentList({ type, notify }: Props) {
  const snap = useWarehouse();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<{ doc?: WarehouseDoc } | null>(null);
  const confirm = useConfirm<Action>();

  const whName = (id: number) => snap.warehouses.find((w) => w.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    const q = search.trim();
    return listDocs(snap, type).filter((d) => {
      if (status && d.status !== status) return false;
      if (!q) return true;
      const hay = [
        String(d.no),
        d.date,
        d.description ?? "",
        "refNo" in d ? (d.refNo ?? "") : "",
        d.lines.map((l) => snap.items.find((i) => i.id === l.itemId)?.name ?? "").join(" "),
      ].join(" ");
      return hay.includes(q);
    });
  }, [snap, type, search, status]);

  const total = (d: WarehouseDoc) =>
    d.type === "Count"
      ? 0
      : d.lines.reduce((s, l) => s + l.qty * getLineCost(snap, d, l), 0);

  const kindLabel = (d: WarehouseDoc) =>
    d.type === "Receipt"
      ? RECEIPT_KIND_LABEL[d.kind]
      : d.type === "Issue"
        ? ISSUE_KIND_LABEL[d.kind]
        : "";

  const runAction = () => {
    const a = confirm.pending;
    if (!a) return;
    const r =
      a.kind === "finalize"
        ? WarehouseService.finalizeDoc(a.doc.id)
        : a.kind === "reopen"
          ? WarehouseService.reopenDoc(a.doc.id)
          : WarehouseService.cancelDoc(a.doc.id);
    confirm.clear();
    if (r.ok) {
      notify(`${DOC_TYPE_LABEL[type]} شماره ${showJalali(String(a.doc.no))} ${
        a.kind === "finalize" ? "قطعی شد." : a.kind === "reopen" ? "به پیش‌نویس بازگشت." : "باطل شد."
      }`);
    } else {
      notify(r.error, "error");
    }
  };

  const text = confirm.pending ? CONFIRM_TEXT[confirm.pending.kind] : null;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="جستجو در شماره، مرجع، کالا…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280, bgcolor: "white", borderRadius: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ width: 180 }}>
          <SelectField
            size="small"
            label="وضعیت"
            value={status}
            onChange={setStatus}
            emptyLabel="همه"
            options={Object.entries(DOC_STATUS_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={primaryBtnSx}
          onClick={() => setEditing({})}
        >
          {DOC_TYPE_LABEL[type]} جدید
        </Button>
      </Box>

      <Paper elevation={0} sx={paperSx}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>شماره</TableCell>
                <TableCell sx={headCellSx}>تاریخ</TableCell>
                {type !== "Count" && <TableCell sx={headCellSx}>نوع</TableCell>}
                <TableCell sx={headCellSx}>{type === "Transfer" ? "مبدأ ← مقصد" : "انبار"}</TableCell>
                {(type === "Receipt" || type === "Issue") && (
                  <TableCell sx={headCellSx}>{type === "Receipt" ? "تحویل‌دهنده" : "تحویل‌گیرنده"}</TableCell>
                )}
                {type !== "Count" && <TableCell sx={headCellSx}>مرجع</TableCell>}
                <TableCell sx={headCellSx}>تعداد اقلام</TableCell>
                {type !== "Count" && <TableCell sx={headCellSx}>مبلغ کل (ریال)</TableCell>}
                <TableCell sx={headCellSx}>وضعیت</TableCell>
                <TableCell sx={headCellSx} align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    سندی پیدا نشد.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((d) => (
                <TableRow key={d.id} hover sx={{ opacity: d.status === "Cancelled" ? 0.55 : 1 }}>
                  <TableCell sx={{ fontWeight: 700 }}>{showJalali(String(d.no))}</TableCell>
                  <TableCell>{showJalali(d.date)}</TableCell>
                  {type !== "Count" && <TableCell>{kindLabel(d) || "انتقال"}</TableCell>}
                  <TableCell>
                    {d.type === "Transfer"
                      ? `${whName(d.fromWarehouseId)} ← ${whName(d.toWarehouseId)}`
                      : whName(d.warehouseId)}
                  </TableCell>
                  {(d.type === "Receipt" || d.type === "Issue") && (
                    <TableCell>{parties.find((p) => p.id === d.partyId)?.name ?? "—"}</TableCell>
                  )}
                  {d.type !== "Count" && <TableCell>{d.refNo || "—"}</TableCell>}
                  <TableCell>{formatInt(d.lines.length)}</TableCell>
                  {d.type !== "Count" && <TableCell>{formatMoney(total(d))}</TableCell>}
                  <TableCell>
                    <StatusChip status={d.status} />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {d.status === "Draft" ? (
                      <>
                        <Tooltip title="ویرایش">
                          <IconButton size="small" onClick={() => setEditing({ doc: d })}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="قطعی کردن">
                          <IconButton size="small" color="success" onClick={() => confirm.ask({ kind: "finalize", doc: d })}>
                            <CheckCircleOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="مشاهده">
                        <IconButton size="small" onClick={() => setEditing({ doc: d })}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {d.status === "Final" && (
                      <Tooltip title="بازگشت به پیش‌نویس">
                        <IconButton size="small" onClick={() => confirm.ask({ kind: "reopen", doc: d })}>
                          <UndoRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {d.status !== "Cancelled" && (
                      <Tooltip title="ابطال سند">
                        <IconButton size="small" color="error" onClick={() => confirm.ask({ kind: "cancel", doc: d })}>
                          <BlockRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
        فقط اسناد «قطعی» روی موجودی و کاردکس اثر می‌گذارند. اسناد باطل‌شده حذف نمی‌شوند و در سوابق باقی می‌مانند.
      </Typography>

      {editing && (
        <DocumentDialog
          key={editing.doc?.id ?? "new"}
          type={type}
          doc={editing.doc}
          onClose={() => setEditing(null)}
          onDone={notify}
        />
      )}

      <ConfirmDialog
        open={!!text}
        title={text?.title ?? ""}
        message={text?.message ?? ""}
        confirmLabel={text?.label ?? ""}
        danger={text?.danger}
        onConfirm={runAction}
        onClose={confirm.clear}
      />
    </Box>
  );
}
