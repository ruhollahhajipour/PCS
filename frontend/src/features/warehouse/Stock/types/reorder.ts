export type ReorderPriority =
  | "LOW"
  | "HIGH"
  | "CRITICAL";

export interface ReorderItem {

  id?: number;

  itemCode: string;

  itemName: string;

  warehouse: string;

  currentQty: number;

  reorderPoint: number;

  safetyStock: number;

  suggestedOrderQty: number;

  priority: ReorderPriority;

  supplier?: string;

}