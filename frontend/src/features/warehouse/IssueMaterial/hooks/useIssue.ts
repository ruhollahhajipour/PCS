import { useEffect, useState } from "react";

import { issueRepository } from "../repository/issue.repository";

import type { Issue } from "../types/issue";

export default function useIssue() {

  const [items, setItems] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {

    setLoading(true);

    const data = await issueRepository.getAll();

    setItems(data);

    setLoading(false);

  };

  useEffect(() => {

    refresh();

  }, []);

  const create = async (item: Issue) => {

    await issueRepository.create(item);

    await refresh();

  };

  const update = async (item: Issue) => {

    await issueRepository.update(item);

    await refresh();

  };

  const remove = async (id: number) => {

    await issueRepository.delete(id);

    await refresh();

  };

  const getById = async (id: number) => {

    return issueRepository.getById(id);

  };

  const exists = async (id: number) => {

    return issueRepository.exists(id);

  };

  const count = async () => {

    return issueRepository.count();

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