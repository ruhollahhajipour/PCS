import type { Stock } from "../types/stock";

import { stockRepository } from "../repository/stock.repository";
import { stockTransactionRepository } from "../repository/stockTransaction.repository";

import { transactionIndexService } from "./transactionIndex.service";

export class StockCalculationService {

  async calculateAllStocks(): Promise<Stock[]> {

    const stocks =
      await stockRepository.getAll();

    const transactions =
      await stockTransactionRepository.getAll();

    const index =
      transactionIndexService.buildIndex(
        transactions
      );

    return stocks.map(stock => {

      const itemTransactions =
        transactionIndexService.getTransactions(
          index,
          stock.warehouse,
          stock.itemCode
        );

      let receivedQty = 0;
      let issuedQty = 0;
      let transferInQty = 0;
      let transferOutQty = 0;
      let adjustmentQty = 0;

      for (const trx of itemTransactions) {

        switch (trx.type) {

          case "RECEIVE":
            receivedQty += trx.quantity;
            break;

          case "ISSUE":
            issuedQty += trx.quantity;
            break;

          case "TRANSFER_IN":
            transferInQty += trx.quantity;
            break;

          case "TRANSFER_OUT":
            transferOutQty += trx.quantity;
            break;

          case "ADJUSTMENT":
            adjustmentQty += trx.quantity;
            break;

        }

      }

      const currentQty =
        receivedQty
        - issuedQty
        + transferInQty
        - transferOutQty
        + adjustmentQty;

      const availableQty =
        currentQty - stock.reservedQty;

      return {

        ...stock,

        receivedQty,

        issuedQty,

        transferInQty,

        transferOutQty,

        adjustmentQty,

        currentQty,

        availableQty,

        lastUpdated:
          new Date().toISOString()

      };

    });

  }

  calculateCurrentQty(
    stock: Stock
  ): number {

    return (
      stock.receivedQty
      - stock.issuedQty
      + stock.transferInQty
      - stock.transferOutQty
      + stock.adjustmentQty
    );

  }

  calculateAvailableQty(
    stock: Stock
  ): number {

    return (
      stock.currentQty
      - stock.reservedQty
    );

  }

  calculateStockStatus(
    stock: Stock
  ): "NORMAL" | "LOW" | "CRITICAL" {

    if (
      stock.currentQty <= stock.safetyStock
    ) {

      return "CRITICAL";

    }

    if (
      stock.currentQty <= stock.reorderPoint
    ) {

      return "LOW";

    }

    return "NORMAL";

  }

}

export const stockCalculationService =
  new StockCalculationService();