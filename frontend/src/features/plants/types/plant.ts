export interface Plant {
  id: number;

  code: string;

  name: string;

  companyId: number;

  country: string;

  city: string;

  area: string;

  manager: string;

  phone: string;

  description: string;

  status:
    | "Active"
    | "Inactive";

  createdAt: string;

  updatedAt: string;
}