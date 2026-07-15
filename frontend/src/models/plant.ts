export interface Plant {
  id: number;

  companyId: number;

  code: string;

  name: string;

  shortName: string;

  location: string;

  address: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}