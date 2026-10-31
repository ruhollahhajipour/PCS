export type StockTransactionType =
  | "RECEIVE"
  | "ISSUE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT";

export interface StockTransaction {
  id: number;

  itemCode: string;

  itemName: string;

  warehouse: string;

  type: StockTransactionType;

  quantity: number;

  referenceId?: number;

  referenceType?: string;

  transactionDate: string;

  createdBy?: string;
}