// ============================================================
// Warehouse module types
// Modeled on the standard inventory workflow of Rahkaran
// (راهکاران سیستم): رسید / حواله / انتقال / انبارگردانی / کاردکس.
// Dates are Jalali strings "YYYY/MM/DD" (sortable lexicographically).
// ============================================================

export type ActiveStatus = "Active" | "Inactive";

/** Document lifecycle. Final documents affect stock; Cancelled = soft delete. */
export type DocStatus = "Draft" | "Final" | "Cancelled";

export type DocType = "Receipt" | "Issue" | "Transfer" | "Count";

export type ItemType =
  | "RawMaterial"
  | "Equipment"
  | "SparePart"
  | "Consumable"
  | "Tool";

export type WarehouseType = "Central" | "Project" | "Temporary";

export interface Unit {
  code: string;
  name: string;
}

export interface ItemGroup {
  id: number;
  code: string;
  name: string;
}

export interface Item {
  id: number;
  code: string;
  name: string;
  englishName?: string;
  groupId: number;
  type: ItemType;
  unit: string; // Unit.code
  minStock: number; // reorder point (حداقل موجودی)
  specification?: string;
  status: ActiveStatus;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  type: WarehouseType;
  location?: string;
  keeper?: string; // انباردار
  projectId?: number;
  status: ActiveStatus;
}

export interface Project {
  id: number;
  code: string;
  name: string;
}

export interface Party {
  id: number;
  code: string;
  name: string;
  kind: "Supplier" | "Contractor" | "Department" | "Customer";
}

// ----- Document types (reasons) -------------------------------------------

export type ReceiptKind =
  | "Purchase" // رسید خرید
  | "Production" // رسید تولید
  | "ReturnFromConsumption" // برگشت از مصرف
  | "Initial" // موجودی اول دوره
  | "Other"; // سایر رسیدها

export type IssueKind =
  | "Consumption" // حواله مصرف
  | "ProjectIssue" // حواله به پروژه / پیمانکار
  | "ReturnToSupplier" // برگشت از خرید
  | "Scrap" // ضایعات
  | "Other"; // سایر حواله‌ها

export interface DocLine {
  id: number;
  itemId: number;
  qty: number;
  /** Receipt: entered by user. Issue/Transfer: filled from costing at finalize. */
  unitPrice: number;
  wbs?: string;
  description?: string;
}

export interface CountLine {
  id: number;
  itemId: number;
  /** Snapshot of system balance when the line was added/finalized. */
  systemQty: number;
  countedQty: number;
  description?: string;
}

export interface AuditEntry {
  at: string; // ISO timestamp
  by: string;
  action: "Create" | "Update" | "Finalize" | "Cancel";
  note?: string;
}

interface DocBase {
  id: number;
  no: number; // sequential per DocType
  date: string; // Jalali
  status: DocStatus;
  description?: string;
  projectId?: number;
  audit: AuditEntry[];
}

export interface ReceiptDoc extends DocBase {
  type: "Receipt";
  kind: ReceiptKind;
  warehouseId: number;
  partyId?: number; // تحویل‌دهنده / تامین‌کننده
  refNo?: string; // شماره سفارش / فاکتور / بیجک
  lines: DocLine[];
}

export interface IssueDoc extends DocBase {
  type: "Issue";
  kind: IssueKind;
  warehouseId: number;
  partyId?: number; // تحویل‌گیرنده
  refNo?: string; // شماره درخواست کالا
  lines: DocLine[];
}

export interface TransferDoc extends DocBase {
  type: "Transfer";
  fromWarehouseId: number;
  toWarehouseId: number;
  refNo?: string;
  lines: DocLine[];
}

export interface CountDoc extends DocBase {
  type: "Count";
  warehouseId: number;
  lines: CountLine[];
}

export type WarehouseDoc = ReceiptDoc | IssueDoc | TransferDoc | CountDoc;

// ----- Ledger ---------------------------------------------------------------

/** One stock movement as it appears in the kardex (کاردکس). */
export interface LedgerRow {
  seq: number; // position in the ledger (stable order)
  docType: DocType;
  docId: number;
  docNo: number;
  lineId: number;
  date: string;
  warehouseId: number;
  itemId: number;
  direction: "in" | "out";
  qty: number;
  label: string; // human description shown in the kardex
  inCost: number;
  inAmount: number;
  outCost: number;
  outAmount: number;
  balQty: number;
  balCost: number; // moving weighted-average cost after this row
  balAmount: number;
}

export interface StockRow {
  warehouseId: number;
  itemId: number;
  qty: number;
  avgCost: number;
  amount: number;
}

export interface WarehouseSnapshot {
  items: Item[];
  warehouses: Warehouse[];
  docs: WarehouseDoc[];
  nextIds: { item: number; warehouse: number; doc: number };
  nextNo: Record<DocType, number>;
}
