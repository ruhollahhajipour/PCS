import { useEffect, useState } from "react";

import CostService from "../services/cost.service";

import type { CostItem } from "../types/costItem";

export default function useCostControl() {
  const [items, setItems] =
    useState<CostItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function load() {
    setLoading(true);

    setItems(
      await CostService.getAll()
    );

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(
    item: CostItem
  ) {
    await CostService.create(item);

    await load();
  }

  async function update(
    item: CostItem
  ) {
    await CostService.update(item);

    await load();
  }

  async function remove(id: number) {
    await CostService.delete(id);

    await load();
  }

  return {
    items,

    loading,

    reload: load,

    create,

    update,

    remove,
  };
}