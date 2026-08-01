import { useEffect, useState } from "react";

import { inventoryCountRepository } from "../repository/inventoryCount.repository";

import type { InventoryCount } from "../types/inventoryCount";

export default function useInventoryCount() {

  const [items, setItems] = useState<InventoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {

    setLoading(true);

    const data = await inventoryCountRepository.getAll();

    setItems(data);

    setLoading(false);

  };

  useEffect(() => {

    refresh();

  }, []);

  const create = async (item: InventoryCount) => {

    await inventoryCountRepository.create(item);

    await refresh();

  };

  const update = async (item: InventoryCount) => {

    await inventoryCountRepository.update(item);

    await refresh();

  };

  const remove = async (id: number) => {

    await inventoryCountRepository.delete(id);

    await refresh();

  };

  const getById = async (id: number) => {

    return inventoryCountRepository.getById(id);

  };

  const exists = async (id: number) => {

    return inventoryCountRepository.exists(id);

  };

  const count = async () => {

    return inventoryCountRepository.count();

  };

  return {

    items,

    loading,

    refresh,

    create,

    update,

    remove,

    getById,

    exists,

    count,

  };

}