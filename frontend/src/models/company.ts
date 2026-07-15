export interface Company {
  id: number;

  code: string;

  shortName: string;

  name: string;

  country: string;

  city: string;

  address: string;

  currency: string;

  status: "Active" | "Inactive";

  registrationNumber: string;

  taxNumber: string;

  createdAt: string;

  updatedAt: string;
}