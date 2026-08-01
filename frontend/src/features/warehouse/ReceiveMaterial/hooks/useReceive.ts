import { useEffect, useState } from "react";

import { receiveService } from "../services/receive.service";

import type { ReceiveMaterial } from "../types/receive";

export default function useReceive() {
  const [items, setItems] = useState<ReceiveMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const data = await receiveService.getAll();

    setItems(data);

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create(item: ReceiveMaterial) {
    await receiveService.create(item);
    refresh();
  }

  async function update(item: ReceiveMaterial) {
    await receiveService.update(item);
    refresh();
  }

  async function remove(id: number) {
    await receiveService.remove(id);
    refresh();
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