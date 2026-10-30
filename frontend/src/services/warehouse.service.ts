// ============================================================
// Warehouse service
//
// A small in-memory store (persisted to localStorage) + pure reducers.
// Stock is never stored: it is always derived by replaying FINAL documents
// through the ledger (computeLedger) with moving weighted-average costing,
// the same approach inventory systems like Rahkaran use for the kardex.
//
// Business rules (see docs/Business-Rules.md):
//  - Rule 007: receipts / issues / transfers belong to a Project.
//  - Rule 009: no physical delete -> documents are cancelled (soft delete).
//  - Rule 010: every change is audited.
// ============================================================

import { seedDocs, seedItems, seedWarehouses, itemGroups, units } from "../mock/warehouse";
import { formatQty } from "../utils/format";
import { normalizeJalali } from "../utils/jalali";
import type {
  AuditEntry,
  DocLine,
  DocType,
  Item,
  LedgerRow,
  StockRow,
  Warehouse,
  WarehouseDoc,
  WarehouseSnapshot,
} from "../types/warehouse";

// ---------- Public types ----------------------------------------------------

type OmitDraft<T> = T extends unknown
  ? Omit<T, "id" | "no" | "status" | "audit">
  : never;

/** What the editor sends when saving a document. */
export type DocDraft = OmitDraft<WarehouseDoc>;

export type ItemInput = Omit<Item, "id">;
export type WarehouseInput = Omit<Warehouse, "id">;

type Outcome<T> =
  | { ok: true; state: WarehouseSnapshot; data: T }
  | { ok: false; error: string };

export type Result<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface LedgerError {
  docType: DocType;
  docId: number;
  docNo: number;
  warehouseId: number;
  itemId: number;
  short: number;
}

export interface LedgerResult {
  rows: LedgerRow[];
  errors: LedgerError[];
  /** `${docId}:${lineId}` -> unit cost used for issue / transfer lines */
  lineCosts: Map<string, number>;
  /** `${docId}:${lineId}` -> system balance used by a count line */
  countSystemQty: Map<string, number>;
}

export interface KardexResult {
  opening: { qty: number; cost: number; amount: number };
  rows: LedgerRow[];
  totals: { inQty: number; inAmount: number; outQty: number; outAmount: number };
}

// ---------- Constants -------------------------------------------------------

const STORAGE_KEY = "pcs.warehouse.v1";
const ACTOR = "مدیر سیستم";
const EPS = 1e-6;

const DOC_RANK: Record<DocType, number> = {
  Receipt: 0,
  Transfer: 1,
  Issue: 2,
  Count: 3,
};

const FIRST_NO: Record<DocType, number> = {
  Receipt: 1001,
  Issue: 2001,
  Transfer: 3001,
  Count: 4001,
};

// ---------- Ledger engine ---------------------------------------------------

interface Balance {
  qty: number;
  amount: number;
  lastCost: number;
}

const keyOf = (warehouseId: number, itemId: number) => `${warehouseId}:${itemId}`;

function sortFinal(docs: WarehouseDoc[]): WarehouseDoc[] {
  return docs
    .filter((d) => d.status === "Final")
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        DOC_RANK[a.type] - DOC_RANK[b.type] ||
        a.id - b.id,
    );
}

const ledgerCache = new WeakMap<WarehouseDoc[], LedgerResult>();

