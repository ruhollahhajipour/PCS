import { stockCalculationService } from "../../Stock/services/stockCalculation.service";

export interface WarehouseDashboardSummary {

  totalItems: number;

  totalQuantity: number;

  lowStockCount: number;

  criticalStockCount: number;

  inventoryValue: number;

}

export class WarehouseDashboardService {

  async getSummary(): Promise<WarehouseDashboardSummary> {

    const stocks =
      await stockCalculationService.calculateAllStocks();

    const totalItems =
      stocks.length;

    const totalQuantity =
      stocks.reduce(

        (sum, item) =>
          sum + item.currentQty,

        0

      );

    const lowStockCount =
      stocks.filter(

        item =>
          item.currentQty <= item.reorderPoint

      ).length;

    const criticalStockCount =
      stocks.filter(

        item =>
          item.currentQty <= item.safetyStock

      ).length;

    // فعلاً چون قیمت کالا نداریم
    // بعداً از Item Master خوانده خواهد شد.
    const inventoryValue = 0;

    return {

      totalItems,

      totalQuantity,

      lowStockCount,

      criticalStockCount,

      inventoryValue

    };

  }

}

export const warehouseDashboardService =
  new WarehouseDashboardService();