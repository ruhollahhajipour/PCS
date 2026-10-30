import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { useMemo, useState } from "react";

import {
  DOC_TYPE_LABEL,
  ISSUE_KIND_LABEL,
  PARTY_KIND_LABEL,
  RECEIPT_KIND_LABEL,
} from "../../constants/warehouse";
import { parties, projects, units } from "../../mock/warehouse";
import {
  WarehouseService,
  getLineCost,
  getStock,
  type DocDraft,
} from "../../services/warehouse.service";
import { useWarehouse } from "../../hooks/useWarehouse";
import type {
  CountLine,
  DocLine,
  DocType,
  IssueKind,
  ReceiptKind,
  WarehouseDoc,
} from "../../types/warehouse";
import { formatMoney, formatQty, numberToInput, parseNumber } from "../../utils/format";
import { showJalali, todayJalali } from "../../utils/jalali";
import { primaryBtnSx, headCellSx, POPUP_CLASS } from "./styles";
import { ItemPicker, JalaliField, SelectField, StatusChip, type Option } from "./ui";

interface Props {
  type: DocType;
  doc?: WarehouseDoc;
  onClose: () => void;
  onDone: (message: string, severity?: "success" | "error" | "info") => void;
}

interface LineState {
  key: number;
  itemId: number | null;
  qty: string;
  unitPrice: string;
  countedQty: string;
  wbs: string;
  description: string;
}

interface Header {
  date: string;
  kind: string;
  warehouseId: string;
  toWarehouseId: string;
  partyId: string;
  refNo: string;
  projectId: string;
  description: string;
}

const AUDIT_LABEL = {
  Create: "ایجاد",
  Update: "ویرایش",
  Finalize: "قطعی شدن",
  Cancel: "ابطال",
} as const;

let nextLineKey = 1;

const unitName = (code?: string) => units.find((u) => u.code === code)?.name ?? "";