export function computeLedger(docs: WarehouseDoc[]): LedgerResult {
  const cached = ledgerCache.get(docs);
  if (cached) return cached;

  const rows: LedgerRow[] = [];
  const errors: LedgerError[] = [];
  const lineCosts = new Map<string, number>();
  const countSystemQty = new Map<string, number>();
  const balances = new Map<string, Balance>();
  let seq = 0;

  const balanceOf = (w: number, i: number): Balance => {
    const k = keyOf(w, i);
    let b = balances.get(k);
    if (!b) {
      b = { qty: 0, amount: 0, lastCost: 0 };
      balances.set(k, b);
    }
    return b;
  };

  const avgCost = (b: Balance) => (b.qty > EPS ? b.amount / b.qty : b.lastCost);

  function applyIn(
    doc: WarehouseDoc,
    lineId: number,
    w: number,
    i: number,
    qty: number,
    unitCost: number,
    label: string,
    amountOverride?: number,
  ) {
    const b = balanceOf(w, i);
    const amount = amountOverride ?? Math.round(qty * unitCost);
    b.qty += qty;
    b.amount += amount;
    b.lastCost = unitCost;
    rows.push({
      seq: seq++,
      docType: doc.type,
      docId: doc.id,
      docNo: doc.no,
      lineId,
      date: doc.date,
      warehouseId: w,
      itemId: i,
      direction: "in",
      qty,
      label,
      inCost: unitCost,
      inAmount: amount,
      outCost: 0,
      outAmount: 0,
      balQty: b.qty,
      balCost: avgCost(b),
      balAmount: b.amount,
    });
  }

  /** Returns { cost, amount } of the removed stock (moving weighted average). */
  function applyOut(
    doc: WarehouseDoc,
    lineId: number,
    w: number,
    i: number,
    qty: number,
    label: string,
  ) {
    const b = balanceOf(w, i);
    const cost = avgCost(b);

    if (qty > b.qty + EPS) {
      errors.push({
        docType: doc.type,
        docId: doc.id,
        docNo: doc.no,
        warehouseId: w,
        itemId: i,
        short: qty - Math.max(b.qty, 0),
      });
    }

    // Taking everything must empty the amount exactly (no rounding residue).
    const amount =
      Math.abs(qty - b.qty) <= EPS ? b.amount : Math.round(qty * cost);

    b.qty -= qty;
    b.amount -= amount;
    if (Math.abs(b.qty) <= EPS) {
      b.qty = 0;
      b.amount = 0;
    }

    rows.push({
      seq: seq++,
      docType: doc.type,
      docId: doc.id,
      docNo: doc.no,
      lineId,
      date: doc.date,
      warehouseId: w,
      itemId: i,
      direction: "out",
      qty,
      label,
      inCost: 0,
      inAmount: 0,
      outCost: cost,
      outAmount: amount,
      balQty: b.qty,
      balCost: avgCost(b),
      balAmount: b.amount,
    });

    return { cost, amount };
  }

  for (const doc of sortFinal(docs)) {
    switch (doc.type) {
      case "Receipt": {
        const label = receiptLabel(doc.kind, doc.refNo);
        for (const l of doc.lines) {
          applyIn(doc, l.id, doc.warehouseId, l.itemId, l.qty, l.unitPrice, label);
        }
        break;
      }
      case "Issue": {
        const label = issueLabel(doc.kind, doc.refNo);
        for (const l of doc.lines) {
          const { cost } = applyOut(doc, l.id, doc.warehouseId, l.itemId, l.qty, label);
          lineCosts.set(`${doc.id}:${l.id}`, cost);
        }
        break;
      }
      case "Transfer": {
        const outLabel = `انتقال به انبار مقصد${doc.refNo ? ` – ${doc.refNo}` : ""}`;
        const inLabel = `انتقال از انبار مبدأ${doc.refNo ? ` – ${doc.refNo}` : ""}`;
        for (const l of doc.lines) {
          const out = applyOut(doc, l.id, doc.fromWarehouseId, l.itemId, l.qty, outLabel);
          lineCosts.set(`${doc.id}:${l.id}`, out.cost);
          // The receiving warehouse takes over the sending warehouse's cost.
          applyIn(doc, l.id, doc.toWarehouseId, l.itemId, l.qty, out.cost, inLabel, out.amount);
        }
        break;
      }
      case "Count": {
        for (const l of doc.lines) {
          const b = balanceOf(doc.warehouseId, l.itemId);
          const system = Math.round(b.qty * 1e6) / 1e6;
          countSystemQty.set(`${doc.id}:${l.id}`, system);
          const diff = Math.round((l.countedQty - system) * 1e6) / 1e6;
          if (diff > EPS) {
            applyIn(doc, l.id, doc.warehouseId, l.itemId, diff, avgCost(b), "مازاد انبارگردانی");
          } else if (diff < -EPS) {
            applyOut(doc, l.id, doc.warehouseId, l.itemId, -diff, "کسری انبارگردانی");
          }
        }
        break;
      }
    }
  }

  const result: LedgerResult = { rows, errors, lineCosts, countSystemQty };
  ledgerCache.set(docs, result);
  return result;
}

