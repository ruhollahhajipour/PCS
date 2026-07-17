export interface Project {
  id: number;

  code: string;

  name: string;

  companyId: number;

  plantId: number;

  contractNo: string;

  client: string;

  contractor: string;

  consultant: string;

  budget: number;

  actualCost: number;

  progress: number;

  spi: number;

  cpi: number;

  startDate: string;

  finishDate: string;

  description: string;

  status:
    | "Active"
    | "Inactive"
    | "Completed";

  createdAt: string;

  updatedAt: string;
}