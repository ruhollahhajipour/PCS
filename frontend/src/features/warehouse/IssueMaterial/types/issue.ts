export interface Issue {

  id: number;

  issueNo: string;

  warehouse: string;

  project: string;

  itemCode: string;

  itemName: string;

  category: string;

  quantity: number;

  unit: string;

  requestedBy: string;

  approvedBy: string;

  receiver: string;

  purpose: string;

  issueDate: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";

  remarks: string;

  createdAt: string;

  updatedAt: string;

}