function receiptLabel(kind: string, refNo?: string) {
  const names: Record<string, string> = {
    Purchase: "رسید خرید",
    Production: "رسید تولید",
    ReturnFromConsumption: "برگشت از مصرف",
    Initial: "موجودی اول دوره",
    Other: "رسید",
  };
  return `${names[kind] ?? "رسید"}${refNo ? ` – ${refNo}` : ""}`;
}

function issueLabel(kind: string, refNo?: string) {
  const names: Record<string, string> = {
    Consumption: "حواله مصرف",
    ProjectIssue: "حواله به پروژه / پیمانکار",
    ReturnToSupplier: "برگشت از خرید",
    Scrap: "ضایعات",
    Other: "حواله",
  };
  return `${names[kind] ?? "حواله"}${refNo ? ` – ${refNo}` : ""}`;
}

// ---------- Selectors -------------------------------------------------------

export function getLedger(s: WarehouseSnapshot): LedgerResult {
  return computeLedger(s.docs);
}

export function getStock(s: WarehouseSnapshot): StockRow[] {
  const last = new Map<string, LedgerRow>();
  for (const r of computeLedger(s.docs).rows) {
    last.set(keyOf(r.warehouseId, r.itemId), r);
  }
  return [...last.values()].map((r) => ({
    warehouseId: r.warehouseId,
    itemId: r.itemId,
    qty: r.balQty,
    avgCost: r.balCost,
    amount: r.balAmount,
  }));
}

export function getBalance(
  s: WarehouseSnapshot,
  warehouseId: number,
  itemId: number,
): { qty: number; avgCost: number; amount: number } {
  const row = getStock(s).find(
    (r) => r.warehouseId === warehouseId && r.itemId === itemId,
  );
  return row
    ? { qty: row.qty, avgCost: row.avgCost, amount: row.amount }
    : { qty: 0, avgCost: 0, amount: 0 };
}

export function getKardex(
  s: WarehouseSnapshot,
  q: { warehouseId: number; itemId: number; from?: string; to?: string },
): KardexResult {
  const all = computeLedger(s.docs).rows.filter(
    (r) => r.warehouseId === q.warehouseId && r.itemId === q.itemId,
  );

  const before = q.from ? all.filter((r) => r.date < q.from!) : [];
  const openRow = before[before.length - 1];
  const opening = openRow
    ? { qty: openRow.balQty, cost: openRow.balCost, amount: openRow.balAmount }
    : { qty: 0, cost: 0, amount: 0 };

  const rows = all.filter(
    (r) => (!q.from || r.date >= q.from) && (!q.to || r.date <= q.to),
  );

  const totals = rows.reduce(
    (t, r) => ({
      inQty: t.inQty + (r.direction === "in" ? r.qty : 0),
      inAmount: t.inAmount + r.inAmount,
      outQty: t.outQty + (r.direction === "out" ? r.qty : 0),
      outAmount: t.outAmount + r.outAmount,
    }),
    { inQty: 0, inAmount: 0, outQty: 0, outAmount: 0 },
  );

  return { opening, rows, totals };
}

export function listDocs<T extends DocType>(
  s: WarehouseSnapshot,
  type: T,
): Extract<WarehouseDoc, { type: T }>[] {
  return s.docs
    .filter((d): d is Extract<WarehouseDoc, { type: T }> => d.type === type)
    .sort((a, b) => b.date.localeCompare(a.date) || b.no - a.no);
}

