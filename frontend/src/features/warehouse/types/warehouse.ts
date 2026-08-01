export type WarehouseStatus =
  | "Available"
  | "Reserved"
  | "Issued"
  | "Damaged"
  | "Returned";

export interface WarehouseItem {
  id: number;

  itemCode: string;
  itemName: string;
  category: string;

  warehouse: string;
  location: string;
  bin: string;

  unit: string;

  quantity: number;
  minimumStock: number;
  maximumStock: number;

  unitPrice: number;
  totalPrice: number;

  currency: string;

  supplier: string;

  receivedDate: string;
  expiryDate: string;

  status: WarehouseStatus;

  remarks: string;

  createdAt: string;
  updatedAt: string;
}