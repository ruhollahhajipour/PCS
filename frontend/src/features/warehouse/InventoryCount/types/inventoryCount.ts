export type InventoryStatus =
  | "Draft"
  | "In Progress"
  | "Completed"
  | "Approved";

export interface InventoryCount {

  id: number;

  countNo: string;

  warehouse: string;

  location: string;

  materialCode: string;

  materialName: string;

  systemQty: number;

  countedQty: number;

  variance: number;

  unit: string;

  countDate: string;

  countedBy: string;

  approvedBy?: string;

  status: InventoryStatus;

  description?: string;

  createdAt: string;

  updatedAt?: string;

}