export function getDocById(s: WarehouseSnapshot, id: number) {
  return s.docs.find((d) => d.id === id);
}

/** Unit cost of an issue / transfer line: exact when final, estimate otherwise. */
export function getLineCost(
  s: WarehouseSnapshot,
  doc: WarehouseDoc,
  line: DocLine,
): number {
  if (doc.type === "Receipt") return line.unitPrice;
  if (doc.type === "Count") return 0;
  if (doc.status === "Final") {
    return computeLedger(s.docs).lineCosts.get(`${doc.id}:${line.id}`) ?? line.unitPrice;
  }
  const wh = doc.type === "Issue" ? doc.warehouseId : doc.fromWarehouseId;
  return getBalance(s, wh, line.itemId).avgCost;
}

// ---------- Validation ------------------------------------------------------

function itemName(s: WarehouseSnapshot, id: number) {
  return s.items.find((i) => i.id === id)?.name ?? `کالا ${id}`;
}

function warehouseName(s: WarehouseSnapshot, id: number) {
  return s.warehouses.find((w) => w.id === id)?.name ?? `انبار ${id}`;
}

function describeErrors(s: WarehouseSnapshot, errors: LedgerError[]): string {
  const parts = errors.slice(0, 3).map((e) => {
    const item = s.items.find((i) => i.id === e.itemId);
    const unit = units.find((u) => u.code === item?.unit)?.name ?? "";
    return `${itemName(s, e.itemId)} در ${warehouseName(s, e.warehouseId)} (کسری ${formatQty(e.short)} ${unit})`;
  });
  const more = errors.length > 3 ? ` و ${errors.length - 3} مورد دیگر` : "";
  return `موجودی کافی نیست: ${parts.join("؛ ")}${more}`;
}

function checkWarehouse(s: WarehouseSnapshot, id: number, title: string): string | null {
  const w = s.warehouses.find((x) => x.id === id);
  if (!w) return `${title} را انتخاب کنید.`;
  if (w.status !== "Active") return `${title} غیرفعال است.`;
  return null;
}

function validateDraft(s: WarehouseSnapshot, d: DocDraft): string | null {
  if (!normalizeJalali(d.date)) return "تاریخ سند معتبر نیست (قالب: ۱۴۰۵/۰۸/۰۸).";

  if (d.type === "Transfer") {
    const e1 = checkWarehouse(s, d.fromWarehouseId, "انبار مبدأ");
    if (e1) return e1;
    const e2 = checkWarehouse(s, d.toWarehouseId, "انبار مقصد");
    if (e2) return e2;
    if (d.fromWarehouseId === d.toWarehouseId) {
      return "انبار مبدأ و مقصد نمی‌تواند یکسان باشد.";
    }
  } else {
    const e = checkWarehouse(s, d.warehouseId, "انبار");
    if (e) return e;
  }

  if (d.type !== "Count") {
    if (!d.projectId) return "انتخاب پروژه الزامی است (هر تراکنش متعلق به یک پروژه است).";
  }

  if (d.lines.length === 0) return "حداقل یک ردیف کالا لازم است.";

  const seen = new Set<number>();
  for (const [idx, l] of d.lines.entries()) {
    const row = `ردیف ${idx + 1}`;
    const item = s.items.find((i) => i.id === l.itemId);
    if (!item) return `${row}: کالا انتخاب نشده است.`;
    if (item.status !== "Active") return `${row}: کالای «${item.name}» غیرفعال است.`;

    if (d.type === "Count") {
      if (seen.has(l.itemId)) return `${row}: کالای «${item.name}» تکراری است.`;
      seen.add(l.itemId);
      const cl = l as { countedQty: number };
      if (!(cl.countedQty >= 0) || !Number.isFinite(cl.countedQty)) {
        return `${row}: مقدار شمارش‌شده معتبر نیست.`;
      }
    } else {
      const dl = l as DocLine;
      if (!(dl.qty > 0) || !Number.isFinite(dl.qty)) return `${row}: مقدار باید بزرگ‌تر از صفر باشد.`;
      if (d.type === "Receipt" && !(dl.unitPrice > 0)) {
        return `${row}: قیمت واحد رسید باید بزرگ‌تر از صفر باشد.`;
      }
    }
  }
  return null;
}

