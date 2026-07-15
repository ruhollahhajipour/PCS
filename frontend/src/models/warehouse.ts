export interface Warehouse {
  id: number;

  companyId: number;

  plantId: number;

  code: string;

  name: string;

  location: string;

  keeper: string;

  totalItems: number;

  totalValue: number;

  currency: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}