import http from "../../../api/http";

import type { Project } from "../../../models/project";

export async function getProjects(): Promise<Project[]> {
  const response = await http.get<Project[]>("/Projects");

  return response.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await http.get<Project>(`/Projects/${id}`);

  return response.data;
}

export async function createProject(
  project: Project
): Promise<string> {
  const response = await http.post<string>(
    "/Projects",
    project
  );

  return response.data;
}

export async function updateProject(
  project: Project
): Promise<void> {
  await http.put(
    `/Projects/${project.id}`,
    project
  );
}

export async function deleteProject(
  id: string
): Promise<void> {
  await http.delete(`/Projects/${id}`);
}