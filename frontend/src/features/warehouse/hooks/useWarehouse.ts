import { useEffect, useState } from "react";

import {
  createWarehouseItem,
  deleteWarehouseItem,
  getWarehouseItems,
  updateWarehouseItem,
} from "../services/warehouse.service";

import type { WarehouseItem } from "../types/warehouse";

export default function useWarehouse() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const data = await getWarehouseItems();

    setItems(data);

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create(item: WarehouseItem) {
    await createWarehouseItem(item);
    await refresh();
  }

  async function update(item: WarehouseItem) {
    await updateWarehouseItem(item);
    await refresh();
  }

  async function remove(id: number) {
    await deleteWarehouseItem(id);
    await refresh();
  }

  return {
    items,
    loading,
    refresh,
    create,
    update,
    remove,
  };
}