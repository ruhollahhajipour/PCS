import { useEffect, useState } from "react";

import type { Stock } from "../types/stock";

import { stockCalculationService } from "../services/stockCalculation.service";

export function useStock() {

  const [stocks, setStocks] = useState<Stock[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadStocks = async () => {

    try {

      setLoading(true);

      setError(null);

      const result =
        await stockCalculationService.calculateAllStocks();

      setStocks(result);

    } catch (err) {

      setError(

        err instanceof Error
          ? err.message
          : "Failed to load stocks"

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadStocks();

  }, []);

  const lowStockItems =
    stocks.filter(

      x =>
        x.currentQty <= x.reorderPoint

    );

  const criticalStockItems =
    stocks.filter(

      x =>
        x.currentQty <= x.safetyStock

    );

  return {

    stocks,

    loading,

    error,

    reload: loadStocks,

    lowStockItems,

    criticalStockItems

  };

}