import { useEffect, useState } from "react";

import type { ReorderItem } from "../types/reorder";

import { stockCalculationService } from "../services/stockCalculation.service";
import { reorderService } from "../services/reorder.service";

export function useReorder() {

  const [items, setItems] =
    useState<ReorderItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const load = async () => {

    try {

      setLoading(true);

      setError(null);

      const stocks =
        await stockCalculationService.calculateAllStocks();

      const reorderItems =
        reorderService.getReorderItems(
          stocks
        );

      setItems(reorderItems);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load reorder list"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    load();

  }, []);

  return {

    items,

    loading,

    error,

    reload: load

  };

}