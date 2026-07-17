import { useEffect, useState } from "react";

import ProjectService from "../services/project.service";

import type { Project } from "../types/project";

export default function useProjects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function load() {
    setLoading(true);

    setProjects(
      await ProjectService.getAll()
    );

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(
    project: Project
  ) {
    await ProjectService.create(project);

    await load();
  }

  async function update(
    project: Project
  ) {
    await ProjectService.update(project);

    await load();
  }

  async function remove(id: number) {
    await ProjectService.delete(id);

    await load();
  }

  return {
    projects,

    loading,

    reload: load,

    create,

    update,

    remove,
  };
}