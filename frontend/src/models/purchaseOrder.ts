import type { BaseEntity } from "./base";

export interface PurchaseOrder
  extends Omit<BaseEntity, "status"> {
  projectId: number;

  vendorId: number;

  poNumber: string;

  title: string;

  description: string;

  orderDate: string;

  deliveryDate: string;

  currency: string;

  totalAmount: number;

  approvedAmount: number;

  receivedAmount: number;

  status:
    | "Draft"
    | "Pending"
    | "Approved"
    | "Closed"
    | "Cancelled";
}