export default function DocumentDialog({ type, doc, onClose, onDone }: Props) {
  const snap = useWarehouse();
  const readOnly = !!doc && doc.status !== "Draft";

  const newLine = (): LineState => ({
    key: nextLineKey++,
    itemId: null,
    qty: "",
    unitPrice: "",
    countedQty: "",
    wbs: "",
    description: "",
  });

  const [header, setHeader] = useState<Header>(() => {
    const d = doc;
    return {
      date: d?.date ?? todayJalali(),
      kind:
        d && (d.type === "Receipt" || d.type === "Issue")
          ? d.kind
          : type === "Receipt"
            ? "Purchase"
            : "Consumption",
      warehouseId:
        d && (d.type === "Receipt" || d.type === "Issue" || d.type === "Count")
          ? String(d.warehouseId)
          : "",
      toWarehouseId: d?.type === "Transfer" ? String(d.toWarehouseId) : "",
      partyId:
        d && (d.type === "Receipt" || d.type === "Issue") && d.partyId
          ? String(d.partyId)
          : "",
      refNo: d && d.type !== "Count" ? (d.refNo ?? "") : "",
      projectId: d?.projectId ? String(d.projectId) : "",
      description: d?.description ?? "",
    };
  });

  // For transfers the "warehouseId" field holds the source warehouse.
  const [fromWarehouseId, setFromWarehouseId] = useState(
    doc?.type === "Transfer" ? String(doc.fromWarehouseId) : "",
  );

  const [lines, setLines] = useState<LineState[]>(() => {
    if (!doc) return [newLine()];
    return doc.lines.map((l): LineState => {
      const base = { key: nextLineKey++, itemId: l.itemId, description: l.description ?? "" };
      if (doc.type === "Count") {
        const cl = l as CountLine;
        return { ...base, qty: "", unitPrice: "", countedQty: String(cl.countedQty), wbs: "" };
      }
      const dl = l as DocLine;
      return {
        ...base,
        qty: String(dl.qty),
        unitPrice: numberToInput(getLineCost(snap, doc, dl)),
        countedQty: "",
        wbs: dl.wbs ?? "",
      };
    });
  });

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Header>(k: K, v: Header[K]) =>
    setHeader((p) => ({ ...p, [k]: v }));

  const sourceWarehouseId = type === "Transfer" ? fromWarehouseId : header.warehouseId;

  // ----- derived data ------------------------------------------------------

  const stockMap = useMemo(() => {
    const m = new Map<string, { qty: number; avgCost: number }>();
    for (const r of getStock(snap)) {
      m.set(`${r.warehouseId}:${r.itemId}`, { qty: r.qty, avgCost: r.avgCost });
    }
    return m;
  }, [snap]);

  const pickerItems = useMemo(
    () =>
      snap.items.filter(
        (i) => i.status === "Active" || lines.some((l) => l.itemId === i.id),
      ),
    [snap.items, lines],
  );

  const warehouseOptions: Option[] = snap.warehouses
    .filter((w) => w.status === "Active" || String(w.id) === header.warehouseId)
    .map((w) => ({ value: w.id, label: `${w.code} – ${w.name}` }));

  const balanceOf = (warehouseId: string, itemId: number | null) =>
    itemId && warehouseId
      ? (stockMap.get(`${warehouseId}:${itemId}`) ?? { qty: 0, avgCost: 0 })
      : { qty: 0, avgCost: 0 };

  const lineInfo = (l: LineState) => {
    const item = snap.items.find((i) => i.id === l.itemId);
    const qty = parseNumber(l.qty);
    const bal = balanceOf(sourceWarehouseId, l.itemId);
    const price = type === "Receipt" || readOnly ? parseNumber(l.unitPrice) : bal.avgCost;
    const amount = Number.isFinite(qty) && Number.isFinite(price) ? qty * price : 0;
    return { item, qty, bal, price, amount };
  };

  const totalAmount = lines.reduce((s, l) => s + lineInfo(l).amount, 0);

  // ----- line editing ------------------------------------------------------

  const patchLine = (key: number, patch: Partial<LineState>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const removeLine = (key: number) =>
    setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.key !== key) : ls));

  const fillCountLines = () => {
    if (!header.warehouseId) {
      setError("ابتدا انبار را انتخاب کنید.");
      return;
    }
    const rows = getStock(snap).filter(
      (r) => String(r.warehouseId) === header.warehouseId && r.qty > 0,
    );
    if (rows.length === 0) {
      setError("این انبار موجودی ندارد.");
      return;
    }
    setError(null);
    setLines(rows.map((r) => ({ ...newLine(), itemId: r.itemId })));
  };

  // ----- save --------------------------------------------------------------

  function buildDraft(): { draft: DocDraft } | { error: string } {
    const common = {
      date: header.date,
      projectId: header.projectId ? Number(header.projectId) : undefined,
      description: header.description.trim() || undefined,
    };

    if (type === "Count") {
      const out: CountLine[] = [];
      for (const [idx, l] of lines.entries()) {
        if (l.itemId === null) return { error: `ردیف ${idx + 1}: کالا انتخاب نشده است.` };
        if (l.countedQty.trim() === "") {
          return { error: `ردیف ${idx + 1}: مقدار شمارش‌شده را وارد کنید (برای صفر، عدد ۰ بزنید).` };
        }
        const counted = parseNumber(l.countedQty);
        if (Number.isNaN(counted)) return { error: `ردیف ${idx + 1}: مقدار شمارش‌شده معتبر نیست.` };
        out.push({
          id: idx + 1,
          itemId: l.itemId,
          systemQty: balanceOf(header.warehouseId, l.itemId).qty,
          countedQty: counted,
          description: l.description.trim() || undefined,
        });
      }
      return {
        draft: { type: "Count", warehouseId: Number(header.warehouseId) || 0, lines: out, ...common },
      };
    }

    const out: DocLine[] = [];
    for (const [idx, l] of lines.entries()) {
      if (l.itemId === null) return { error: `ردیف ${idx + 1}: کالا انتخاب نشده است.` };
      const qty = parseNumber(l.qty);
      const price = type === "Receipt" ? parseNumber(l.unitPrice) : 0;
      if (Number.isNaN(qty) || Number.isNaN(price)) {
        return { error: `ردیف ${idx + 1}: مقدار یا قیمت معتبر نیست.` };
      }
      out.push({
        id: idx + 1,
        itemId: l.itemId,
        qty,
        unitPrice: price,
        wbs: l.wbs.trim() || undefined,
        description: l.description.trim() || undefined,
      });
    }

    const refNo = header.refNo.trim() || undefined;
    const partyId = header.partyId ? Number(header.partyId) : undefined;

    if (type === "Receipt") {
      return {
        draft: {
          type: "Receipt",
          kind: header.kind as ReceiptKind,
          warehouseId: Number(header.warehouseId) || 0,
          partyId,
          refNo,
          lines: out,
          ...common,
        },
      };
    }
    if (type === "Issue") {
      return {
        draft: {
          type: "Issue",
          kind: header.kind as IssueKind,
          warehouseId: Number(header.warehouseId) || 0,
          partyId,
          refNo,
          lines: out,
          ...common,
        },
      };
    }
    return {
      draft: {
        type: "Transfer",
        fromWarehouseId: Number(fromWarehouseId) || 0,
        toWarehouseId: Number(header.toWarehouseId) || 0,
        refNo,
        lines: out,
        ...common,
      },
    };
  }

  function save(finalize: boolean) {
    setError(null);
    const built = buildDraft();
    if ("error" in built) {
      setError(built.error);
      return;
    }

    setBusy(true);
    const saved = WarehouseService.saveDoc(built.draft, doc?.id);
    if (!saved.ok) {
      setBusy(false);
      setError(saved.error);
      return;
    }

    if (!finalize) {
      onDone(`${DOC_TYPE_LABEL[type]} شماره ${showJalali(String(saved.data.no))} به‌صورت پیش‌نویس ذخیره شد.`);
      onClose();
      return;
    }

    const done = WarehouseService.finalizeDoc(saved.data.id);
    if (!done.ok) {
      // The draft is saved; keep the dialog open on the saved document would
      // be confusing, so close it and tell the user why it is not final.
      onDone(`سند ذخیره شد ولی قطعی نشد: ${done.error}`, "error");
      onClose();
      return;
    }
    onDone(`${DOC_TYPE_LABEL[type]} شماره ${showJalali(String(done.data.no))} قطعی شد.`);
    onClose();
  }

  // ----- render ------------------------------------------------------------

  const title = doc
    ? `${DOC_TYPE_LABEL[type]} شماره ${showJalali(String(doc.no))}`
    : `${DOC_TYPE_LABEL[type]} جدید`;

  const partyOptions: Option[] = parties.map((p) => ({
    value: p.id,
    label: `${p.name} (${PARTY_KIND_LABEL[p.kind]})`,
  }));

  const projectOptions: Option[] = projects.map((p) => ({
    value: p.id,
    label: `${p.code} – ${p.name}`,
  }));

  const partyLabel = type === "Receipt" ? "تحویل‌دهنده / تامین‌کننده" : "تحویل‌گیرنده";
  const refLabel =
    type === "Receipt" ? "شماره سفارش / فاکتور" : type === "Issue" ? "شماره درخواست کالا" : "شماره مرجع";

  const isCount = type === "Count";
  const showPrice = !isCount;
  const colSpanTotal = isCount ? 5 : 6;

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth dir="rtl" className={POPUP_CLASS}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <span>{title}</span>
        {doc && <StatusChip status={doc.status} />}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* ---------------- Header ---------------- */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <JalaliField
              value={header.date}
              onChange={(v) => set("date", v)}
              disabled={readOnly}
              required
            />
          </Grid>

          {(type === "Receipt" || type === "Issue") && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SelectField
                label={type === "Receipt" ? "نوع رسید" : "نوع حواله"}
                value={header.kind}
                onChange={(v) => set("kind", v)}
                disabled={readOnly}
                options={Object.entries(type === "Receipt" ? RECEIPT_KIND_LABEL : ISSUE_KIND_LABEL).map(
                  ([value, label]) => ({ value, label }),
                )}
              />
            </Grid>
          )}

          {type === "Transfer" ? (
            <>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SelectField
                  label="انبار مبدأ"
                  value={fromWarehouseId}
                  onChange={setFromWarehouseId}
                  disabled={readOnly}
                  required
                  options={warehouseOptions}
                  emptyLabel="انتخاب کنید"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SelectField
                  label="انبار مقصد"
                  value={header.toWarehouseId}
                  onChange={(v) => set("toWarehouseId", v)}
                  disabled={readOnly}
                  required
                  options={warehouseOptions.filter((o) => String(o.value) !== fromWarehouseId)}
                  emptyLabel="انتخاب کنید"
                />
              </Grid>
            </>
          ) : (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SelectField
                label="انبار"
                value={header.warehouseId}
                onChange={(v) => set("warehouseId", v)}
                disabled={readOnly}
                required
                options={warehouseOptions}
                emptyLabel="انتخاب کنید"
              />
            </Grid>
          )}

          {(type === "Receipt" || type === "Issue") && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SelectField
                label={partyLabel}
                value={header.partyId}
                onChange={(v) => set("partyId", v)}
                disabled={readOnly}
                options={partyOptions}
                emptyLabel="بدون طرف حساب"
              />
            </Grid>
          )}

          {!isCount && (
            <>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label={refLabel}
                  value={header.refNo}
                  onChange={(e) => set("refNo", e.target.value)}
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SelectField
                  label="پروژه"
                  value={header.projectId}
                  onChange={(v) => set("projectId", v)}
                  disabled={readOnly}
                  required
                  options={projectOptions}
                  emptyLabel="انتخاب کنید"
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, md: isCount ? 9 : 6 }}>
            <TextField
              fullWidth
              label="توضیحات"
              value={header.description}
              onChange={(e) => set("description", e.target.value)}
              disabled={readOnly}
            />
          </Grid>
        </Grid>

        {/* ---------------- Lines ---------------- */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <Typography fontWeight={700} sx={{ flex: 1 }}>
            اقلام سند
          </Typography>
          {!readOnly && isCount && (
            <Button size="small" startIcon={<PlaylistAddRoundedIcon />} onClick={fillCountLines}>
              درج همه کالاهای موجود در انبار
            </Button>
          )}
        </Box>

        {!readOnly && !isCount && type !== "Receipt" && (
          <Alert severity="info" sx={{ mb: 1.5 }}>
            قیمت واحد خروجی‌ها در زمان قطعی شدن با روش میانگین موزون متحرک محاسبه می‌شود؛ مقدار نمایش‌داده‌شده تخمینی است.
          </Alert>
        )}
        {!readOnly && isCount && (
          <Alert severity="info" sx={{ mb: 1.5 }}>
            با قطعی شدن انبارگردانی، اختلاف شمارش با موجودی سیستم به‌صورت رسید (مازاد) یا حواله (کسری) تعدیل می‌شود.
          </Alert>
        )}

        <Paper variant="outlined" sx={{ borderRadius: "12px", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx} width={48}>ردیف</TableCell>
                <TableCell sx={headCellSx}>کالا</TableCell>
                <TableCell sx={headCellSx}>واحد</TableCell>
                {(type === "Issue" || type === "Transfer" || isCount) && !readOnly && (
                  <TableCell sx={headCellSx}>{isCount ? "موجودی سیستم" : "موجودی انبار"}</TableCell>
                )}
                <TableCell sx={headCellSx}>{isCount ? "شمارش‌شده" : "مقدار"}</TableCell>
                {isCount && <TableCell sx={headCellSx}>اختلاف</TableCell>}
                {showPrice && <TableCell sx={headCellSx}>قیمت واحد (ریال)</TableCell>}
                {showPrice && <TableCell sx={headCellSx}>مبلغ (ریال)</TableCell>}
                {!isCount && <TableCell sx={headCellSx}>WBS</TableCell>}
                <TableCell sx={headCellSx}>توضیحات</TableCell>
                {!readOnly && <TableCell sx={headCellSx} width={48} />}
              </TableRow>
            </TableHead>

            <TableBody>
              {lines.map((l, idx) => {
                const info = lineInfo(l);
                const counted = parseNumber(l.countedQty);
                const diff =
                  isCount && l.countedQty.trim() !== "" && Number.isFinite(counted)
                    ? counted - info.bal.qty
                    : null;
                const short =
                  !isCount &&
                  !readOnly &&
                  type !== "Receipt" &&
                  Number.isFinite(info.qty) &&
                  info.qty > info.bal.qty + 1e-9;

                return (
                  <TableRow key={l.key}>
                    <TableCell>{showJalali(String(idx + 1))}</TableCell>

                    <TableCell sx={{ minWidth: 280 }}>
                      <ItemPicker
                        items={pickerItems}
                        value={l.itemId}
                        disabled={readOnly}
                        onChange={(id) => patchLine(l.key, { itemId: id })}
                      />
                    </TableCell>

                    <TableCell>{unitName(info.item?.unit)}</TableCell>

                    {(type === "Issue" || type === "Transfer" || isCount) && !readOnly && (
                      <TableCell>{l.itemId ? formatQty(info.bal.qty) : "—"}</TableCell>
                    )}

                    <TableCell sx={{ minWidth: 120 }}>
                      <TextField
                        size="small"
                        className="pcs-ltr-num"
                        value={isCount ? l.countedQty : l.qty}
                        disabled={readOnly}
                        error={short}
                        helperText={short ? "بیش از موجودی" : undefined}
                        onChange={(e) =>
                          patchLine(l.key, isCount ? { countedQty: e.target.value } : { qty: e.target.value })
                        }
                        slotProps={{ htmlInput: { inputMode: "decimal" } }}
                      />
                    </TableCell>

                    {isCount && (
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: diff === null || diff === 0 ? "text.secondary" : diff > 0 ? "success.main" : "error.main",
                        }}
                      >
                        {diff === null ? "—" : diff > 0 ? `+${formatQty(diff)}` : formatQty(diff)}
                      </TableCell>
                    )}

                    {showPrice && (
                      <TableCell sx={{ minWidth: 140 }}>
                        {type === "Receipt" && !readOnly ? (
                          <TextField
                            size="small"
                            className="pcs-ltr-num"
                            value={l.unitPrice}
                            onChange={(e) => patchLine(l.key, { unitPrice: e.target.value })}
                            slotProps={{ htmlInput: { inputMode: "decimal" } }}
                          />
                        ) : (
                          formatMoney(info.price)
                        )}
                      </TableCell>
                    )}

                    {showPrice && (
                      <TableCell sx={{ fontWeight: 600 }}>{formatMoney(info.amount)}</TableCell>
                    )}

                    {!isCount && (
                      <TableCell sx={{ minWidth: 100 }}>
                        <TextField
                          size="small"
                          className="pcs-ltr-num"
                          value={l.wbs}
                          disabled={readOnly}
                          placeholder="1.2.1"
                          onChange={(e) => patchLine(l.key, { wbs: e.target.value })}
                        />
                      </TableCell>
                    )}

                    <TableCell sx={{ minWidth: 160 }}>
                      <TextField
                        size="small"
                        value={l.description}
                        disabled={readOnly}
                        onChange={(e) => patchLine(l.key, { description: e.target.value })}
                      />
                    </TableCell>

                    {!readOnly && (
                      <TableCell>
                        <Tooltip title="حذف ردیف">
                          <span>
                            <IconButton
                              size="small"
                              disabled={lines.length === 1}
                              onClick={() => removeLine(l.key)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}

              {showPrice && (
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  <TableCell colSpan={colSpanTotal + (readOnly ? 0 : 1)} sx={{ fontWeight: 700 }}>
                    جمع کل
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatMoney(totalAmount)}</TableCell>
                  <TableCell colSpan={readOnly ? 2 : 3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {!readOnly && (
          <Button
            startIcon={<AddRoundedIcon />}
            sx={{ mt: 1.5 }}
            onClick={() => setLines((ls) => [...ls, newLine()])}
          >
            افزودن ردیف
          </Button>
        )}

        {/* ---------------- Audit trail ---------------- */}
        {doc && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography fontWeight={700} mb={1}>
              سابقه تغییرات
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {doc.audit.map((a, i) => (
                <Chip
                  key={i}
                  size="small"
                  variant="outlined"
                  label={`${AUDIT_LABEL[a.action]}${a.note ? ` (${a.note})` : ""} – ${a.by} – ${new Date(a.at).toLocaleString("fa-IR")}`}
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-start", gap: 1 }}>
        {!readOnly && (
          <>
            <Button
              variant="contained"
              disabled={busy}
              onClick={() => save(true)}
              sx={primaryBtnSx}
            >
              ذخیره و قطعی کردن
            </Button>
            <Button variant="outlined" disabled={busy} onClick={() => save(false)}>
              ذخیره پیش‌نویس
            </Button>
          </>
        )}
        <Button onClick={onClose}>{readOnly ? "بستن" : "انصراف"}</Button>
      </DialogActions>
    </Dialog>
  );
}