// ---------- Reducers (pure) -------------------------------------------------

function audit(action: AuditEntry["action"], note?: string): AuditEntry {
  return { at: new Date().toISOString(), by: ACTOR, action, note };
}

/** Rewrites derived snapshots (issue/transfer cost, count system qty) on final docs. */
function refreshDerived(docs: WarehouseDoc[]): WarehouseDoc[] {
  const ledger = computeLedger(docs);
  let changed = false;

  const next = docs.map((d): WarehouseDoc => {
    if (d.status !== "Final") return d;

    if (d.type === "Issue" || d.type === "Transfer") {
      const lines = d.lines.map((l) => {
        const c = ledger.lineCosts.get(`${d.id}:${l.id}`);
        return c !== undefined && c !== l.unitPrice ? { ...l, unitPrice: c } : l;
      });
      if (lines.some((l, i) => l !== d.lines[i])) {
        changed = true;
        return { ...d, lines };
      }
    }

    if (d.type === "Count") {
      const lines = d.lines.map((l) => {
        const q = ledger.countSystemQty.get(`${d.id}:${l.id}`);
        return q !== undefined && q !== l.systemQty ? { ...l, systemQty: q } : l;
      });
      if (lines.some((l, i) => l !== d.lines[i])) {
        changed = true;
        return { ...d, lines };
      }
    }
    return d;
  });

  if (!changed) return docs;
  ledgerCache.set(next, ledger); // same movements, only snapshots differ
  return next;
}

function withDocs(s: WarehouseSnapshot, docs: WarehouseDoc[]): WarehouseSnapshot {
  return { ...s, docs: refreshDerived(docs) };
}

function reindexLines<T extends { id: number }>(lines: T[]): T[] {
  return lines.map((l, i) => ({ ...l, id: i + 1 }));
}

export function reduceSaveDoc(
  s: WarehouseSnapshot,
  draft: DocDraft,
  id?: number,
): Outcome<WarehouseDoc> {
  const err = validateDraft(s, draft);
  if (err) return { ok: false, error: err };

  const date = normalizeJalali(draft.date)!;

  // Drafts never carry costs for outgoing documents: they are computed.
  const prepared = {
    ...draft,
    date,
    lines:
      draft.type === "Issue" || draft.type === "Transfer"
        ? reindexLines(draft.lines).map((l) => ({ ...l, unitPrice: 0 }))
        : reindexLines(draft.lines as { id: number }[]),
  } as DocDraft;

  if (id !== undefined) {
    const old = s.docs.find((d) => d.id === id);
    if (!old) return { ok: false, error: "سند پیدا نشد." };
    if (old.status !== "Draft") {
      return { ok: false, error: "فقط اسناد پیش‌نویس قابل ویرایش هستند." };
    }
    if (old.type !== prepared.type) return { ok: false, error: "نوع سند قابل تغییر نیست." };

    const updated = {
      ...prepared,
      id: old.id,
      no: old.no,
      status: old.status,
      audit: [...old.audit, audit("Update")],
    } as WarehouseDoc;
    return {
      ok: true,
      state: withDocs(s, s.docs.map((d) => (d.id === id ? updated : d))),
      data: updated,
    };
  }

  const nextNo = { ...s.nextNo };
  const no = nextNo[prepared.type]++;
  const created = {
    ...prepared,
    id: s.nextIds.doc,
    no,
    status: "Draft",
    audit: [audit("Create")],
  } as WarehouseDoc;

  return {
    ok: true,
    state: {
      ...withDocs(s, [...s.docs, created]),
      nextIds: { ...s.nextIds, doc: s.nextIds.doc + 1 },
      nextNo,
    },
    data: created,
  };
}

