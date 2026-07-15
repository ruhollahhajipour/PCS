export interface Project {
  id: number;

  companyId: number;

  plantId: number;

  code: string;

  name: string;

  shortName: string;

  client: string;

  contractor: string;

  budget: number;

  currency: string;

  progress: number;

  startDate: string;

  finishDate: string;

  status: "Planning" | "Active" | "Completed";

  createdAt: string;

  updatedAt: string;
}