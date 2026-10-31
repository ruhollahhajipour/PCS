export interface ReceiveMaterial {
  id: number;

  receiptNo: string;

  poNo: string;

  supplier: string;

  warehouse: string;

  location: string;

  category: string;

  itemCode: string;

  itemName: string;

  quantity: number;

  unit: string;

  receiveDate: string;

  inspector: string;

  documentNo: string;

  remarks: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";
}