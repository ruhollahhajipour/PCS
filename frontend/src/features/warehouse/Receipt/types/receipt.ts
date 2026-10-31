export interface Receipt {

  id: number;

  receiptNo: string;

  poNo: string;

  supplier: string;

  warehouse: string;

  location: string;

  itemCode: string;

  itemName: string;

  category: string;

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

  createdAt: string;

  updatedAt: string;

}