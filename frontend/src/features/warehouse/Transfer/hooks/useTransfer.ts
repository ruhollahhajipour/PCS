import { useEffect, useState } from "react";

import { transferRepository } from "../repository/transfer.repository";

import type { TransferMaterial } from "../types/transfer";

export default function useTransfer() {

  const [items, setItems] = useState<TransferMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {

    setLoading(true);

    const data = await transferRepository.getAll();

    setItems(data);

    setLoading(false);

  };

  useEffect(() => {

    refresh();

  }, []);

  const create = async (item: TransferMaterial) => {

    await transferRepository.create(item);

    await refresh();

  };

  const update = async (item: TransferMaterial) => {

    await transferRepository.update(item);

    await refresh();

  };

  const remove = async (id: number) => {

    await transferRepository.delete(id);

    await refresh();

  };

  const getById = async (id: number) => {

    return transferRepository.getById(id);

  };

  const exists = async (id: number) => {

    return transferRepository.exists(id);

  };

  const count = async () => {

    return transferRepository.count();

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