function changeStatus(
  s: WarehouseSnapshot,
  id: number,
  from: WarehouseDoc["status"][],
  to: WarehouseDoc["status"],
  entry: AuditEntry,
): Outcome<WarehouseDoc> {
  const doc = s.docs.find((d) => d.id === id);
  if (!doc) return { ok: false, error: "سند پیدا نشد." };
  if (!from.includes(doc.status)) {
    return { ok: false, error: "این عملیات برای وضعیت فعلی سند مجاز نیست." };
  }

  const updated = { ...doc, status: to, audit: [...doc.audit, entry] } as WarehouseDoc;
  const docs = s.docs.map((d) => (d.id === id ? updated : d));

  // Any change that touches stock must keep every balance >= 0.
  const ledger = computeLedger(docs);
  if (ledger.errors.length > 0) {
    return { ok: false, error: describeErrors(s, ledger.errors) };
  }

  const next = withDocs(s, docs);
  return { ok: true, state: next, data: next.docs.find((d) => d.id === id)! };
}

export function reduceFinalize(s: WarehouseSnapshot, id: number) {
  const doc = s.docs.find((d) => d.id === id);
  if (doc) {
    const err = validateDraft(s, doc as unknown as DocDraft);
    if (err) return { ok: false, error: err } as const;
  }
  return changeStatus(s, id, ["Draft"], "Final", audit("Finalize"));
}

export function reduceReopen(s: WarehouseSnapshot, id: number) {
  return changeStatus(s, id, ["Final"], "Draft", audit("Update", "بازگشت به پیش‌نویس"));
}

export function reduceCancel(s: WarehouseSnapshot, id: number) {
  return changeStatus(s, id, ["Draft", "Final"], "Cancelled", audit("Cancel"));
}

// ----- Master data -----------------------------------------------------------

function validateItem(s: WarehouseSnapshot, i: ItemInput, id?: number): string | null {
  if (!i.code.trim()) return "کد کالا الزامی است.";
  if (!i.name.trim()) return "نام کالا الزامی است.";
  if (s.items.some((x) => x.id !== id && x.code.trim() === i.code.trim())) {
    return "این کد کالا قبلاً استفاده شده است.";
  }
  if (!units.some((u) => u.code === i.unit)) return "واحد اندازه‌گیری را انتخاب کنید.";
  if (!itemGroups.some((g) => g.id === i.groupId)) return "گروه کالا را انتخاب کنید.";
  if (!(i.minStock >= 0)) return "حداقل موجودی نمی‌تواند منفی باشد.";
  return null;
}

export function reduceSaveItem(s: WarehouseSnapshot, input: ItemInput, id?: number): Outcome<Item> {
  const err = validateItem(s, input, id);
  if (err) return { ok: false, error: err };

  const clean: ItemInput = { ...input, code: input.code.trim(), name: input.name.trim() };

  if (id !== undefined) {
    const old = s.items.find((x) => x.id === id);
    if (!old) return { ok: false, error: "کالا پیدا نشد." };
    const updated = { ...clean, id };
    return {
      ok: true,
      state: { ...s, items: s.items.map((x) => (x.id === id ? updated : x)) },
      data: updated,
    };
  }

  const created = { ...clean, id: s.nextIds.item };
  return {
    ok: true,
    state: {
      ...s,
      items: [...s.items, created],
      nextIds: { ...s.nextIds, item: s.nextIds.item + 1 },
    },
    data: created,
  };
}

