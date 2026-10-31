import type { StockTransaction } from "../types/stockTransaction";

export class TransactionIndexService {

  buildIndex(
    transactions: StockTransaction[]
  ): Map<string, StockTransaction[]> {

    const index =
      new Map<string, StockTransaction[]>();

    for (const trx of transactions) {

      const key =
        `${trx.warehouse}_${trx.itemCode}`;

      const current =
        index.get(key);

      if (current) {

        current.push(trx);

      } else {

        index.set(key, [trx]);

      }

    }

    return index;

  }

  getTransactions(

    index: Map<string, StockTransaction[]>,

    warehouse: string,

    itemCode: string

  ): StockTransaction[] {

    const key =
      `${warehouse}_${itemCode}`;

    return index.get(key) ?? [];

  }

}

export const transactionIndexService =
  new TransactionIndexService();