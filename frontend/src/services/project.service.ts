import type { Project } from "../models/project";

let projects: Project[] = [
  {
    id: 1,
    plantId: 1,

    code: "PRJ-001",
    shortName: "OFFSITE",

    name: "Offsite Facilities",

    description: "Utilities and Offsite",

    startDate: "2026-01-01",
    finishDate: "2028-12-31",

    budget: 25000000,

    currency: "USD",

    status: "Active",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class ProjectService {
  async getAll(): Promise<Project[]> {
    return Promise.resolve(projects);
  }

  async getById(id: number) {
    return Promise.resolve(
      projects.find((x) => x.id === id)
    );
  }

  async create(project: Project) {
    projects.push(project);
    return Promise.resolve();
  }

  async update(project: Project) {
    projects = projects.map((x) =>
      x.id === project.id ? project : x
    );

    return Promise.resolve();
  }

  async delete(id: number) {
    projects = projects.filter(
      (x) => x.id !== id
    );

    return Promise.resolve();
  }
}

export default new ProjectService();