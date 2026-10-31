import { useEffect, useState } from "react";

import { receiptService } from "../services/receipt.service";

import type { Receipt } from "../types/receipt";

export default function useReceipt() {

  const [items, setItems] = useState<Receipt[]>([]);

  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const data =
      await receiptService.getAll();

    setItems(data);

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create(
    item: Receipt
  ) {
    await receiptService.create(item);
    await refresh();
  }

  async function update(
    item: Receipt
  ) {
    await receiptService.update(item);
    await refresh();
  }

  async function remove(
    id: number
  ) {
    await receiptService.remove(id);
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