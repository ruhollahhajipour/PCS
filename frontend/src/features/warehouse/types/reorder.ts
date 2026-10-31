export interface ReorderItem {

  itemCode: string;

  itemName: string;

  warehouse: string;

  currentQty: number;

  reorderPoint: number;

  safetyStock: number;

  suggestedOrderQty: number;

  priority: "LOW" | "HIGH" | "CRITICAL";

}