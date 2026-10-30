import type {
  Item,
  ItemGroup,
  Party,
  Project,
  Unit,
  Warehouse,
} from "../types/warehouse";
import type { DocDraft } from "../services/warehouse.service";

export const units: Unit[] = [
  { code: "TON", name: "تن" },
  { code: "KG", name: "کیلوگرم" },
  { code: "M", name: "متر" },
  { code: "L", name: "لیتر" },
  { code: "PCS", name: "عدد" },
  { code: "SET", name: "دست" },
  { code: "LOT", name: "سری" },
];

export const itemGroups: ItemGroup[] = [
  { id: 1, code: "CIV", name: "مصالح ساختمانی" },
  { id: 2, code: "PIP", name: "لوله و اتصالات" },
  { id: 3, code: "ELC", name: "برق و ابزار دقیق" },
  { id: 4, code: "MEC", name: "مکانیکال و قطعات یدکی" },
  { id: 5, code: "SAF", name: "ایمنی (HSE)" },
  { id: 6, code: "CON", name: "مواد مصرفی" },
];

export const projects: Project[] = [
  { id: 1, code: "PRJ-001", name: "توسعه فاز ۱ پالایشگاه" },
  { id: 2, code: "PRJ-002", name: "تعمیرات اساسی واحد تقطیر" },
];

export const parties: Party[] = [
  { id: 1, code: "S-001", name: "شرکت بازرگانی آریا فولاد", kind: "Supplier" },
  { id: 2, code: "S-002", name: "شرکت پارس لوله و اتصالات", kind: "Supplier" },
  { id: 3, code: "S-003", name: "شرکت صنعتی نیرو کابل", kind: "Supplier" },
  { id: 4, code: "S-004", name: "شرکت ایمن‌گستر", kind: "Supplier" },
  { id: 5, code: "C-001", name: "پیمانکار سازه‌گستر", kind: "Contractor" },
  { id: 6, code: "D-001", name: "واحد اجرا", kind: "Department" },
  { id: 7, code: "D-002", name: "واحد نگهداری و تعمیرات", kind: "Department" },
];

export const seedItems: Item[] = [
  { id: 1, code: "ITM-0001", name: "میلگرد آجدار A3 سایز ۱۶", englishName: "Rebar A3 16mm", groupId: 1, type: "RawMaterial", unit: "TON", minStock: 20, status: "Active" },
  { id: 2, code: "ITM-0002", name: "سیمان پرتلند تیپ ۲", englishName: "Portland Cement Type II", groupId: 1, type: "RawMaterial", unit: "TON", minStock: 50, status: "Active" },
  { id: 3, code: "ITM-0003", name: "لوله فولادی کربنی ۶ اینچ SCH40", englishName: "CS Pipe 6in SCH40", groupId: 2, type: "RawMaterial", unit: "M", minStock: 200, specification: "API 5L Gr.B", status: "Active" },
  { id: 4, code: "ITM-0004", name: "زانوی ۹۰ درجه ۶ اینچ", englishName: "Elbow 90° 6in", groupId: 2, type: "RawMaterial", unit: "PCS", minStock: 20, status: "Active" },
  { id: 5, code: "ITM-0005", name: "شیر کشویی ۶ اینچ کلاس ۱۵۰", englishName: "Gate Valve 6in Class 150", groupId: 2, type: "Equipment", unit: "PCS", minStock: 5, status: "Active" },
  { id: 6, code: "ITM-0006", name: "کابل مسی ۳×۱۶", englishName: "Copper Cable 3x16", groupId: 3, type: "RawMaterial", unit: "M", minStock: 500, status: "Active" },
  { id: 7, code: "ITM-0007", name: "ترانسمیتر فشار", englishName: "Pressure Transmitter", groupId: 3, type: "Equipment", unit: "PCS", minStock: 10, status: "Active" },
  { id: 8, code: "ITM-0008", name: "الکترود جوشکاری E7018", englishName: "Welding Electrode E7018", groupId: 6, type: "Consumable", unit: "KG", minStock: 100, status: "Active" },
  { id: 9, code: "ITM-0009", name: "بلبرینگ ۶۳۱۰", englishName: "Ball Bearing 6310", groupId: 4, type: "SparePart", unit: "PCS", minStock: 10, status: "Active" },
  { id: 10, code: "ITM-0010", name: "رنگ اپوکسی دوجزئی", englishName: "Two-part Epoxy Paint", groupId: 6, type: "Consumable", unit: "L", minStock: 100, status: "Active" },
  { id: 11, code: "ITM-0011", name: "کلاه ایمنی", englishName: "Safety Helmet", groupId: 5, type: "Consumable", unit: "PCS", minStock: 120, status: "Active" },
  { id: 12, code: "ITM-0012", name: "پیچ و مهره گالوانیزه M16", englishName: "Galvanized Bolt & Nut M16", groupId: 4, type: "Consumable", unit: "KG", minStock: 80, status: "Active" },
];

export const seedWarehouses: Warehouse[] = [
  { id: 1, code: "W-01", name: "انبار مرکزی کالا", type: "Central", location: "سایت پالایشگاه – ورودی شرقی", keeper: "محمد رضایی", status: "Active" },
  { id: 2, code: "W-02", name: "انبار قطعات یدکی", type: "Central", location: "سایت پالایشگاه – ساختمان نت", keeper: "علی کریمی", status: "Active" },
  { id: 3, code: "W-03", name: "انبار پروژه فاز ۱", type: "Project", location: "کارگاه فاز ۱", keeper: "حسین احمدی", projectId: 1, status: "Active" },
  { id: 4, code: "W-04", name: "انبار موقت سایت", type: "Temporary", location: "محوطه شمالی", status: "Inactive" },
];

