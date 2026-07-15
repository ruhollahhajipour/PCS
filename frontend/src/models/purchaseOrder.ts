export interface PurchaseOrder {
  id: number;

  companyId: number;

  plantId: number;

  projectId: number;

  poNumber: string;

  vendorId: number;

  description: string;

  currency: string;

  amount: number;

  issueDate: string;

  deliveryDate: string;

  buyer: string;

  status:
    | "Draft"
    | "Approved"
    | "Issued"
    | "Closed"
    | "Cancelled";

  createdAt: string;

  updatedAt: string;
}