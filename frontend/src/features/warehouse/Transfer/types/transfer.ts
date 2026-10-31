export type TransferStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

export interface TransferMaterial {

  id: number;

  transferNo: string;

  fromWarehouse: string;

  toWarehouse: string;

  materialCode: string;

  materialName: string;

  quantity: number;

  unit: string;

  transferDate: string;

  requestedBy: string;

  approvedBy?: string;

  status: TransferStatus;

  description?: string;

  createdAt: string;

  updatedAt?: string;

}