/**
 * Seed documents. They are replayed through the service (create + finalize),
 * so costs and the kardex are always consistent with the business rules.
 */
export const seedDocs: { draft: DocDraft; finalize: boolean }[] = [
  {
    finalize: true,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/05/10", warehouseId: 1, partyId: 1,
      refNo: "PO-1405-012", projectId: 1, description: "خرید میلگرد، سیمان و لوله",
      lines: [
        { id: 1, itemId: 1, qty: 120, unitPrice: 345_000_000, wbs: "1.2.1" },
        { id: 2, itemId: 2, qty: 200, unitPrice: 48_000_000, wbs: "1.2.1" },
        { id: 3, itemId: 3, qty: 600, unitPrice: 2_850_000, wbs: "1.3.1" },
        { id: 4, itemId: 4, qty: 80, unitPrice: 1_450_000, wbs: "1.3.1" },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/06/02", warehouseId: 1, partyId: 2,
      refNo: "PO-1405-019", projectId: 1,
      lines: [
        { id: 1, itemId: 5, qty: 12, unitPrice: 62_000_000, wbs: "1.3.2" },
        { id: 2, itemId: 7, qty: 8, unitPrice: 185_000_000, wbs: "1.4.1" },
        { id: 3, itemId: 6, qty: 1500, unitPrice: 1_980_000, wbs: "1.4.2" },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/06/20", warehouseId: 2, partyId: 3,
      refNo: "PO-1405-024", projectId: 2,
      lines: [{ id: 1, itemId: 9, qty: 40, unitPrice: 9_500_000 }],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/07/05", warehouseId: 1, partyId: 4,
      refNo: "PO-1405-031", projectId: 1,
      lines: [
        { id: 1, itemId: 8, qty: 600, unitPrice: 1_420_000 },
        { id: 2, itemId: 10, qty: 300, unitPrice: 2_300_000 },
        { id: 3, itemId: 11, qty: 150, unitPrice: 480_000 },
        { id: 4, itemId: 12, qty: 250, unitPrice: 1_650_000 },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/08/01", warehouseId: 1, partyId: 1,
      refNo: "PO-1405-040", projectId: 1,
      lines: [{ id: 1, itemId: 1, qty: 60, unitPrice: 352_000_000, wbs: "1.2.1" }],
    },
  },
  {
    finalize: false,
    draft: {
      type: "Receipt", kind: "Purchase", date: "1405/08/07", warehouseId: 1, partyId: 1,
      refNo: "PO-1405-044", projectId: 1, description: "پیش‌نویس – در انتظار تأیید کنترل کیفی",
      lines: [{ id: 1, itemId: 2, qty: 100, unitPrice: 49_500_000, wbs: "1.2.1" }],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Issue", kind: "ProjectIssue", date: "1405/06/15", warehouseId: 1, partyId: 5,
      refNo: "MR-1405-007", projectId: 1, description: "تحویل مصالح به پیمانکار سازه",
      lines: [
        { id: 1, itemId: 1, qty: 45, unitPrice: 0, wbs: "1.2.1" },
        { id: 2, itemId: 2, qty: 80, unitPrice: 0, wbs: "1.2.1" },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Issue", kind: "Consumption", date: "1405/07/12", warehouseId: 1, partyId: 6,
      refNo: "MR-1405-015", projectId: 1,
      lines: [
        { id: 1, itemId: 8, qty: 120, unitPrice: 0 },
        { id: 2, itemId: 10, qty: 60, unitPrice: 0 },
        { id: 3, itemId: 11, qty: 40, unitPrice: 0 },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Transfer", date: "1405/07/20", fromWarehouseId: 1, toWarehouseId: 3,
      refNo: "TR-1405-003", projectId: 1, description: "تأمین موجودی انبار پروژه",
      lines: [
        { id: 1, itemId: 1, qty: 30, unitPrice: 0 },
        { id: 2, itemId: 2, qty: 50, unitPrice: 0 },
        { id: 3, itemId: 11, qty: 50, unitPrice: 0 },
      ],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Count", date: "1405/07/28", warehouseId: 2, description: "انبارگردانی دوره‌ای قطعات یدکی",
      lines: [{ id: 1, itemId: 9, systemQty: 40, countedQty: 38, description: "۲ عدد کسری" }],
    },
  },
  {
    finalize: true,
    draft: {
      type: "Issue", kind: "ProjectIssue", date: "1405/08/05", warehouseId: 1, partyId: 5,
      refNo: "MR-1405-022", projectId: 1,
      lines: [
        { id: 1, itemId: 3, qty: 250, unitPrice: 0, wbs: "1.3.1" },
        { id: 2, itemId: 4, qty: 30, unitPrice: 0, wbs: "1.3.1" },
        { id: 3, itemId: 5, qty: 4, unitPrice: 0, wbs: "1.3.2" },
      ],
    },
  },
  {
    finalize: false,
    draft: {
      type: "Issue", kind: "Consumption", date: "1405/08/08", warehouseId: 1, partyId: 7,
      refNo: "MR-1405-025", projectId: 2,
      lines: [{ id: 1, itemId: 6, qty: 200, unitPrice: 0 }],
    },
  },
];
