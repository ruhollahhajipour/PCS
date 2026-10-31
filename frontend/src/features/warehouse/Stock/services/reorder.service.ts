import type { Stock } from "../types/stock";
import type { ReorderItem } from "../types/reorder";

export class ReorderService {

  getReorderItems(
    stocks: Stock[]
  ): ReorderItem[] {

    return stocks
      .filter(
        stock =>
          stock.currentQty <= stock.reorderPoint
      )
      .map(stock => ({

        itemCode: stock.itemCode,

        itemName: stock.itemName,

        warehouse: stock.warehouse,

        currentQty: stock.currentQty,

        reorderPoint: stock.reorderPoint,

        safetyStock: stock.safetyStock,

        suggestedOrderQty:
          Math.max(
            stock.reorderPoint * 2 - stock.currentQty,
            0
          ),

        priority:
          stock.currentQty <= stock.safetyStock
            ? "CRITICAL"
            : stock.currentQty <= stock.reorderPoint / 2
              ? "HIGH"
              : "LOW"

      }));

  }

}

export const reorderService =
  new ReorderService();