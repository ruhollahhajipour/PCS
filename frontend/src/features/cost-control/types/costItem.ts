export interface CostItem {
  id: number;

  wbs: string;

  project: string;

  discipline: string;

  budget: number;

  commitment: number;

  actual: number;

  forecast: number;

  variance: number;

  progress: number;

  status:
    | "Normal"
    | "Warning"
    | "Critical";

  updatedAt: string;
}