function validateWarehouse(
  s: WarehouseSnapshot,
  w: WarehouseInput,
  id?: number,
): string | null {
  if (!w.code.trim()) return "کد انبار الزامی است.";
  if (!w.name.trim()) return "نام انبار الزامی است.";
  if (s.warehouses.some((x) => x.id !== id && x.code.trim() === w.code.trim())) {
    return "این کد انبار قبلاً استفاده شده است.";
  }
  if (id !== undefined && w.status === "Inactive") {
    const stock = getStock(s).filter((r) => r.warehouseId === id && r.qty > EPS);
    if (stock.length > 0) {
      return "انبار دارای موجودی است و نمی‌تواند غیرفعال شود؛ ابتدا موجودی را منتقل کنید.";
    }
  }
  return null;
}

export function reduceSaveWarehouse(
  s: WarehouseSnapshot,
  input: WarehouseInput,
  id?: number,
): Outcome<Warehouse> {
  const err = validateWarehouse(s, input, id);
  if (err) return { ok: false, error: err };

  const clean: WarehouseInput = { ...input, code: input.code.trim(), name: input.name.trim() };

  if (id !== undefined) {
    const old = s.warehouses.find((x) => x.id === id);
    if (!old) return { ok: false, error: "انبار پیدا نشد." };
    const updated = { ...clean, id };
    return {
      ok: true,
      state: { ...s, warehouses: s.warehouses.map((x) => (x.id === id ? updated : x)) },
      data: updated,
    };
  }

  const created = { ...clean, id: s.nextIds.warehouse };
  return {
    ok: true,
    state: {
      ...s,
      warehouses: [...s.warehouses, created],
      nextIds: { ...s.nextIds, warehouse: s.nextIds.warehouse + 1 },
    },
    data: created,
  };
}

// ---------- Seed + persistence ----------------------------------------------

function buildSeedState(): WarehouseSnapshot {
  let s: WarehouseSnapshot = {
    items: seedItems,
    warehouses: seedWarehouses,
    docs: [],
    nextIds: { item: seedItems.length + 1, warehouse: seedWarehouses.length + 1, doc: 1 },
    nextNo: { ...FIRST_NO },
  };

  for (const { draft, finalize } of seedDocs) {
    const saved = reduceSaveDoc(s, draft);
    if (!saved.ok) throw new Error(`Seed document is invalid: ${saved.error}`);
    s = saved.state;
    if (finalize) {
      const done = reduceFinalize(s, saved.data.id);
      if (!done.ok) throw new Error(`Seed document cannot be finalized: ${done.error}`);
      s = done.state;
    }
  }
  return s;
}

function load(): WarehouseSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WarehouseSnapshot;
      if (
        Array.isArray(parsed.items) &&
        Array.isArray(parsed.warehouses) &&
        Array.isArray(parsed.docs) &&
        parsed.nextIds &&
        parsed.nextNo
      ) {
        return parsed;
      }
    }
  } catch {
    // corrupted or unavailable storage -> fall back to seed data
  }
  return buildSeedState();
}

function persist(s: WarehouseSnapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // storage full / blocked: the app keeps working in memory
  }
}

// ---------- Store -----------------------------------------------------------

let state: WarehouseSnapshot = load();
const listeners = new Set<() => void>();

function commit<T>(o: Outcome<T>): Result<T> {
  if (!o.ok) return o;
  state = o.state;
  persist(state);
  listeners.forEach((l) => l());
  return { ok: true, data: o.data };
}

export const warehouseStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
};

export const WarehouseService = {
  saveDoc: (draft: DocDraft, id?: number) => commit(reduceSaveDoc(state, draft, id)),
  finalizeDoc: (id: number) => commit(reduceFinalize(state, id)),
  reopenDoc: (id: number) => commit(reduceReopen(state, id)),
  cancelDoc: (id: number) => commit(reduceCancel(state, id)),
  saveItem: (input: ItemInput, id?: number) => commit(reduceSaveItem(state, input, id)),
  saveWarehouse: (input: WarehouseInput, id?: number) =>
    commit(reduceSaveWarehouse(state, input, id)),
  /** Restores the demo data (used by the "بازنشانی داده‌های نمونه" action). */
  resetDemoData() {
    return commit<undefined>({ ok: true, state: buildSeedState(), data: undefined });
  },
};
