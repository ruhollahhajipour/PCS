import type {
  DocStatus,
  DocType,
  IssueKind,
  ItemType,
  ReceiptKind,
  WarehouseType,
} from "../types/warehouse";

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  Receipt: "رسید انبار",
  Issue: "حواله انبار",
  Transfer: "انتقال بین انبارها",
  Count: "انبارگردانی",
};

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  Draft: "پیش‌نویس",
  Final: "قطعی",
  Cancelled: "باطل",
};

export const DOC_STATUS_COLOR: Record<
  DocStatus,
  "default" | "success" | "error" | "warning"
> = {
  Draft: "warning",
  Final: "success",
  Cancelled: "error",
};

export const RECEIPT_KIND_LABEL: Record<ReceiptKind, string> = {
  Purchase: "رسید خرید",
  Production: "رسید تولید",
  ReturnFromConsumption: "برگشت از مصرف",
  Initial: "موجودی اول دوره",
  Other: "سایر رسیدها",
};

export const ISSUE_KIND_LABEL: Record<IssueKind, string> = {
  Consumption: "حواله مصرف",
  ProjectIssue: "حواله به پروژه / پیمانکار",
  ReturnToSupplier: "برگشت از خرید",
  Scrap: "ضایعات",
  Other: "سایر حواله‌ها",
};

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  RawMaterial: "مواد و مصالح",
  Equipment: "تجهیزات",
  SparePart: "قطعات یدکی",
  Consumable: "مصرفی",
  Tool: "ابزار",
};

export const WAREHOUSE_TYPE_LABEL: Record<WarehouseType, string> = {
  Central: "مرکزی",
  Project: "پروژه‌ای",
  Temporary: "موقت",
};

export const PARTY_KIND_LABEL = {
  Supplier: "تامین‌کننده",
  Contractor: "پیمانکار",
  Department: "واحد سازمانی",
  Customer: "مشتری",
} as const;
