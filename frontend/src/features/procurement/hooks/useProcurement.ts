import { useCallback, useEffect, useState } from "react";

import procurementService from "../services/procurement.service";

import type { Procurement } from "../types/procurement";

export default function useProcurement() {

  const [items, setItems] = useState<Procurement[]>([]);

  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {

    setLoading(true);

    try {

      const data =
        await procurementService.getAll();

      setItems(data);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    load();

  }, [load]);

  async function create(
    item: Procurement
  ) {

    setLoading(true);

    try {

      await procurementService.create(item);

      await load();

    } finally {

      setLoading(false);

    }

  }

  async function update(
    item: Procurement
  ) {

    setLoading(true);

    try {

      await procurementService.update(item);

      await load();

    } finally {

      setLoading(false);

    }

  }

  async function remove(
    id: number
  ) {

    setLoading(true);

    try {

      await procurementService.delete(id);

      await load();

    } finally {

      setLoading(false);

    }

  }

  async function duplicate(
    id: number
  ) {

    setLoading(true);

    try {

      await procurementService.duplicate(id);

      await load();

    } finally {

      setLoading(false);

    }

  }

  return {

    items,

    loading,

    reload: load,

    create,

    update,

    remove,

    duplicate,

  };

}