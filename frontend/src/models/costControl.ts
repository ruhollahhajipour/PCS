export interface CostControl {
  id: number;

  companyId: number;

  plantId: number;

  projectId: number;

  wbsCode: string;

  costCode: string;

  description: string;

  budgetCost: number;

  committedCost: number;

  actualCost: number;

  forecastCost: number;

  currency: string;

  progress: number;

  variance: number;

  status:
    | "Planning"
    | "Active"
    | "Completed";

  createdAt: string;

  updatedAt: string;
}