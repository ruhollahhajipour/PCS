export interface Project {
  id: number;

  companyId: number;

  plantId: number;

  code: string;

  name: string;

  client: string;

  contractor: string;

  startDate: string;

  finishDate: string;

  budget: number;

  currency: string;

  progress: number;

  status: "Planning" | "Active" | "Completed";
}

const projects: Project[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    code: "PCS-001",
    name: "Project Cost System",
    client: "KGN",
    contractor: "KGN",
    startDate: "2026-07-01",
    finishDate: "2027-01-01",
    budget: 2500000,
    currency: "USD",
    progress: 12,
    status: "Active",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    code: "EPC-102",
    name: "Utility Expansion",
    client: "ADISH",
    contractor: "KGN",
    startDate: "2026-05-01",
    finishDate: "2027-12-30",
    budget: 9800000,
    currency: "USD",
    progress: 44,
    status: "Active",
  },
];

class ProjectService {
  async getAll(): Promise<Project[]> {
    return Promise.resolve(projects);
  }

  async getByPlant(
    plantId: number
  ): Promise<Project[]> {
    return Promise.resolve(
      projects.filter((p) => p.plantId === plantId)
    );
  }

  async getById(
    id: number
  ): Promise<Project | undefined> {
    return Promise.resolve(
      projects.find((p) => p.id === id)
    );
  }

  async create(project: Project): Promise<Project> {
    projects.push(project);
    return Promise.resolve(project);
  }

  async update(project: Project): Promise<Project> {
    const index = projects.findIndex(
      (p) => p.id === project.id
    );

    if (index >= 0) {
      projects[index] = project;
    }

    return Promise.resolve(project);
  }

  async delete(id: number): Promise<void> {
    const index = projects.findIndex(
      (p) => p.id === id
    );

    if (index >= 0) {
      projects.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new ProjectService();