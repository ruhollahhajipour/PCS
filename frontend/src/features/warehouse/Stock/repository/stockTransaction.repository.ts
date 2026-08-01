import { BaseCRUDRepository } from "../../../../core/repositories";

import type { StockTransaction } from "../types/stockTransaction";

export class StockTransactionRepository extends BaseCRUDRepository<StockTransaction> {
  constructor() {
    super("pcs_stock_transactions");
  }

  async getByItemCode(
    itemCode: string
  ): Promise<StockTransaction[]> {
    const data = await this.getAll();

    return data.filter(
      (item) => item.itemCode === itemCode
    );
  }

  async getByWarehouse(
    warehouse: string
  ): Promise<StockTransaction[]> {
    const data = await this.getAll();

    return data.filter(
      (item) => item.warehouse === warehouse
    );
  }
}

export const stockTransactionRepository =
  new StockTransactionRepository();