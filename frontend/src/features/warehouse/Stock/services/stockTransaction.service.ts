import type { Stock } from "../types/stock";
import type { StockTransaction } from "../types/stockTransaction";

export class StockTransactionService {

  calculateStock(
    stock: Stock,
    transactions: StockTransaction[]
  ): Stock {

    const itemTransactions = transactions.filter(
      t =>
        t.itemCode === stock.itemCode &&
        t.warehouse === stock.warehouse
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

      lastUpdated: new Date().toISOString()
    };

  }

}

export const stockTransactionService =
  new StockTransactionService();